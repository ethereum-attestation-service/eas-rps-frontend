import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import newChallengeFists from "./assets/newChallengeFists.png";

import {
  baseURL,
  CUSTOM_SCHEMAS,
  EASContractAddress,
  getAddressForENS,
  RPS_GAME_UID,
  submitSignedAttestation,
} from "./utils/utils";
import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import invariant from "tiny-invariant";
import { ethers } from "ethers";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import dayjs from "dayjs";
import { useSigner } from "./utils/wagmi-utils";
import { useStore } from "./useStore";
import Start from "./Start";
import Page from "./Page";
import MiniHeader from "./MiniHeader";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px; // or whatever value gives the desired spacing
  background-color: #fef6e4;
`;

const StartButton = styled.div`
  border-radius: 8px;
  background: rgba(46, 196, 182, 0.33);
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 18px;
  font-weight: 700;
  line-height: 34px;
  width: 326px;
  height: 71px;
  margin: 20px 0; // Adds space above and below the button
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FistsImage = styled.img`
  width: 293px;
  height: 221px;
  flex-shrink: 0;
`;

const BigText = styled.div`
  text-align: center;
  font-family: Ubuntu;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px; /* 166.667% */
  padding: 20px 0;
`;

function Home() {
  const { status, address: myAddress } = useAccount();
  const modal = useModal();
  const { preComputedRecipient } = useParams();

  const [address, setAddress] = useState(preComputedRecipient || "");
  const [stakes, setStakes] = useState("");
  const signer = useSigner();
  const [attesting, setAttesting] = useState(false);
  const [ensResolvedAddress, setEnsResolvedAddress] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const styles = {
    input: {
      textAlign: "center" as "center",
      fontFamily: "Ubuntu",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "40px" /* 285.714% */,
      width: "311px",
      height: "65px",
      border: "none",
    },
  };

  const issueChallenge = async () => {
    invariant(address, "Address should be defined");
    const recipient = ensResolvedAddress || address;
    console.log("signer", signer);
    console.log("me", myAddress);
    setAttesting(true);
    try {
      const schemaEncoder = new SchemaEncoder("string stakes");

      const encoded = schemaEncoder.encodeData([
        { name: "stakes", type: "string", value: stakes },
      ]);

      const eas = new EAS(EASContractAddress);

      invariant(signer, "signer must be defined");
      eas.connect(signer);

      const offchain = await eas.getOffchain();

      const signedOffchainAttestation = await offchain.signOffchainAttestation(
        {
          schema: CUSTOM_SCHEMAS.CREATE_GAME_CHALLENGE,
          recipient: recipient,
          refUID: RPS_GAME_UID,
          data: encoded,
          time: BigInt(dayjs().unix()),
          revocable: false,
          expirationTime: BigInt(0),
          version: 1,
          nonce: BigInt(0),
        },
        signer
      );

      const pkg: AttestationShareablePackageObject = {
        signer: myAddress!,
        sig: signedOffchainAttestation,
      };

      const res = await submitSignedAttestation(pkg);

      if (!res.data.error) {
        console.log(res);

        navigate(`/challenge/${signedOffchainAttestation.uid}`);
      } else {
        console.error(res.data.error);
      }
    } catch (e) {
      console.error(e);
    }

    setAttesting(false);
  };

  useEffect(() => {
    const addressParam = searchParams.get("address");
    if (addressParam) {
      setAddress(addressParam);
    }
  }, []);

  useEffect(() => {
    async function checkENS() {
      if (address.includes(".eth")) {
        const tmpAddress = await getAddressForENS(address);
        console.log("tmpAddress", tmpAddress);
        if (tmpAddress) {
          setEnsResolvedAddress(tmpAddress);
        } else {
          setEnsResolvedAddress("");
        }
      } else {
        setEnsResolvedAddress("");
      }
    }

    checkENS();
  }, [address]);

  return (
    <>
      <GradientBar />
      {status === "connected" ? (
        <Page>
          <Container>
            <MiniHeader selected={1} />
            <FistsImage src={newChallengeFists} />
            <BigText>Who are you battling?</BigText>
            <input
              style={styles.input}
              type="text"
              placeholder="Type in address or ENS name..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoCorrect={"off"}
              autoComplete={"off"}
              autoCapitalize={"off"}
            />
            <BigText>Optional Stakes...</BigText>
            <textarea
              style={{ ...styles.input, height: "90px", resize: "none" }}
              placeholder="What happens if someone wins? Remember, it's only as good as their
              word."
              value={stakes}
              onChange={(e) => setStakes(e.target.value)}
            />
            <StartButton
              style={
                ethers.isAddress(ensResolvedAddress || address)
                  ? { backgroundColor: "green", cursor: "pointer" }
                  : {}
              }
              onClick={
                ethers.isAddress(ensResolvedAddress || address)
                  ? issueChallenge
                  : () => {}
              }
            >
              Start Battle
            </StartButton>
          </Container>
        </Page>
      ) : (
        <Start />
      )}
    </>
  );
}

export default Home;
