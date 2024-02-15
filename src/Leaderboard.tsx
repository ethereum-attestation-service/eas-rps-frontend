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
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RankCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 10fr;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(57, 53, 84, 0.15);
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
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
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

// Individual icon containers
const IconContainer = styled.div<{ place: number }>`
  width: ${({ place }) => (place === 1 ? "150px" : "100px")};
  height: ${({ place }) => (place === 1 ? "150px" : "100px")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: white; // assuming the icons have a white background
  border: ${({ place }) => (place === 1 ? "5px" : "3px")} solid #fff;
  box-shadow: 5px 10px 10px 0 rgba(57, 53, 84, 0.05);
`;

// Text for the place number (1st, 2nd, 3rd)
const PlaceText = styled.span<{ place: number }>`
  text-shadow: 5px 5px 10px rgba(39, 35, 67, 0.51);
  color: #fff;
  -webkit-text-stroke-color: ${({ place }) =>
    place === 1 ? "#FFBF69" : place === 2 ? "#00EBCF" : "#C8B3F5"};
  -webkit-text-stroke-width: 1px;
  position: absolute;
  top: -30px;
  font-family: Audiowide;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const BorderlessIdenticon = styled(Identicon)`
  border: none;
`;

const FlatPlayerCard = styled(PlayerCard)`
  border: none !important;
  box-shadow: none !important;
  background-color: transparent !important;
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
      <BorderlessIdenticon address={secondAddress} size={70} />
    </IconContainer>
    <IconContainer place={1}>
      <PlaceText place={1}>1st</PlaceText>
      <BorderlessIdenticon address={firstAddress} size={70 * 1.5} />
    </IconContainer>
    <IconContainer place={3}>
      <PlaceText place={3}>3rd</PlaceText>
      <BorderlessIdenticon address={thirdAddress} size={70} />
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
      <ListContainer>
        {leaderboard.map((player, index) => (
          <RankCard key={index}>
            <RankNumber>
              {leaderboard.findIndex((p) => p.elo === player.elo) + 1}
            </RankNumber>
            <FlatPlayerCard
              style={{
                background: "transparent",
                border: "none",
                boxShadow: "none",
              }}
              address={player.address}
              score={player.elo}
              overrideENSWith={""}
            />
          </RankCard>
        ))}
      </ListContainer>
    </Container>
  );
}
