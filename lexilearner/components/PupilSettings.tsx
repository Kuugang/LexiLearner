import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { leaveClassroom as apiLeaveClassroom } from "@/services/ClassroomService";
import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";
import BackHeader from "./BackHeader";
import { Button } from "@/components/ui/button";
import { useClassroomStore } from "@/stores/classroomStore";
import { router } from "expo-router";

export default function PupilSettings() {
  const queryClient = useQueryClient();
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );
  const setSelectedClassroom = useClassroomStore(
    (state) => state.setSelectedClassroom
  );

  const { mutateAsync: leaveClassroomMutation } = useMutation({
    mutationFn: ({ classroomId }: { classroomId: string }) =>
      apiLeaveClassroom(classroomId),
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
            <Text>Leave Classroom</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
