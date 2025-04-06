import React from "react";
import { Stack } from "expo-router";

function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]/index" />
      <Stack.Screen name="[id]/read" />
    </Stack>
  );
}

export default RootLayout;
