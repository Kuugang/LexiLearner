import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReadingSession } from "@/models/ReadingSession";

interface ReadingSessionStore {
  currentSession: ReadingSession | null;
  sessions: ReadingSession[] | null;
  setCurrentSession: (session: ReadingSession | null) => void;

  addSession: (session: ReadingSession) => void;
  getPastSession: (readingMaterialId: string) => ReadingSession | null;

  updateReadingSessionProgress: (
    readingSessionId: string,
    percentage: number
  ) => void;

  currentlyReading: ReadingSession[];
  setCurrentlyReading: (currentlyReading: ReadingSession[]) => void;
}

export const useReadingSessionStore = create<ReadingSessionStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],

      setCurrentSession: (session: ReadingSession | null) =>
        set({ currentSession: session }),
      addSession: (session: ReadingSession) =>
        set((state) => ({
          sessions: state.sessions ? [...state.sessions, session] : [session],
        })),

      getPastSession: (readingMaterialId: string) => {
        const sessions = get().sessions ?? [];
        return (
          sessions.find(
            (session) =>
              session.readingMaterialId === readingMaterialId &&
              session.completionPercentage < 100
          ) ?? null
        );
      },

      updateReadingSessionProgress: (
        readingSessionId: string,
        percentage: number
      ) =>
        set((state) => ({
          sessions:
            state.sessions?.map((session) =>
              session.id === readingSessionId
                ? {
                    ...session,
                    completionPercentage: percentage,
                  }
                : session
            ) ?? null,
        })),
      currentlyReading: [],
      setCurrentlyReading: (currentlyReading: ReadingSession[]) =>
        set({ currentlyReading: currentlyReading }),
    }),
    {
      name: "reading-session-store",
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
