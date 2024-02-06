import { Identicon } from "./Identicon";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { getENSName } from "../utils/utils";

const PlayerName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  overflow-wrap: anywhere;
`;

const PlayerScore = styled.div`
  color: #272343;
  font-family: "Space Grotesk";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const PlayerAddress = styled.div`
  font-size: 14px;
  color: #666;
  overflow-wrap: anywhere;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-radius: 15px;
  width: 80%;
  background: #fff;
  justify-content: center;

  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  overflow-wrap: anywhere;
  max-width: 50%;
`;

type Props = {
  address: string;
  score: number | string;
};

export default function PlayerCard({ address, score }: Props) {
  const [ensName, setEnsName] = useState<string>("");

  const updateENS = async () => {
    setEnsName((await getENSName(address)) || address);
    // setEnsName("kirmayer.eth" || address);
  };

  useEffect(() => {
    if (address) {
      updateENS();
    }
  }, []);

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
