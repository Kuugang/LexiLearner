import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReadingAssignment } from "@/models/ReadingMaterialAssignment";
import { useReadingAssignmentStore } from "@/stores/readingAssignmentStore";

interface AssignmentCardProps {
  assignment: ReadingAssignment;
}

function AssignmentCard({ assignment }: AssignmentCardProps) {
  return (
    <View
      className="border-2 rounded-xl border-lightGray border-b-4 p-4 items-center flex-row"
      style={{ width: "100%" }}
    >
      <View>
        <Image
          source={
            assignment.cover !== ""
              ? assignment.cover
              : require("@/assets/images/reading-assignment.png")
          }
          resizeMode="contain"
          className="rounded-xl"
          alt="book for activity"
          style={{ width: 125, height: 125 }}
        />
      </View>
      <View className="flex-1">
        <Text className="font-bold">{assignment.title}</Text>
        <Text>{assignment.description}</Text>
        <TouchableOpacity className="w-[75%] bg-yellowOrange rounded-lg py-2 items-center mt-2 drop-shadow-custom">
          <Text className="font-semibold">Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(AssignmentCard);
