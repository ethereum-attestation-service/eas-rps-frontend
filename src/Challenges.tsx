import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import { getAvailableChallenges } from "./utils/utils";
import { Attestation } from "./utils/types";
import { useNavigate } from "react-router";
import { ChallengeAttestation } from "./ChallengeAttestation";

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
  const { address } = useAccount();
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      return navigate("/");
    }

    async function getAtts() {
      setAttestations([]);

      setLoading(true);
      const challengeAttestations = await getAvailableChallenges();

      setAttestations(challengeAttestations);
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
          {attestations.length > 0 || loading ? (
            attestations.map((attestation, i) => (
              <ChallengeAttestation attestation={attestation} />
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
