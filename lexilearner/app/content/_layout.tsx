import React from "react";
import { Stack } from "expo-router";

function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="/read/[id]" />
    </Stack>
  );
}

export default RootLayout;
