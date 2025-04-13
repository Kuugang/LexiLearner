import React from "react";
import { ScrollView } from "react-native";
import Login from "@/components/Auth/Login";

const SignIn = () => {
  return (
    <ScrollView className="bg-background">
      <Login />
    </ScrollView>
  );
};

export default React.memo(SignIn);
