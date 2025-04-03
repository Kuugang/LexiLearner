import React, { useContext, useState } from "react";
import { router } from "expo-router";
import { RegisterFormContext } from "@/app/(auth)/_layout";
import { useLocalSearchParams } from "expo-router";

//Components
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";

import { Input, InputField } from "@/components/ui/input";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface SignUp2Props {
  firstNameInvalid: boolean;
  lastNameInvalid: boolean;
  userNameInvalid: boolean;
  handleStep: () => void;
}

export default function SignUp2({
  firstNameInvalid,
  lastNameInvalid,
  userNameInvalid,
  handleStep,
}: SignUp2Props) {
  const { fromProviderAuth } = useLocalSearchParams();
  const {
    registerForm,
    setRegisterForm,
    providerRegisterForm,
    setProviderRegisterForm,
  } = useContext(RegisterFormContext);

  return (
    <VStack space="xl" className="flex-1 gap-36 p-8 h-full justify-around">
      <Button
        className="bg-transparent self-start p-0"
        onPress={() => router.back()}
      >
        <FontAwesomeIcon size={30} icon={faArrowLeft} />
      </Button>

      <VStack space="xl" className="justify-around">
        <Heading className="text-typography-black">
          Tell Us About Yourself!
        </Heading>

        {/* Username Field */}
        {fromProviderAuth && (
          <FormControl isInvalid={userNameInvalid}>
            <Input className="rounded-lg bg-primary-appWhite">
              <InputField
                className="text-typography-black"
                placeholder="Username"
                value={providerRegisterForm.username}
                onChangeText={(text: string) =>
                  setProviderRegisterForm({
                    ...providerRegisterForm,
                    username: text,
                  })
                }
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                Username is already taken.
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}

        {/* FirstName Field */}
        <FormControl isInvalid={firstNameInvalid}>
          <Input className="rounded-lg bg-primary-appWhite">
            <InputField
              className="text-typography-black"
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
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>First Name is required.</FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* LastName Field */}
        <FormControl isInvalid={lastNameInvalid}>
          <Input className="rounded-lg bg-primary-appWhite">
            <InputField
              className="text-typography-black"
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
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>Last Name is required.</FormControlErrorText>
          </FormControlError>
        </FormControl>
      </VStack>

      <Button
        className="bg-background-orange rounded-lg"
        onPress={() => {
          handleStep();
        }}
      >
        <ButtonText className="text-primary-appWhite">Continue</ButtonText>
      </Button>
    </VStack>
  );
}
