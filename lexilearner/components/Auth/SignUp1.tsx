import React, { useContext, useState } from "react";

import { RegisterFormContext } from "../../app/(auth)/_layout";

//Components
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
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
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { useAuthContext } from "@/context/AuthProvider";

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
      <VStack space="xl" className="text-typography-black">
        <Heading className="text-typography-black">Let's Get Started</Heading>

        {/* Username Field */}
        <FormControl isInvalid={!!formErrors.username}>
          <FormControlLabel>
            <FormControlLabelText className="text-black">
              Username
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1">
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
          <FormControlLabel>
            <FormControlLabelText className="text-black">
              Email
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1">
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
            <Text className="text-typography-500">Password</Text>
            <Input className="text-center">
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
              <FormControlErrorText>{formErrors.password}</FormControlErrorText>
            </FormControlError>
          </VStack>
        </FormControl>

        {/* Confirm Password Field */}
        <FormControl isInvalid={!!formErrors.confirmPassword}>
          <VStack space="xs">
            <Text className="text-typography-500">Confirm Password</Text>
            <Input className="text-center">
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

        <Button
          className="ml-auto"
          onPress={() => {
            handleStep();
          }}
        >
          <ButtonText className="text-typography-0">Sign Up</ButtonText>
        </Button>
        <HStack space="md" className="w-full justify-center items-center mt-4">
          <Divider className="flex-1" />
          <Text>OR CONTINUE WITH</Text>
          <Divider className="flex-1" />
        </HStack>

        <HStack space="md" className="w-full justify-center items-center">
          <Button
            size="md"
            variant="outline"
            action="secondary"
            className="bg-transparent border border-black-1"
            onPress={() => {
              providerAuth(0);
            }}
          >
            <FontAwesomeIcon icon={faGoogle} />
          </Button>

          <Button
            size="md"
            variant="outline"
            action="secondary"
            className="bg-transparent border border-black-1"
            onPress={() => {
              providerAuth(1);
            }}
          >
            <FontAwesomeIcon icon={faFacebook} />
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
