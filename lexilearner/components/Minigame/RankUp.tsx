import React from "react";
import { View, ScrollView, Text, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { MoveRight } from "lucide-react-native";

export default function RankUp() {
  return (
    <View className="h-screen flex items-center justify-around py-16 bg-lightGray">
      <View className="flex relative">
        <View
          style={{
            width: 230,
            height: 160,
            borderRadius: "100%",
            backgroundColor: "white",
            position: "absolute",
          }}
        ></View>
        <Image
          source={require("@/assets/images/girl-working-home.png")}
          style={{
            width: 250,
          }}
          resizeMode="contain"
        />
      </View>

      <View className="flex flex-col gap-3">
        <View className="flex flex-row gap-2 items-center justify-center">
          <Text className="text-center font-bold text-4xl">299</Text>
          <MoveRight color="#000000" size={30} />
          <Text className="text-center font-bold text-4xl text-appBlue">
            321
          </Text>
        </View>
        <Text className="text-center font-bold text-2xl">
          You've Ranked Up!
        </Text>
        <Text className="text-center text-sm">
          TIP: Keep reading to climb further up the ranks!
        </Text>
      </View>

      <Button
        className="w-2/3 bg-background border-appBlue border-b-4"
        onPress={() => {}}
      >
        <Text className="font-semibold">NEXT</Text>
      </Button>
    </View>
  );
}
