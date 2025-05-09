import { Classroom } from "@/models/Classroom";
import {
  createClassroom as apiCreateClassroom,
  getByTeacherId as apiGetByTeacherIdClassroom,
  editClassroom as apiEditClassroom,
} from "@/services/ClassroomService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClassroomStore {
  selectedClassroom: Classroom | null;
  setSelectedClassroom: (classroom: Classroom) => void;
  classrooms: Classroom[];
  setClassrooms: (classrooms: Classroom[]) => void;
  createClassroom: (createClassroomForm: Record<string, any>) => void;
  getByTeacherId: () => void;
  updateClassroom: (editClassroomForm: Record<string, any>) => Promise<void>;
}

export const useClassroomStore = create<ClassroomStore>()(
  persist(
    (set) => ({
      classrooms: [],
      selectedClassroom: null,
      setClassrooms: (classrooms: Classroom[]) =>
        set((state) => ({ ...state, classrooms: classrooms })),
      createClassroom: async (createClassroomForm: Record<string, any>) => {
        try {
          let response = await apiCreateClassroom(createClassroomForm);

          const { id, teacher, joinCode, name, description } = response.data;

          const classroom: Classroom = {
            id: id,
            teacher: teacher,
            joinCode: joinCode,
            name: name,
            description: description,
          };

          return response;
        } catch (err: any) {
          throw Error(
            err instanceof Error ? err.message : "Failed to create classroom."
          );
        }
      },
      getByTeacherId: async () => {
        try {
          let response = await apiGetByTeacherIdClassroom();
        } catch (err: any) {
          throw Error(
            err instanceof Error
              ? err.message
              : "Failed to retrieve teacher's classrooms."
          );
        }
      },
      setSelectedClassroom: (selectedClassroom: Classroom) =>
        set((state) => ({ selectedClassroom: selectedClassroom })),
      updateClassroom: async (editClassroomForm: Record<string, any>) => {
        // try {
        //   const response = await apiEditClassroom()
        // }
      },
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

export const createClassroom = () =>
  useClassroomStore((state) => state.createClassroom);
