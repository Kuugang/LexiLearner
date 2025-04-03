import React, { useContext, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

import { router } from "expo-router";
import { RegisterFormContext } from "./_layout";

import { useGlobalContext } from "@/context/GlobalProvider";
import { useAuthContext } from "@/context/AuthProvider";

import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

import SignUp3 from "@/components/Auth/SignUp3";
import { Text } from "@/components/ui/text";
import { useUserContext } from "@/context/UserProvider";

export default function Step3() {
  const { updateProfile } = useUserContext();

  const { fromProviderAuth } = useLocalSearchParams();

  const toast = useToast();
  const { signup } = useAuthContext();

  const { registerForm, providerRegisterForm } =
    useContext(RegisterFormContext);
  const [isInvalid, setIsInvalid] = useState(false);
  const { setIsLoading } = useGlobalContext();

  const handleStep = async () => {
    const form = fromProviderAuth ? providerRegisterForm : registerForm;
    const isEmpty = !form.role?.trim();

    setIsInvalid(isEmpty);
    if (isEmpty) return;

    setIsLoading(true);

    try {
      if (fromProviderAuth) {
        await updateProfile(form, form.role === "Teacher" ? true : false);
      } else {
        await signup(form);
      }

      router.push(form.role === "Pupil" ? "/signup4" : "/home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast
            nativeID={`toast-${id}`}
            className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row bg-red-500 rounded-lg"
          >
            <ToastTitle size="sm">{errorMessage}</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="bg-background-yellowOrange">
      <SignUp3 isInvalid={isInvalid} handleStep={handleStep} />
    </ScrollView>
  );
}
