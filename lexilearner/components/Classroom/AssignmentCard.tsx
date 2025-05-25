import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  ReadingAssignment,
  ReadingAssignmentOverview,
} from "@/models/ReadingMaterialAssignment";
import { router } from "expo-router";
import { useUserStore } from "@/stores/userStore";
import { useReadingAssignmentStore } from "@/stores/readingAssignmentStore";
import { useGetCoverFromGDrive } from "@/hooks/useExtractDriveFileId";

interface AssignmentCardProps {
  assignment: ReadingAssignment;
}

function AssignmentCard({ assignment }: AssignmentCardProps) {
  const user = useUserStore((state) => state.user);
  const setSelectedReadingAssignment = useReadingAssignmentStore(
    (state) => state.setSelectedReadingAssignment
  );
  const imageUrl = useGetCoverFromGDrive(assignment.cover);

  return (
    <View
      className="border-2 rounded-xl border-lightGray border-b-4 p-4 items-center flex-row"
      style={{ width: "100%" }}
    >
      <View>
        <Image
          source={{ uri: imageUrl }}
          resizeMode="contain"
          className="rounded-xl"
          alt="book for activity"
          style={{ width: 125, height: 125 }}
        />
      </View>
      <View className="flex-1">
        <Text className="font-bold">{assignment.title}</Text>
        <Text>{assignment.description}</Text>

        <TouchableOpacity
          className="w-[75%] bg-yellowOrange rounded-lg py-2 items-center mt-2 drop-shadow-custom"
          onPress={() => {
            setSelectedReadingAssignment(assignment);

            const routePath =
              user?.role === "Teacher"
                ? "/classroom/activity/teacherside"
                : "/classroom/activity/pupilside";

            router.push(routePath);
            // router.push(`/classroom/activity/${assignment.id}`)
          }}
        >
          <Text className="font-semibold">Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(AssignmentCard);
