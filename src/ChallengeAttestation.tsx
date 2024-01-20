import { Attestation } from "./utils/types";
import styled from "styled-components";
import { ButtonStandard } from "./styles/buttons";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useStore } from "./useStore";

type Props = {
  attestation: Attestation;
};

const Container = styled.div``;
const UID = styled.div`
  font-size: 12px;
`;
const Challenger = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
`;

const RPSHolder = styled.div``;

export function ChallengeAttestation({ attestation }: Props) {
  const navigate = useNavigate();
  const addAcceptedChallenge = useStore((state) => state.addAcceptedChallenge);

  return (
    <Container>
      <UID>UID: {attestation.id}</UID>
      <Challenger>Challenger: {attestation.attester}</Challenger>

      <ButtonStandard
        onClick={() => {
          addAcceptedChallenge({
            UID: attestation.id,
            opponentAddress: attestation.attester,
            playerRevealed: false,
            opponentRevealed: false,
          });
          navigate(`/challenge/${attestation.id}`);
        }}
      >
        Accept Challenge
      </ButtonStandard>
    </Container>
  );
}
