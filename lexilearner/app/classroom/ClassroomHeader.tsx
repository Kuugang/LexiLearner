import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View } from "react-native";
import { Image } from "@/components/ui/image";

export default function ClassroomHeader() {
  return (
    <View className="bg-background-yellowOrange w-full rounded-bl-4xl h-32 drop-shadow-lg">
      <Text>Grade 6 - F2</Text>
      <Text>x5AhYyj</Text>
      <Image source={require("@/assets/images/classroom-header.png")} />
    </View>
  );
}
