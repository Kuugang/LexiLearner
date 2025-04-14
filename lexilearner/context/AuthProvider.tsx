import { createContext, useEffect, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  login as apiLogin,
  signUp as apiSignUp,
  signInWithGoogle,
  signInWithFacebook,
  tokenAuth,
} from "../services/AuthService";
import { User } from "../models/User";
import { getProfile } from "@/services/UserService";
import { router, SplashScreen, useSegments } from "expo-router";
import { useUserContext } from "./UserProvider";

interface AuthContextType {
  login: (email: string, password: string) => void;
  signup: (registerForm: Record<string, any>) => void;
  logout: () => void;
  providerAuth: (provider: number) => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setUser } = useUserContext();

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn("Auth preprocessing failed", e);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      let response = await apiLogin(email, password);
      await AsyncStorage.setItem("token", response.data.token);
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
        await AsyncStorage.setItem("user", JSON.stringify(user));
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
  };

  const signup = async (registerForm: Record<string, any>) => {
    try {
      const response = await apiSignUp(registerForm);
      await AsyncStorage.setItem("token", response.data.token);
    } catch (error: any) {
      throw Error(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    }
  };

  //0 -> Google, 1 -> Facebook
  const providerAuth = async (provider: number) => {
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

      await AsyncStorage.setItem("token", response.data.token);
      let userProfileResponse = await getProfile();

      const userData = userProfileResponse.data;

      if (userData) {
        const user: User = {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        };
        setUser(user);
      } else {
        // Redirect user to profile setup screen
        router.push({
          pathname: "/signup2",
          params: { fromProviderAuth: "true" },
        });
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ login, signup, logout, providerAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
