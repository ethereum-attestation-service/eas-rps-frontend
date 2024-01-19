import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StateCreator } from "zustand";
import { Attestation, GameCommit } from "./utils/types";

type InitialState = {
  appVersion: number;
  hasHydrated: boolean;
  gameCommits: GameCommit[];
};

type StoreMethods = {
  setHasHydrated: (hydrated: boolean) => void;
  addGameCommit: (commit: GameCommit) => void;
};

const initialState: InitialState = {
  appVersion: 0,
  hasHydrated: false,
  gameCommits: [],
};

const reducer: StateCreator<InitialState & StoreMethods> = (set, get) => ({
  ...initialState,
  setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),
  addGameCommit: (commit: GameCommit) =>
    set((state) => ({
      gameCommits: [...state.gameCommits, commit],
    })),
});

export const useStore = create(
  persist(reducer, {
    name: "eas-rps",
    onRehydrateStorage: () => (state: any) => state?.setHasHydrated(true),
  })
);
