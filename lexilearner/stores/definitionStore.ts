import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DefinitionStore {
  definitions: Record<string, string>;
  getDefinition: (word: string) => string;
  storeDefinition: (word: string, definition: string) => void;
}

export const useDefinitionStore = create<DefinitionStore>()(
  persist(
    (set, get) => ({
      definitions: {},

      getDefinition: (word: string) => {
        return get().definitions[word];
      },

      storeDefinition: (word: string, definition: string) => {
        set((state) => ({
          definitions: {
            ...state.definitions,
            [word]: definition,
          },
        }));
      },
    }),
    {
      name: "definition-store",
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
    },
  ),
);
