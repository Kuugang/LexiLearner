import { create } from "zustand";
import { persist } from "zustand/middleware";
import { updateProfile as apiUpdateProfile } from "@/services/UserService";
import { User } from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  updateProfile: (form: Record<string, any>) => Promise<void>;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: UserStore["user"]) => set({ user }),
      updateProfile: async (form: Record<string, any>) => {
        try {
          const response = await apiUpdateProfile(form);
          const data = response.data;

          const updatedUser: User = {
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
            twoFactorEnabled: data.twoFactorEnabled,
            phoneNumber: data.phoneNumber,
            role: data.role,
            age: data.age,
            level: data.level ?? 0,
          };

          set({ user: updatedUser });
        } catch (error: any) {
          throw new Error(
            error instanceof Error ? error.message : "Unknown error occurred",
          );
        }
      },
    }),
    {
      name: "user-store",
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
