import React, { useContext, useState } from "react";

import SignUp1 from "@/components/Auth/SignUp1";
import { ScrollView, ToastAndroid, View } from "react-native";
import { router } from "expo-router";
import { validateField } from "@/utils/utils";
import { checkUserExist } from "@/services/UserService";
import { RegisterFormContext } from "./_layout";

export default function Step1() {
  const { registerForm } = useContext(RegisterFormContext);

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleStep = async () => {
    const newErrors: any = {};
    Object.keys(registerForm).forEach((field) => {
      const error = validateField(
        field,
        registerForm[field as keyof typeof registerForm],
        registerForm,
      );
      if (error == "") return;
      newErrors[field] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      if (
        (await checkUserExist("email", registerForm.email)).statusCode === 200
      ) {
        newErrors["email"] = "Email is already in use";
      }
      if (
        (await checkUserExist("username", registerForm.username)).statusCode ===
        200
      ) {
        newErrors["username"] = "Username is already taken.";
      }
    }

    setFormErrors(newErrors);

    if (!Object.values(newErrors).some((value) => value !== "")) {
      router.push("/signup2");
    }
  };

  return (
    <ScrollView className="bg-background">
      <SignUp1 formErrors={formErrors} handleStep={handleStep} />
    </ScrollView>
  );
}
