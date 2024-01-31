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
  getENSName,
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
import { AcceptedChallenge, Game, GameCommit } from "./utils/types";
import axios from "axios";
import Lottie from "react-lottie";
import { Identicon } from "./components/Identicon";
// import { button } from "./Home";

const Container = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const UID = styled.div`
  font-size: 12px;
`;

const Vs = styled.div`
  text-align: center;
  font-family: "Racing Sans One";
  font-size: 80px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px; /* 42.5% */
  padding: 20px;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #fef6e4;
  border-radius: 20px;
  padding: 20px;
  justify-content: center;
`;

const PlayerCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #f3f3f3;
  padding: 10px;
  margin: 10px 0;
  border-radius: 15px;
  background: #fff;

  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
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
`;

const PlayerName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const PlayerScore = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #000;
`;

const PlayerAddress = styled.div`
  font-size: 14px;
  color: #666;
  word-break: break-all;
`;

const HandSelection = styled.div`
  display: flex;
  justify-content: center;
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
`;

const HandOptionImage = styled.img`
  width: 80%;
  height: 80%;
`;

const LottieContainer = styled.div`
  width: 200px;
  height: 200px;
`;

const PlayerStatus = styled.div`
  display: flex;
  width: 100%;
  height: 400px;
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
  const [attesting, setAttesting] = useState(false);
  const signer = useSigner();
  const [tick, setTick] = useState(0);
  const [waiting, setWaiting] = useState(true);
  const [game, setGame] = useState<Game>();
  const [myENSName, setMyENSName] = useState<string>("");
  const [opponentENSName, setOpponentENSName] = useState<string>("");

  const gameCommits = useStore((state) => state.gameCommits);

  const thisGameCommit = gameCommits.find(
    (commit) => commit.challengeUID === challengeId
  );

  const addGameCommit = useStore((state) => state.addGameCommit);

  const committed = !!thisGameCommit;

  invariant(challengeId, "Challenge ID should be defined");

  const update = async () => {
    //query server for game status
    const gameRes = await axios.post<Game>(`${baseURL}/gameStatus`, {
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
    }
    setGame(gameRes.data);
    setMyENSName(
      (await getENSName(gameRes.data.player1)) || gameRes.data.player1
    );
    setOpponentENSName(
      (await getENSName(gameRes.data.player2)) || gameRes.data.player2
    );
  };

  //watch for game updates

  useEffect(() => {
    if (waiting) {
      update();
      setTimeout(() => {
        setTick(tick + 1);
      }, 5000);
    }
  }, [tick]);

  const commit = async (choice: number) => {
    invariant(address, "Address should be defined");

    setAttesting(true);
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
          version: 1,
          nonce: BigInt(0),
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
        console.error(res.data.error);
      }
    } catch (e) {
      console.error(e);
    }

    setAttesting(false);
  };

  const status = game ? getGameStatus(game) : STATUS_UNKNOWN;

  if (!game) {
    return <div>no game here</div>;
  }

  return (
    <GameContainer>
      <PlayerCard>
        <Identicon address={game.player2} size={56} />
        <PlayerInfo>
          <PlayerName>{opponentENSName}</PlayerName>
          {opponentENSName !== game.player2 ? (
            <PlayerAddress>{game.player2}</PlayerAddress>
          ) : null}
        </PlayerInfo>
        <PlayerScore>1100</PlayerScore>
      </PlayerCard>
      <PlayerStatus>
        {game.commit2 === ZERO_BYTES32 ? (
          <WaitingText isPlayer1={false}>Waiting For Opponent...</WaitingText>
        ) : game.choice2 === CHOICE_UNKNOWN ? (
          <WaitingText isPlayer1={false}>Player Ready</WaitingText>
        ) : (
          <LottieContainer>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData:
                  game.choice2 === CHOICE_ROCK
                    ? rockLottiePurple
                    : game.choice2 === CHOICE_PAPER
                    ? paperLottiePurple
                    : scissorsLottiePurple,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </LottieContainer>
        )}
      </PlayerStatus>

      <Vs>VS</Vs>

      <PlayerStatus>
        {game.commit1 === ZERO_BYTES32 ? (
          <>
            <WaitingText isPlayer1={true}>Waiting For You...</WaitingText>
            <div></div>
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
          <LottieContainer>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData:
                  thisGameCommit?.choice === CHOICE_ROCK
                    ? rockLottieOrange
                    : thisGameCommit?.choice === CHOICE_PAPER
                    ? paperLottieOrange
                    : scissorsLottieOrange,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
            />
          </LottieContainer>
        )}
      </PlayerStatus>

      <PlayerCard>
        <Identicon address={game.player1} size={56} />
        <PlayerInfo>
          <PlayerName>{myENSName}</PlayerName>
          {myENSName !== game.player1 ? (
            <PlayerAddress>{game.player1}</PlayerAddress>
          ) : null}
        </PlayerInfo>
        <PlayerScore>1400</PlayerScore>
      </PlayerCard>
    </GameContainer>
  );
}

export default Challenge;
