import { AchievementDisplay } from "@/components/AchievementDisplay";
import BackHeader from "@/components/BackHeader";
import { Text } from "@/components/ui/text";
import { Achievement } from "@/models/Achievement";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { StyleSheet, ScrollView, View, Image } from "react-native";

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
        {achievements.map((achievement: Achievement, index) => (
          <AchievementDisplay
            key={index}
            badge={achievement.badge}
            title={achievement.name}
            description={achievement.description}
          />
        ))}
      </View>
    </ScrollView>
  );
}
