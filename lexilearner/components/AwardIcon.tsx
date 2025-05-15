import { Award } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

export default function AwardIcon() {
  return (
    <View className="p-4 rounded-md bg-yellowOrange border-2 rounded-xl border-lightGray border-b-4 my-1 p-4">
      <Award color="black" className="h-[30px] w-[30px]" />
    </View>
  );
}
