import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import {
  baseURL,
  CHOICE_ROCK,
  CHOICE_PAPER,
  CHOICE_SCISSORS,
  CHOICE_UNKNOWN,
  CUSTOM_SCHEMAS,
  EASContractAddress,
  getGameStatus,
  RPS_GAME_UID,
  STATUS_DRAW,
  STATUS_PLAYER1_WIN,
  STATUS_PLAYER2_WIN,
  STATUS_UNKNOWN,
  submitSignedAttestation,
} from "./utils/utils";

import invariant from "tiny-invariant";
import { useNavigate, useParams } from "react-router";
import { FaHandRock, FaHandScissors, FaHandPaper } from "react-icons/fa";
import { theme } from "./utils/theme";
import rockOptionImage from "./assets/rockOption.png";
import paperOptionImage from "./assets/paperOption.png";
import scissorsOptionImage from "./assets/scissorsOption.png";
import rockLottieOrange from "./assets/power-orange.json";
import paperLottieOrange from "./assets/paper-orange.json";
import scissorsLottieOrange from "./assets/scissors-orange.json";
import rockLottiePurple from "./assets/power-purple.json";
import paperLottiePurple from "./assets/paper-purple.json";
import scissorsLottiePurple from "./assets/scissors-purple.json";

import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
  ZERO_ADDRESS,
  ZERO_BYTES32,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import dayjs from "dayjs";
import { useSigner } from "./utils/wagmi-utils";
import { useStore } from "./useStore";
import {
  AcceptedChallenge,
  Game,
  GameCommit,
  GameWithPlayers,
} from "./utils/types";
import axios from "axios";
import Lottie from "react-lottie";
import { Identicon } from "./components/Identicon";
import PlayerCard from "./components/PlayerCard";
import RotatedLottie from "./components/RotatedLottie";

type finishedProps = { finished: boolean };
const Vs = styled.div<finishedProps>`
  text-align: center;
  font-family: ${({ finished }) => (finished ? "Ubuntu" : "Racing Sans One")};
  font-size: ${({ finished }) => (finished ? "50px" : "80px")};
  font-style: normal;
  font-weight: ${({ finished }) => (finished ? 700 : 400)};
  line-height: 34px; /* 42.5% */
  padding: 20px;
`;

const Button = styled.button`
  border-radius: 8px;
  border: 1px solid #e18100;
  background: #e18100;
  margin: 10px 0;
  cursor: pointer;
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  height: 40px;
  flex-shrink: 0;
`;

type GameStatusProps = { status: number };

const GameContainer = styled.div<GameStatusProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ status }) =>
    status === STATUS_PLAYER1_WIN
      ? "rgba(46, 196, 182, 0.33)"
      : status === STATUS_PLAYER2_WIN
      ? "rgba(255, 0, 28, 0.33)"
      : status === STATUS_DRAW
      ? "rgba(255, 220, 0, 0.33)"
      : "none"};
  padding: 20px;
  box-sizing: border-box;
  min-height: 100vh;
`;

type WaitingTextProps = { isPlayer1: boolean };

const WaitingText = styled.div<WaitingTextProps>`
  color: #272343;
  text-align: center;
  -webkit-text-stroke-color: ${({ isPlayer1 }) =>
    isPlayer1 ? "#00ebcf" : "#C8B3F5"};
  -webkit-text-stroke-width: 2px;
  font-family: Ubuntu;
  font-size: 28px;
  font-style: italic;
  font-weight: 700;
  line-height: 34px; /* 121.429% */
  padding: 20px;
`;

const HandSelection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 20px;
`;

const HandOption = styled.div`
  border-radius: 5px;
  border: 1px solid rgba(57, 53, 84, 0.26);
  background: #fff;
  width: 110px;
  height: 104px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
`;

const HandOptionImage = styled.img`
  width: 80%;
  height: 80%;
`;

const LottieContainer = styled.div`
  width: 200px;
  height: 200px;
  transform: rotate(45deg);
`;

const PlayerStatus = styled.div`
  display: flex;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: column;
`;

