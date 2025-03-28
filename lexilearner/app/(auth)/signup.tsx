import React from "react";

import SignUp1 from "@/components/Auth/SignUp1";
import { ScrollView, ToastAndroid, View } from "react-native";

export default function Step1() {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <SignUp1 />
    </ScrollView>
  );
}
