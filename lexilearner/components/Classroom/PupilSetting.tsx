import React from "react";
import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import BackHeader from "@/components/BackHeader";
import { router } from "expo-router";

type PupilSettingsProps = {
  selectedClassroom: any;
  setSelectedClassroom: (classroom: any) => void;
  leaveClassroomMutation: any;
};

export default function PupilSetting({
  selectedClassroom,
  setSelectedClassroom,
  leaveClassroomMutation,
}: PupilSettingsProps) {
  return (
    <View className="flex-1">
      <ScrollView className="bg-background p-8">
        <BackHeader />
        <View className="py-1">
          <Text className="text-[22px] text-center m-5 font-bold">
            Classroom
          </Text>
        </View>
        <View className="p-5 bottom-0 my-5">
          <Button
            className="m-5 bg-orange"
            onPress={async () => {
              if (selectedClassroom?.id) {
                try {
                  await leaveClassroomMutation({
                    classroomId: selectedClassroom?.id,
                  });
                  setSelectedClassroom(null);
                  router.replace("/classroom");
                } catch (error) {
                  console.error("Error leaving classroom:", error);
                }
              }
            }}
          >
            <Text className="text-black font-semibold">Leave Classroom</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
