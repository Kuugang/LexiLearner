import { useState } from "react";
import { router } from "expo-router";
import { useUserStore } from "@/stores/userStore";
import { useGlobalStore } from "@/stores/globalStore";
import { refreshAccessToken } from "@/services/AuthService";
import Toast from "react-native-toast-message";

import { Platform, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { View, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Step4() {
  const updateProfile = useUserStore((state) => state.updateProfile);
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  const [age, setAge] = useState<string | null>(null);
  const [ageInvalid, setAgeInvalid] = useState(false);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      android: insets.bottom,
      default: insets.bottom,
    }),
    left: 12,
    right: 12,
  };

  const handleStep = async () => {
    try {
      if (age === null) {
        setAgeInvalid(true);
        return;
      }
      setAgeInvalid(false);
      setIsLoading(true);
      await updateProfile({ age: age });
      Toast.show({
        type: "success",
        text1: "Registration Success",
      });
      refreshAccessToken();
      router.replace("/home");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Registration Failed aaa",
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="bg-yellowOrange">
      <View className="flex-1 gap-14 p-8 h-full justify-around items-center">
        <View className="flex-1 gap-6 p-8 h-full justify-around items-center">
          <Image
            source={require("@/assets/images/role-pupil.png")}
            style={{ width: 160, height: 160 }}
            resizeMode="contain"
            alt=""
          />
          <Text className="text-typography-black font-bold text-3xl">
            Almost There!
          </Text>
        </View>

        <Select
          onValueChange={(e) => {
            setAge(e?.value as string);
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue
              className="text-foreground text-sm native:text-lg"
              placeholder="Enter your age"
            />
          </SelectTrigger>

          <SelectContent insets={contentInsets} side="bottom">
            <ScrollView className="w-[245px] max-h-64">
              <SelectLabel>Age</SelectLabel>
              {[
                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
              ].map((value) => (
                <SelectItem
                  key={value}
                  label={String(value)}
                  value={String(value)}
                >
                  {value}
                </SelectItem>
              ))}
            </ScrollView>
          </SelectContent>
        </Select>

        {ageInvalid && (
          <Text className="text-lg text-destructive text-center">
            Please enter your age.
          </Text>
        )}

        <TouchableOpacity
          className="bg-orange border border-dropShadowColor w-full rounded-xl border-b-4 p-3 items-center"
          onPress={() => {
            handleStep();
          }}
        >
          <Text className="text-white text-md font-bold">Finish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
