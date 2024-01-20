import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router";
import { ChallengeAttestation } from "./ChallengeAttestation";
import axios from "axios";
import { baseURL } from "./utils/utils";
import { Game } from "./utils/types";

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

function Challenges() {
  console.log("looking for challenges");
  const { address } = useAccount();
  const [challengeObjects, setChallengeObjects] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      return navigate("/");
    }

    async function getAtts() {
      setChallengeObjects([]);

      setLoading(true);
      const newChallenges = await axios.post<Game[]>(
        `${baseURL}/incomingChallenges`,
        { address: address }
      );

      setChallengeObjects(newChallenges.data);
      setLoading(false);
    }
    getAtts();
  }, [address]);

  return (
    <Container>
      <GradientBar />
      <NewConnection>Challenges</NewConnection>
      <AttestationHolder>
        <WhiteBox>
          {loading && <div>Loading...</div>}
          {challengeObjects.length > 0 || loading ? (
            challengeObjects.map((gameObj, i) => (
              <ChallengeAttestation game={gameObj} />
            ))
          ) : (
            <div>No one here yet</div>
          )}
        </WhiteBox>
      </AttestationHolder>
    </Container>
  );
}

export default Challenges;
