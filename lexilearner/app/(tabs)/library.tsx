import BackHeader from "@/components/BackHeader";
import React from "react";
import { ScrollView, View } from "react-native";

function library() {
  return (
    <ScrollView className="bg-background">
      <View>
        <View className="flex flex-row justify-between">
          <BackHeader />
        </View>
      </View>
    </ScrollView>
  );
}

export default library;
