import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "./ui/heading";

interface ProfileStatsProps {
  level: number;
  description: string;
}

function ProfileStats({ level, description }: ProfileStatsProps) {
  return (
    <View className="items-center w-full p-4">
      <Heading bold className="text-2xl">
        {level}
      </Heading>
      <Text className="flex-wrap text-center w-full">{description}</Text>
    </View>
  );
}

export default ProfileStats;
