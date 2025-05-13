import BackHeader from "@/components/BackHeader";
import { AddReadingAssignment } from "@/components/Classroom/MainClassroomBtns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import React from "react";
import { View, Image, TouchableOpacity, Text, ScrollView } from "react-native";

export default function createactivity() {
  return (
    <View className="flex-1">
      <ScrollView>
        <View className="p-8">
          <BackHeader />
          <View className="py-8">
            <Text className="text-[22px] font-bold">Create Activity</Text>
            <View className="py-4">
              <AddReadingAssignment />
            </View>
            <Input placeholder="Title..." className="my-3"></Input>
            <TextArea placeholder="Description..."></TextArea>
          </View>
        </View>
      </ScrollView>
      <View className="p-5">
        <Button
          className="bg-yellowOrange m-5 mb-24 shadow-main"
          //   onPress={() => router.push("/minigames/results/recommendation")}
        >
          <Text>Finish</Text>
        </Button>
      </View>
    </View>
  );
}
