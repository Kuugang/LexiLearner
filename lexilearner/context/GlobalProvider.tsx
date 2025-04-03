import React, { createContext, useState, ReactNode, useContext } from "react";
import { useColorScheme } from "react-native"; // Get light/dark mode

interface GlobalContextType {
  isLogged: boolean;
  setIsLogged: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface GlobalProviderProps {
  children: ReactNode;
}

interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scheme = useColorScheme() ?? "light";

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
