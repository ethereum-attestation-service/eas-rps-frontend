import React, { useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import {
  CUSTOM_SCHEMAS,
  EASContractAddress,
  submitSignedAttestation,
} from "./utils/utils";

import invariant from "tiny-invariant";
import { useNavigate, useParams } from "react-router";
import { FaHandRock, FaHandScissors, FaHandPaper } from "react-icons/fa";
import { theme } from "./utils/theme";
import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import dayjs from "dayjs";
import { useSigner } from "./utils/wagmi-utils";
import { useStore } from "./useStore";
import { GameCommit } from "./utils/types";

const Container = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const UID = styled.div`
  font-size: 12px;
`;

// Rock paper & sicssors components
const RPSContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;

  width: 260px;
  margin: 0 auto;

  :hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
`;

const WhiteBox = styled.div`
  box-shadow: 0 4px 33px rgba(168, 198, 207, 0.15);
  background-color: #fff;
  padding: 20px;
  width: 590px;
  border-radius: 10px;
  margin: 40px auto 0;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

function Challenges() {
  const { address } = useAccount();
  const navigate = useNavigate();
  const { challengeId } = useParams();
  const [attesting, setAttesting] = useState(false);
  const signer = useSigner();
  const gameCommits: GameCommit[] = useStore((state) => state.gameCommits);
  const addGameCommit = useStore((state) => state.addGameCommit);

  const playedMove = gameCommits.some((gc) => gc.challengeUID === challengeId);

  console.log("gameCommits", gameCommits);
  invariant(challengeId, "Challenge ID should be defined");

  const playRPS = async (choice: number) => {
    invariant(address, "Address should be defined");

    setAttesting(true);
    try {
      const schemaEncoder = new SchemaEncoder("bytes32 commitHash");

      // create random bytes32 salt
      const salt = ethers.randomBytes(32);
      const saltHex = ethers.hexlify(salt);

      const hashedChoice = ethers.solidityPackedKeccak256(
        ["uint256", "bytes32"],
        [choice, saltHex]
      );

      console.log("hashedChoice", hashedChoice);

      const encoded = schemaEncoder.encodeData([
        { name: "commitHash", type: "bytes32", value: hashedChoice },
      ]);

      const eas = new EAS(EASContractAddress);

      invariant(signer, "signer must be defined");
      eas.connect(signer);

      const offchain = await eas.getOffchain();

      const signedOffchainAttestation = await offchain.signOffchainAttestation(
        {
          schema: CUSTOM_SCHEMAS.COMMIT_HASH,
          recipient: ethers.ZeroAddress,
          refUID: challengeId,
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
        signer: address,
        sig: signedOffchainAttestation,
      };

      const res = await submitSignedAttestation(pkg);

      if (!res.data.error) {
        // setTimeout(() => {
        //   navigate(`/challenge/${signedOffchainAttestation.uid}}`);
        // }, 500);

        addGameCommit({
          salt: saltHex,
          choice: choice,
          challengeUID: challengeId,
        });
      } else {
        console.error(res.data.error);
      }
    } catch (e) {
      console.error(e);
    }

    setAttesting(false);
  };

  return (
    <Container>
      <WhiteBox>
        <UID>Challenge UID: {challengeId}</UID>

        {playedMove ? (
          <>Already played</>
        ) : (
          <RPSContainer>
            <FaHandRock
              size={50}
              color={theme.primary["indigo-500"]}
              onClick={() => playRPS(0)}
            />
            <FaHandPaper
              size={50}
              color={theme.primary["indigo-500"]}
              onClick={() => playRPS(1)}
            />
            <FaHandScissors
              size={50}
              color={theme.primary["indigo-500"]}
              onClick={() => playRPS(2)}
            />
          </RPSContainer>
        )}
      </WhiteBox>
    </Container>
  );
}

export default Challenges;
