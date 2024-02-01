export type EASChainConfig = {
  chainId: number;
  chainName: string;
  version: string;
  contractAddress: string;
  schemaRegistryAddress: string;
  etherscanURL: string;
  /** Must contain a trailing dot (unless mainnet). */
  subdomain: string;
  contractStartBlock: number;
  rpcProvider: string;
};

export interface AttestationResult {
  data: Data;
}

export interface MyAttestationResult {
  data: MyData;
}

export interface EnsNamesResult {
  data: {
    ensNames: { id: string; name: string }[];
  };
}

export interface Data {
  attestation: Attestation | null;
}

export interface MyData {
  attestations: Attestation[];
}

export type ResolvedAttestation = Attestation & {
  name: string;
  confirmation?: Attestation;
};

export type StoreAttestationRequest = { filename: string; textJson: string };

export type StoreIPFSActionReturn = {
  error: null | string;
  ipfsHash: string | null;
  offchainAttestationId: string | null;
};

export interface AvailableChallengesResult {
  data: Data;
}

export interface Data {
  attestations: Attestation[];
}

export interface Attestation {
  attester: string;
  data: string;
  decodedDataJson: string;
  expirationTime: number;
  id: string;
  ipfsHash: string;
  isOffchain: boolean;
  recipient: string;
  revocable: boolean;
  refUID: string;
  revocationTime: number;
  revoked: boolean;
  schemaId: string;
  time: number;
  timeCreated: number;
  txid: string;
}

export type GameCommit = {
  salt: string;
  choice: number;
  challengeUID: string;
};

export type AcceptedChallenge = {
  UID: string;
  opponentAddress: string;
  playerChoice: number;
  opponentChoice: number;
};

export type Game = {
  uid: string;
  commit1: string;
  commit2: string;
  player1: string;
  player2: string;
  choice1: number;
  choice2: number;
  salt1: number;
  salt2: number;
  stakes: string;
  eloChange1: number;
  eloChange2: number;
};

export type IncomingChallenge = {
  uid: string;
  stakes: string;
  player1Object: { address: string; elo: number };
  winstreak: number;
  gameCount: number;
};

export type GameWithPlayers = Game & {
  player1Object: { address: string; elo: number };
  player2Object: { address: string; elo: number };
};

export type MyStats = {
  games: Game[];
  elo: number;
};
