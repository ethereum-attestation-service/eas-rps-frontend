import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {StateCreator} from "zustand";
import {AcceptedChallenge, Attestation, GameCommit} from "./utils/types";
import {produce} from "immer";

type InitialState = {
  appVersion: number;
  hasHydrated: boolean;
  gameCommits: GameCommit[];
  acceptedChallenges: AcceptedChallenge[];
  isConnected: boolean;
};

type StoreMethods = {
  setHasHydrated: (hydrated: boolean) => void;
  addGameCommit: (commit: GameCommit) => void;
  addAcceptedChallenge: (challenge: AcceptedChallenge) => void;
  setIsConnected: (connected: boolean) => void;
};

const initialState: InitialState = {
  appVersion: 0,
  hasHydrated: false,
  gameCommits: [],
  acceptedChallenges: [],
  isConnected: false,
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
});

export const useStore = create(
  persist<InitialState & StoreMethods>(reducer, {
    name: "eas-rps",
    onRehydrateStorage: () => (state: any) => state?.setHasHydrated(true),
  })
);
