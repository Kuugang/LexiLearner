import React, { useContext } from "react";
import { router } from "expo-router";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";

//Components
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";

import { Radio, RadioGroup } from "@/components/ui/radio";

import { VStack } from "@/components/ui/vstack";
import { AlertCircleIcon, CircleIcon } from "@/components/ui/icon";
import { RegisterFormContext } from "@/app/(auth)/_layout";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
      <VStack space="xl" className="flex-1 p-8 h-full justify-around">
        <Button
          className="bg-transparent self-start p-0"
          onPress={() => router.back()}
        >
          <FontAwesomeIcon size={30} icon={faArrowLeft} />
        </Button>

        <FormControl isInvalid={isInvalid}>
          <RadioGroup
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
            <VStack space="sm" className="flex items-center gap-8">
              <Radio size="lg" value="Teacher">
                <VStack className="flex gap-2 items-center">
                  <View
                    className={`h-60 w-60 p-2 rounded-full  ${registerForm.role == "Teacher" ? "bg-background-orange scale-105" : ""}}`}
                  >
                    <Image
                      source={require("@/assets/images/role-teacher.png")}
                      className={`w-full h-full transition-transform`}
                      resizeMode="contain"
                      alt=""
                    />
                  </View>
                  <Heading className="text-typography-black">Teacher</Heading>
                </VStack>
              </Radio>

              <Heading className="text-typography-black text-2xl font-bold">
                Are you?
              </Heading>

              <Radio size="lg" value="Pupil">
                <VStack className="flex gap-2 items-center">
                  <View
                    className={`h-60 w-60 p-2 rounded-full  ${registerForm.role == "Pupil" ? "bg-background-orange scale-105" : ""}}`}
                  >
                    <Image
                      source={require("@/assets/images/role-pupil.png")}
                      className={`w-full h-full transition-transform`}
                      resizeMode="contain"
                      alt=""
                    />
                  </View>
                  <Heading className="text-typography-black">Pupil</Heading>
                </VStack>
              </Radio>

              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  Please Choose a role
                </FormControlErrorText>
              </FormControlError>
            </VStack>
          </RadioGroup>
        </FormControl>

        <Button
          className="bg-background-orange rounded-lg"
          onPress={() => {
            handleStep();
          }}
        >
          <ButtonText className="text-primary-appWhite">Continue</ButtonText>
        </Button>
      </VStack>
    </>
  );
}
