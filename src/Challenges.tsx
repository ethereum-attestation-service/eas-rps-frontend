import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router";
import { ChallengeAttestation } from "./ChallengeAttestation";
import axios from "axios";
import { baseURL, playLinks } from "./utils/utils";
import { Game, IncomingChallenge } from "./utils/types";
import Page from "./Page";
import MiniHeader from "./MiniHeader";
import { usePrivy } from "@privy-io/react-auth";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
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

function Challenges() {
  const {user} = usePrivy();
  const address = user?.wallet?.address;
  const [challengeObjects, setChallengeObjects] = useState<IncomingChallenge[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      return;
    }

    async function getAtts() {
      setChallengeObjects([]);

      setLoading(true);
      const newChallenges = await axios.post<IncomingChallenge[]>(
        `${baseURL}/incomingChallenges`,
        { address: address }
      );

      setChallengeObjects(newChallenges.data);
      setLoading(false);
    }

    getAtts();
  }, [address]);

  return (
    <Page>
      <Container>
        <MiniHeader links={playLinks} selected={1} />

        <Title>Incoming Battles</Title>
        {loading && <div>Loading...</div>}
        {challengeObjects.length > 0 || loading ? (
          challengeObjects.map((gameObj) => (
            <ChallengeAttestation game={gameObj} isChallenge={true} />
          ))
        ) : (
          <div>No one here yet</div>
        )}
      </Container>
    </Page>
  );
}

export default Challenges;
