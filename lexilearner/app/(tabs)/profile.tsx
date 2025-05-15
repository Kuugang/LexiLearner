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
import { getLoginStreak, getTotalSession } from "@/services/UserService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const [longestStreak, setLongestStreak] = useState(0);

  // Opening back to profile page will force refetch total screentime
  const { data: screenTime } = useQuery({
    queryKey: ["totalSession"],
    queryFn: getTotalSession,
    refetchOnWindowFocus: true,
  });

  const { data: loginStreak, isLoading } = useQuery({
    queryKey: ["loginStreak"],
    queryFn: getLoginStreak,
  });

  const formatScreenTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <ScrollView className="bg-background">
      <View
        style={{
          height: 150,
          width: "100%",
          borderBottomLeftRadius: 40,
        }}
        className="bg-yellowOrange p-4 shadow-lg w-full"
      >
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
        <View className="h-32 w-32">
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
                    <Text className="text-lg font-bold">{user?.level}</Text>
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
                  level={isLoading ? "1" : `${loginStreak.longestStreak}`}
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
                    screenTime !== undefined
                      ? formatScreenTime(screenTime)
                      : "0"
                  }
                  description="Total Screentime"
                  icon={<Smartphone color="black" />}
                />
                <ProfileStat
                  level={"2"}
                  description="Achievements"
                  icon={<Star color="#FFD43B" />}
                />
              </View>

              <View className="flex-row justify-between">
                <Text className="text-xl font-bold">Achievements</Text>
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
                <View className="p-4 rounded-md bg-yellow-500 shadow-md">
                  <Award color="black" style={{ width: 30, height: 30 }} />
                </View>

                <View className="p-4 rounded-md bg-yellow-500 shadow-md">
                  <Medal color="black" style={{ width: 30, height: 30 }} />
                </View>
                <View className="p-4 rounded-md bg-yellow-500 shadow-md">
                  <Trophy color="black" style={{ width: 30, height: 30 }} />
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
