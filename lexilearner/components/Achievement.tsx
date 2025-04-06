import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "./ui/heading";
import { Image } from "@/components/ui/image";

interface AchievementProps {
  title: string;
  description: string;
}

function Achievement({ title, description }: AchievementProps) {
  return (
    <View className="py-1 w-full">
      <View className="flex-row items-start gap-3 w-full">
        <Image
          source={require("@/assets/icons/achievementTest.png")}
          alt="achievement"
          className="w-25 h-25"
        />
        <View className="flex-1">
          <Heading>{title}</Heading>
          <Text numberOfLines={1} className="truncate">
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default Achievement;
