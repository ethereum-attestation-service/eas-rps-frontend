import invariant from "tiny-invariant";
import type {
  Attestation,
  AttestationResult,
  AvailableChallengesResult,
  EASChainConfig,
  EnsNamesResult,
  Game,
  MyAttestationResult,
} from "./types";
import {
  ResolvedAttestation,
  StoreAttestationRequest,
  StoreIPFSActionReturn,
} from "./types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { ethers } from "ethers";
import { AttestationShareablePackageObject } from "@ethereum-attestation-service/eas-sdk";
import axios from "axios";

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;

export const CUSTOM_SCHEMAS = {
  COMMIT_HASH:
    "0x2328029cfa84b9ea42f4e0e8fa24fbf66da07ceec0a925dd27370b9617b32d59",
  CREATE_GAME_CHALLENGE:
    "0x64b1bac6f531c64a6aa372b1239111fe41a60003dcda62bfa967bc6e4c4d91e0",
  DECLINE_GAME_CHALLENGE:
    "0x27e160d185f1d97202897bd3ed697906398b70a8d08b0d22bc2cfffdf561e3e9",
};

export const RPS_GAME_UID =
  "0x048de8e6b4bf0769744930cc2641ce05d473f3cd5ce976ba9e6a3256d4b011eb";

dayjs.extend(duration);
dayjs.extend(relativeTime);

function getChainId() {
  return Number(process.env.REACT_APP_CHAIN_ID);
}

export const CHAINID = getChainId();
invariant(CHAINID, "No chain ID env found");

export const EAS_CHAIN_CONFIGS: EASChainConfig[] = [
  {
    chainId: 11155111,
    chainName: "sepolia",
    subdomain: "sepolia.",
    version: "0.26",
    contractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    schemaRegistryAddress: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    etherscanURL: "https://sepolia.etherscan.io",
    contractStartBlock: 2958570,
    rpcProvider: `https://sepolia.infura.io/v3/`,
  },
  {
    chainId: 1,
    chainName: "mainnet",
    subdomain: "",
    version: "0.26",
    contractAddress: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
    schemaRegistryAddress: "0xA7b39296258348C78294F95B872b282326A97BDF",
    contractStartBlock: 16756720,
    etherscanURL: "https://etherscan.io",
    rpcProvider: `https://mainnet.infura.io/v3/`,
  },
];

export const activeChainConfig = EAS_CHAIN_CONFIGS.find(
  (config) => config.chainId === CHAINID
);

export const baseURL = `http://localhost:8080`;
// export const baseURL = `http://eas-rps.dakh.com`;

invariant(activeChainConfig, "No chain config found for chain ID");
export const EASContractAddress = activeChainConfig.contractAddress;

export const EASVersion = activeChainConfig.version;
export const timeFormatString = "MM/DD/YYYY h:mm:ss a";

export async function getAddressForENS(name: string) {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      "mainnet",
      {
        staticNetwork: new ethers.Network("mainnet", 1),
      }
    );

    return await provider.resolveName(name);
  } catch (e) {
    return null;
  }
}

export async function getENSName(address: string) {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      "mainnet",
      {
        staticNetwork: new ethers.Network("mainnet", 1),
      }
    );
    return await provider.lookupAddress(address);
  } catch (e) {
    return null;
  }
}

export async function getAttestation(uid: string): Promise<Attestation | null> {
  const response = await axios.post<AttestationResult>(
    `${baseURL}/graphql`,
    {
      query:
        "query Query($where: AttestationWhereUniqueInput!) {\n  attestation(where: $where) {\n    id\n    attester\n    recipient\n    revocationTime\n    expirationTime\n    time\n    txid\n    data\n  }\n}",
      variables: {
        where: {
          id: uid,
        },
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return response.data.data.attestation;
}

export async function getENSNames(addresses: string[]) {
  const response = await axios.post<EnsNamesResult>(
    `${baseURL}/graphql`,
    {
      query:
        "query Query($where: EnsNameWhereInput) {\n  ensNames(where: $where) {\n    id\n    name\n  }\n}",
      variables: {
        where: {
          id: {
            in: addresses,
            mode: "insensitive",
          },
        },
      },
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return response.data.data.ensNames;
}

export async function submitSignedAttestation(
  pkg: AttestationShareablePackageObject
) {
  console.log("pkg", pkg);
  const data: StoreAttestationRequest = {
    filename: `eas.txt`,
    textJson: JSON.stringify(pkg),
  };

  return await axios.post<StoreIPFSActionReturn>(
    `${baseURL}/newAttestation`,
    data
  );
}

export const CHOICE_UNKNOWN = 3;

export const STATUS_DRAW = 0;
export const STATUS_PLAYER1_WIN = 1;
export const STATUS_PLAYER2_WIN = 2;

export const STATUS_UNKNOWN = 3;
export const STATUS_INVALID = 4;

export function getGameStatus(game: Game) {
  if (game.choice1 === CHOICE_UNKNOWN || game.choice2 === CHOICE_UNKNOWN) {
    return STATUS_UNKNOWN;
  }
  return (3 + game.choice1 - game.choice2) % 3;
}
