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

  const updateProfile = async (
    form: Record<string, any>,
    update: boolean = true,
  ) => {
    try {
      let response = await apiUpdateProfile(form);
      const data = response.data;

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
      } = data;

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

      if (!update) return;
      setUser(user);
      AsyncStorage.setItem("user", JSON.stringify(user));
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
