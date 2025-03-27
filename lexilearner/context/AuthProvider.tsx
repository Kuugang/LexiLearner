import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  login as apiLogin,
  signUp as apiSignUp,
  signInWithGoogle,
  tokenAuth,
} from "../services/AuthService";
import { User } from "../models/User";
import { getProfile } from "@/services/UserService";

interface AuthContextType {
  user: User | null;
  // setUser: (user: User | null) => void;
  login: (email: string, password: string) => void;
  signup: (
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
  ) => void;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user data on app start
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      let response = await apiLogin(email, password);
      await AsyncStorage.setItem("token", response.data.token);
      response = await getProfile();

      const userData = response.data;

      const user: User = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      };

      setUser(user);
    } catch (error: any) {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    }
  };

  const signup = async (
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
  ) => {
    try {
      const response = await apiSignUp(
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      );
      await AsyncStorage.setItem("token", response.data.token);
    } catch (error: any) {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
