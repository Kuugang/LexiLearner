import { create } from "zustand";

interface GlobalStore {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const useGlobalStore = create<GlobalStore>()((set) => ({
  isLoading: false,
  setIsLoading: (value: boolean) => set({ isLoading: value }),
}));
