import ClassroomHeader from "@/components/Classroom/ClassroomHeader";
import { ReadingAssignmentOverview } from "@/models/ReadingMaterialAssignment";
import { useClassroomStore } from "@/stores/classroomStore";
import React, { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useReadingAssignmentStore } from "@/stores/readingAssignmentStore";
import { useStories } from "@/services/ReadingMaterialService";
import { ReadingContentType } from "@/models/ReadingContent";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { useReadingContentStore } from "@/stores/readingContentStore";
import { StarsIcon, TimerIcon, Users2 } from "lucide-react-native";
import { useGetCoverFromGDrive } from "@/hooks/useExtractDriveFileId";

export default function activity() {
  const user = useUserStore((state) => state.user);
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );

  const selectedReadingAssignment = useReadingAssignmentStore(
    (state) => state.selectedReadingAssignment as ReadingAssignmentOverview
  );

  const { setSelectedContent } = useReadingContentStore();
  const { data: contents, isLoading: isStoriesLoading, error } = useStories();
  const selectedContent: ReadingContentType | undefined = contents?.find(
    (content) => content.id === selectedReadingAssignment?.readingMaterialId
  );
  const imageUrl = useGetCoverFromGDrive(selectedContent!.cover);

  useEffect(() => {
    if (selectedContent) {
      setSelectedContent(selectedContent);
    }
  }, [selectedContent]);

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
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
              source={{ uri: imageUrl }}
              className="w-[100px] h-[140px] rounded-lg flex-1"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-[24px] font-bold flex-wrap">
                {selectedContent!.title}
              </Text>
              <Text>{selectedReadingAssignment?.minigameType}</Text>
              <Text className="font-bold">
                Created at: {formatDate(selectedReadingAssignment.createdAt)}
              </Text>
              <Text className="font-bold text-lg text-red-500">
                {selectedReadingAssignment?.isActive == true
                  ? "ACTIVE"
                  : "NOT ACTIVE"}
              </Text>
            </View>
          </View>
          <View className="border-b border-lightGray my-8" />
          <View>
            <View>
              <Text className="font-bold text-[24px]">
                {selectedReadingAssignment.title}
              </Text>
              <Text className="text-[16px]">
                {selectedReadingAssignment.description}
              </Text>
            </View>
            <View className="my-6">
              <Text className="font-bold text-[24px]">Overview</Text>
              <Text className="flex-row items-center">
                {selectedReadingAssignment?.numberOfStudentsFinished}
                <View className="px-2">
                  <Users2 color="black" />
                </View>
                Students Finished
              </Text>

              <Text className="flex-row items-center">
                {selectedReadingAssignment?.averageScore}
                <View className="px-2">
                  <Users2 color="black" />
                </View>
                Average Score
              </Text>

              <Text className="flex-row items-center">
                {selectedReadingAssignment?.averageDuration}
                <View className="px-2">
                  <Users2 color="black" />
                </View>
                Average Duration
              </Text>
            </View>
          </View>
          <Button
            className="m-5 bg-yellowOrange border-2 rounded-xl border-lightGray my-4 border-b-4"
            onPress={() => router.push("/classroom/activity/activitysettings")}
          >
            <Text className="text-black font-semibold">Edit</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
