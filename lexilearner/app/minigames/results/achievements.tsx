import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { ScrollView, View, Image } from "react-native";
import { AchievementDisplay as Achievement } from "@/components/AchievementDisplay";
import { Button } from "@/components/ui/button";
import { router, useLocalSearchParams } from "expo-router";
import { Achievement as AchievementType } from "@/models/Achievement";

export default function achievements() {
  const [achievements, setAchievements] = useState<AchievementType[]>();
  const { data } = useLocalSearchParams();

  useEffect(() => {
    const parsed = data ? JSON.parse(data as string) : null;

    if (parsed) {
      const achievementsList = parsed.achievements.map(
        (item: any) => item.achievement
      );
      setAchievements(achievementsList);
    }
  }, []);

  return (
    <ScrollView className="bg-lightGray p-8">
      <View className="flex gap-4 items-center w-full p-4">
        <View className="justify-center">
          <View className="absolute w-64 h-32 rounded-full bg-white" />
          <Image
            source={require("@/assets/images/Juicy/Girl-and-boy-searching.png")}
            alt="Girl and boy searching"
          />
        </View>

        <Text
          className="font-poppins text-2xl font-bold text-center"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          Achievements unlocked!
        </Text>

        <View className="w-full">
          {achievements != undefined &&
            achievements.map((achievement: AchievementType, index: number) => {
              return (
                <Achievement
                  key={index}
                  title={achievement.name}
                  description={achievement.description}
                  badge={achievement.badge}
                />
              );
            })}
        </View>

        <Button
          className="w-full bg-background border-appBlue border-b-4 rounded-xl"
          onPress={() => {
            router.replace({
              pathname: "/minigames/results/levelup",
              params: {
                data: data,
              },
            });
          }}
        >
          <Text>Next</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
