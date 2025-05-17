import BackHeader from "@/components/BackHeader";
import BookCard from "@/components/Classroom/BookCard";
import {
  SetMinigameDropdown,
  AddReadingAssignment,
} from "@/components/Classroom/MainClassroomBtns";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { useClassroomStore } from "@/stores/classroomStore";
import { useReadingAssignmentStore } from "@/stores/readingAssignmentStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { PaperProvider } from "react-native-paper";
import { Button } from "@/components/ui/button";
import { useReadingContentStore } from "@/stores/readingContentStore";
import { ReadingAssignment } from "@/models/ReadingMaterialAssignment";
import { MinigameType } from "@/models/Minigame";
import { useUpdateReadingAssignment } from "@/services/ReadingAssignment";
import { useGetReadingMaterialById } from "@/services/ReadingMaterialService";

export default function activitysettings() {
  const selectedReadingAssignment = useReadingAssignmentStore(
    (state) => state.selectedReadingAssignment
  );
  const setSelectedReadingAssignment = useReadingAssignmentStore(
    (state) => state.setSelectedReadingAssignment
  );
  const [selectedMinigameType, setSelectedMinigameType] = useState(
    MinigameType.TwoTruthsOneLie
  );
  const { selectedContent, setSelectedContent } = useReadingContentStore();

  const { mutateAsync: updateReadingAssignment } = useUpdateReadingAssignment();

  const [editActivityForm, setEditActivityForm] =
    useState<ReadingAssignment | null>(null);

  // needed. selectedReadingAssignment could change values (like choosing a different assignment)
  // useState only runs once, ignores future and dynamic changes. so OA (ga useState(selecreadingassign) ko before)
  // to ensure the state is concurrent with the sra, we use useeffect with sra as its dependency
  // yes po gi comment ko ni wa nako kasabot aning async bullshit fuckshit
  // TODO: erase comments kay profanity smile
  useEffect(() => {
    if (selectedReadingAssignment) {
      setEditActivityForm(selectedReadingAssignment);
    }
  }, [selectedReadingAssignment]);

  if (!editActivityForm || !selectedContent) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View className="flex-1">
        <ScrollView>
          <View className="p-8">
            <BackHeader />
            <View className="py-8">
              <Text className="text-[22px] font-bold">Create New Activity</Text>

              <View className="flex justify-center items-center mt-4">
                <BookCard book={selectedContent} />
              </View>

              <View className="py-4">
                <AddReadingAssignment />
              </View>

              <Input
                placeholder="Title..."
                className="my-3"
                value={editActivityForm.title}
                onChangeText={(title: string) => {
                  setEditActivityForm({
                    ...editActivityForm,
                    title,
                  });
                }}
              />

              <TextArea
                placeholder="Description..."
                value={editActivityForm.description}
                onChangeText={(description: string) => {
                  setEditActivityForm({
                    ...editActivityForm,
                    description,
                  });
                }}
              />

              <View className="py-4">
                <SetMinigameDropdown
                  selected={selectedMinigameType}
                  setSelected={setSelectedMinigameType}
                />
              </View>

              <Button
                className="bg-yellowOrange m-5 shadow-main"
                disabled={
                  !editActivityForm.title.trim() ||
                  !editActivityForm.description.trim()
                }
                onPress={async () => {
                  try {
                    await updateReadingAssignment({
                      readingAssignment: editActivityForm,
                    });
                    setSelectedReadingAssignment(editActivityForm);
                    router.back();
                  } catch (error: any) {
                    console.error("Failed to edit activity", error);
                  }
                }}
              >
                <Text>Finish</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}
