import React, { useEffect, useState } from "react";
import { Player } from "./utils/types";
import { baseURL, leaderboardLinks } from "./utils/utils";
import axios from "axios";
import styled from "styled-components";
import PlayerCard from "./components/PlayerCard";
import { useParams } from "react-router";
import { useAccount } from "wagmi";
import MiniHeader from "./MiniHeader";
import { Identicon } from "./components/Identicon";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const MiniHeaderContainer = styled.div`
  margin: 20px;
  box-sizing: border-box;
`;

const RankCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #272343;
  background: rgba(255, 255, 255, 0.5);
`;

const RankNumber = styled.div`
  color: #fff;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #272343;
  font-family: Audiowide;
  font-size: 25px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

// Container for the icons
const PodiumContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

// Individual icon containers
const IconContainer = styled.div<{ place: number }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
  position: relative;
  background-color: white; // assuming the icons have a white background
`;

// Adjustments for the first place
const FirstPlaceContainer = styled(IconContainer)`
  margin-bottom: 30px; // Makes the first place float above the others
`;

// Text for the place number (1st, 2nd, 3rd)
const PlaceText = styled.span<{ place: number }>`
  font-size: 1.5em;
  color: ${({ place }) =>
    place === 1 ? "#FFD700" : place === 2 ? "#C0C0C0" : "#CD7F32"};
  position: absolute;
  top: -25px;
  font-weight: bold;
`;

// Example usage
type PodiumProps = {
  firstAddress: string;
  secondAddress: string;
  thirdAddress: string;
};
const Podium = ({ firstAddress, secondAddress, thirdAddress }: PodiumProps) => (
  <PodiumContainer>
    <IconContainer place={2}>
      <PlaceText place={2}>2nd</PlaceText>
      <Identicon address={secondAddress} size={70} />
    </IconContainer>
    <FirstPlaceContainer place={1}>
      <PlaceText place={1}>1st</PlaceText>
      <Identicon address={firstAddress} size={70} />
    </FirstPlaceContainer>
    <IconContainer place={3}>
      <PlaceText place={3}>3rd</PlaceText>
      <Identicon address={thirdAddress} size={70} />
    </IconContainer>
  </PodiumContainer>
);

export default function Leaderboard() {
  const { address } = useAccount();
  const { type } = useParams();
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  async function getLeaderboard() {
    const res = await axios.post<Player[]>(`${baseURL}/${type}Leaderboard`, {
      address,
    });

    setLeaderboard(res.data);
  }

  useEffect(() => {
    getLeaderboard();
  }, [type]);

  return (
    <Container>
      <MiniHeaderContainer>
        <MiniHeader
          links={leaderboardLinks}
          selected={type === "global" ? 0 : 1}
        />
      </MiniHeaderContainer>
      <Podium
        firstAddress={leaderboard[0] ? leaderboard[0].address : ""}
        secondAddress={leaderboard[1] ? leaderboard[1].address : ""}
        thirdAddress={leaderboard[2] ? leaderboard[2].address : ""}
      />
      {leaderboard.map((player, index) => (
        <RankCard key={index}>
          <RankNumber>
            {leaderboard.findIndex((p) => p.elo === player.elo) + 1}
          </RankNumber>
          <PlayerCard address={player.address} score={player.elo} />
        </RankCard>
      ))}
    </Container>
  );
}
