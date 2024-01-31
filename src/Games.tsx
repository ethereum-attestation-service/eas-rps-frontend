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
  getGameStatus,
  STATUS_PLAYER1_WIN,
  STATUS_PLAYER2_WIN,
} from "./utils/utils";
import { Game, MyStats } from "./utils/types";
// import { Button } from "./Home";

const Container = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const AttestationHolder = styled.div``;

const NewConnection = styled.div`
  color: #333342;
  text-align: center;
  font-size: 25px;
  font-family: Montserrat, sans-serif;
  font-style: italic;
  font-weight: 700;
  margin-top: 20px;
`;

const WhiteBox = styled.div`
  box-shadow: 0 4px 33px rgba(168, 198, 207, 0.15);
  background-color: #fff;
  padding: 20px;
  width: 590px;
  border-radius: 10px;
  margin: 40px auto 0;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

function Games() {
  const { address } = useAccount();
  const [finishedGames, setFinishedGames] = useState<Game[]>([]);
  const [activeGames, setActiveGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      return navigate("/");
    }

    async function getStats() {
      setFinishedGames([]);

      setLoading(true);
      const newChallenges = await axios.post<MyStats>(`${baseURL}/myStats`, {
        address: address,
      });

      setFinishedGames(
        newChallenges.data.games.filter(
          (game) =>
            game.choice1 !== CHOICE_UNKNOWN && game.choice2 !== CHOICE_UNKNOWN
        )
      );

      setActiveGames(
        newChallenges.data.games.filter(
          (game) =>
            game.choice1 === CHOICE_UNKNOWN || game.choice2 === CHOICE_UNKNOWN
        )
      );

      setLoading(false);
    }

    getStats();
  }, [address]);

  return (
    <Container>
      <GradientBar />
      <NewConnection>Games</NewConnection>
      <AttestationHolder>
        <WhiteBox>
          {loading && <div>Loading...</div>}
          {activeGames.length > 0 || loading ? (
            activeGames.map((gameObj, i) => (
              <div>
                <button
                  onClick={() => {
                    navigate(`/challenge/${gameObj.uid}`);
                  }}
                >
                  Game against{" "}
                  {gameObj.player1 === address
                    ? gameObj.player2
                    : gameObj.player1}
                </button>
              </div>
            ))
          ) : (
            <div>No one here yet</div>
          )}
          {finishedGames.length > 0 || loading ? (
            finishedGames.map((gameObj, i) => (
              <div>
                {gameObj.player1 === address ? (
                  <>
                    {getGameStatus(gameObj) === STATUS_PLAYER1_WIN ? (
                      <>You won against {gameObj.player2}</>
                    ) : getGameStatus(gameObj) === STATUS_PLAYER2_WIN ? (
                      <>You lost against {gameObj.player2}</>
                    ) : (
                      <>You tied against {gameObj.player2}</>
                    )}
                  </>
                ) : gameObj.player2 === address ? (
                  <>
                    {getGameStatus(gameObj) === STATUS_PLAYER2_WIN ? (
                      <>You won against {gameObj.player1}</>
                    ) : getGameStatus(gameObj) === STATUS_PLAYER1_WIN ? (
                      <>You lost against {gameObj.player1}</>
                    ) : (
                      <>You tied against {gameObj.player1}</>
                    )}
                  </>
                ) : null}
              </div>
            ))
          ) : (
            <div>No one here yet</div>
          )}
        </WhiteBox>
      </AttestationHolder>
    </Container>
  );
}

export default Games;
