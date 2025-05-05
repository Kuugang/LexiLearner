import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { ReactNode } from "react";

interface ProfileStatsProps {
  level: string;
  description: string;
  icon?: ReactNode;
}

function ProfileStats({ level, description, icon }: ProfileStatsProps) {
  return (
    <View className="flex flex-row gap-3 items-center p-3 border-2 rounded-xl border-lightGray">
      <View>{icon}</View>
      <View>
        <Text className="text-md font-bold">{level}</Text>
        <Text className="text-sm text-gray-700" style={{ flexWrap: "wrap" }}>
          {description}
        </Text>
      </View>
    </View>
  );
}

export default ProfileStats;
