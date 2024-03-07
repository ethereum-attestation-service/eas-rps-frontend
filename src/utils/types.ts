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

export interface Data {
  attestation: Attestation | null;
}

export type StoreAttestationRequest = { filename: string; textJson: string };

export type StoreIPFSActionReturn = {
  error: null | string;
  ipfsHash: string | null;
  offchainAttestationId: string | null;
};

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
  encryptedChoice1: string;
  encryptedChoice2: string;
  salt1: string;
  salt2: string;
  stakes: string;
  eloChange1: number;
  eloChange2: number;
  invalidated: boolean;
  updatedAt: number;
};

export type IncomingChallenge = {
  uid: string;
  stakes: string;
  player1Object: {
    address: string;
    elo: number | string;
    whiteListAttestations: { type: string }[];
    ensName?: string;
    ensAvatar?: string;
  };
  winstreak: number;
  gameCount: number;
};

export type GameWithPlayers = Game & {
  player1Object: {
    address: string;
    elo: number;
    whiteListAttestations: { type: string }[];
    ensName?: string;
    ensAvatar?: string;
  };
  player2Object: {
    address: string;
    elo: number;
    whiteListAttestations: { type: string }[];
    ensName?: string;
    ensAvatar?: string;
  };
};

export type GameWithPlayersAndAttestations = GameWithPlayers & {
  relevantAttestations: { packageObjString: string, timestamp:number }[];
};

export type Player = {
  address: string;
  elo: number;
  badges: string[];
  ensName?: string;
  ensAvatar?: string;
};

export type GameWithOnePlayer = Game & {
  player1Object: Player
}

export type MyStats = {
  games: GameWithOnePlayer[];
  elo: number;
  badges: string[];
  ensName?: string;
  ensAvatar?: string;
};

