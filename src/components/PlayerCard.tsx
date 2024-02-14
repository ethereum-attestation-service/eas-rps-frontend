import { Identicon } from "./Identicon";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { getENSName } from "../utils/utils";
import { MaxWidthDiv } from "./MaxWidthDiv";

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

const CardContainer = styled(MaxWidthDiv)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  justify-content: space-between;
  border-radius: 10px;
  border: 1px solid rgba(57, 53, 84, 0.1);
  background-color: #fff;
  box-shadow: 10px 10px 10px 0px rgba(57, 53, 84, 0.05);
`;

const PlayerInfo = styled.div`
  margin: 0 10px;
  overflow-wrap: anywhere;
  max-width: 50%;
`;

type Props = {
  address: string;
  score: number | string;
  overrideENSWith: string;
  style?: React.CSSProperties;
};

export default function PlayerCard({
  address,
  score,
  overrideENSWith,
  style,
}: Props) {
  const [ensName, setEnsName] = useState<string>("");

  const updateENS = async () => {
    setEnsName((await getENSName(address)) || overrideENSWith);
    // setEnsName("kirmayer.eth" || address);
  };

  useEffect(() => {
    if (address) {
      updateENS();
    }
  }, [address]);

  return (
    <CardContainer style={style}>
      <Identicon address={address} size={56} />
      <PlayerInfo>
        <PlayerName>{ensName}</PlayerName>
        <PlayerAddress>{address}</PlayerAddress>
      </PlayerInfo>
      <PlayerScore>{score}</PlayerScore>
    </CardContainer>
  );
}
