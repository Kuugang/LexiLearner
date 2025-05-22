import { router } from "expo-router";
import { create } from "zustand";
import { useUserStore } from "./userStore";
import { useGlobalStore } from "./globalStore";
import { persist } from "zustand/middleware";
import { extractUser, Pupil, User } from "../models/User";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  login as apiLogin,
  signUp as apiSignUp,
  signInWithGoogle,
  signInWithFacebook,
  tokenAuth,
  refreshAccessToken,
} from "../services/AuthService";
import { getProfile } from "@/services/UserService";

type AuthStore = {
  signup: (registerForm: Record<string, any>) => void;
  logout: () => void;
  providerAuth: (provider: number) => void;
};

const setUser = useUserStore.getState().setUser;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      signup: async (registerForm: Record<string, any>) => {
        try {
          let response = await apiSignUp(registerForm);

          await AsyncStorage.setItem("accessToken", response.data.accessToken);
          await AsyncStorage.setItem(
            "refreshToken",
            response.data.refreshToken,
          );

          response = await getProfile();
          const user = extractUser(response.data);
          setUser(user);
        } catch (error: any) {
          throw Error(
            error instanceof Error ? error.message : "Unknown error occurred",
          );
        }
      },
      logout: async () => {
        setUser(null);
        await AsyncStorage.removeItem("accessToken");
      },

      providerAuth: async (provider: number) => {
        try {
          let token: string | null;
          let response: Record<string, any>;
          let signIn: any;

          switch (provider) {
            case 0:
              signIn = await signInWithGoogle();
              if (!signIn.data) {
                throw Error("Signin Failed");
              }
              token = signIn.data?.idToken;
              response = await tokenAuth(0, token as string);
              break;
            case 1:
              signIn = await signInWithFacebook();
              if (!signIn) {
                throw Error("Signin Failed");
              }
              response = await tokenAuth(1, signIn as string);
              break;
            default:
              console.warn("Invalid provider selected");
              return;
          }

          await AsyncStorage.setItem("accessToken", response.data.accessToken);
          await AsyncStorage.setItem(
            "refreshToken",
            response.data.refreshToken.token,
          );

          let userProfileResponse = await getProfile();

          const userData = userProfileResponse.data;

          if (userData) {
            const user = extractUser(userData);
            setUser(user);
            refreshAccessToken();
            Toast.show({
              type: "success",
              text1: "Authentication Success",
            });
            router.replace("/home");
          } else {
            // Redirect user to profile setup screen
            router.push({
              pathname: "/signup3",
              params: { fromProviderAuth: "true" },
            });
          }
        } catch (error) {
          console.error("Authentication failed:", error);
        }
      },
    }),
    {
      name: "auth-store",
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
