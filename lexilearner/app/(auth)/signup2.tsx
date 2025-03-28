import React, { useContext, useState } from "react";
import { router } from "expo-router";
import { RegisterFormContext } from "./_layout";

import SignUp2 from "@/components/Auth/SignUp2";
import { ScrollView } from "react-native";

export default function Step2() {
  const { registerForm } = useContext(RegisterFormContext);

  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [lastNameInvalid, setLastNameInvalid] = useState(false);

  const handleStep = () => {
    setFirstNameInvalid(!registerForm.firstName.trim());
    setLastNameInvalid(!registerForm.lastName.trim());

    if (registerForm.firstName?.trim() && registerForm.lastName?.trim()) {
      router.push("/signup3");
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
      <SignUp2
        firstNameInvalid={firstNameInvalid}
        lastNameInvalid={lastNameInvalid}
        handleStep={handleStep}
      />
    </ScrollView>
  );
}
