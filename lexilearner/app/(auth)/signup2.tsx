import React, { useContext, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { RegisterFormContext } from "./_layout";

import { ScrollView } from "react-native";
import { checkUserExist } from "@/services/UserService";
import { validateField } from "@/utils/utils";
import SignUp2 from "@/components/Auth/SignUp2";

export default function Step2() {
  const { registerForm, providerRegisterForm } =
    useContext(RegisterFormContext);
  const { fromProviderAuth } = useLocalSearchParams();

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleStep = async () => {
    let form = fromProviderAuth ? providerRegisterForm : registerForm;

    const newErrors: any = {};
    Object.keys(form).forEach((field) => {
      const error = validateField(
        field,
        form[field as keyof typeof form],
        form,
      );
      if (error == "") return;
      newErrors[field] = error;
    });

    if (Object.keys(newErrors).length === 0 && fromProviderAuth) {
      if (
        (await checkUserExist("username", providerRegisterForm.username))
          .statusCode === 200
      ) {
        newErrors["username"] = "Username is already taken.";
      }
    }
    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (fromProviderAuth) {
        router.push({
          pathname: "/signup3",
          params: { fromProviderAuth: "true" },
        });
      } else {
        router.push("/signup3");
      }
    }
  };

  return (
    <ScrollView className="bg-background-yellowOrange">
      <SignUp2 formErrors={formErrors} handleStep={handleStep} />
    </ScrollView>
  );
}
