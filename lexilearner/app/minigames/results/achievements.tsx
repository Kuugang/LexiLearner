import React from "react";
import { Text } from "@/components/ui/text";
import { ScrollView, View, Image } from "react-native";
import Achievement from "@/components/Achievement";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import BackHeader from "@/components/BackHeader";
export default function achievements() {
  return (
    <ScrollView className="bg-lightGray p-8">
      <BackHeader />
      <View className="flex justify-center items-center">
        <View className="justify-center m-4">
          <View className="absolute w-64 h-32 rounded-full bg-white" />
          <Image
            source={require("@/assets/images/Juicy/Girl-and-boy-searching.png")}
            alt="Girl and boy searching"
          />
        </View>

        <Text className="font-poppins text-[30px] font-bold">
          Achievements unlocked!
        </Text>
        <View className="m-10">
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

      <View>
        <Button
          className="bg-white m-5 my-1 p-4"
          onPress={() => router.push("/minigames/results/levelup")}
        >
          <Text>Next</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
