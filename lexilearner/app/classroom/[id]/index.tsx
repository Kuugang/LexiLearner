import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import BackHeader from "@/components/BackHeader";
import { Activity, AddActivity } from "../../../components/MainClassroomBtns";
import { Settings, Users } from "lucide-react-native";

export default function ClassroomScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  return (
    <ScrollView>
      <View>
        <BackHeader />
        <View>
          <View
            style={{
              height: 150,
              width: "100%",
              borderBottomLeftRadius: "30px",
            }}
            className="bg-yellow-500 p-4"
          >
            <Text className="font-bold">Grade 6 - F2</Text>
            x5AhYyj
          </View>

          <View className="p-8">
            <Text>id:{params.id}</Text>
            <View className="items-center justify-between flex-row">
              <Text className="font-bold">Activities</Text>
              <View className="flex-row">
                <Users
                  className="mx-2"
                  onPress={() => {
                    router.push(`classroom/${params.id}/studentslist`);
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
      </View>
    </ScrollView>
  );
}
