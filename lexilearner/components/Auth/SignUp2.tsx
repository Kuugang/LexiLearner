import React, { useContext, useState } from "react";
import { router } from "expo-router";
import { RegisterFormContext } from "@/app/(auth)/_layout";
import { useLocalSearchParams } from "expo-router";

//Components
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function SignUp2({
  formErrors,
  handleStep,
}: {
  formErrors: Record<string, any>;
  handleStep: () => void;
}) {
  const { fromProviderAuth } = useLocalSearchParams();

  const {
    registerForm,
    setRegisterForm,
    providerRegisterForm,
    setProviderRegisterForm,
  } = useContext(RegisterFormContext);

  return (
    <View className="flex-1 gap-36 p-8 h-full justify-around">
      <Button
        className="bg-transparent self-start p-0"
        onPress={() => router.back()}
      >
        <FontAwesomeIcon size={30} icon={faArrowLeft} />
      </Button>

      <View className="flex gap-4 justify-around">
        <Text className="text-2xl font-bold">Tell Us About Yourself!</Text>

        {/* Username Field */}
        {fromProviderAuth && (
          <View className="flex gap-2">
            <Input
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
            <Text className="text-destructive">{formErrors.username}</Text>
          </View>
        )}

        {/* FirstName Field */}
        <View className="flex gap-2">
          <Input
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
          <Text className="text-destructive">{formErrors.firstName}</Text>
        </View>

        <View className="flex gap-2">
          <Input
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
          <Text className="text-destructive">{formErrors.lastName}</Text>
        </View>
      </View>

      <Button
        className="bg-primary rounded-lg"
        onPress={() => {
          handleStep();
        }}
      >
        <Text className="text-primary-foreground">Continue</Text>
      </Button>
    </View>
  );
}
