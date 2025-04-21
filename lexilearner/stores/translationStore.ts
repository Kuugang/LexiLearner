import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Currently Cebuano
interface TranslationStore {
  translations: Record<string, string>;
  getTranslation: (word: string) => string;
  storeTranslation: (word: string, translation: string) => void;
}

export const useTranslationStore = create<TranslationStore>()(
  persist(
    (set, get) => ({
      translations: {},

      getTranslation: (word: string) => {
        return get().translations[word];
      },

      storeTranslation: (word: string, definition: string) => {
        set((state) => ({
          translations: {
            ...state.translations,
            [word]: definition,
          },
        }));
      },
    }),
    {
      name: "translation-store",
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
