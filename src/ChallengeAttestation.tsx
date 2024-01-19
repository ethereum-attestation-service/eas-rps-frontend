import { Attestation } from "./utils/types";
import styled from "styled-components";
import { ButtonStandard } from "./styles/buttons";
import { useState } from "react";
import { useNavigate } from "react-router";

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

  return (
    <Container>
      <UID>UID: {attestation.id}</UID>
      <Challenger>Challanger: {attestation.attester}</Challenger>

      <ButtonStandard onClick={() => navigate(`/challenge/${attestation.id}`)}>
        Accept Challenge
      </ButtonStandard>
    </Container>
  );
}
