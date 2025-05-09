import React, { useContext, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import { router } from "expo-router";
import { RegisterFormContext } from "./_layout";

import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useGlobalStore } from "@/stores/globalStore";

import SignUp3 from "@/components/Auth/SignUp3";

export default function Step3() {
  const updateProfile = useUserStore((state) => state.updateProfile);

  const { fromProviderAuth } = useLocalSearchParams();

  const signup = useAuthStore((state) => state.signup);

  const { registerForm, providerRegisterForm } =
    useContext(RegisterFormContext)!;
  const [isInvalid, setIsInvalid] = useState(false);
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  const handleStep = async () => {
    const form = fromProviderAuth ? providerRegisterForm : registerForm;
    const isEmpty = !form.role?.trim();

    setIsInvalid(isEmpty);
    if (isEmpty) return;

    setIsLoading(true);

    try {
      if (fromProviderAuth) {
        await updateProfile(form);
      } else {
        await signup(form);
      }
      if (form.role === "Pupil") {
        router.push("/signup4");
      } else {
        Toast.show({
          type: "success",
          text1: "Registration Success",
        });
        router.push("/home");
      }
    } catch (error: any) {
      console.log("Form data being submitted:", form);
      Toast.show({
        type: "error",
        text1: "Registration Failed bbb",
        text2: error.message || "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <SignUp3 isInvalid={isInvalid} handleStep={handleStep} />;
}
