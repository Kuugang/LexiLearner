import React, { useContext, useState } from "react";
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

export default function Step3() {
  const toast = useToast();
  const { signup } = useAuthContext();

  const { registerForm } = useContext(RegisterFormContext);
  const [isInvalid, setIsInvalid] = useState(false);
  const { setIsLoading } = useGlobalContext();

  const handleStep = async () => {
    setIsInvalid(!registerForm.role.trim());

    if (!registerForm.role?.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup(registerForm);

      if (registerForm.role === "Pupil") {
        router.push("/signup4");
      } else {
        router.replace("/home");
      }
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          const errorMessage =
            error instanceof Error ? error.message : "An error occurred";

          return (
            <Toast
              nativeID={toastId}
              className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row bg-red-500 rounded-lg"
            >
              <ToastTitle size="sm">{errorMessage}</ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <SignUp3 isInvalid={isInvalid} handleStep={handleStep} />
    </ScrollView>
  );
}
