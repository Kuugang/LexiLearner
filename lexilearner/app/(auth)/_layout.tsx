import React, { createContext, useState, useContext } from "react";
import { Stack } from "expo-router";

// Define the type for the context state
interface RegisterFormContextType {
  registerForm: Record<string, any>;
  setRegisterForm: React.Dispatch<React.SetStateAction<Record<string, any>>>;

  providerRegisterForm: Record<string, any>;
  setProviderRegisterForm: React.Dispatch<
    React.SetStateAction<Record<string, any>>
  >;
}

// Provide a default value to prevent 'null' errors
const RegisterFormContext = createContext<RegisterFormContextType | null>(null);

export function useRegisterFormContext() {
  const context = useContext(RegisterFormContext);
  if (!context) {
    throw new Error(
      "useRegisterFormContext must be used within a RegisterFormProvider"
    );
  }
  return context;
}

export default function AuthLayout() {
  const [registerForm, setRegisterForm] = useState<Record<string, any>>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "",
  });

  const [providerRegisterForm, setProviderRegisterForm] = useState<
    Record<string, any>
  >({
    role: "",
    age: "",
    gradeLevel: "",
  });

  return (
    <RegisterFormContext.Provider
      value={{
        registerForm,
        setRegisterForm,

        providerRegisterForm,
        setProviderRegisterForm,
      }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="signup2" />
        <Stack.Screen name="signup3" />
        <Stack.Screen name="signup4" />
      </Stack>
    </RegisterFormContext.Provider>
  );
}
