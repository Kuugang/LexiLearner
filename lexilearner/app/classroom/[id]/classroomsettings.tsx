import React, { useContext, useState } from "react";
import { Text } from "@/components/ui/text";
import {
  ScrollView,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button } from "@/components/ui/button";
import BackHeader from "@/components/BackHeader";
import { Input } from "@/components/ui/input";
import { useClassroomStore } from "@/stores/classroomStore";
import { TextArea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editClassroom as apiEditClassroom,
  deleteClassroom as apiDeleteClassroom,
} from "@/services/ClassroomService";
import { router } from "expo-router";

export default function ClassroomSettings() {
  const queryClient = useQueryClient();
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );
  const setSelectedClassroom = useClassroomStore(
    (state) => state.setSelectedClassroom
  );

  const [editClassroomForm, setEditClassroomForm] = useState({
    name: selectedClassroom?.name || "",
    description: selectedClassroom?.description || "",
  });

  const { mutateAsync: editClassroomMutation } = useMutation({
    mutationFn: ({
      classroomForm,
      classroomId,
    }: {
      classroomForm: Record<string, any>;
      classroomId: string;
    }) => apiEditClassroom(classroomForm, classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classroomsData"] });
    },
  });

  const { mutateAsync: deleteClassroomMutation } = useMutation({
    mutationFn: ({ classroomId }: { classroomId: string }) =>
      apiDeleteClassroom(classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classroomsData"] });
    },
  });

  return (
    <View className="flex-1">
      <ScrollView className="bg-background p-8">
        <BackHeader />

        <View className="py-1">
          <Text className="text-[22px] text-center m-5 font-bold">
            Classroom
          </Text>
          <Text className="font-bold">Classroom Name</Text>
          <View>
            <Input
              className="border border-gray-300 rounded-md p-2 mt-2"
              placeholder={editClassroomForm.name}
              value={editClassroomForm.name}
              onChangeText={(value: string) =>
                setEditClassroomForm({ ...editClassroomForm, name: value })
              }
            />
          </View>
        </View>
        <TextArea
          placeholder="Classroom Description..."
          value={editClassroomForm.description}
          onChangeText={(value: string) =>
            setEditClassroomForm({
              ...editClassroomForm,
              description: value,
            })
          }
        ></TextArea>

        <View className="py-1">
          <Text className="font-bold">Add Pupil</Text>
          <Input
            className="border border-gray-300 rounded-md p-2 mt-2"
            placeholder="Type pupil name..."
            // value={pupilName}
            // onChangeText={setPupilName}
          />
        </View>
        <View className="p-5 bottom-0">
          <Button className="m-5" onPress={() => {}}>
            <Text>Generate Classroom Report</Text>
          </Button>
          <Button
            className="mx-5"
            onPress={async () => {
              if (selectedClassroom?.id) {
                try {
                  await editClassroomMutation({
                    classroomForm: editClassroomForm,
                    classroomId: selectedClassroom.id,
                  });

                  setSelectedClassroom({
                    ...selectedClassroom,
                    ...editClassroomForm,
                  });

                  router.back();
                  console.log("Classroom edited successfully");
                } catch (error) {
                  console.error("Error editing classroom:", error);
                }
              } else {
                console.error("Classroom ID is not available");
              }
            }}
          >
            <Text>Edit Classroom</Text>
          </Button>
          <Button
            className="bg-orange m-5"
            onPress={async () => {
              if (selectedClassroom?.id) {
                try {
                  await deleteClassroomMutation({
                    classroomId: selectedClassroom.id,
                  });
                  setSelectedClassroom(null);
                  router.push("/classroom");
                } catch (error) {
                  console.error("Error deleting classroom:", error);
                }
              }
            }}
          >
            <Text>Delete Classroom</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
