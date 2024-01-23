import { Game } from "./utils/types";
import styled from "styled-components";
import { ButtonStandard } from "./styles/buttons";
import { useNavigate } from "react-router";
import { useStore } from "./useStore";
import invariant from "tiny-invariant";
import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
  ZERO_ADDRESS,
} from "@ethereum-attestation-service/eas-sdk";
import {
  CUSTOM_SCHEMAS,
  EASContractAddress,
  RPS_GAME_UID,
  submitSignedAttestation,
} from "./utils/utils";
import dayjs from "dayjs";
import { useSigner } from "./utils/wagmi-utils";

type Props = {
  game: Game;
};

const Container = styled.div``;
const UID = styled.div`
  font-size: 12px;
`;
const Challenger = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
`;

export function ChallengeAttestation({ game: g }: Props) {
  const navigate = useNavigate();
  const signer = useSigner();

  const decline = async (uid: string) => {
    try {
      const schemaEncoder = new SchemaEncoder("bool declineGameChallenge");

      const encoded = schemaEncoder.encodeData([
        { name: "declineGameChallenge", type: "bool", value: true },
      ]);

      const eas = new EAS(EASContractAddress);

      invariant(signer, "signer must be defined");
      eas.connect(signer);

      const offchain = await eas.getOffchain();

      const signedOffchainAttestation = await offchain.signOffchainAttestation(
        {
          schema: CUSTOM_SCHEMAS.DECLINE_GAME_CHALLENGE,
          recipient: ZERO_ADDRESS,
          refUID: uid,
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
        signer: signer.address!,
        sig: signedOffchainAttestation,
      };

      const res = await submitSignedAttestation(pkg);

      if (!res.data.error) {
        console.log(res);

        navigate(`/`);
      } else {
        console.error(res.data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <UID>UID: {g.uid}</UID>
      <Challenger>Challenger: {g.player1}</Challenger>

      <ButtonStandard
        onClick={() => {
          navigate(`/challenge/${g.uid}`);
        }}
      >
        Accept
      </ButtonStandard>

      <ButtonStandard
        onClick={async () => {
          await decline(g.uid);
        }}
      >
        Decline
      </ButtonStandard>
    </Container>
  );
}
