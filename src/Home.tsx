import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {
  playLinks,
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
import {ethers} from "ethers";
import { useSearchParams} from "react-router-dom";
import {useNavigate, useParams} from "react-router";
import dayjs from "dayjs";
import {useSigner} from "./utils/wagmi-utils";
import {useStore} from "./useStore";
import Start from "./Start";
import Page from "./Page";
import MiniHeader from "./MiniHeader";
import {usePrivy} from "@privy-io/react-auth";
import {globalMaxWidth} from "./components/MaxWidthDiv";
import AwaitingSignerMessage from "./components/AwaitingSignerMessage";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    height: 100%;
    padding: 0 20px 20px 20px;
    box-sizing: border-box;
`;

const StartButton = styled.div`
    border-radius: 8px;
    background: rgba(46, 196, 182, 0.33);
    color: #fff;
    font-family: Nunito,serif;
    font-size: 18px;
    font-weight: 700;
    width: 100%;
    padding: 30px 0;
    margin: 20px 0; // Adds space above and below the button
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: ${globalMaxWidth};
`;



const BigText = styled.div`
    text-align: center;
    font-family: Ubuntu,serif;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    color: rgb(80, 80, 80);
    padding: 20px 0;
`;

const Input = styled.input`
    text-align: center;
    font-family: Ubuntu,serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    width: 100%;
    padding: 25px 0;
    border: 1px solid #eee;
    border-radius: 8px;
    outline: none;
    max-width: ${globalMaxWidth};
    box-sizing: border-box;
`;


const MiniHeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
`;

function Home() {
  const {preComputedRecipient} = useParams();

  const [address, setAddress] = useState(preComputedRecipient || "");
  const [stakes, setStakes] = useState("");
  const signer = useSigner();
  const [attesting, setAttesting] = useState(false);
  const [ensResolvedAddress, setEnsResolvedAddress] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {user} = usePrivy();
  const cachedAddress = useStore((state) => state.cachedAddress)
  const myAddress = user?.wallet?.address || cachedAddress;

  const issueChallenge = async () => {
    invariant(address, "Address should be defined");
    const recipient = ensResolvedAddress || address;

    setAttesting(true);
    try {
      const schemaEncoder = new SchemaEncoder("string stakes");

      const encoded = schemaEncoder.encodeData([
        {name: "stakes", type: "string", value: stakes},
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
      {/*<GradientBar />*/}
      {myAddress ? (
        <Page>
          <Container>
            <MiniHeaderContainer>
              <MiniHeader links={playLinks} selected={0}/>
            </MiniHeaderContainer>
            {/*<FistsImage src={newChallengeFists} />*/}
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
            <Input
              placeholder="What happens if someone wins? Remember, it's only as good as their
              word."
              value={stakes}
              onChange={(e) => setStakes(e.target.value)}
            />
            {signer ? <StartButton
              style={
                ethers.isAddress(ensResolvedAddress || address) && !attesting
                  ? {backgroundColor: "#2EC4B6", cursor: "pointer"}
                  : {}
              }
              onClick={
                ethers.isAddress(ensResolvedAddress || address) && !attesting
                  ? issueChallenge
                  : () => {
                  }
              }
            >
              {attesting ? 'Starting...' : 'Start Battle'}
            </StartButton> : <AwaitingSignerMessage/>
            }
          </Container>
        </Page>
      ) : (
        <Start/>
      )}
    </>
  );
}

export default Home;
