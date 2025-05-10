import React from "react";
import { View, Text, Image } from "react-native";
import BackHeader from "../BackHeader";
interface ClassroomDetailsProp {
  name: string;
  joinCode: string;
}

export default function ClassroomHeader({
  name,
  joinCode,
}: ClassroomDetailsProp) {
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
          <Text className="text-[22px] font-bold leading-tight">{name}</Text>
          <Text>{joinCode}</Text>
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
