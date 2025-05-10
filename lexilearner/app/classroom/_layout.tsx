import { Stack } from "expo-router";
import { createContext, useState } from "react";

interface ClassroomFormContextType {
  createClassroomForm: Record<string, any>;
  setCreateClassroomForm: React.Dispatch<
    React.SetStateAction<Record<string, any>>
  >;
  editClassroomForm: Record<string, any>;
  setEditClassroomForm: React.Dispatch<
    React.SetStateAction<Record<string, any>>
  >;
}

export const ClassroomFormContext =
  createContext<ClassroomFormContextType | null>(null);

export default function ClassroomLayout() {
  const [createClassroomForm, setCreateClassroomForm] = useState<
    Record<string, any>
  >({
    Name: "test name",
    Description: "test descriptsion",
  });
  const [editClassroomForm, setEditClassroomForm] = useState<
    Record<string, any>
  >({
    Name: "Grade 6 - F2",
    Description: "Welcome to Grade 6 - F2",
  });

  return (
    <ClassroomFormContext.Provider
      value={{
        createClassroomForm,
        setCreateClassroomForm,
        editClassroomForm,
        setEditClassroomForm,
      }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[id]" />
        <Stack.Screen name="[id]/studentslist" />
        <Stack.Screen name="[id]/createclassroom" />
        <Stack.Screen name="classroomsettings" />
        <Stack.Screen name="joinclassroom" />
      </Stack>
    </ClassroomFormContext.Provider>
  );
}
