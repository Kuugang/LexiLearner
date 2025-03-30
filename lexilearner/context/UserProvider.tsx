import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { updateProfile as apiUpdateProfile } from "@/services/UserService";

import { User } from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  updateProfile: (form: Record<string, any>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
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

  const updateProfile = async (
    form: Record<string, any>,
    update: boolean = true,
  ) => {
    try {
      let data = await apiUpdateProfile(form);

      const user: User = {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      if (!update) return;
      setUser(user);
    } catch (error: any) {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
