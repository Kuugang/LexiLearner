import React, { useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { useAuthContext } from "@/context/AuthProvider";
import { validateField } from "@/utils/utils";

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
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const toast = useToast();
  const { login } = useAuthContext();
  const { providerAuth } = useAuthContext();
  const { setIsLoading } = useGlobalContext();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "mrekajojab@gmail.com",
    password: "Maotka1!",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handleLogin = async () => {
    const newErrors: any = {};
    Object.keys(form).forEach((field) => {
      const error = validateField(field, form[field as keyof typeof form]);
      newErrors[field] = error;
    });

    setFormErrors(newErrors);

    if (form.email === "" || form.password === "") {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast
              nativeID={toastId}
              className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row bg-red-500 rounded-lg"
            >
              <ToastTitle size="sm">Please fill in all fields</ToastTitle>
            </Toast>
          );
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(form.email, form.password);
      router.push("/home");
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          const errorMessage =
            error instanceof Error ? error.message : "An error occurred";

          return (
            <Toast
              nativeID={toastId}
              className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row bg-red-500 rounded-lg"
            >
              <ToastTitle size="sm">{errorMessage}</ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack space="xl" className="flex-1 gap-36 p-8 h-full justify-around">
      <Button
        className="bg-transparent self-start p-0"
        onPress={() => router.back()}
      >
        <FontAwesomeIcon size={30} icon={faArrowLeft} />
      </Button>

      <VStack space="xl" className="justify-around">
        <Heading className="text-primary-0 text-2xl">Welcome Back!</Heading>

        {/* Email Field */}
        <FormControl isInvalid={!!formErrors.email}>
          <Input className="rounded-lg bg-primary-appWhite">
            <InputField
              className="text-black"
              value={form.email}
              onChangeText={(text: string) => setForm({ ...form, email: text })}
              placeholder="Email"
              type="text"
            />
          </Input>

          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>{formErrors.email}</FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Password Field */}
        <FormControl isInvalid={!!formErrors.password}>
          <Input className="rounded-lg bg-primary-appWhite">
            <InputField
              className="text-black"
              value={form.password}
              onChangeText={(text: string) =>
                setForm({ ...form, password: text })
              }
              placeholder="Password"
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
        </FormControl>
      </VStack>

      <VStack space="lg">
        <Button
          className="bg-background-orange rounded-lg"
          onPress={() => {
            handleLogin();
          }}
        >
          <ButtonText className="text-primary-appWhite">Login</ButtonText>
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
  );
}
