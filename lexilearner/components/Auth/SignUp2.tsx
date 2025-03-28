import React, { useContext, useState } from "react";

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
  handleStep: () => void;
}

export default function SignUp2({
  firstNameInvalid,
  lastNameInvalid,
  handleStep,
}: SignUp2Props) {
  const { registerForm, setRegisterForm } = useContext(RegisterFormContext);

  return (
    <VStack space="xl" className="text-typography-black">
      <Heading className="text-typography-black">What do we call you?</Heading>

      {/* FirstName Field */}
      <FormControl isInvalid={firstNameInvalid}>
        <FormControlLabel>
          <FormControlLabelText>First Name</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            placeholder="Enter First Name"
            value={registerForm.firstName}
            onChangeText={(text: string) =>
              setRegisterForm({ ...registerForm, firstName: text })
            }
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
          <FormControlLabelText>Last Name</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            placeholder="Enter Last Name"
            value={registerForm.lastName}
            onChangeText={(text: string) =>
              setRegisterForm({ ...registerForm, lastName: text })
            }
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
