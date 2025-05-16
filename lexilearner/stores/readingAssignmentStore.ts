import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReadingAssignment } from '@/models/ReadingMaterialAssignment';

interface ReadingAssignmentStore {
  readingAssignments: ReadingAssignment[];
  selectedReadingAssignment: ReadingAssignment | null;

  setSelectedReadingAssignment: (
    readingAssignment: ReadingAssignment | null
  ) => void;
  setReadingAssignments: (readingAssignments: ReadingAssignment[]) => void;
}

export const useReadingAssignmentStore = create<ReadingAssignmentStore>()(
  persist(
    (set) => ({
      readingAssignments: [],
      selectedReadingAssignment: null,
      setReadingAssignments: (readingAssignments: ReadingAssignment[]) =>
        set((state) => ({ ...state, readingAssignments: readingAssignments })),
      setSelectedReadingAssignment: (
        selectedReadingAssignment: ReadingAssignment | null
      ) =>
        set((state) => ({
          selectedReadingAssignment: selectedReadingAssignment,
        })),
    }),
    {
      name: 'reading-assignment-store',
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