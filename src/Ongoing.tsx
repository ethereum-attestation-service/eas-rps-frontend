import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ChallengeAttestation} from "./ChallengeAttestation";
import axios from "axios";
import {baseURL, playLinks} from "./utils/utils";
import {
  GameWithPlayers,
  IncomingChallenge,
} from "./utils/types";
import Page from "./Page";
import MiniHeader from "./MiniHeader";
import {usePrivy} from "@privy-io/react-auth";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 0 20px 20px 20px;
    box-sizing: border-box;
`;

const Title = styled.div`
    color: #272343;
    text-align: center;
    font-family: Ubuntu;
    font-size: 36px;
    font-style: normal;
    font-weight: 700;
    line-height: 34px; /* 94.444% */
    padding: 30px;
`;

function Ongoing() {
  const {user} = usePrivy();
  const address = user?.wallet?.address;
  const [challengeObjects, setChallengeObjects] = useState<IncomingChallenge[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getAtts() {
      setChallengeObjects([]);

      setLoading(true);
      const newChallenges = await axios.post<GameWithPlayers[]>(
        `${baseURL}/ongoing`,
        {
          address: address,
        }
      );

      setChallengeObjects(
        newChallenges.data.map((game) => ({
          uid: game.uid,
          stakes: game.stakes,
          player1Object: {
            address: address === game.player1 ? game.player2 : game.player1,
            elo:
              address === game.player1
                ? game.player2Object.elo
                : game.player1Object.elo,
            whiteListAttestations: address === game.player1
              ? game.player2Object.whiteListAttestations
              : game.player1Object.whiteListAttestations,
            ensName: address === game.player1
              ? game.player2Object.ensName
              : game.player1Object.ensName,
            ensAvatar: address === game.player1
              ? game.player2Object.ensAvatar
              : game.player1Object.ensAvatar,
          },
          gameCount: 0,
          winstreak: 0,
        }))
      );
      setLoading(false);
    }

    getAtts();
  }, [address]);

  return (
    <Page>
      <Container>
        <MiniHeader links={playLinks} selected={2}/>

        <Title>Ongoing Battles</Title>
        {loading && <div>Loading...</div>}
        {challengeObjects.length > 0 || loading ? (
          challengeObjects.map((gameObj) => (
            <ChallengeAttestation game={gameObj}/>
          ))
        ) : (
          <div>No one here yet</div>
        )}
      </Container>
    </Page>
  );
}

export default Ongoing;
