import { useUserContext } from "@/context/UserProvider";
import { Alert, View, ScrollView } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { checkUserExist, deleteAccount } from "@/services/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Components
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import BackHeader from "@/components/BackHeader";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { useToast } from "@/components/ui/toast";
import { Toast, ToastTitle } from "@/components/ui/toast";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";
import { validateField } from "@/utils/utils";

export default function profileSettings() {
  const { user, updateProfile } = useUserContext();
  const toast = useToast();

  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    username: user?.userName,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
  });

  useEffect(() => {
    if (
      profile.firstName === user?.firstName &&
      profile.lastName === user?.lastName &&
      profile.username === user?.userName
    ) {
      setIsProfileChanged(false);
      return;
    }
    setIsProfileChanged(true);
  }, [profile]);

  const handleUpdateProfile = async () => {
    try {
      const newErrors: any = {};
      Object.keys(profile).forEach((field) => {
        const error = validateField(field, profile[field], profile);
        if (error === "") return;
        newErrors[field] = error;
      });
      setFormErrors(newErrors);

      if (
        (await checkUserExist("username", profile.username as string))
          .statusCode == 200 &&
        profile.username !== user?.userName
      ) {
        setFormErrors({ ...formErrors, username: "Username is already taken" });
      }
      if (Object.keys(newErrors).length > 0) return;

      await updateProfile(profile);

      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} className="">
              <ToastTitle size="sm">Profile Updated Successfully</ToastTitle>
            </Toast>
          );
        },
      });
    } catch (error: any) {
      //TODO: make reusable
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
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      await AsyncStorage.removeItem("token");
      router.push("/");
    } catch (err) {
      Alert.alert("Error deleting account");
    }
  };

  return (
    <ScrollView className="flex-1 gap-36 p-8 h-full justify-around">
      <BackHeader />

      <VStack space="xl" className="justify-around">
        <Center>
          <Image
            source={require("@/assets/images/leeseopp.png")}
            className="rounded-full border-[5px] border-white w-32 h-32"
            size="lg"
            alt="User profile pic"
          />
        </Center>

        <Heading className="center">Profile</Heading>

        <View className="py-1">
          <FormControl isInvalid={!!formErrors.firstName}>
            <Text className="font-bold">First Name</Text>
            <Input>
              <InputField
                placeholder={profile.firstName}
                value={profile.firstName}
                onChangeText={(value: string) =>
                  setProfile({ ...profile, firstName: value })
                }
              />
            </Input>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {formErrors.firstName}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </View>

        <View className="py-1">
          <FormControl isInvalid={!!formErrors.lastName}>
            <Text>Last Name</Text>
            <Input>
              <InputField
                placeholder={profile.lastName}
                value={profile.lastName}
                onChangeText={(value: string) =>
                  setProfile({ ...profile, lastName: value })
                }
              />
            </Input>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{formErrors.lastName}</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </View>

        <View className="py-1">
          <Text>Username</Text>

          <FormControl isInvalid={!!formErrors.username}>
            <Input>
              <InputField
                placeholder={profile.username}
                value={profile.username}
                onChangeText={(value: string) =>
                  setProfile({ ...profile, username: value })
                }
              />
            </Input>

            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{formErrors.username}</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </View>

        <View className="py-5">
          <Text>Password</Text>
          <Input>
            <InputField placeholder="*****" />
          </Input>
        </View>

        {isProfileChanged && (
          <Button onPress={() => handleUpdateProfile()} className="my-2">
            <ButtonText>EDIT ACCOUNT</ButtonText>
          </Button>
        )}

        <Button onPress={() => handleDeleteAccount()} className="my-2">
          <ButtonText>DELETE ACCOUNT</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}
