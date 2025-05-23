import React from "react";
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
import { LucideALargeSmall } from "lucide-react-native";

export default function ReadContentHeader({ title }: { title: string }) {
  // function onPress = () => {

  // }

  return (
    <View>
      <View className="flex flex-row px-6 py-4 items-center justify-between">
        <View className="flex flex-row">
          <BackHeader />
          <Text className="text-xl px-4 font-bold">{title}</Text>
        </View>
        <TouchableOpacity className="px-4">
          <LucideALargeSmall color="black" size={36} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
