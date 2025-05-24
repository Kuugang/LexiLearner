import React, { useContext, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import { router } from "expo-router";
import { useRegisterFormContext } from "./_layout";

import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useGlobalStore } from "@/stores/globalStore";

import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import BackHeader from "@/components/BackHeader";

export default function Step3() {
  const { fromProviderAuth } = useLocalSearchParams();

  const {
    registerForm,
    setRegisterForm,
    providerRegisterForm,
    setProviderRegisterForm,
  } = useRegisterFormContext();

  const updateProfile = useUserStore((state) => state.updateProfile);

  const signup = useAuthStore((state) => state.signup);

  const [isInvalid, setIsInvalid] = useState(false);
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  const handleStep = async () => {
    const form = fromProviderAuth ? providerRegisterForm : registerForm;
    const isEmpty = !form.role?.trim();

    setIsInvalid(isEmpty);
    if (isEmpty) return;

    setIsLoading(true);

    try {
      if (fromProviderAuth) {
        await updateProfile(form);
      } else {
        signup(form);
      }
      if (form.role === "Pupil") {
        router.push("/signup4");
      } else {
        Toast.show({
          type: "success",
          text1: "Registration Success",
        });
        router.push("/home");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Registration Failed.",
        text2: error.message || "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="bg-yellowOrange">
      <View className="flex-1 gap-2 p-8 h-full justify-around">
        <BackHeader />

        <View className="flex items-center gap-8">
          <TouchableOpacity
            className="flex flex-col gap-4 items-center justify-center"
            onPress={() => {
              if (fromProviderAuth) {
                setProviderRegisterForm({
                  ...providerRegisterForm,
                  role: "Teacher",
                });
              } else {
                setRegisterForm({ ...registerForm, role: "Teacher" });
              }
            }}
          >
            <View
              className={`h-60 w-60 p-2 rounded-full ${registerForm.role === "Teacher" || providerRegisterForm.role === "Teacher" ? "bg-orange scale-105" : ""}}`}
            >
              <Image
                source={require("@/assets/images/role-teacher.png")}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
                alt=""
              />
            </View>
            <Text className="text-xl font-bold">Teacher</Text>
          </TouchableOpacity>

          <View>
            <Text className="text-4xl font-bold">Are you?</Text>
          </View>

          <TouchableOpacity
            className="flex flex-col gap-4 items-center justify-center"
            onPress={() => {
              if (fromProviderAuth) {
                setProviderRegisterForm({
                  ...providerRegisterForm,
                  role: "Pupil",
                });
              } else {
                setRegisterForm({ ...registerForm, role: "Pupil" });
              }
            }}
          >
            <View
              className={`h-60 w-60 p-2 rounded-full ${registerForm.role === "Pupil" || providerRegisterForm.role === "Pupil" ? "bg-orange scale-105" : ""}}`}
            >
              <Image
                source={require("@/assets/images/role-pupil.png")}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
                alt=""
              />
            </View>
            <Text className="text-xl font-bold">Pupil</Text>
          </TouchableOpacity>
        </View>
        {isInvalid && (
          <Text className="text-lg text-destructive text-center">
            Please select a role
          </Text>
        )}

        <Button
          className="bg-orange rounded-lg mt-6"
          onPress={() => {
            handleStep();
          }}
        >
          <Text className="text-white text-2xl font-bold">Continue</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
