import Achievement from "@/components/Achievement";
import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View } from "react-native";
// sakto ba diri nga folder? HUHUHUHUUH
export default function achievements() {
  return (
    <View>
      <View className="bg-background-yellowOrange w-full h-50 drop-shadow-lg">
        <Text className="text-lg font-bold p-10">Achievements</Text>
      </View>
      <View className="p-10">
        <Text>TESTESTETSSTSSSS</Text>
        <Achievement
          title="Reader Rookie"
          description="Read a total of 3 books."
        />
        <Achievement
          title="More and More!"
          description="Reach 300 Reading Comprehension."
        />
      </View>
    </View>
  );
}
