import ClassroomHeader from "@/components/Classroom/ClassroomHeader";
import { ReadingAssignment } from "@/models/ReadingMaterialAssignment";
import { useGetReadingAssignmentById } from "@/services/ClassroomService";
import { useClassroomStore } from "@/stores/classroomStore";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

export default function activity() {
  const params = useLocalSearchParams<{ activityId: string }>();
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );
  const { data: activity, isLoading } = useGetReadingAssignmentById(
    params.activityId
  );
  console.log("ACTIVISFIT", activity);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View>
        <ClassroomHeader
          name={`${selectedClassroom?.name}`}
          joinCode={`${selectedClassroom?.joinCode}`}
        />
        <View className="p-8">
          <View className="flex flex-row">
            <Image
              source={require("@/assets/images/land-of-stories.png")}
              className="h-[100px] flex-1 rounded-lg"
              resizeMode="cover"
            />
            <Text className="font-bold">Created at: {activity.createdAt}</Text>
          </View>
          <View className="border-b border-gray-200 my-3" />
          <View>
            <Text className="font-bold text-lg">{activity.title}</Text>
            <Text>{activity.description}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
