import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {StateCreator} from "zustand";
import {AcceptedChallenge, GameCommit} from "./utils/types";

export type KeyStorage = {
  key: string;
  wallet: string;
}

type InitialState = {
  appVersion: number;
  hasHydrated: boolean;
  gameCommits: GameCommit[];
  acceptedChallenges: AcceptedChallenge[];
  isConnected: boolean;
  keyObj: KeyStorage;
  sigRequested: boolean;
  cachedAddress: string | undefined;
  loggingIn: boolean;
};

type StoreMethods = {
  setHasHydrated: (hydrated: boolean) => void;
  addGameCommit: (commit: GameCommit) => void;
  setKeyObj: (ks: KeyStorage) => void;
  setSigRequested: (sigRequested: boolean) => void;
  setCachedAddress: (address: string | undefined) => void;
  setLoggingIn: (isLoggingIn: boolean) => void;
};

const initialState: InitialState = {
  appVersion: 0,
  hasHydrated: false,
  gameCommits: [],
  acceptedChallenges: [],
  isConnected: false,
  keyObj: {key: "", wallet: ""},
  sigRequested: false,
  cachedAddress: undefined,
  loggingIn: false,
};

const reducer: StateCreator<InitialState & StoreMethods> = (set, get) => ({
  ...initialState,
  setHasHydrated: (hydrated: boolean) => set({hasHydrated: hydrated}),
  addGameCommit: (commit: GameCommit) =>
    set((state) => ({
      gameCommits: !state.gameCommits.find(c => c.challengeUID === commit.challengeUID) ?
        [...state.gameCommits, commit] : [...state.gameCommits],
    })),
  setKeyObj: (ks: KeyStorage) => set({keyObj: ks}),
  setSigRequested: (sr: boolean) => set({sigRequested: sr}),
  setCachedAddress: (address: string | undefined) => set({cachedAddress: address}),
  setLoggingIn: (isLoggingIn: boolean) => set({loggingIn: isLoggingIn}),
});

export const useStore = create(
  persist<InitialState & StoreMethods>(reducer, {
    name: "eas-rps",
    onRehydrateStorage: () => (state: any) => state?.setHasHydrated(true),
  })
);
