import { router, useFocusEffect } from "expo-router";
import { useUserStore } from "@/stores/userStore";

import { ScrollView, View, Image } from "react-native";

import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import {
  Settings,
  Flame,
  Book,
  Smartphone,
  Star,
  Medal,
  Award,
  Trophy,
  Zap,
} from "lucide-react-native";

import ProfileStat from "@/components/ProfileStat";
import BackHeader from "@/components/BackHeader";
import {
  getLoginStreak,
  getPupilAchievements,
  getTotalSession,
} from "@/services/UserService";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { AwardIcon } from "@/components/AchievementDisplay";
import { Achievement } from "@/models/Achievement";
import { ActivityIndicator } from "react-native-paper";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const setAchievements = useMiniGameStore((state) => state.setAchievements);
  const isPupil = user?.role === "Pupil";

  const [achievementsQuery, screenTimeQuery, loginStreakQuery] = useQueries({
    queries: [
      {
        queryKey: ["achievements"],
        queryFn: getPupilAchievements,
        enabled: isPupil,
      },
      {
        queryKey: ["totalSession"],
        queryFn: getTotalSession,
        refetchOnWindowFocus: true,
        enabled: isPupil,
      },
      {
        queryKey: ["loginStreak"],
        queryFn: getLoginStreak,
        enabled: isPupil,
      },
    ],
  });

  if (
    achievementsQuery.isLoading ||
    screenTimeQuery.isLoading ||
    loginStreakQuery.isLoading
  ) {
    return (
      <View className="flex-1 justify-center items-center absolute inset-0 z-50">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Loading...</Text>
      </View>
    );
  }

  setAchievements(achievementsQuery.data);
  console.log("acsuehmet:", achievementsQuery.data);

  const formatScreenTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <ScrollView className="bg-background">
      <View className="h-[150px] w-full rounded-bl-[40px] bg-yellowOrange p-4 rounded-xl border-lightGray border-b-4">
        <View className="flex flex-row justify-between">
          <BackHeader />

          <Button
            className="self-end bg-transparent"
            onPress={async () => {
              router.push("/profile/settings");
            }}
          >
            <Settings color="black" />
          </Button>
        </View>
      </View>

      <View
        className="flex p-8 gap-4"
        style={{ position: "relative", bottom: 90 }}
      >
        <View className="h-32 w-32 rounded-full border-[5px] border-white">
          <Image
            source={require("@/assets/images/leeseopp.png")}
            className="rounded-full shadow-lg w-full h-full"
            resizeMode="contain"
            alt="User profile pic"
          />
        </View>

        <View className="w-full mt-4 flex gap-4">
          <View className="flex-row justify-between">
            <View className="pb-5">
              <Text className="text-lg font-bold">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text>@{user?.userName}</Text>
            </View>

            <View>
              {user?.role === "Pupil" ? (
                <>
                  <View className="flex flex-row gap-2 items-center">
                    <Zap color="#FFD43B" />
                    <Text className="text-lg font-bold">
                      {user?.pupil?.level ? user?.pupil?.level : 0}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-800">
                    Reading Compr. Level
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-xl font-bold">Teacher</Text>
                </>
              )}
            </View>
          </View>
          {user?.role === "Pupil" && (
            <>
              <Text className="text-xl font-bold">Overview</Text>

              <View className="grid grid-cols-2 gap-2">
                <ProfileStat
                  level={`${loginStreakQuery.data.longestStreak}`}
                  description="Longest Streak"
                  icon={<Flame color="red" />}
                />
                <ProfileStat
                  level={"10"}
                  description="Books Read"
                  icon={<Book color="blue" />}
                />
                <ProfileStat
                  level={
                    screenTimeQuery !== undefined
                      ? formatScreenTime(screenTimeQuery.data)
                      : "0"
                  }
                  description="Total Screentime"
                  icon={<Smartphone color="black" />}
                />
                <ProfileStat
                  level={`${achievementsQuery.data.length}`}
                  description="Achievements"
                  icon={<Star color="#FFD43B" />}
                />
              </View>

              <View className="my-4">
                <View className="flex-row justify-between">
                  <Text className="text-xl font-bold my-2">Achievements</Text>
                  <Text
                    className="underline"
                    onPress={async () => {
                      router.push("/profile/achievementslist");
                    }}
                  >
                    View All
                  </Text>
                </View>

                <View className="flex-row flex gap-4">
                  {achievementsQuery.data.map(
                    (a: Achievement, index: number) => (
                      <AwardIcon badge={`${a.badge}`} key={index} />
                    ),
                  )}
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
