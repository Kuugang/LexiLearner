import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useClassroomStore } from "@/stores/classroomStore";
import { Classroom } from "@/models/Classroom";
import { getPupilsFromClassroom } from "@/services/ClassroomService";

interface ClassroomCardProps {
  classroom: Classroom;
}

export default function ClassroomCard({ classroom }: ClassroomCardProps) {
  const setSelectedClassroom = useClassroomStore(
    (state) => state.setSelectedClassroom
  );
  const router = useRouter();

  const onPress = () => {
    setSelectedClassroom(classroom);
    router.push(`/classroom/${classroom.id}`);
  };

  const displayText =
    classroom.pupilCount !== null
      ? classroom.pupilCount === 1
        ? "1 Pupil"
        : `${classroom.pupilCount} Pupils`
      : "Loading...";
  return (
    <Pressable onPress={onPress}>
      <View className="rounded-xl overflow-hidden border-b-4 border-lightGray border bg-white my-2">
        <View className="bg-yellowOrange h-24 w-full" />

        <View className="flex-row justify-between items-center px-5 py-4 bg-white">
          <Text className="font-bold text-lg">{classroom.name}</Text>
          <Text className="text-gray-700">{displayText}</Text>
        </View>
      </View>
    </Pressable>
  );
}
