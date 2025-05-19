import { Classroom } from "@/models/Classroom";
import { ReadingAssignment } from "@/models/ReadingMaterialAssignment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClassroomStore {
  selectedClassroom: Classroom | null;
  setSelectedClassroom: (classroom: Classroom | null) => void;
  classrooms: Classroom[];
  setClassrooms: (classrooms: Classroom[]) => void;
}

export const useClassroomStore = create<ClassroomStore>()(
  persist(
    (set) => ({
      classrooms: [],
      selectedClassroom: null,
      setClassrooms: (classrooms: Classroom[]) =>
        set((state) => ({ ...state, classrooms: classrooms })),
      setSelectedClassroom: (selectedClassroom: Classroom | null) =>
        set((state) => ({ selectedClassroom: selectedClassroom })),
    }),
    {
      name: "classroom-store",
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
