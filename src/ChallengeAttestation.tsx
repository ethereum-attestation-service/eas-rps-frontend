import { Game } from "./utils/types";
import styled from "styled-components";
import { ButtonStandard } from "./styles/buttons";
import { useNavigate } from "react-router";
import { useStore } from "./useStore";

type Props = {
  game: Game;
};

const Container = styled.div``;
const UID = styled.div`
  font-size: 12px;
`;
const Challenger = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
`;

export function ChallengeAttestation({ game: g }: Props) {
  const navigate = useNavigate();

  return (
    <Container>
      <UID>UID: {g.uid}</UID>
      <Challenger>Challenger: {g.player1}</Challenger>

      <ButtonStandard
        onClick={() => {
          navigate(`/challenge/${g.uid}`);
        }}
      >
        Accept Challenge
      </ButtonStandard>
    </Container>
  );
}
