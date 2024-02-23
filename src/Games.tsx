import React, {useEffect, useState} from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import {useAccount} from "wagmi";
import {useNavigate, useParams} from "react-router";
import {ChallengeAttestation} from "./ChallengeAttestation";
import axios from "axios";
import {
  baseURL,
  CHOICE_UNKNOWN,
  profileLinks,
  getGameStatus,
  STATUS_PLAYER1_WIN,
  STATUS_PLAYER2_WIN,
} from "./utils/utils";
import {Game, GameWithOnePlayer, MyStats} from "./utils/types";
import UserHistoryCard from "./UserHistoryCard";
import PlayerCard from "./components/PlayerCard";
import MiniHeader from "./MiniHeader";
import {usePrivy} from "@privy-io/react-auth";
// import { Button } from "./Home";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 20px 20px 20px;
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
    align-items: center;
    width: 100%;
    justify-content: center;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
`;

const BattlesWrapper = styled.div`
    background-color: #fff;
    max-width: 800px;
    max-height: 400px;
    overflow-x: auto;
    width: 100%;
    border-radius: 10px;
    gap: 10px;
    display: flex;
    flex-direction: column;
    padding: 12px;
`;

const StyledPlayerCard = styled(PlayerCard)`
    margin: 0;
    box-shadow: none;
    border: none;
    //border-bottom: 1px solid rgba(57, 53, 84, 0.1);
    border-radius: 0;
    padding: 10px 0;
`;

function Games() {
  const {address: preComputedAddress} = useParams();
  const {user} = usePrivy();
  const address = preComputedAddress || user?.wallet?.address;
  const [ensName, setEnsName] = useState<string | undefined>(undefined);
  const [ensAvatar, setEnsAvatar] = useState<string | undefined>(undefined);
  const [finishedGames, setFinishedGames] = useState<GameWithOnePlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [gameStats, setGameStats] = useState({
    wins: 0,
    draws: 0,
    losses: 0,
    streak: 0,
  });
  const [gameResults, setGameResults] = useState<string[]>();
  const [badges, setBadges] = useState<string[]>();
  const [eloScore, setEloScore] = useState<number>(0);

  useEffect(() => {
    if (!address) {
      return;
    }

    async function getStats() {
      setFinishedGames([]);
      setLoading(true);

      const gameList = await axios.post<MyStats>(`${baseURL}/myGames`, {
        address: address,
        finalized: true,
      });

      const {
        games,
        elo,
        badges,
        ensName: ens,
        ensAvatar: ensAv,
      } = gameList.data;

      setFinishedGames(games);
      setBadges(badges);
      setEloScore(elo);
      setEnsName(ens);
      setEnsAvatar(ensAv);
      let tmpGameResults = [];

      let tmpGameStats = {wins: 0, draws: 0, losses: 0, streak: 0};
      let streakCounting = true;
      for (const gameObj of games) {
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
      {!preComputedAddress && <MiniHeader links={profileLinks} selected={1}/>}
      <UserHistoryCard
        address={address || ""}
        ensName={ensName}
        ensAvatar={ensAvatar}
        stats={gameStats}
        isSelf={
          !preComputedAddress || preComputedAddress === user?.wallet?.address
        }
        badges={badges || []}
        elo={eloScore}
      />

      {finishedGames.length > 0 && (
        <>
          <RecentBattles>Recent Battles</RecentBattles>

          <BattlesWrapper>
            {finishedGames.slice(0, 30).map((gameObj, i) => {
              const isPlayer1 = gameObj.player1 === address;
              return (
                <BattleContainer
                  onClick={() => {
                    navigate(`/summary/${gameObj.uid}`);
                  }}
                >
                  <StyledPlayerCard
                    address={isPlayer1 ? gameObj.player2 : gameObj.player1}
                    score={gameResults ? gameResults[i] : ""}
                    overrideENSWith={""}
                    badges={gameObj.player1Object.badges}
                    ens={gameObj.player1Object.ensName}
                    ensAvatar={gameObj.player1Object.ensAvatar}
                  />
                </BattleContainer>
              );
            })}
          </BattlesWrapper>
        </>)
      }
    </Container>
  );
}

export default Games;
