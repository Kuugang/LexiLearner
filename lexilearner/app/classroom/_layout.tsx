import { Stack } from "expo-router";
import { createContext, useState } from "react";

export default function ClassroomLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/studentslist" />
      <Stack.Screen name="createclassroom" />
      <Stack.Screen name="classroomsettings" />
      <Stack.Screen name="joinclassroom" />
    </Stack>
  );
}
