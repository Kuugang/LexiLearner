import ClassroomHeader from "@/components/Classroom/ClassroomHeader";
import { Button } from "@/components/ui/button";
import { ReadingContentType } from "@/models/ReadingContent";
import {
  useGetReadingMaterialById,
  useStories,
} from "@/services/ReadingMaterialService";
import { useClassroomStore } from "@/stores/classroomStore";
import { useReadingAssignmentStore } from "@/stores/readingAssignmentStore";
import { useReadingContentStore } from "@/stores/readingContentStore";
import { router, useLocalSearchParams } from "expo-router";
import { StarsIcon, Users2 } from "lucide-react-native";
import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

export default function activity() {
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );
  const selectedReadingAssignment = useReadingAssignmentStore(
    (state) => state.selectedReadingAssignment
  );
  const { data: contents, isLoading: isStoriesLoading, error } = useStories();
  const content: ReadingContentType | undefined = contents?.find(
    (content) => content.id === selectedReadingAssignment?.readingMaterialId
  );

  const { selectedContent, setSelectedContent } = useReadingContentStore();
  setSelectedContent(content!); // mo hope lng ko nga permi ni defined

  if (!selectedReadingAssignment || isStoriesLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

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
              source={require("@/assets/images/land-of-stories.png")}
              className="h-2xs w-2xs rounded-lg"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-[24px] font-bold flex-wrap">
                {selectedContent!.title}
              </Text>
              <Text className="font-bold">
                Created at: {formatDate(selectedReadingAssignment.createdAt)}
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
              <Text>
                18{<Users2 color="black" className="mx-4" />} Students Finished
              </Text>
              <Text>
                7.5{<StarsIcon color="black" className="mx-4" />}Average Score
              </Text>
            </View>
          </View>

          <Button
            className="m-5 bg-yellowOrange"
            onPress={() => router.push("/classroom/activity/activitysettings")}
          >
            <Text className="text-black font-semibold">Edit</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
