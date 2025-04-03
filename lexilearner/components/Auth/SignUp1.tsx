import React, { useContext, useState } from "react";
import { router } from "expo-router";

import { RegisterFormContext } from "../../app/(auth)/_layout";
import { useAuthContext } from "@/context/AuthProvider";

//Components
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";

import { AlertCircleIcon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface SignUp1Props {
  formErrors: Record<string, any>;
  handleStep: () => void;
}

export default function SignUp1({ formErrors, handleStep }: SignUp1Props) {
  const { registerForm, setRegisterForm } = useContext(RegisterFormContext);
  const { providerAuth } = useAuthContext();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  return (
    <>
      <VStack space="sm" className="flex-1 gap-36 p-8 h-full justify-around">
        <Button
          className="bg-transparent self-start p-0"
          onPress={() => router.back()}
        >
          <FontAwesomeIcon size={30} icon={faArrowLeft} />
        </Button>

        <VStack space="md">
          <Heading className="text-primary-0 text-2xl">
            Let's Get Started!
          </Heading>

          {/* Username Field */}
          <FormControl isInvalid={!!formErrors.username}>
            <Input className="rounded-lg bg-primary-appWhite">
              <InputField
                className="text-black"
                placeholder="Enter username"
                value={registerForm.username}
                onChangeText={(text: string) =>
                  setRegisterForm({ ...registerForm, username: text })
                }
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{formErrors.username}</FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Email Field */}
          <FormControl isInvalid={!!formErrors.email}>
            <Input className="rounded-lg bg-primary-appWhite">
              <InputField
                className="text-black"
                placeholder="Enter email"
                value={registerForm.email}
                onChangeText={(text: string) =>
                  setRegisterForm({ ...registerForm, email: text })
                }
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{formErrors.email}</FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Password Field */}
          <FormControl isInvalid={!!formErrors.password}>
            <VStack space="xs">
              <Input className="rounded-lg bg-primary-appWhite">
                <InputField
                  className="text-black"
                  value={registerForm.password}
                  placeholder="Enter password"
                  onChangeText={(text: string) =>
                    setRegisterForm({ ...registerForm, password: text })
                  }
                  type={showPassword ? "text" : "password"}
                />
                <InputSlot className="pr-3" onPress={handleState}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {formErrors.password}
                </FormControlErrorText>
              </FormControlError>
            </VStack>
          </FormControl>

          {/* Confirm Password Field */}
          <FormControl isInvalid={!!formErrors.confirmPassword}>
            <VStack space="xs">
              <Input className="rounded-lg bg-primary-appWhite">
                <InputField
                  className="text-black"
                  value={registerForm.confirmPassword}
                  placeholder="Confirm password"
                  onChangeText={(text: string) =>
                    setRegisterForm({ ...registerForm, confirmPassword: text })
                  }
                  type={showPassword ? "text" : "password"}
                />
                <InputSlot className="pr-3" onPress={handleState}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {formErrors.confirmPassword}
                </FormControlErrorText>
              </FormControlError>
            </VStack>
          </FormControl>
        </VStack>

        <VStack space="lg">
          <Button
            className="bg-background-orange"
            onPress={() => {
              handleStep();
            }}
          >
            <ButtonText className="text-typography-0">Sign Up</ButtonText>
          </Button>

          <VStack space="lg">
            <HStack
              space="md"
              className="w-full justify-center items-center mt-4"
            >
              <Divider className="flex-1" />
              <Text className="text-primary-0">OR CONTINUE WITH</Text>
              <Divider className="flex-1" />
            </HStack>

            <HStack space="md" className="w-full justify-center items-center">
              <Button
                size="md"
                action="secondary"
                className="bg-white shadow-md rounded-lg"
                onPress={() => {
                  providerAuth(0);
                }}
              >
                <FontAwesomeIcon icon={faGoogle} />
              </Button>

              <Button
                size="md"
                action="secondary"
                className="bg-white shadow-md rounded-lg"
                onPress={() => {
                  providerAuth(1);
                }}
              >
                <FontAwesomeIcon icon={faFacebook} />
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </>
  );
}
