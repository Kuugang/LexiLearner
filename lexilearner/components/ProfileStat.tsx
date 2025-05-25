import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { memo, ReactNode } from "react";

interface ProfileStatsProps {
  level: string;
  description: string;
  icon?: ReactNode;
}

function ProfileStat({ level, description, icon }: ProfileStatsProps) {
  return (
    <View className="w-[48%] m-1 p-3 flex flex-row items-center gap-3 border-2 rounded-xl border-lightGray">
      <View>{icon}</View>
      <View className="flex-1">
        <Text className="text-md font-bold">{level}</Text>
        <Text className="text-sm text-gray-700">{description}</Text>
      </View>
    </View>
  );
}

export default memo(ProfileStat);
