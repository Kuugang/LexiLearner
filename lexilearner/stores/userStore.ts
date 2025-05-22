import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, extractUser } from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  updateProfile as apiUpdateProfile,
  deleteAccount as apiDeleteAccount,
} from "~/services/UserService";
import { Session } from "@/models/Session";

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  updateProfile: (form: Record<string, any>) => Promise<void>;
  deleteAccount: () => Promise<void>;

  streak: number;
  setStreak: (streak: number) => void;

  lastLoginStreak: string | null;
  setLastLoginStreak: (date: string) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      lastLoginStreak: null,
      setUser: (user: UserStore["user"]) => set({ user }),
      updateProfile: async (form: Record<string, any>) => {
        try {
          const response = await apiUpdateProfile(form);
          const data = response.data;

          set((state) => {
            if (!state.user) {
              const user = extractUser(response.data);

              return {
                user: {
                  ...user,
                },
              };
            }
            return {
              user: {
                ...state.user,
                pupil: {
                  ...state.user.pupil,
                  ...(data.age !== undefined && { age: data.age }),
                },
                id: state.user.id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                userName: data.userName,
                twoFactorEnabled: data.twoFactorEnabled,
                phoneNumber: data.phoneNumber,
                role: data.role,
              },
            };
          });
        } catch (error: any) {
          throw new Error(
            error instanceof Error ? error.message : "Unknown error occurred",
          );
        }
      },
      deleteAccount: async () => {
        await apiDeleteAccount();
        set({ user: null });
      },
      streak: 1,
      setStreak: (streak: number) => set((state) => ({ streak: streak })),
      setLastLoginStreak: (date: string) =>
        set((state) => ({ lastLoginStreak: date })),
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
