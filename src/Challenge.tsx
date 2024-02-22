import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useAccount} from "wagmi";
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
import {useNavigate, useParams} from "react-router";
import {FaHandRock, FaHandScissors, FaHandPaper} from "react-icons/fa";

import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
  ZERO_ADDRESS,
  ZERO_BYTES32,
} from "@ethereum-attestation-service/eas-sdk";
import {ethers} from "ethers";
import dayjs from "dayjs";
import {useSigner} from "./utils/wagmi-utils";
import {useStore} from "./useStore";
import {
  GameWithPlayers,
} from "./utils/types";
import axios from "axios";
import Lottie from "react-lottie";
import {Identicon} from "./components/Identicon";
import PlayerCard from "./components/PlayerCard";
import RotatedLottie from "./components/RotatedLottie";
import {usePrivy} from "@privy-io/react-auth";

type finishedProps = { finished: boolean };
const Vs = styled.div`
    text-align: center;
    font-family: Racing Sans One;
    font-size: 80px;
    font-style: normal;
    font-weight: 700;
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
    background-color: ${({status}) =>
            status === STATUS_PLAYER1_WIN
                    ? "rgba(46, 196, 182, 0.33)"
                    : status === STATUS_PLAYER2_WIN
                            ? "rgba(255, 0, 28, 0.33)"
                            : status === STATUS_DRAW
                                    ? "rgba(255, 220, 0, 0.33)"
                                    : "none"};
    padding: 0 1.2rem 1.2rem 1.2rem;
    box-sizing: border-box;
`;

type WaitingTextProps = { isPlayer1: boolean };

const blinkAnimation = `@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}`;

const WaitingText = styled.div<WaitingTextProps>`
    color: #272343;
    text-align: center;
    -webkit-text-stroke-color: ${({isPlayer1}) =>
            isPlayer1 ? "#00ebcf" : "#C8B3F5"};
    -webkit-text-stroke-width: 2px;
    font-family: Ubuntu;
    font-size: 28px;
    font-style: italic;
    font-weight: 700;
    line-height: 34px;
    padding: 20px;
    margin: 5px 0;
    animation: ${blinkAnimation} 1.5s linear infinite;
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
    font-size: 60px;
`;

const HandOptionImage = styled.img`
    width: 80%;
    height: 80%;
`;

const PlayerContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin: 10px 0;
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
  const {user} = usePrivy();
  const address = user?.wallet?.address;
  const navigate = useNavigate();
  const {challengeId} = useParams();
  const signer = useSigner();
  const [tick, setTick] = useState(0);
  const [game, setGame] = useState<GameWithPlayers>();

  const gameCommits = useStore((state) => state.gameCommits);

  const thisGameCommit = gameCommits.find(
    (commit) => commit.challengeUID === challengeId
  );

  const addGameCommit = useStore((state) => state.addGameCommit);

  invariant(challengeId, "Challenge ID should be defined");

  const swapPlayersIfNecessary = () => {
    let tmpGame = game;
    if (tmpGame && tmpGame.player2 === address) {
      tmpGame.player2 = tmpGame.player1;
      tmpGame.player1 = address;
      const tmpCommit = tmpGame.commit2;
      tmpGame.commit2 = tmpGame.commit1;
      tmpGame.commit1 = tmpCommit;
      const tmpChoice = tmpGame.choice2;
      tmpGame.choice2 = tmpGame.choice1;
      tmpGame.choice1 = tmpChoice;
      const tmpSalt = tmpGame.salt2;
      tmpGame.salt2 = tmpGame.salt1;
      tmpGame.salt1 = tmpSalt;
      const tmpPlayerObject = tmpGame.player2Object;
      tmpGame.player2Object = tmpGame.player1Object;
      tmpGame.player1Object = tmpPlayerObject;
    }
    setGame(tmpGame);
  }

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

  useEffect(() => {
    swapPlayersIfNecessary()
  }, [game, address]);

  const status = game ? getGameStatus(game) : STATUS_UNKNOWN;

  useEffect(() => {
    if (status !== STATUS_UNKNOWN) {
      setTimeout(() => {
        navigate(`/summary/${challengeId}`);
      }, 1000);
    }
  }, [game]);

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
        {name: "commitHash", type: "bytes32", value: hashedChoice},
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

  if (!game) {
    return <div>no game here</div>;
  }

  return (
    <GameContainer status={status}>
      <PlayerContainer>
        <PlayerCard
          address={game.player2}
          score={game.player2Object.elo}
          overrideENSWith={"Opponent"}
          badges={game.player2Object.whiteListAttestations.map(
            (att) => att.type
          )}
          ens={game.player2Object.ensName}
        />
        <PlayerStatus>
          {game.commit2 === ZERO_BYTES32 ? (
            <WaitingText isPlayer1={false}>Waiting For Opponent...</WaitingText>
          ) : game.choice2 === CHOICE_UNKNOWN ? (
            <WaitingText isPlayer1={false}>Player Ready</WaitingText>
          ) : (
            <RotatedLottie choice={game.choice2} isPlayer1={false}/>
          )}
        </PlayerStatus>
      </PlayerContainer>

      <Vs>VS</Vs>

      <PlayerContainer>
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
                  🪨
                </HandOption>
                <HandOption
                  onClick={() => {
                    commit(CHOICE_PAPER);
                  }}
                >
                  📄
                </HandOption>
                <HandOption
                  onClick={() => {
                    commit(CHOICE_SCISSORS);
                  }}
                >
                  ✂️
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
          badges={game.player1Object.whiteListAttestations.map(
            (att) => att.type
          )}
          ens={game.player1Object.ensName}
        />
      </PlayerContainer>
    </GameContainer>
  );
}

export default Challenge;
