import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface dictionaryStore {
  word: string | null;
  setWord: (word: string) => void;
}

export const useDictionaryStore = create<dictionaryStore>()(
  persist(
    (set) => ({
      word: null,
      setWord: (word: string) => set((state) => ({ word })),
    }),
    {
      name: "dictionary-store",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
