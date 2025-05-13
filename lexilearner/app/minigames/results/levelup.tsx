import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { ArrowRightIcon } from "lucide-react-native";
import React from "react";
import { ScrollView, View, Image, Text } from "react-native";

export default function levelup() {
  return (
    <View className="flex-1 bg-lightGray">
      <ScrollView className="p-8">
        <BackHeader />
        <View className="flex items-center justify-between">
          <View className="justify-center m-4">
            <View className="absolute w-64 h-32 rounded-full bg-white" />
            <Image
              source={require("@/assets/images/Juicy/Girl-working-at-home.png")}
              alt="Girl and boy searching"
            />
          </View>

          <Text className="text-[35px] font-bold m-4">
            299 <ArrowRightIcon color="black" /> 300
          </Text>
          <Text className="poppins text-[30px] font-bold">
            You've Ranked Up!
          </Text>
          <Text>TIP: Keep reading to climb further up the ranks!!!</Text>
        </View>
      </ScrollView>

      <View className="p-5">
        <Button
          className="bg-white m-5 mb-24 shadow-main"
          onPress={() => {
            console.log("Button pressed");
            router.push("/minigames/results/recommendation");
          }}
        >
          <Text>Next</Text>
        </Button>
      </View>
    </View>
  );
}
