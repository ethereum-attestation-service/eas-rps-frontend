import {Identicon} from "./Identicon";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {getENSName} from "../utils/utils";
import {MaxWidthDiv} from "./MaxWidthDiv";
import easLogo from "../assets/easlogo.png";
import coinbaseLogo from "../assets/coinbaseLogo.png";
import {useNavigate} from "react-router";

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
    text-align: center;
`;

const PlayerAddress = styled.div`
    font-size: 14px;
    color: #666;
    overflow-wrap: anywhere;
`;

const CardContainer = styled(MaxWidthDiv)`
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr;
    align-items: center;
    padding: 10px 20px;
    box-sizing: border-box;
    width: 100%;
    justify-content: space-between;
    border-radius: 10px;
    border: 1px solid rgba(57, 53, 84, 0.1);
    background-color: #fff;
    box-shadow: 10px 10px 10px 0px rgba(57, 53, 84, 0.05);
    cursor: pointer;
`;

const PlayerInfo = styled.div`
    margin: 0 10px;
    overflow-wrap: anywhere;
`;

const BadgesContainer = styled.div`
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const Badge = styled.img`
    width: 40px;
    height: 40px;
`;

type Props = {
  address: string;
  score: number | string;
  overrideENSWith: string;
  style?: React.CSSProperties;
  badges: string[];
};

export default function PlayerCard({
                                     address,
                                     score,
                                     overrideENSWith,
                                     badges,
                                     style,
                                   }: Props) {
  const navigate = useNavigate();
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
    <CardContainer style={style} onClick={() => {
      navigate(`/games/${address}`)
    }}>
      <Identicon address={address} size={56}/>
      <PlayerInfo>
        <PlayerName>
          {ensName}
        </PlayerName>
        <PlayerAddress>{address}</PlayerAddress>
      </PlayerInfo>
      <span>
        {badges.length > 0 &&
          <BadgesContainer>
            <Badge src={easLogo}/>
          </BadgesContainer>
        }
      </span>
      {score !== 0 &&
        <PlayerScore>{score}</PlayerScore>
      }
    </CardContainer>
  );
}
