import { Identicon } from "./Identicon";
import styled from "styled-components";
import { baseURL, choiceToText, getENSName } from "../utils/utils";
import { Game } from "../utils/types";
import axios from "axios";
import { useEffect, useState } from "react";

const PlayerName = styled.div`
  color: #000;
  font-family: "Space Grotesk";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  white-space: normal;
  word-break: break-word;
`;

const PlayerChoice = styled.div`
  color: #000;
  font-family: "Space Grotesk";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const PlayerAddress = styled.div`
  color: #272343;
  font-family: "Space Grotesk";
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  overflow-wrap: anywhere;
  white-space: normal;
`;

type ContainerProps = { won: boolean };

const CardContainer = styled.div<ContainerProps>`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  background-color: ${({ won }) => (won ? "rgba(46, 196, 182, 0.33)" : "#FFF")};
  padding: 1rem 0.5rem;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  flex-wrap: wrap;
  white-space: normal;
`;

const IdenticonContainer = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
`;

type Props = {
  address: string;
  ensName: string;
  choice: number;
  won: boolean;
};

export default function PlayerResult({ address, ensName, choice, won }: Props) {
  return (
    <CardContainer won={won}>
      <IdenticonContainer>
        <Identicon address={address} size={56} />
      </IdenticonContainer>
      <PlayerInfo>
        <PlayerName>{ensName}</PlayerName>
        {ensName !== address ? <PlayerAddress>{address}</PlayerAddress> : null}
      </PlayerInfo>
      <PlayerChoice>{choiceToText(choice)}</PlayerChoice>
    </CardContainer>
  );
}
