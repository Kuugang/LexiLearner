import ClassroomHeader from "@/components/Classroom/ClassroomHeader";
import { useClassroomStore } from "@/stores/classroomStore";
import React from "react";
import { useUserStore } from "@/stores/userStore";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useReadingAssignmentStore } from "@/stores/readingAssignmentStore";

export default function activity() {
  const user = useUserStore((state) => state.user);
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );

  const selectedReadingAssignment = useReadingAssignmentStore(
    (state) => state.selectedReadingAssignment
  );

  const setSelectedReadingAssignment = useReadingAssignmentStore(
    (state) => state.setSelectedReadingAssignment
  );

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
              className="flex-1 rounded-lg"
              style={{ width: 100, height: 140 }}
              resizeMode="contain"
            />
            <View className="flex flex-col">
              <Text
                className="font-bold text-lg"
                style={{ wordWrap: "break-word" }}
              >
                {selectedReadingAssignment?.title}
              </Text>
              <Text style={{ wordWrap: "break-word" }}>
                Created at: {selectedReadingAssignment?.createdAt.split("T")[0]}
              </Text>
            </View>
          </View>
          <View className="border-b border-gray-200 my-3" />
          <View>
            <Text className="font-bold text-lg">
              {selectedReadingAssignment?.title}
            </Text>
            <Text>{selectedReadingAssignment?.description}</Text>
            <Text className="font-bold text-lg text-red-500">
              {selectedReadingAssignment?.isActive == true
                ? "ACTIVE"
                : "NOT ACTIVE"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
