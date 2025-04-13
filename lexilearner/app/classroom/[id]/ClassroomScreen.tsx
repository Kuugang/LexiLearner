import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useLocalSearchParams } from "expo-router";
import BackHeader from "@/components/BackHeader";
import ClassroomHeader from "../ClassroomHeader";
import { StudentDisplay, StudentLeaderboardDisplay } from "../StudentDisplay";
import { Activity, AddActivity } from "../MainClassroomBtns";

export default function ClassroomScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  return (
    <ScrollView>
      <View>
        <BackHeader />
        <View>
          <ClassroomHeader />
          <View className="p-8">
            <Text>id:{params.id}</Text>
            <AddActivity />
            <Activity />
            <Activity />
            <StudentDisplay />
            <StudentLeaderboardDisplay />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
