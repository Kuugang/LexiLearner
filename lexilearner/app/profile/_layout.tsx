import React from "react";
import { Stack } from "expo-router";

function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="/settings" />
      <Stack.Screen name="/achievementslist" />
      <Stack.Screen name="/changepassword" />
    </Stack>
  );
}

export default RootLayout;
