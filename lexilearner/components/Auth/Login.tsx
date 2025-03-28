import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";

import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";

import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/models/User";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getProfile } from "@/services/UserService";
import { login } from "@/services/AuthService";
import { useAuth } from "@/stores/authStore";
import { router } from "expo-router";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useFacebookAuth } from "@/hooks/useFacebookAuth";

export default function Login() {
  const toast = useToast();
  const { isLoading, setIsLoading, isLogged } = useGlobalContext();

  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);
  const isLoggedIn = useAuth((s) => !!s.token);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    //TODO Data validation and loader
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
      let response = await login(form.email, form.password);
      await AsyncStorage.setItem("token", response.data.token);
      response = await getProfile();

      const userData = response.data;

      const user: User = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      };
      setUser(user);
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
    <FormControl className="p-4 border border-red-500 rounded-lg border-outline-300 max-w-[90%] mx-auto">
      <VStack space="xl">
        <Heading className="text-typography-900">Login</Heading>
        <VStack space="xs">
          <Text className="text-typography-500">Email</Text>
          <Input className="min-w-[250px]">
            <InputField
              className="text-black"
              value={form.email}
              onChangeText={(text: string) => setForm({ ...form, email: text })}
              type="text"
            />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500">Password</Text>
          <Input className="text-center">
            <InputField
              className="text-black"
              value={form.password}
              onChangeText={(text: string) =>
                setForm({ ...form, password: text })
              }
              type={showPassword ? "text" : "password"}
            />
            <InputSlot className="pr-3" onPress={handleState}>
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
            </InputSlot>
          </Input>
        </VStack>
        <Button
          className="ml-auto"
          onPress={() => {
            handleLogin();
          }}
        >
          <ButtonText className="text-typography-0">Login</ButtonText>
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
    </FormControl>
  );
}
