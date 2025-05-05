import React from "react";
import { View, Text, Image } from "react-native";
import BackHeader from "../BackHeader";

export default function ClassroomHeader() {
  return (
    <View
      style={{
        height: 150,
        width: "100%",
        borderBottomLeftRadius: 40,
      }}
      className="bg-yellowOrange p-4"
    >
      <View className="flex flex-row justify-between items-center px-4 h-full">
        <BackHeader />
        <View>
          <Text className="text-[22px] font-bold leading-tight">
            Grade 6 - F2
          </Text>
          <Text>x5AHSydA</Text>
        </View>
        <Image
          source={require("@/assets/images/Juicy/Office-desk.png")}
          resizeMode="contain"
          className="h-64 w-64"
        />
      </View>
    </View>
  );
}
