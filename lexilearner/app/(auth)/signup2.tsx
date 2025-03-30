import React, { useContext, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { RegisterFormContext } from "./_layout";

import SignUp2 from "@/components/Auth/SignUp2";
import { ScrollView } from "react-native";
import { checkUserExist } from "@/services/UserService";

export default function Step2() {
  const { registerForm, providerRegisterForm } =
    useContext(RegisterFormContext);
  const { fromProviderAuth } = useLocalSearchParams();

  const [userNameInvalid, setUserNameInvalid] = useState(false);
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [lastNameInvalid, setLastNameInvalid] = useState(false);

  const handleStep = async () => {
    let form = fromProviderAuth ? providerRegisterForm : registerForm;
    setFirstNameInvalid(!form.firstName.trim());
    setLastNameInvalid(!form.lastName.trim());

    if (fromProviderAuth) {
      const userExists =
        (await checkUserExist("username", providerRegisterForm.username))
          .statusCode === 200;
      if (userExists) {
        setUserNameInvalid(true);
        return;
      }
    }

    if (form.firstName?.trim() && form.lastName?.trim()) {
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
        userNameInvalid={userNameInvalid}
        handleStep={handleStep}
      />
    </ScrollView>
  );
}
