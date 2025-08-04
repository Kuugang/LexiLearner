import React, { useEffect, useRef } from "react";
import { useWindowDimensions, View, Text } from "react-native";
import BackHeader from "./BackHeader";

export default function ReadContentHeader({
  title,
  handleBack,
  background,
}: {
  title: string;
  handleBack: () => void;
  background?: "white";
}) {
  return (
    <View className={`bg-${background ?? "white"}`}>
      <View className="flex flex-row px-6 py-4 items-center justify-between ">
        <View className="flex flex-row">
          <BackHeader onPress={handleBack} />
          <Text className="text-xl px-4 font-bold">{title}</Text>
        </View>
      </View>
    </View>
  );
}
