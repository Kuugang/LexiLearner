import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinClassroom as apiJoinClassroom } from "@/services/ClassroomService";
import { useClassroomStore } from "@/stores/classroomStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, ScrollView } from "react-native";

export default function JoinClassroom() {
  const [joinCode, setJoinCode] = useState("");
  const setSelectedClassroom = useClassroomStore(
    (state) => state.setSelectedClassroom
  );

  const queryClient = useQueryClient();
  const { mutateAsync: joinClassroomMutation } = useMutation({
    mutationFn: apiJoinClassroom,
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
            <Text className="font-bold text-[22px]">Join Classroom</Text>
            <Input
              placeholder="Enter Classroom Code..."
              className="my-3"
              value={joinCode}
              onChangeText={(joinCode) => {
                setJoinCode(joinCode);
              }}
            ></Input>
          </View>
        </View>
      </ScrollView>

      <View className="p-5">
        <Button
          className="bg-yellowOrange m-5 mb-24 shadow-main"
          onPress={async () => {
            try {
              const response = await joinClassroomMutation(joinCode);
              const classroom = response.data;

              setSelectedClassroom(classroom);
              router.replace(`/classroom/${classroom.id}`);
            } catch (error) {
              console.error("Error joining classroom:", error);
            }
          }}
        >
          <Text>Finish</Text>
        </Button>
      </View>
    </View>
  );
}
