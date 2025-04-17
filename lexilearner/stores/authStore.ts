import { router } from "expo-router";
import { create } from "zustand";
import { useUserStore } from "./userStore";
import { useGlobalStore } from "./globalStore";
import { persist } from "zustand/middleware";
import { User } from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "@/utils/axiosInstance";

import {
  login as apiLogin,
  signUp as apiSignUp,
  signInWithGoogle,
  signInWithFacebook,
  tokenAuth,
} from "../services/AuthService";
import { getProfile } from "@/services/UserService";

type AuthStore = {
  login: (email: string, password: string) => void;
  signup: (registerForm: Record<string, any>) => void;
  logout: () => void;
  providerAuth: (provider: number) => void;
};

const setUser = useUserStore.getState().setUser;
const setIsLoading = useGlobalStore.getState().setIsLoading;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      login: async (email: string, password: string) => {
        try {
          let response = await apiLogin(email, password);

          setAuthToken(response.data.token);

          response = await getProfile();

          const userData = response.data;

          if (userData) {
            const {
              id,
              email,
              firstName,
              lastName,
              userName,
              twoFactorEnabled,
              phoneNumber,
              role,
              age,
              level,
            } = userData;

            const user: User = {
              id: id,
              email: email,
              firstName: firstName,
              lastName: lastName,
              userName: userName,
              twoFactorEnabled: twoFactorEnabled,
              phoneNumber: phoneNumber,
              role: role,
              age: age,
              level: level ?? 0,
            };

            setUser(user);
          } else {
            router.push({
              pathname: "/signup3",
              params: { fromProviderAuth: "false" },
            });
          }
        } catch (error: any) {
          throw new Error(
            error instanceof Error ? error.message : "Unknown error occurred",
          );
        }
      },

      signup: async (registerForm: Record<string, any>) => {
        try {
          let response = await apiSignUp(registerForm);
          setAuthToken(response.data.token);
          response = await getProfile();

          const {
            id,
            email,
            firstName,
            lastName,
            userName,
            twoFactorEnabled,
            phoneNumber,
            role,
            age,
            level,
          } = response.data;

          const user: User = {
            id: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            twoFactorEnabled: twoFactorEnabled,
            phoneNumber: phoneNumber,
            role: role,
            age: age,
            level: level ?? 0,
          };

          setUser(user);
        } catch (error: any) {
          throw Error(
            error instanceof Error ? error.message : "Unknown error occurred",
          );
        }
      },
      logout: () => {
        setUser(null);
        setAuthToken(null);
      },

      providerAuth: async (provider: number) => {
        try {
          let token;
          let response;
          let signIn;

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

          setIsLoading(true);
          setAuthToken(response.data.token);
          let userProfileResponse = await getProfile();

          const userData = userProfileResponse.data;

          if (userData) {
            const {
              id,
              email,
              firstName,
              lastName,
              userName,
              twoFactorEnabled,
              phoneNumber,
              role,
              age,
              level,
            } = userData;

            const user: User = {
              id: id,
              email: email,
              firstName: firstName,
              lastName: lastName,
              userName: userName,
              twoFactorEnabled: twoFactorEnabled,
              phoneNumber: phoneNumber,
              role: role,
              age: age,
              level: level ?? 0,
            };

            setUser(user);
          } else {
            // Redirect user to profile setup screen
            router.push({
              pathname: "/signup3",
              params: { fromProviderAuth: "true" },
            });
          }
        } catch (error) {
          console.error("Authentication failed:", error);
        } finally {
          setIsLoading(false);
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
