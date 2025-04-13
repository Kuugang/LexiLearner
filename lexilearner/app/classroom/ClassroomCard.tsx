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
    router.push(`/classroom/${props.id}/ClassroomScreen`);
  };

  return (
    <Pressable onPress={onPress}>
      <View className="border-2 rounded-xl border-gray-300 my-3">
        <View className="bg-background-lightGrayOrange p-10"></View>
        <View className="p-3 px-5 flex-row justify-between">
          <Text bold>{props.sectionName}</Text>
          <Text>
            {props.studentCount}
            {props.studentCount > 1 ? " Students" : " Student"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
