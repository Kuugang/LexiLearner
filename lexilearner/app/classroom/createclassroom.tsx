import BackHeader from "@/components/BackHeader";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { router } from "expo-router";
import { View, Image, TouchableOpacity, Text, ScrollView } from "react-native";
import { Input } from "~/components/ui/input";
import { ClassroomFormContext } from "./_layout";
import { Description } from "@rn-primitives/dialog";
import { useClassroomStore } from "@/stores/classroomStore";

export default function CreateClassroom() {
  const { createClassroomForm, setCreateClassroomForm } =
    useContext(ClassroomFormContext);
  const createClassroom = useClassroomStore((state) => state.createClassroom);

  //TODO: NGANONG RED MAN KA murag naa pani better way gangshyts
  const handleCreateClassroom = async () => {
    let response = await createClassroom(createClassroomForm);
    router.push(`/classroom/${response.data.id}`);
  };

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
              value={createClassroomForm.Name}
              onChangeText={(value: string) =>
                setCreateClassroomForm({ ...createClassroomForm, Name: value })
              }
            ></Input>
            <TextArea
              placeholder="Classroom Description..."
              value={createClassroomForm.Description}
              onChangeText={(value: string) =>
                setCreateClassroomForm({
                  ...createClassroomForm,
                  Description: value,
                })
              }
            ></TextArea>
          </View>
        </View>
      </ScrollView>

      <View className="p-5">
        <Button
          className="bg-yellowOrange m-5 mb-24 shadow-main"
          onPress={handleCreateClassroom}
        >
          <Text>Finish</Text>
        </Button>
      </View>
    </View>
  );
}
