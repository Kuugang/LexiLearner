import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "./ui/heading";

interface ProfileStatsProps {
  level: number;
  description: string;
}

function ProfileStats({ level, description }: ProfileStatsProps) {
  return (
    <View className="w-[48%] py-1">
      <View className="p-3 border-2 rounded-xl border-gray-300">
        <Text className="text-lg font-bold">{level}</Text>
        <Text className="text-sm text-gray-700">{description}</Text>
      </View>
    </View>
  );
}

export default ProfileStats;
