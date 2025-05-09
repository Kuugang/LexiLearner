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
import { ClassroomFormContext } from "../_layout";
import { useClassroomStore } from "@/stores/classroomStore";
import { TextArea } from "@/components/ui/textarea";

export default function ClassroomSettings() {
  // const [classroomName, setClassroomName] = useState("Grade 6 - F2");
  // const [pupilName, setPupilName] = useState("");
  // const { editClassroomForm, setEditClassroomForm } =
  //   useContext(ClassroomFormContext);

  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );
  const [editClassroomForm, setEditClassroomForm] = useState({
    name: selectedClassroom?.name,
    description: selectedClassroom?.description,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
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

          <Button className="my-2" onPress={() => {}}>
            <Text>Generate Classroom Report</Text>
          </Button>
        </ScrollView>
        <View className="p-5 absolute bottom-0  w-full">
          <Button className="bg-orange m-5 ">
            <Text>Delete Classroom</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
