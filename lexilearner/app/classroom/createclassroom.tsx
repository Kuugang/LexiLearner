import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { router } from "expo-router";
import React from "react";
import { View, Image, TouchableOpacity, Text, ScrollView } from "react-native";
import { Input } from "~/components/ui/input";

export default function CreateClassroom() {
  return (
    <View className="flex-1">
      <ScrollView className="p-8">
        <View>
          <BackHeader />
          <View className="py-8">
            <Text className="font-bold text-[22px]">Create Classroom</Text>
            <Input placeholder="Classroom Name..." className="my-3"></Input>
            <TextArea placeholder="Classroom Description..."></TextArea>
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
