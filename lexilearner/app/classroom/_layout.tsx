import { Stack } from "expo-router";

export default function ClassroomLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/studentslist" />
    </Stack>
  );
}
