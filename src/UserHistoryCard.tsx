import {useNavigate} from "react-router";
import {Identicon} from "./components/Identicon";
import styled from "styled-components";
import axios from "axios";
import {baseURL} from "./utils/utils";
import {useState} from "react";

const CardContainer = styled.div`
    border-radius: 10px;
    background: #fff;
    box-shadow: 10px 10px 10px 10px rgba(57, 53, 84, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    max-width: 100vw;
    margin: 3rem 0;
    padding: 1rem;
`;

const Name = styled.div`
    color: #272343;
    text-align: center;
    font-family: "Space Grotesk";
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    padding: 0 12px;
    overflow-wrap: anywhere;
`;

const Address = styled.div`
    color: rgba(57, 53, 84, 0.5);
    text-align: center;
    font-family: "Space Grotesk";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 0 12px;
    overflow-wrap: anywhere;
`;

const LineBreak = styled.div`
    height: 1px;
    background-color: rgba(57, 53, 84, 0.15);
    margin: 10px;
    width: 100%;
`;

const StatsContainer = styled.div`
    display: flex;
    -webkit-box-pack: justify;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
    flex-flow: wrap;
    justify-content: center;
`;

const StatName = styled.div`
    color: rgba(57, 53, 84, 0.43);
    text-align: center;
    font-family: "Space Grotesk";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const StatValue = styled.div`
    color: #272343;
    text-align: center;
    font-family: Audiowide;
    font-size: 40px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const StyledIdenticon = styled(Identicon)`
    margin-top: -3rem;
    border-radius: 50px;
    padding: 15px;
`;

const StatContainer = styled.div`
    margin: 0 1rem;
`;

type Stats = { wins: number; losses: number; draws: number; streak: number };
type Props = { address: string; ensName: string; stats: Stats, isSelf: boolean };

export default function UserHistoryCard({address, ensName, stats, isSelf}: Props) {
  const [checkingForBadges, setCheckingForBadges] = useState(false);
  const navigate = useNavigate();
  return (
    <CardContainer>
      <StyledIdenticon address={address} size={75}/>
      <Name>{ensName}</Name>
      {ensName !== address && <Address>{address}</Address>}
      <LineBreak/>
      {isSelf ?
        <div onClick={async () => {
          setCheckingForBadges(true)
          await axios.post(`${baseURL}/checkForBadges`, {
            address,
          })
          window.location.reload()
        }}>
          {checkingForBadges ? "Checking for verifications..." : "Check for verifications"}
        </div>
        :
        <div onClick={() => {
          navigate(`/${address}`);
        }}>
          Challenge this player
        </div>
      }
      <LineBreak/>
      <StatsContainer>
        {Object.entries(stats).map(([key, value]) => (
          <StatContainer>
            <StatName>{key.charAt(0).toUpperCase() + key.slice(1)}</StatName>
            <StatValue>{value}</StatValue>
          </StatContainer>
        ))}
      </StatsContainer>
    </CardContainer>
  );
}
