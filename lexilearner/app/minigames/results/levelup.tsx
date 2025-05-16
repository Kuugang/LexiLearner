import React, { useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowRightIcon } from "lucide-react-native";
import { ScrollView, View, Image, Text } from "react-native";
import {
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { useUserStore } from "@/stores/userStore";

export default function levelup() {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  const { data } = useLocalSearchParams();
  const [initialLevel, setInitialLevel] = useState<number>(0);
  const [targetLevel, setTargetLevel] = useState<number>(0);

  const progress = useSharedValue(0);
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    try {
      const userLevel = useUserStore.getState().user?.pupil?.level ?? 0;
      setInitialLevel(userLevel);
      setTargetLevel(userLevel);

      const parsed = data ? JSON.parse(data as string) : null;
      if (parsed && typeof parsed.level === "number") {
        setTargetLevel(parsed.level);

        if (user) {
          setUser({
            ...user,
            pupil: {
              ...user.pupil,
              level: parsed.level,
            },
          });
        }
      } else {
        console.warn("Parsed data is invalid or missing 'level' field.");
      }
    } catch (error) {
      console.error("Failed to parse data:", error);
    }
  }, [data]);

  useEffect(() => {
    progress.value = initialLevel;
    setDisplayValue(initialLevel);
  }, [initialLevel]);

  useEffect(() => {
    if (targetLevel > 0) {
      progress.value = withTiming(targetLevel, { duration: 1500 });
    }
  }, [targetLevel]);

  useAnimatedReaction(
    () => Math.round(progress.value),
    (result) => {
      runOnJS(setDisplayValue)(result);
    },
  );

  return (
    <View className="flex-1 bg-lightGray">
      <ScrollView className="p-8">
        <BackHeader />
        <View className="flex items-center justify-between">
          <View className="justify-center m-4">
            <View className="absolute w-64 h-32 rounded-full bg-white" />
            <Image
              source={require("@/assets/images/Juicy/Girl-working-at-home.png")}
              alt="Girl and boy searching"
            />
          </View>
          <View className="flex-row items-center space-x-2 m-4">
            <Text className="text-[35px] font-bold text-black">
              {initialLevel}
            </Text>
            <ArrowRightIcon color="black" />
            <Text className="text-[35px] font-bold text-black">
              {displayValue}
            </Text>
          </View>
          <Text className="poppins text-[30px] font-bold">
            You've Ranked Up!
          </Text>
          <Text className="text-center">
            TIP: Keep reading to climb further up the ranks!
          </Text>
        </View>
      </ScrollView>
      <View className="p-5">
        <Button
          className="w-full bg-background border-appBlue border-b-4 rounded-xl"
          onPress={() => {
            router.push("/minigames/results/recommendation");
          }}
        >
          <Text>Next</Text>
        </Button>
      </View>
    </View>
  );
}
