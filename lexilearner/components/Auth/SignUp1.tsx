import React, { useContext, useState } from "react";

import { router } from "expo-router";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useFacebookAuth } from "@/hooks/useFacebookAuth";

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

export default function SignUp1() {
  const { registerForm, setRegisterForm } = useContext(RegisterFormContext);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "",
  });

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "username":
        if (!value.trim() || !value) return "Username is required.";
        if (!value) return "Username is required.";
        return "";

      case "email":
        if (!value.trim() || !value) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format.";
        return ""; // No error

      case "password":
        if (!value.trim() || !value) return "Password is required.";
        if (value.length < 6)
          return "Password must be at least 6 characters long.";
        if (!/[A-Z]/.test(value))
          return "Password must contain at least one uppercase letter.";
        if (!/[0-9]/.test(value))
          return "Password must contain at least one number.";
        return ""; // No error

      case "confirmPassword":
        if (value !== registerForm.password) return "Passwords no not match.";
        return "";

      default:
        return "";
    }
  };

  const handleRegister = async () => {
    const newErrors: any = {};
    Object.keys(registerForm).forEach((field) => {
      const error = validateField(
        field,
        registerForm[field as keyof typeof registerForm],
      );
      newErrors[field] = error;
    });

    setFormErrors(newErrors);

    if (!Object.values(newErrors).some((value) => value !== "")) {
      router.push("/signup2");
    }
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
            handleRegister();
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
              useGoogleAuth();
            }}
          >
            <FontAwesomeIcon icon={faGoogle} />
          </Button>

          <Button
            size="md"
            variant="outline"
            action="secondary"
            className="bg-transparent border border-black-1"
            onPress={useFacebookAuth}
          >
            <FontAwesomeIcon icon={faFacebook} />
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
