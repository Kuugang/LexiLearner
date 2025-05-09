import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View, Image } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import BackHeader from "@/components/BackHeader";
import {
  Activity,
  AddActivity,
} from "../../../components/Classroom/MainClassroomBtns";
import { Settings, SettingsIcon, Users, UsersIcon } from "lucide-react-native";
import ClassroomHeader from "@/components/Classroom/ClassroomHeader";
import { useClassroomStore } from "@/stores/classroomStore";

export default function CurrentClassroom() {
  const params = useLocalSearchParams<{ id: string }>();
  // selectedClassroom()
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );
  console.log("SELECTED CLASSROOM:", selectedClassroom?.id);

  return (
    <ScrollView>
      <View>
        <ClassroomHeader name="" joinCode="" />
        <View className="p-8">
          <Text>id:{params.id}</Text>
          <View className="items-center justify-between flex-row w-full">
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="font-bold text-[22px]">Activities</Text>

              <View className="flex flex-row space-x-4 items-center">
                <View className="mx-3">
                  <UsersIcon color="black" />
                </View>
                <SettingsIcon
                  color="black"
                  onPress={() => {
                    router.push(`/classroom/${params.id}/classroomsettings`);
                  }}
                />
              </View>
            </View>

            <View className="flex-row">
              <Users
                className="mx-2"
                onPress={() => {
                  router.push(`/classroom/${params.id}/studentslist`);
                }}
              />
              <Settings />
            </View>
          </View>
          <AddActivity />
          <Activity />
          <Activity />
          {/* <StudentDisplay />
            <StudentLeaderboardDisplay /> */}
        </View>
      </View>
    </ScrollView>
  );
}
