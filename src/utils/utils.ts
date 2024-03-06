import invariant from "tiny-invariant";
import type {
  EASChainConfig,
  Game,
} from "./types";
import {StoreAttestationRequest, StoreIPFSActionReturn} from "./types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import {ethers} from "ethers";
import {AttestationShareablePackageObject} from "@ethereum-attestation-service/eas-sdk";
import axios from "axios";
import {KeyStorage} from "../useStore";
import aesjs from "aes-js";

const easLogo = "/images/rps/easlogo.png";
const coinbaseLogo = "/images/rps/coinbaseLogo.png";

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;

export const CUSTOM_SCHEMAS = {
  COMMIT_HASH:
    "0x3ee426c18d2dce68267f5fd2050b82687b51608819d7c2503f6f0ff0ac5ca1c8",
  CREATE_GAME_CHALLENGE:
    "0x8f60d8dbd47e0a6953b0b1fd640359d249ba8f14c15c02bc5c6b642b0b888f37",
  DECLINE_GAME_CHALLENGE:
    "0x27e160d185f1d97202897bd3ed697906398b70a8d08b0d22bc2cfffdf561e3e9",
  FINALIZE_GAME:
    "0x74421276d2c56437784aec6f2ede7d837c2196897b16c0c73fa84865ce9ee565",
};

export const RPS_GAME_UID =
  "0x9a3b8beb51629e4624923863231c3931f466e79dac4d7c7f2d0e346240e66a72";

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

export const baseURL = process.env.NODE_ENV === "development" ?
  `http://localhost:8080/api` :
  `https://rps.sh/api`;

// export const clientURL = `http://localhost:3000`;
export const clientURL = `https://rps.sh`;

invariant(activeChainConfig, "No chain config found for chain ID");
export const EASContractAddress = activeChainConfig.contractAddress;

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


export async function submitSignedAttestation(
  pkg: AttestationShareablePackageObject
) {
  const data: StoreAttestationRequest = {
    filename: `eas.txt`,
    textJson: JSON.stringify(pkg),
  };

  return await axios.post<StoreIPFSActionReturn>(
    `${baseURL}/newAttestation`,
    data
  );
}

export const CHOICE_ROCK = 0;
export const CHOICE_PAPER = 1;
export const CHOICE_SCISSORS = 2;

export const CHOICE_UNKNOWN = 3;

export const STATUS_DRAW = 0;
export const STATUS_PLAYER1_WIN = 1;
export const STATUS_PLAYER2_WIN = 2;

export const STATUS_UNKNOWN = 3;
export const STATUS_INVALID = 4;

export function getGameStatus(game: Game) {
  if (game.invalidated) {
    return STATUS_INVALID;
  }

  if (game.choice1 === CHOICE_UNKNOWN || game.choice2 === CHOICE_UNKNOWN) {
    return STATUS_UNKNOWN;
  }

  return (3 + game.choice1 - game.choice2) % 3;
}

export function choiceToText(choice: number) {
  switch (choice) {
    case CHOICE_ROCK:
      return "🪨";
    case CHOICE_PAPER:
      return "📄";
    case CHOICE_SCISSORS:
      return "✂️";
    default:
      return " ";
  }
}

export const addPlusIfPositive = (num: number) => {
  return num > 0 ? `+${num}` : num;
};

export const playLinks = [
  {name: "New", url: "/"},
  {name: "Incoming", url: "/challenges"},
  {name: "Active", url: "/ongoing"},
];

export const profileLinks = [
  {name: "QR Code", url: "/qr"},
  {name: "History", url: "/games"},
  {name: "Graph", url: "/graph"},
];

export const leaderboardLinks = [
  {name: "Global", url: "/leaderboard/global"},
  {name: "Local", url: "/leaderboard/local"},
];

export function formatAttestationLongValueV2(address: string) {
  return address.substring(0, 8) + "•••" + address.slice(-8);
}

export function badgeNameToLogo(badgeName: string) {
  switch (badgeName) {
    case "MetIRL":
      return easLogo;
    case "Coinbase":
      return coinbaseLogo;
  }
}

const LOCAL_KEY_SEED = 'Signing this message makes your rps.sh account accessible to you on any device.\n\n' +
  'DO NOT SHARE YOUR SIGNATURE WITH ANYONE. DO NOT SIGN THIS EXACT MESSAGE FOR ANY APP EXCEPT rps.sh. ';


async function generateAndStoreLocalKey(signer: ethers.Signer,
                                        setKeyStorage: (ks: KeyStorage) => void,
                                        setSigRequested: (b: boolean) => void){
  const key = await signer.signMessage(LOCAL_KEY_SEED).catch((e) => {
    setSigRequested(false);
    return '';
  });
  setKeyStorage({key, wallet: await signer.getAddress()});
  return key;
}

export async function getLocalKey(signer: ethers.Signer, keyStorage: KeyStorage,
                                  setKeyStorage: (ks: KeyStorage) => void,
                                  setSigRequested: (b: boolean) => void){
  if (keyStorage.key.length > 0 && keyStorage.wallet === await signer.getAddress()) {
    return keyStorage.key;
  } else {
    return await generateAndStoreLocalKey(signer, setKeyStorage,setSigRequested);
  }
}

function hexStrToLastNBytesBuffer(hexStr: string, n: number) {
  return Buffer.from(hexStr.slice(-2*n), 'hex');
}

function padWithZerosUntilMultipleOf16Bytes(hexStr: string) {
  const length = hexStr.length;
  const padding = (32 - (length % 32)) % 32;
  return hexStr + '0'.repeat(padding);
}

export async function encryptWithLocalKey(signer: ethers.Signer,
                                          choice: number,
                                          saltHex: string,
                                          gameUID: string,
                                          keyStorage: KeyStorage,
                                          setKeyStorage: (ks: KeyStorage) => void,
                                          setSigRequested: (b: boolean) => void){
  const keyHexStr = await getLocalKey(signer, keyStorage, setKeyStorage,setSigRequested);
  const keyBuffer32Bytes = hexStrToLastNBytesBuffer(keyHexStr, 32);
  const initVector = hexStrToLastNBytesBuffer(gameUID, 16);
  const aesCbc = new aesjs.ModeOfOperation.cbc(keyBuffer32Bytes, initVector);
  const paddedHexData = padWithZerosUntilMultipleOf16Bytes(`0${choice}${saltHex.slice(2)}`);
  const dataBuffer = Buffer.from(paddedHexData, 'hex');
  const result =  Buffer.from(aesCbc.encrypt(dataBuffer)).toString('hex');
  return `0x${result}`;
}

export async function decryptWithLocalKey(signer: ethers.Signer,
                                          encryptedHex: string,
                                          gameUID: string,
                                          keyStorage: KeyStorage,
                                          setKeyStorage: (ks: KeyStorage) => void) {
  try {
    const keyHexStr = keyStorage.key;
    if (!keyHexStr || keyHexStr.length === 0) {
      return {choice: CHOICE_UNKNOWN, salt: '0x'};
    }
    const keyBuffer32Bytes = hexStrToLastNBytesBuffer(keyHexStr, 32);
    const initVector = hexStrToLastNBytesBuffer(gameUID, 16);
    const encrypted = Buffer.from(encryptedHex.slice(2), 'hex');
    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBuffer32Bytes, initVector);
    const decrypted = aesCbc.decrypt(encrypted);
    const result = Buffer.from(decrypted).toString('hex');
    return {choice: parseInt(result[1]), salt: `0x${result.slice(2,66)}`};
  } catch (e) {
    return {choice: CHOICE_UNKNOWN, salt: '0x'};
  }
}
