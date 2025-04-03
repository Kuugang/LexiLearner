import React from "react";

//Components
import { View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

import { AlertCircleIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";

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
    <View className="flex-1 gap-14 p-8 h-full justify-around items-center">
      <View className="flex-1 gap-6 p-8 h-full justify-around items-center">
        <Image
          source={require("@/assets/images/role-pupil.png")}
          className="w-32 h-32"
          resizeMode="contain"
          alt=""
        />
        <Heading className="text-typography-black font-bold text-3xl">
          Almost There!
        </Heading>
      </View>
      <Heading>USBON PANI</Heading>

      <View className="flex flex-row gap-4">
        <FormControl isInvalid={ageInvalid}>
          <Select
            onValueChange={(value: string) => setForm({ ...form, age: value })}
          >
            <SelectTrigger>
              <SelectInput placeholder="Age" />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>

                <SelectItem label="11" value="11" />
                <SelectItem label="12" value="12" />
                <SelectItem label="13" value="13" />
                <SelectItem label="14" value="14" />
                <SelectItem label="15" value="15" />
                <SelectItem label="16" value="16" />
                <SelectItem label="17" value="17" />
                <SelectItem label="18" value="19" />
              </SelectContent>
            </SelectPortal>
          </Select>

          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>
              Grade Level is required.
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl isInvalid={gradeLevelInvalid}>
          <Select
            onValueChange={(value: string) =>
              setForm({ ...form, gradeLevel: value })
            }
          >
            <SelectTrigger className="text-typography-black">
              <SelectInput placeholder="Grade Level" />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>

                <SelectItem label="5" value="5" />
                <SelectItem label="6" value="6" />
                <SelectItem label="7" value="7" />
                <SelectItem label="8" value="8" />
                <SelectItem label="9" value="9" />
                <SelectItem label="10" value="10" />
                <SelectItem label="11" value="11" />
                <SelectItem label="12" value="12" />
              </SelectContent>
            </SelectPortal>
          </Select>

          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>Age is required.</FormControlErrorText>
          </FormControlError>
        </FormControl>
      </View>

      <Button
        className="bg-background-orange rounded-lg w-full"
        onPress={() => {
          handleStep();
        }}
      >
        <ButtonText className="text-primary-appWhite">Finish</ButtonText>
      </Button>
    </View>
  );
}
