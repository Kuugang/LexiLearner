import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReadingContentType } from "@/models/ReadingContent";

interface ReadingContentStore {
  contents: ReadingContentType[];
  selectedContent: ReadingContentType | null;

  setContents: (contents: ReadingContentType[]) => void;
  setSelectedContent: (content: ReadingContentType) => void;
}

export const useReadingContentStore = create<ReadingContentStore>()(
  persist(
    (set) => ({
      contents: [],
      selectedContent: null,
      setContents: (contents: ReadingContentType[]) =>
        set({ contents: contents }),
      setSelectedContent: (content: ReadingContentType) =>
        set({ selectedContent: content }),
    }),
    {
      name: "reading-content-store",
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
