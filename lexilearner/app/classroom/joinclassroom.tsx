import BackHeader from "@/components/BackHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { View, Image, TouchableOpacity, Text, ScrollView } from "react-native";

export default function JoinClassroom() {
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
            ></Input>
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
