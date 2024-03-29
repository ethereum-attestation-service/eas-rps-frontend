import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {baseURL, profileLinks, clientURL} from "./utils/utils";
import {QRCodeSVG} from "qrcode.react";
import PlayerCard from "./components/PlayerCard";
import axios from "axios";
import MiniHeader from "./components/MiniHeader";
import {usePrivy} from "@privy-io/react-auth";
import {Player} from "./utils/types";
import {useStore} from "./hooks/useStore";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px 20px 20px;
    min-height: 100vh;
    height: 100%;
`;

const QrCard = styled.div`
    max-width: 600px;
    border-radius: 15px;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 10px 10px 5px 0px rgba(57, 53, 84, 0.05);
    margin-top: 20px;
`;

const CopyButton = styled.div`
    color: rgb(57, 53, 84);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Space Grotesk";
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    width: 300px;
    height: 39px;
    flex-shrink: 0;
    border-radius: 8px;
    cursor: pointer;
    background: rgba(200, 179, 245, 0.15);
    padding: 10px 20px;
`;

const ChallengeLink = styled.div`
    color: rgba(57, 53, 84, 0.5);
    text-align: center;
    font-family: Nunito;
    font-size: 12px;
    font-style: italic;
    font-weight: 400;
    overflow-wrap: anywhere;
    padding: 20px;
`;

const QrCodeContainer = styled.div`
    width: 100%;
    text-align: center;
    height: auto;
    padding-top: 0.75rem;
`;

function Home() {
  const {user} = usePrivy();
  const cachedAddress = useStore((state) => state.cachedAddress)
  const address = user?.wallet?.address || cachedAddress;
  const [player, setPlayer] = useState<Player>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPlayerDetails() {
      const result = await axios.post<Player>(`${baseURL}/getElo`, {
        address: address,
      });
      setPlayer(result.data)
    }

    fetchPlayerDetails();
  }, [address]);

  const challengeLink = `${clientURL}/${player?.ensName || address}`

  return (
    <Container>
      <MiniHeader links={profileLinks} selected={0}/>
      <PlayerCard
        address={address || ""}
        score={player?.elo || 0}
        overrideENSWith={"Your Address"}
        badges={player?.badges || []}
        ens={player?.ensName}
        ensAvatar={player?.ensAvatar}
      />

      <QrCard>
        <QrCodeContainer>
          {address && (
            <QRCodeSVG
              value={challengeLink}
              includeMargin={true}
              size={300}
            />
          )}
        </QrCodeContainer>

        <CopyButton
          onClick={async () => {
            window.navigator.clipboard.writeText(
              challengeLink
            );
            setCopied(true);
          }}
        >
          {copied ? 'Copied Link' : 'Copy Challenge Link'}
        </CopyButton>
        <ChallengeLink>{challengeLink}</ChallengeLink>
      </QrCard>
    </Container>
  );
}

export default Home;
