import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "./ui/heading";
import { Image } from "@/components/ui/image";

function Achievement() {
  return (
    <View className="pr-3 w-full">
      <View className="flex-row items-start gap-3 w-full">
        <Image
          source={require("@/assets/icons/achievementTest.png")}
          alt="achievement"
          className="w-25 h-25"
        />
      </View>
    </View>
  );
}

export default Achievement;
