import Achievement from "@/components/Achievement";
import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { Settings } from "lucide-react-native";
import { StyleSheet, ScrollView, View, Image } from "react-native";
// sakto ba diri nga folder? HUHUHUHUUH
export default function achievementslist() {
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

      <View className="p-5 my-5 items-center justify-center flex flex-col">
        {/* <View className="m-3">
          <Text>My Achievements</Text>
        </View> */}
        <Achievement
          title="Reader Rookie"
          description="Read a total of 3 books."
        />
        <Achievement
          title="More and More!"
          description="Reach 300 Reading Comprehension."
        />
        <Achievement
          title="More and More!"
          description="Reach 300 Reading Comprehension."
        />
        <Achievement
          title="More and More!"
          description="Reach 300 Reading Comprehension."
        />
        <Achievement
          title="More and More!"
          description="Reach 300 Reading Comprehension."
        />
        <Achievement
          title="More and More!"
          description="Reach 300 Reading Comprehension."
        />
        <Achievement
          title="More and More!"
          description="Reach 300 Reading Comprehension."
        />
        <Achievement
          title="More and More!"
          description="Reach 300 Reading Comprehension."
        />
        <Achievement
          title="More and More!"
          description="Reach 300 Reading Comprehension."
        />
        <Achievement
          title="More and More!"
          description="Reach 300 Reading Comprehension."
        />
      </View>
    </ScrollView>
  );
}
