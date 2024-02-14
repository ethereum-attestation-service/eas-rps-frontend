import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import newChallengeFists from "./assets/newChallengeFists.png";

import {
  baseURL,
  challengeLinks,
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
import { usePrivy } from "@privy-io/react-auth";
import { globalMaxWidth } from "./components/MaxWidthDiv";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 0 20px 20px 20px;
`;

const StartButton = styled.div`
  border-radius: 8px;
  background: rgba(46, 196, 182, 0.33);
  color: #fff;
  font-family: Nunito;
  font-size: 18px;
  font-weight: 700;
  width: 100%;
  height: 71px;
  margin: 20px 0; // Adds space above and below the button
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: ${globalMaxWidth};
`;

const FistsImage = styled.img`
  width: 133px;
  height: 100px;
  flex-shrink: 0;
`;

const BigText = styled.div`
  text-align: center;
  font-family: Ubuntu;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  color: rgb(80, 80, 80);
  padding: 20px 0;
`;

// styled component with above styles
const Input = styled.input`
  text-align: center;
  font-family: Ubuntu;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  width: 100%;
  height: 65px;
  border: 1px solid #eee;
  border-radius: 4px;
  outline: none;
  max-width: ${globalMaxWidth};
`;

const TextArea = styled.textarea`
  text-align: center;
  font-family: Ubuntu;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  width: 100%;
  border: 1px solid #eee;
  resize: none;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 4px;
  outline: none;
  max-width: ${globalMaxWidth};
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
        alert(res.data.error);
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
            <MiniHeader links={challengeLinks} selected={1} />
            <FistsImage src={newChallengeFists} />
            <BigText>Who are you battling?</BigText>
            <Input
              type="text"
              placeholder="Type in address or ENS name..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoCorrect={"off"}
              autoComplete={"off"}
              autoCapitalize={"off"}
            />
            <BigText>Optional Stakes...</BigText>
            <TextArea
              placeholder="What happens if someone wins? Remember, it's only as good as their
              word."
              value={stakes}
              onChange={(e) => setStakes(e.target.value)}
            />
            <StartButton
              style={
                ethers.isAddress(ensResolvedAddress || address)
                  ? { backgroundColor: "#2EC4B6", cursor: "pointer" }
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
