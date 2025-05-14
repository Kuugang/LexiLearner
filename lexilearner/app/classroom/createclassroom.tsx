import BackHeader from "@/components/BackHeader";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { router } from "expo-router";
import { View, Image, TouchableOpacity, Text, ScrollView } from "react-native";
import { Input } from "~/components/ui/input";
import { Description } from "@rn-primitives/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClassroom } from "@/services/ClassroomService";
import { useClassroomStore } from "@/stores/classroomStore";

export default function CreateClassroom() {
  console.log("hmmmmm?");
  const setSelectedClassroom = useClassroomStore(
    (state) => state.setSelectedClassroom
  );

  const queryClient = useQueryClient();
  const [classroomForm, setClassroomForm] = useState({
    name: "",
    description: "",
  });

  const { mutateAsync: createClassroomMutation } = useMutation({
    mutationFn: createClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classroomsData"] });
    },
  });

  return (
    <View className="flex-1">
      <ScrollView className="p-8">
        <View>
          <BackHeader />
          <View className="py-8">
            <Text className="font-bold text-[22px]">Create Classroom</Text>
            <Input
              placeholder="Classroom Name..."
              className="my-3"
              value={classroomForm.name}
              onChangeText={(name: string) => {
                setClassroomForm({ ...classroomForm, name: name });
              }}
            ></Input>
            <TextArea
              placeholder="Classroom Description..."
              className="my-3"
              value={classroomForm.description}
              onChangeText={(desc: string) => {
                setClassroomForm({ ...classroomForm, description: desc });
              }}
            ></TextArea>
          </View>
        </View>
      </ScrollView>

      <View className="p-5">
        <Button
          className="bg-yellowOrange m-5 mb-24 shadow-main"
          onPress={async () => {
            try {
              const response = await createClassroomMutation(classroomForm);
              const classroom = response.data;

              setSelectedClassroom(classroom);
              router.replace(`/classroom/${classroom.id}`);
            } catch (error) {
              console.error("Error creating classroom:", error);
            }
          }}
        >
          <Text>Finish</Text>
        </Button>
      </View>
    </View>
  );
}
