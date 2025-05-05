import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import React from "react";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface classroomProps {
  id: string;
  sectionName: string;
  studentCount: number;
}

export default function ClassroomCard(props: classroomProps) {
  const router = useRouter();

  const onPress = () => {
    router.push(`/classroom/${props.id}`);
  };

  return (
    <Pressable onPress={onPress}>
      <View className="rounded-xl overflow-hidden shadow-main border-b-4 border-lightGray bg-white my-2">
        <View className="bg-yellowOrange h-24 w-full" />

        <View className="flex-row justify-between items-center px-5 py-4 bg-white">
          <Text className="font-bold text-lg">{props.sectionName}</Text>
          <Text className="text-gray-700">
            {props.studentCount}
            {props.studentCount > 1 ? " Students" : " Student"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
