import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import {
  baseURL,
  CHOICE_UNKNOWN,
  CUSTOM_SCHEMAS,
  EASContractAddress,
  getGameStatus,
  RPS_GAME_UID,
  STATUS_DRAW,
  STATUS_PLAYER1_WIN,
  STATUS_PLAYER2_WIN,
  STATUS_UNKNOWN,
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
  ZERO_ADDRESS,
  ZERO_BYTES32,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import dayjs from "dayjs";
import { useSigner } from "./utils/wagmi-utils";
import { useStore } from "./useStore";
import { AcceptedChallenge, Game, GameCommit } from "./utils/types";
import axios from "axios";
import { Button } from "./Home";

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
  const [tick, setTick] = useState(0);
  const [waiting, setWaiting] = useState(true);
  const [game, setGame] = useState<Game>();

  const gameCommits = useStore((state) => state.gameCommits);

  const thisGameCommit = gameCommits.find(
    (commit) => commit.challengeUID === challengeId
  );

  const addGameCommit = useStore((state) => state.addGameCommit);

  const committed = !!thisGameCommit;

  invariant(challengeId, "Challenge ID should be defined");

  const update = async () => {
    //query server for game status
    const gameRes = await axios.post<Game>(`${baseURL}/gameStatus`, {
      uid: challengeId,
    });
    console.log(gameRes.data);
    setGame(gameRes.data);
  };

  //watch for game updates

  useEffect(() => {
    if (waiting) {
      update();
      setTimeout(() => {
        setTick(tick + 1);
      }, 1000);
    }
  }, [tick]);

  const commit = async (choice: number) => {
    invariant(address, "Address should be defined");

    console.log("signer", signer);
    console.log("me", address);
    setAttesting(true);
    try {
      const schemaEncoder = new SchemaEncoder("bytes32 commitHash");

      console.log(choice, address);
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
          recipient: ZERO_ADDRESS,
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
        addGameCommit({
          salt: saltHex,
          choice: choice,
          challengeUID: challengeId,
        });
        window.location.reload();
      } else {
        console.error(res.data.error);
      }
    } catch (e) {
      console.error(e);
    }

    setAttesting(false);
  };

  const RPSOptions = () => {
    return (
      <RPSContainer>
        <FaHandRock
          size={50}
          color={theme.primary["indigo-500"]}
          onClick={() => commit(0)}
        />
        <FaHandPaper
          size={50}
          color={theme.primary["indigo-500"]}
          onClick={() => commit(1)}
        />
        <FaHandScissors
          size={50}
          color={theme.primary["indigo-500"]}
          onClick={() => commit(2)}
        />
      </RPSContainer>
    );
  };

  const status = game ? getGameStatus(game) : STATUS_UNKNOWN;

  if (!game) {
    return <div>no game here</div>;
  }
  return (
    <Container>
      <WhiteBox>
        <UID>Challenge UID: {challengeId}</UID>
        {game.player1 === address ? (
          <>
            {status !== STATUS_UNKNOWN ? (
              <>
                {status === STATUS_PLAYER1_WIN
                  ? "You won"
                  : status === STATUS_DRAW
                  ? "Tied"
                  : "Lost"}
              </>
            ) : game.commit1 !== ZERO_BYTES32 ? (
              <>Waiting for opponent...</>
            ) : (
              <RPSOptions />
            )}
          </>
        ) : game.player2 === address ? (
          <>
            {status !== STATUS_UNKNOWN ? (
              <>
                {status === STATUS_PLAYER2_WIN
                  ? "You won"
                  : status === STATUS_DRAW
                  ? "Tied"
                  : "Lost"}
              </>
            ) : game.commit2 !== ZERO_BYTES32 ? (
              <> Waiting for opponent...</>
            ) : (
              <RPSOptions />
            )}
          </>
        ) : null}
      </WhiteBox>
    </Container>
  );
}

export default Challenges;
