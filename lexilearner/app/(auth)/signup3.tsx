import React, { useContext, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import { router } from "expo-router";
import { RegisterFormContext } from "./_layout";

import { useGlobalContext } from "@/context/GlobalProvider";
import { useAuthContext } from "@/context/AuthProvider";

import SignUp3 from "@/components/Auth/SignUp3";
import { useUserContext } from "@/context/UserProvider";

export default function Step3() {
  const { updateProfile } = useUserContext();

  const { fromProviderAuth } = useLocalSearchParams();

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
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <SignUp3 isInvalid={isInvalid} handleStep={handleStep} />;
}
