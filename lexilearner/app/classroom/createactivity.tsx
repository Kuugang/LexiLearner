import BackHeader from "@/components/BackHeader";
import SetMinigameDropdown, {
  AddReadingAssignment,
} from "@/components/Classroom/MainClassroomBtns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, Text, ScrollView } from "react-native";
import BookCard from "@/components/Classroom/BookCard";
import { useReadingContentStore } from "@/stores/readingContentStore";
import { MinigameType } from "@/models/Minigame";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReadingAssignment } from "@/services/ClassroomService";
import { useClassroomStore } from "@/stores/classroomStore";

export default function createactivity() {
  const { selectedContent, setSelectedContent } = useReadingContentStore();
  const { selectedClassroom } = useClassroomStore();

  // set selectedContent to null when the component starts
  useEffect(() => {
    setSelectedContent(null);
  }, []);

  useEffect(() => {
    if (!selectedClassroom) {
      // Redirect to classroom selection or home page
      router.replace("/classroom");
    }
  }, [selectedClassroom]);

  const [selectedMinigameType, setSelectedMinigameType] = useState(
    MinigameType.TwoTruthsOneLie
  ); // or your default

  const queryClient = useQueryClient();
  const [readingAssignmentForm, setReadingAssignmentForm] = useState({
    title: "",
    description: "",
    minigameType: selectedMinigameType,
    readingMaterialId: selectedContent?.id,
  });

  const { mutateAsync: createReadingAssignmentMutation } = useMutation({
    mutationFn: createReadingAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activeReadingAssignments", selectedClassroom!.id],
      });
    },
  });

  return (
    <View className="flex-1">
      <ScrollView>
        <View className="p-8">
          <BackHeader />
          <View className="py-8">
            <Text className="text-[22px] font-bold">Create New Activity</Text>
            <View className="flex justify-center items-center mt-4">
              {selectedContent && <BookCard book={selectedContent} />}
            </View>

            <View className="py-4">
              <AddReadingAssignment />
            </View>

            <Input
              placeholder="Title..."
              className="my-3"
              value={readingAssignmentForm.title}
              onChangeText={(title: string) => {
                setReadingAssignmentForm({
                  ...readingAssignmentForm,
                  title: title,
                });
              }}
            ></Input>

            <TextArea
              placeholder="Description..."
              value={readingAssignmentForm.description}
              onChangeText={(description: string) => {
                setReadingAssignmentForm({
                  ...readingAssignmentForm,
                  description: description,
                });
              }}
            ></TextArea>

            <View className="py-4">
              <SetMinigameDropdown
                selected={selectedMinigameType}
                setSelected={setSelectedMinigameType}
              />
            </View>

            <Button
              className="bg-yellowOrange m-5 shadow-main"
              disabled={
                !selectedContent ||
                !readingAssignmentForm.title.trim() ||
                !readingAssignmentForm.description.trim()
              }
              //   onPress={() => router.push("/minigames/results/recommendation")}
              onPress={async () => {
                try {
                  readingAssignmentForm.readingMaterialId = selectedContent!.id;

                  const response = await createReadingAssignmentMutation({
                    classroomId: selectedClassroom!.id,
                    readingAssignmentForm: readingAssignmentForm,
                  });
                  const readingAssignment = response.data;

                  console.log("Created Reading Assignment:", readingAssignment);
                  // router.replace(
                  //   `/classroom/${readingAssignment.classroomId}/activity/${readingAssignment.id}`
                  // );
                  router.dismiss();
                  router.replace(`/classroom/${selectedClassroom!.id}`);

                  setSelectedContent(null);
                } catch (error) {
                  console.error("Error creating activity:", error);
                }
              }}
            >
              <Text>Finish</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
