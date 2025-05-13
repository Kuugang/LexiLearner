import React, { useContext, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { RegisterFormContext } from "./_layout";
import { View, Text } from "react-native";
import { checkUserExist } from "@/services/UserService";
import { validateField } from "@/utils/utils";
import SignUp2 from "@/components/Auth/SignUp2";

export default function Step2() {
  // Get the context without destructuring
  const context = useContext(RegisterFormContext);
  const { fromProviderAuth } = useLocalSearchParams();

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // If context is null, show a loading state
  if (!context) {
    return (
      <View>
        <Text>Loading registration form...</Text>
      </View>
    );
  }

  // After checking, it's safe to destructure
  const { registerForm, providerRegisterForm } = context;

  const handleStep = async () => {
    let form = fromProviderAuth ? providerRegisterForm : registerForm;

    const newErrors: any = {};
    Object.keys(form).forEach((field) => {
      const error = validateField(
        field,
        form[field as keyof typeof form],
        form
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

  return <SignUp2 formErrors={formErrors} handleStep={handleStep} />;
}
