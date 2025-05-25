import React, { useEffect, useRef } from "react";
import {
  useWindowDimensions,
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import BackHeader from "./BackHeader";
import {
  LucideAArrowDown,
  LucideAArrowUp,
  LucideALargeSmall,
} from "lucide-react-native";
import { useReadingContentStore } from "@/stores/readingContentStore";

export default function ReadContentHeader({ title }: { title: string }) {
  const fontSize = useReadingContentStore((state) => state.fontSize);
  const setFontSize = useReadingContentStore((state) => state.setFontSize);

  const increaseSize = () => {
    const size = fontSize + 4;
    setFontSize(size);
  };

  const decreseSize = () => {
    const size = fontSize - 4;
    setFontSize(size);
  };

  console.log("rch", fontSize);

  return (
    <View className="drop-shadow-lg">
      <View className="flex flex-row px-6 py-4 items-center justify-between ">
        <View className="flex flex-row">
          <BackHeader />
          <Text className="text-xl px-4 font-bold">{title}</Text>
        </View>
        {/* <View className="flex flex-row">
          <TouchableOpacity onPress={increaseSize}>
            <LucideAArrowUp color="black" size={36} />
          </TouchableOpacity>
          <TouchableOpacity className="px-2" onPress={decreseSize}>
            <LucideAArrowDown color="black" size={36} />
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
}
