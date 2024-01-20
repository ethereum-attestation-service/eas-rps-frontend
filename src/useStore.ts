import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StateCreator } from "zustand";
import { AcceptedChallenge, Attestation, GameCommit } from "./utils/types";
import { produce } from "immer";

type InitialState = {
  appVersion: number;
  hasHydrated: boolean;
  gameCommits: GameCommit[];
  acceptedChallenges: AcceptedChallenge[];
};

type StoreMethods = {
  setHasHydrated: (hydrated: boolean) => void;
  addGameCommit: (commit: GameCommit) => void;
  addAcceptedChallenge: (challenge: AcceptedChallenge) => void;
};

const initialState: InitialState = {
  appVersion: 0,
  hasHydrated: false,
  gameCommits: [],
  acceptedChallenges: [],
};

const reducer: StateCreator<InitialState & StoreMethods> = (set, get) => ({
  ...initialState,
  setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),
  addGameCommit: (commit: GameCommit) =>
    set((state) => ({
      gameCommits: [...state.gameCommits, commit],
    })),
  addAcceptedChallenge: (challenge: AcceptedChallenge) =>
    set((state) => ({
      acceptedChallenges: [...state.acceptedChallenges, challenge],
    })),
  setMyChoice: (uid: string, choice: number) =>
    set((state) =>
      produce(state, (draft) => {
        const idx = state.acceptedChallenges.findIndex(
          (ac: AcceptedChallenge) => ac.UID === uid
        );
        if (idx < 0) {
          console.log("Challenge UID not found");
        } else {
          draft.acceptedChallenges[idx].playerChoice = choice;
        }
      })
    ),
  setOpponentChoice: (uid: string, choice: number) =>
    set((state) =>
      produce(state, (draft) => {
        const idx = state.acceptedChallenges.findIndex(
          (ac: AcceptedChallenge) => ac.UID === uid
        );
        if (idx < 0) {
          console.log("Challenge UID not found");
        } else {
          draft.acceptedChallenges[idx].opponentChoice = choice;
        }
      })
    ),
});

export const useStore = create(
  persist(reducer, {
    name: "eas-rps",
    onRehydrateStorage: () => (state: any) => state?.setHasHydrated(true),
  })
);
