import React, { useContext } from "react";
import { useLocalSearchParams } from "expo-router";

//Components
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from "@/components/ui/radio";

import { VStack } from "@/components/ui/vstack";
import { AlertCircleIcon, CircleIcon } from "@/components/ui/icon";
import { RegisterFormContext } from "@/app/(auth)/_layout";

interface SignUp3Props {
  isInvalid: boolean;
  handleStep: () => void;
}

export default function SignUp3({ isInvalid, handleStep }: SignUp3Props) {
  const { fromProviderAuth } = useLocalSearchParams();
  const {
    registerForm,
    setRegisterForm,
    providerRegisterForm,
    setProviderRegisterForm,
  } = useContext(RegisterFormContext);
  return (
    <>
      <FormControl isInvalid={isInvalid}>
        <FormControlLabel>
          <FormControlLabelText>
            Which time slot works best for you?
          </FormControlLabelText>
        </FormControlLabel>

        <RadioGroup
          className="my-2"
          onChange={(selected) => {
            if (fromProviderAuth) {
              setProviderRegisterForm({
                ...providerRegisterForm,
                role: selected,
              });
            } else {
              setRegisterForm({ ...registerForm, role: selected });
            }
          }}
        >
          <VStack space="sm">
            <Radio size="lg" value="Teacher">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel className="text-black">Teacher</RadioLabel>
            </Radio>

            <Heading className="text-typography-black">Are you?</Heading>

            <Radio size="lg" value="Pupil">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel className="text-black">Student</RadioLabel>
            </Radio>
          </VStack>
        </RadioGroup>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>Choose a role</FormControlErrorText>
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
    </>
  );
}
