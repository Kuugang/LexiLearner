import React, { useContext, useState } from "react";
import { useLocalSearchParams } from "expo-router";

//Components
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

import { Input, InputField } from "@/components/ui/input";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { RegisterFormContext } from "@/app/(auth)/_layout";

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
    <VStack space="xl" className="text-typography-black">
      <Heading className="text-typography-black">What do we call you?</Heading>

      {/* Username Field */}
      {fromProviderAuth && (
        <FormControl isInvalid={userNameInvalid}>
          <FormControlLabel>
            <FormControlLabelText className="text-typography-black">
              Username
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1">
            <InputField
              className="text-typography-black"
              placeholder="Enter Username"
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
        <FormControlLabel>
          <FormControlLabelText className="text-typography-black">
            First Name
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            className="text-typography-black"
            placeholder="Enter First Name"
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
        <FormControlLabel>
          <FormControlLabelText className="text-typography-black">
            Last Name
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            className="text-typography-black"
            placeholder="Enter Last Name"
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

      <Button
        className="ml-auto"
        onPress={() => {
          handleStep();
        }}
      >
        <ButtonText className="text-typography-0">Continue</ButtonText>
      </Button>
    </VStack>
  );
}
