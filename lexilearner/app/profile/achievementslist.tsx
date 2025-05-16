import { AchievementDisplay } from "@/components/AchievementDisplay";
import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Achievement } from "@/models/Achievement";
import { getPupilAchievements } from "@/services/UserService";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Settings } from "lucide-react-native";
import { StyleSheet, ScrollView, View, Image } from "react-native";

// sakto ba diri nga folder? HUHUHUHUUH
export default function achievementslist() {
  const achievements = useMiniGameStore((state) => state.achievements);

  return (
    <ScrollView className="bg-white">
      <View className="h-[150px] w-full rounded-bl-[40px] bg-yellowOrange p-4">
        <View className="flex flex-row justify-between">
          <BackHeader />
        </View>
        <View className="flex flex-row p-5">
          <View className="flex flex-col">
            <Text className="text-[22px] font-bold">Achievements</Text>
            <Text>Great Job!</Text>
          </View>
          <Image
            source={require("@/assets/images/Juicy/Girl-party.png")}
            alt="Girl party"
            className="h-32"
          />
        </View>
      </View>

      <View className="p-5 my-8 items-center justify-center flex flex-col">
        {achievements.map((achievement: Achievement) => (
          <AchievementDisplay
            badge={achievement.badge}
            title={achievement.name}
            description={achievement.description}
          />
        ))}
      </View>
    </ScrollView>
  );
}
