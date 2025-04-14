import React, { createContext, useState, ReactNode, useContext } from "react";
import { ActivityIndicator, View } from "react-native";

interface GlobalContextType {
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

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
