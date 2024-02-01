import React, { useEffect, useState } from "react";
import { BiArrowFromBottom } from "react-icons/bi";
import styled from "styled-components";
import PlayerResult from "./components/PlayerResult";
import { useNavigate, useParams } from "react-router";
import easLogo from "./assets/easlogo.png";
import {
  CHOICE_UNKNOWN,
  STATUS_PLAYER1_WIN,
  STATUS_PLAYER2_WIN,
  STATUS_UNKNOWN,
  addPlusIfPositive,
  baseURL,
  getENSName,
  getGameStatus,
} from "./utils/utils";
import { Game } from "./utils/types";
import axios from "axios";
import { useAccount } from "wagmi";
import Page from "./Page";
// Styled components
const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  background-color: #fef6e4;
  padding: 20px;
  justify-content: center;
  height: 100vh;
`;

const LineBreak = styled.div`
  height: 1px;
  width: 80%;
  background: rgba(57, 53, 84, 0.15);
  margin: 10px;
`;

type WonProps = { won: boolean };

const VictoryMessage = styled.div<WonProps>`
  font-family: Ubuntu;
  margin: 10px 0;
  text-align: left;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: ${({ won }) => (won ? "#00ebcf" : "#C8B3F5")};
  font-size: 26px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 40%;
`;

const Points = styled.div`
  display: flex;
  flex-direction: row;
`;

const PointsNum = styled.span<WonProps>`
  margin-bottom: 20px;
  color: #272343;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: ${({ won }) => (won ? "#ff9f1c" : "#F582AE")};
  font-family: "Space Grotesk";
  font-size: 75px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const PointsWord = styled.span`
  color: #272343;
  font-family: "Space Grotesk";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 20%;
`;

const ResultContainer = styled.div`
  border-radius: 10px;
  width: 357px;
  height: 515px;
  flex-shrink: 0;
  border: 1px solid rgba(57, 53, 84, 0.2);
  background: #fff;
  box-shadow: 10px 10px 25px 5px rgba(210, 201, 190, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ResultTitle = styled.div`
  color: #272343;
  text-align: center;
  font-family: "Space Grotesk";
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding: 20px;
`;

const StakeTitle = styled.div`
  color: rgba(39, 35, 67, 0.66);
  font-family: "Space Grotesk";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const StakeBet = styled.div`
  color: #272343;
  font-family: "Space Grotesk";
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const GameUID = styled.div`
  color: #272343;
  font-family: "Space Grotesk";
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  overflow-wrap: anywhere;
`;

const GameUIDTitle = styled.div`
  color: #000;
  font-family: "Space Grotesk";
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const GameUIDContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  margin: 20px;
`;

const Button = styled.button`
  border-radius: 8px;
  border: 1px solid #ff9f1c;
  background: #ff9f1c;
  margin: 10px 0;
  cursor: pointer;
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 34px; /* 188.889% */
  width: 357px;
  height: 71px;
  flex-shrink: 0;
`;

const UnderlinedLink = styled.a`
  color: #272343;
  text-align: center;
  font-family: "Space Grotesk";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px; /* 188.889% */
  text-decoration-line: underline;
`;

const GameInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

function Summary() {
  const [game, setGame] = useState<Game>();
  const [player1ENS, setPlayer1ENS] = useState<string>("");
  const [player2ENS, setPlayer2ENS] = useState<string>("");
  const [tick, setTick] = useState<number>(0);
  const { challengeId } = useParams();
  const { address } = useAccount();
  const navigate = useNavigate();

  const update = async () => {
    //query server for game status
    const gameRes = await axios.post<Game>(`${baseURL}/gameStatus`, {
      uid: challengeId,
    });

    setGame(gameRes.data);
    setPlayer1ENS(
      (await getENSName(gameRes.data.player1)) || gameRes.data.player1
    );
    setPlayer2ENS(
      (await getENSName(gameRes.data.player2)) || gameRes.data.player2
    );
  };

  //watch for game updates

  useEffect(() => {
    update();
    setTimeout(() => {
      setTick(tick + 1);
    }, 5000);
  }, [tick]);

  const status = game ? getGameStatus(game) : STATUS_UNKNOWN;
  console.log("status", status);
  return (
    <Page>
      <SummaryContainer>
        {address === game?.player1 ? (
          <VictoryMessage won={status === STATUS_PLAYER1_WIN}>
            {status === STATUS_PLAYER1_WIN
              ? "You won!"
              : status === STATUS_PLAYER2_WIN
              ? "You lost!"
              : "It's a tie!"}
          </VictoryMessage>
        ) : address === game?.player2 ? (
          <VictoryMessage won={status === STATUS_PLAYER2_WIN}>
            {status === STATUS_PLAYER2_WIN
              ? "You won!"
              : status === STATUS_PLAYER1_WIN
              ? "You lost!"
              : "It's a tie!"}
          </VictoryMessage>
        ) : null}

        {address === game?.player1 || address === game?.player2 ? (
          <Points>
            <PointsNum
              won={
                (address === game?.player1 && status === STATUS_PLAYER1_WIN) ||
                (address === game?.player2 && status === STATUS_PLAYER2_WIN)
              }
            >
              {addPlusIfPositive(
                (address === game?.player1
                  ? game?.eloChange1
                  : game?.eloChange2) || 0
              )}
            </PointsNum>
            <div style={{ width: 5 }} />
            <PointsWord>points</PointsWord>
          </Points>
        ) : null}
        <ResultContainer>
          {/*<BiArrowFromBottom color={"#000"} size={24} />*/}
          <ResultTitle>Roshambo Result</ResultTitle>
          <PlayerResult
            address={game?.player1 || ""}
            ensName={player1ENS}
            choice={game?.choice1 || 0}
            won={status === STATUS_PLAYER1_WIN}
          />
          <PlayerResult
            address={game?.player2 || ""}
            ensName={player2ENS}
            choice={game?.choice2 || 0}
            won={status === STATUS_PLAYER2_WIN}
          />
          <LineBreak />
          <StakeTitle>What was at stake...</StakeTitle>
          <StakeBet>{game?.stakes}</StakeBet>
          <LineBreak />
          <GameInfoContainer>
            <img
              src={easLogo}
              style={{ width: 28, height: 28, display: "flex", margin: 20 }}
            />
            <GameUIDContainer>
              <GameUIDTitle>Game UID:</GameUIDTitle>
              <GameUID>{game?.uid}</GameUID>
            </GameUIDContainer>
          </GameInfoContainer>
        </ResultContainer>
        {address === game?.player1 || address === game?.player2 ? (
          <Button
            onClick={() => {
              navigate(
                `/${address === game?.player1 ? game?.player2 : game?.player1}`
              );
            }}
          >
            Rematch
          </Button>
        ) : null}
        <UnderlinedLink href={"/challenges"}>Back to Battles</UnderlinedLink>
      </SummaryContainer>
    </Page>
  );
}

export default Summary;
