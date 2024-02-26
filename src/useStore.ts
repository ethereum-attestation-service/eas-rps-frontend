import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {StateCreator} from "zustand";
import {AcceptedChallenge, Attestation, GameCommit} from "./utils/types";
import {produce} from "immer";

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
  key: KeyStorage;
};

type StoreMethods = {
  setHasHydrated: (hydrated: boolean) => void;
  addGameCommit: (commit: GameCommit) => void;
  addAcceptedChallenge: (challenge: AcceptedChallenge) => void;
  setIsConnected: (connected: boolean) => void;
  setKey: (ks: KeyStorage) => void;
};

const initialState: InitialState = {
  appVersion: 0,
  hasHydrated: false,
  gameCommits: [],
  acceptedChallenges: [],
  isConnected: false,
  key: {key: "", wallet: ""},
};

const reducer: StateCreator<InitialState & StoreMethods> = (set, get) => ({
  ...initialState,
  setHasHydrated: (hydrated: boolean) => set({hasHydrated: hydrated}),
  addGameCommit: (commit: GameCommit) =>
    set((state) => ({
      gameCommits: !state.gameCommits.find(c => c.challengeUID === commit.challengeUID) ?
        [...state.gameCommits, commit] : [...state.gameCommits],
    })),
  addAcceptedChallenge: (challenge: AcceptedChallenge) =>
    set((state) => ({
      acceptedChallenges: [...state.acceptedChallenges, challenge],
    })),
  setIsConnected: (connected: boolean) => set({isConnected: connected}),
  setKey: (ks: KeyStorage) => set({key:ks}),
});

export const useStore = create(
  persist<InitialState & StoreMethods>(reducer, {
    name: "eas-rps",
    onRehydrateStorage: () => (state: any) => state?.setHasHydrated(true),
  })
);
