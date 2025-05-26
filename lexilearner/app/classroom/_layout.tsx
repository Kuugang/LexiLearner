import { Stack } from "expo-router";
import { createContext, useState } from "react";

export default function ClassroomLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]/index" />
      <Stack.Screen name="[id]/studentslist" />
      <Stack.Screen name="createclassroom" />
      <Stack.Screen name="[id]/classroomsettings" />
      <Stack.Screen name="joinclassroom" />
    </Stack>
  );
}
