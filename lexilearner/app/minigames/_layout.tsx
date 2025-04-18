import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function MinigamesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="wordhunt" />
      <Stack.Screen name="wordfromletters" />
      <Stack.Screen name="2truths1lie" />
      {/* <Stack.Screen name="fillintheblanks" />
      <Stack.Screen name="sentencearrangement" /> */}
    </Stack>
  );
}

const styles = StyleSheet.create({});
