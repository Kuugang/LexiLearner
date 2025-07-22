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
    <ScrollView className="bg-white">
      <View className="flex-1 gap-2 p-8 h-full justify-around">
        <BackHeader />
        <View>
          <Text className="text-3xl font-bold">What role are you?</Text>
        </View>

        <View className="flex gap-6">
          <TouchableOpacity
            className={`flex flex-col gap-4 items-center justify-center py-4 rounded-xl ${
              registerForm.role === "Teacher" ||
              providerRegisterForm.role === "Teacher"
                ? "border-yellowOrange border-4 border-b-8"
                : "border-lightGray border-2"
            } border-b-4`}
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
            <Image
              source={require("@/assets/images/roles/teacher.png")}
              // style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
              alt=""
            />
            <Text className="text-xl font-bold">Teacher</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex flex-col gap-4 items-center justify-center py-4 rounded-xl ${
              registerForm.role === "Pupil" ||
              providerRegisterForm.role === "Pupil"
                ? "border-yellowOrange border-4 border-b-8"
                : "border-lightGray border-2"
            } border-b-4`}
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
            <Image
              source={require("@/assets/images/roles/student.png")}
              // style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
              alt=""
            />
            <Text className="text-xl font-bold">Pupil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-yellowOrange border border-dropShadowColor rounded-xl border-b-4 p-3 items-center"
            onPress={() => {
              handleStep();
            }}
          >
            <Text className="text-black text-base font-bold">Continue</Text>
          </TouchableOpacity>
        </View>
        {isInvalid && (
          <Text className="text-lg text-destructive text-center">
            Please select a role
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