function Challenge() {
  const { address } = useAccount();
  const navigate = useNavigate();
  const { challengeId } = useParams();
  const signer = useSigner();
  const [tick, setTick] = useState(0);
  const [game, setGame] = useState<GameWithPlayers>();

  const gameCommits = useStore((state) => state.gameCommits);

  console.log("gc", gameCommits);
  const thisGameCommit = gameCommits.find(
    (commit) => commit.challengeUID === challengeId
  );

  const addGameCommit = useStore((state) => state.addGameCommit);

  invariant(challengeId, "Challenge ID should be defined");

  const update = async () => {
    //query server for game status
    const gameRes = await axios.post<GameWithPlayers>(`${baseURL}/gameStatus`, {
      uid: challengeId,
    });
    // swap players if we are player 2
    if (gameRes.data.player2 === address) {
      gameRes.data.player2 = gameRes.data.player1;
      gameRes.data.player1 = address;
      const tmpCommit = gameRes.data.commit2;
      gameRes.data.commit2 = gameRes.data.commit1;
      gameRes.data.commit1 = tmpCommit;
      const tmpChoice = gameRes.data.choice2;
      gameRes.data.choice2 = gameRes.data.choice1;
      gameRes.data.choice1 = tmpChoice;
      const tmpSalt = gameRes.data.salt2;
      gameRes.data.salt2 = gameRes.data.salt1;
      gameRes.data.salt1 = tmpSalt;
      const tmpPlayerObject = gameRes.data.player2Object;
      gameRes.data.player2Object = gameRes.data.player1Object;
      gameRes.data.player1Object = tmpPlayerObject;
    }
    setGame(gameRes.data);
  };

  //watch for game updates

  useEffect(() => {
    update();
    setTimeout(() => {
      setTick(tick + 1);
    }, 5000);
  }, [tick]);

  const commit = async (choice: number) => {
    invariant(address, "Address should be defined");

    try {
      const schemaEncoder = new SchemaEncoder("bytes32 commitHash");

      console.log(choice, address);
      // create random bytes32 salt
      const salt = ethers.randomBytes(32);
      const saltHex = ethers.hexlify(salt);

      const hashedChoice = ethers.solidityPackedKeccak256(
        ["uint256", "bytes32"],
        [choice, saltHex]
      );

      console.log("hashedChoice", hashedChoice);

      const encoded = schemaEncoder.encodeData([
        { name: "commitHash", type: "bytes32", value: hashedChoice },
      ]);

      const eas = new EAS(EASContractAddress);

      invariant(signer, "signer must be defined");
      eas.connect(signer);

      const offchain = await eas.getOffchain();

      const signedOffchainAttestation = await offchain.signOffchainAttestation(
        {
          schema: CUSTOM_SCHEMAS.COMMIT_HASH,
          recipient: ZERO_ADDRESS,
          refUID: challengeId,
          data: encoded,
          time: BigInt(dayjs().unix()),
          revocable: false,
          expirationTime: BigInt(0),
        },
        signer
      );

      const pkg: AttestationShareablePackageObject = {
        signer: address,
        sig: signedOffchainAttestation,
      };

      const res = await submitSignedAttestation(pkg);

      if (!res.data.error) {
        addGameCommit({
          salt: saltHex,
          choice: choice,
          challengeUID: challengeId,
        });
        window.location.reload();
      } else {
        alert(res.data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const status = game ? getGameStatus(game) : STATUS_UNKNOWN;

  if (!game) {
    return <div>no game here</div>;
  }

  return (
    <GameContainer status={status}>
      <PlayerCard
        address={game.player2}
        score={game.player2Object.elo}
        overrideENSWith={"Opponent"}
      />
      <PlayerStatus>
        {game.commit2 === ZERO_BYTES32 ? (
          <WaitingText isPlayer1={false}>Waiting For Opponent...</WaitingText>
        ) : game.choice2 === CHOICE_UNKNOWN ? (
          <WaitingText isPlayer1={false}>Player Ready</WaitingText>
        ) : (
          <RotatedLottie choice={game.choice2} isPlayer1={false} />
        )}
      </PlayerStatus>

      <Vs finished={status !== STATUS_UNKNOWN}>
        {status === STATUS_PLAYER1_WIN
          ? "YOU WON"
          : status === STATUS_PLAYER2_WIN
          ? "YOU LOST"
          : status === STATUS_DRAW
          ? "DRAW"
          : "VS"}
      </Vs>
      {status !== STATUS_UNKNOWN && (
        <Button
          onClick={() => {
            navigate(`/summary/${challengeId}`);
          }}
        >
          Continue to Summary
        </Button>
      )}

      <PlayerStatus>
        {game.commit1 === ZERO_BYTES32 ? (
          <>
            <WaitingText isPlayer1={true}>Waiting For You...</WaitingText>
            <HandSelection>
              <HandOption
                onClick={() => {
                  commit(CHOICE_ROCK);
                }}
              >
                <HandOptionImage src={rockOptionImage} />
              </HandOption>
              <HandOption
                onClick={() => {
                  commit(CHOICE_PAPER);
                }}
              >
                <HandOptionImage src={paperOptionImage} />
              </HandOption>
              <HandOption
                onClick={() => {
                  commit(CHOICE_SCISSORS);
                }}
              >
                <HandOptionImage src={scissorsOptionImage} />
              </HandOption>
            </HandSelection>
          </>
        ) : (
          <RotatedLottie
            choice={
              game.choice1 !== CHOICE_UNKNOWN
                ? game.choice1
                : thisGameCommit && thisGameCommit.choice !== CHOICE_UNKNOWN
                ? thisGameCommit.choice
                : CHOICE_UNKNOWN
            }
            isPlayer1={true}
          />
        )}
      </PlayerStatus>

      <PlayerCard
        address={game.player1}
        score={game.player1Object.elo}
        overrideENSWith={"You"}
      />
    </GameContainer>
  );
}

export default Challenge;
