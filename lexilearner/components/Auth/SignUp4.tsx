import React from "react";

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

interface SignUp4Props {
  ageInvalid: boolean;
  gradeLevelInvalid: boolean;

  form: { age: string; gradeLevel: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ age: string; gradeLevel: string }>
  >;

  handleStep: () => void;
}

export default function SignUp4({
  ageInvalid,
  gradeLevelInvalid,
  form,
  setForm,
  handleStep,
}: SignUp4Props) {
  return (
    <VStack space="xl" className="text-typography-black">
      <Heading className="text-typography-black">Final Step!</Heading>

      {/* Age Field */}
      <FormControl isInvalid={ageInvalid}>
        <FormControlLabel>
          <FormControlLabelText>First Name</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            placeholder="Enter Age"
            value={form.age}
            keyboardType="numeric"
            onChangeText={(text: string) => setForm({ ...form, age: text })}
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>Age is required.</FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* Grade Level Field */}
      <FormControl isInvalid={gradeLevelInvalid}>
        <FormControlLabel>
          <FormControlLabelText>Grade Level</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            placeholder="Enter Grade Level"
            value={form.gradeLevel}
            onChangeText={(text: string) =>
              setForm({ ...form, gradeLevel: text })
            }
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>Grade Level is required.</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <Button
        className="ml-auto"
        onPress={() => {
          handleStep();
        }}
      >
        <ButtonText className="text-typography-0">Finish</ButtonText>
      </Button>
    </VStack>
  );
}
