import { useNavigate } from "react-router";
import styled from "styled-components";

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10%;
  margin: 20px;
  justify-content: center;
`;

type SelectedProps = { selected: boolean };

const HeaderItem = styled.div<SelectedProps>`
  color: #1e1e1e;
  text-align: center;
  font-family: Nunito;
  font-size: 10px;
  font-style: normal;
  font-weight: 800;
  line-height: 34px; /* 340% */
  background-color: ${({ selected }) => (selected ? "#FFBF69" : "transparent")};
  border-radius: 10px;
  cursor: pointer;
`;
export default function MiniHeader({ selected }: { selected: number }) {
  const navigate = useNavigate();

  return (
    <Container>
      {["BATTLE CODE", "NEW CHALLENGE", "LEADERBOARD"].map((name, index) => (
        <HeaderItem
          selected={selected === index}
          onClick={() =>
            navigate(
              index === 0
                ? "/qr"
                : index === 1
                ? "/newChallenge"
                : "/leaderboard"
            )
          }
        >
          {name}
        </HeaderItem>
      ))}
    </Container>
  );
}
