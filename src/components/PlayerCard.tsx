import { Identicon } from "./Identicon";
import styled from "styled-components";

const PlayerName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const PlayerScore = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #000;
`;

const PlayerAddress = styled.div`
  font-size: 14px;
  color: #666;
  word-break: break-all;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #f3f3f3;
  padding: 10px;
  margin: 10px 0;
  border-radius: 15px;
  background: #fff;

  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
`;

type Props = {
  address: string;
  ensName: string;
  score: number;
};

export default function PlayerCard({ address, ensName, score }: Props) {
  return (
    <CardContainer>
      <Identicon address={address} size={56} />
      <PlayerInfo>
        <PlayerName>{ensName}</PlayerName>
        {ensName !== address ? <PlayerAddress>{address}</PlayerAddress> : null}
      </PlayerInfo>
      <PlayerScore>{score}</PlayerScore>
    </CardContainer>
  );
}
