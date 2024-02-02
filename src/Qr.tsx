import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import { baseURL, clientURL, getENSName } from "./utils/utils";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import PlayerCard from "./components/PlayerCard";
import axios from "axios";
import Page from "./Page";
import MiniHeader from "./MiniHeader";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #fef6e4;
  box-sizing: border-box;
  padding: 20px;
  height: 100vh;
`;

const QrCard = styled.div`
  width: 80%;
  flex-shrink: 0;
  border-radius: 15px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  margin-top: 20px;
`;

const CopyButton = styled.div`
  color: #393554;
  text-align: center;
  font-family: "Space Grotesk";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 34px; /* 242.857% */
  width: 80%;
  height: 39px;
  flex-shrink: 0;
  cursor: pointer;
  background: rgba(200, 179, 245, 0.15);
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

function Home() {
  const { address } = useAccount();
  const [ens, setEns] = useState("");
  const [elo, setElo] = useState(1000);

  useEffect(() => {
    async function checkENS() {
      if (!address) return;
      const name = await getENSName(address);
      if (name) {
        setEns(name);
      } else {
        setEns("");
      }
    }

    async function getElo() {
      const result = await axios.post(`${baseURL}/getElo`, {
        address: address,
      });
      setElo(result.data);
    }

    checkENS();

    getElo();
  }, [address]);

  return (
    <Page>
      <Container>
        <MiniHeader selected={0} />
        <PlayerCard
          address={address || ""}
          ensName={ens ? ens : address || ""}
          score={elo}
        />

        <QrCard>
          {address && (
            <QRCodeSVG
              value={`https://metirl.org/${ens ? ens : address}`}
              includeMargin={true}
              size={200}
            />
          )}
          <CopyButton
            onClick={async () => {
              window.navigator.clipboard.writeText(
                `${clientURL}/${ens || address}`
              );
            }}
          >
            Copy Challenge Link
          </CopyButton>
          <ChallengeLink>{`${clientURL}/${ens || address}`}</ChallengeLink>
        </QrCard>
      </Container>
    </Page>
  );
}

export default Home;
