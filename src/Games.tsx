import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router";
import { ChallengeAttestation } from "./ChallengeAttestation";
import axios from "axios";
import {
  baseURL,
  CHOICE_UNKNOWN,
  gameLinks,
  getENSName,
  getGameStatus,
  STATUS_PLAYER1_WIN,
  STATUS_PLAYER2_WIN,
} from "./utils/utils";
import { Game, MyStats } from "./utils/types";
import UserHistoryCard from "./UserHistoryCard";
import PlayerCard from "./components/PlayerCard";
import MiniHeader from "./MiniHeader";
// import { Button } from "./Home";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const RecentBattles = styled.div`
  color: #272343;
  font-family: Ubuntu;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const BattleContainer = styled.div`
  margin: 12px;
  align-items: center;
  width: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

type result = "WIN" | "LOSS" | "DRAW";

function Games() {
  const { address } = useAccount();
  const [ensName, setEnsName] = useState<string>("");
  const [finishedGames, setFinishedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [gameStats, setGameStats] = useState({
    wins: 0,
    draws: 0,
    losses: 0,
    streak: 0,
  });
  const [gameResults, setGameResults] = useState<string[]>();

  useEffect(() => {
    if (!address) {
      return;
    }

    async function getStats() {
      setFinishedGames([]);
      setLoading(true);
      if (address) {
        setEnsName((await getENSName(address)) || address);
        // setEnsName("kirmayer.eth" || address);
      }
      const gameList = await axios.post<MyStats>(`${baseURL}/myGames`, {
        address: address,
        finalized: true,
      });

      setFinishedGames(gameList.data.games);
      let tmpGameResults = [];

      let tmpGameStats = { wins: 0, draws: 0, losses: 0, streak: 0 };
      let streakCounting = true;
      for (const gameObj of gameList.data.games) {
        const status = getGameStatus(gameObj);
        const isPlayer1 = gameObj.player1 === address;
        const result = isPlayer1
          ? status === STATUS_PLAYER1_WIN
            ? "WIN"
            : status === STATUS_PLAYER2_WIN
            ? "LOSS"
            : "DRAW"
          : status === STATUS_PLAYER2_WIN
          ? "WIN"
          : status === STATUS_PLAYER1_WIN
          ? "LOSS"
          : "DRAW";
        if (result === "WIN") {
          tmpGameStats.wins++;
          if (streakCounting) {
            tmpGameStats.streak++;
          }
        } else if (result === "LOSS") {
          tmpGameStats.losses++;
          streakCounting = false;
        } else {
          tmpGameStats.draws++;
          streakCounting = false;
        }
        tmpGameResults.push(result);
      }
      setGameResults(tmpGameResults);
      setGameStats(tmpGameStats);
      setLoading(false);
    }

    getStats();
  }, [address]);

  return (
    <Container>
      <MiniHeader links={gameLinks} selected={2} />
      <UserHistoryCard
        address={address || ""}
        ensName={ensName || ""}
        stats={gameStats}
      />
      <RecentBattles>Recent Battles</RecentBattles>
      {finishedGames.length > 0 || loading ? (
        finishedGames.slice(0, 5).map((gameObj, i) => {
          const isPlayer1 = gameObj.player1 === address;
          return (
            <BattleContainer
              onClick={() => {
                navigate(`/summary/${gameObj.uid}`);
              }}
            >
              <PlayerCard
                address={isPlayer1 ? gameObj.player2 : gameObj.player1}
                score={gameResults ? gameResults[i] : ""}
                overrideENSWith={""}
                badges={[]}
              />
            </BattleContainer>
          );
        })
      ) : (
        <div>No one here yet</div>
      )}
    </Container>
  );
}

export default Games;
