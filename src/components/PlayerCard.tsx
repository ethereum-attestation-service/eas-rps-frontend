import { Identicon } from "./Identicon";
import styled from "styled-components";
import { badgeNameToLogo } from "../utils/utils";
import { MaxWidthDiv } from "./MaxWidthDiv";
import { useNavigate } from "react-router";

const PlayerName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  overflow-wrap: anywhere;
`;

const PlayerScore = styled.div`
  color: #272343;
  font-family: "Space Grotesk", serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
`;

const PlayerAddress = styled.div`
  font-size: 14px;
  color: #666;
  overflow-wrap: anywhere;
`;

const CardContainer = styled(MaxWidthDiv)`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  //padding: 10px 20px;
  box-sizing: border-box;
  width: 100%;
  justify-content: space-between;
  border-radius: 10px;
  border: 1px solid rgba(57, 53, 84, 0.1);
  background-color: #fff;
  box-shadow: 10px 10px 10px 0 rgba(57, 53, 84, 0.05);
  cursor: pointer;
`;

const PlayerInfo = styled.div`
  margin: 0 10px;
  overflow-wrap: anywhere;
`;

const BadgesContainer = styled.div`
  position: absolute;
  bottom: -8px;
  left: -4px;
`;

const Badge = styled.img`
  width: 16px;
  height: 16px;
`;

type Props = {
  address: string;
  score: number | string;
  overrideENSWith: string;
  style?: React.CSSProperties;
  badges: string[];
  ens?: string;
  ensAvatar?: string;
  className?: string;
};

const IconWrapper = styled.div`
  position: relative;
`;

const ENSAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 12px;
`;

export default function PlayerCard({
  address,
  score,
  overrideENSWith,
  badges,
  style,
  className,
  ens,
  ensAvatar,
}: Props) {
  const navigate = useNavigate();

  return (
    <CardContainer
      className={className}
      style={style}
      onClick={() => {
        navigate(`/games/${address}`);
      }}
    >
      <IconWrapper>
        {ensAvatar ? (
          <ENSAvatar src={ensAvatar} />
        ) : (
          <Identicon address={address} size={56} />
        )}
        <BadgesContainer>
          {badges.map((badge) => (
            <Badge src={badgeNameToLogo(badge)} />
          ))}
        </BadgesContainer>
      </IconWrapper>
      <PlayerInfo>
        <PlayerName>{ens || overrideENSWith}</PlayerName>
        <PlayerAddress>{address}</PlayerAddress>
      </PlayerInfo>
      {score !== 0 && <PlayerScore>{score}</PlayerScore>}
    </CardContainer>
  );
}
