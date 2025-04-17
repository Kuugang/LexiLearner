import { create } from "zustand";
import { persist } from "zustand/middleware";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ScreenState {
  currentScreen: string;
  setScreen: (route: string) => void;
}

export const useScreenStore = create<ScreenState>()(
  persist(
    (set) => ({
      currentScreen: "home",

      setScreen: (route: any) => {
        set({ currentScreen: route });
        router.push(route);
      },
    }),
    {
      name: "screen-store",
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
