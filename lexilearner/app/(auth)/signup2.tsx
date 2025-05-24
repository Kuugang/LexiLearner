import React, { useContext, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useRegisterFormContext } from "./_layout";
import { checkUserExist } from "@/services/UserService";
import { validateField } from "@/utils/utils";

import { View, ScrollView } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import BackHeader from "@/components/BackHeader";

export default function Step2() {
  const { fromProviderAuth } = useLocalSearchParams();
  const [formErrors, setFormErrors] = useState<Record<string, any>>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    registerForm,
    setRegisterForm,
    providerRegisterForm,
    setProviderRegisterForm,
  } = useRegisterFormContext();

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
    <ScrollView className="bg-yellowOrange">
      <View className="flex-1 gap-36 p-8 h-full justify-around">
        <BackHeader />

        <View className="flex gap-4 justify-around">
          <Text className="text-2xl font-bold">Tell Us About Yourself!</Text>

          {/* Username Field */}
          {fromProviderAuth && (
            <View className="flex gap-2">
              <Input
                className="py-2 rounded-xl shadow-xl"
                placeholder="Username"
                value={providerRegisterForm.username}
                onChangeText={(text: string) =>
                  setProviderRegisterForm({
                    ...providerRegisterForm,
                    username: text,
                  })
                }
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
              />
              {formErrors.username && (
                <Text className="text-destructive">{formErrors.username}</Text>
              )}
            </View>
          )}

          {/* FirstName Field */}
          <View className="flex gap-2">
            <Input
              className="py-2 rounded-xl shadow-xl"
              placeholder="First Name"
              value={
                fromProviderAuth
                  ? providerRegisterForm.firstName
                  : registerForm.firstName
              }
              onChangeText={(text: string) => {
                if (fromProviderAuth) {
                  setProviderRegisterForm({
                    ...providerRegisterForm,
                    firstName: text,
                  });
                } else {
                  setRegisterForm({ ...registerForm, firstName: text });
                }
              }}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
            />
            {formErrors.firstName && (
              <Text className="text-destructive">{formErrors.firstName}</Text>
            )}
          </View>

          <View className="flex gap-2">
            <Input
              className="py-2 rounded-xl shadow-xl"
              placeholder="Last Name"
              value={
                fromProviderAuth
                  ? providerRegisterForm.lastName
                  : registerForm.lastName
              }
              onChangeText={(text: string) => {
                if (fromProviderAuth) {
                  setProviderRegisterForm({
                    ...providerRegisterForm,
                    lastName: text,
                  });
                } else {
                  setRegisterForm({ ...registerForm, lastName: text });
                }
              }}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
            />
            {formErrors.lastName && (
              <Text className="text-destructive">{formErrors.lastName}</Text>
            )}
          </View>
        </View>

        <Button
          className="bg-orange rounded-lg"
          onPress={() => {
            handleStep();
          }}
        >
          <Text className="text-white text-2xl font-bold">Continue</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
