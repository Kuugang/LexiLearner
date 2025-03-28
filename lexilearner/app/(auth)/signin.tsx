import React from "react";
import { Text } from "@/components/ui/text";
import { StyleSheet, View } from "react-native";
import Login from "@/components/Auth/Login";

const SignIn = () => {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(SignIn);
