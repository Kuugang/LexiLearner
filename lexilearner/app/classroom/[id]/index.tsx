import { Text } from "@/components/ui/text";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import BackHeader from "@/components/BackHeader";
import {
  Activity,
  AddActivity,
} from "../../../components/Classroom/MainClassroomBtns";
import {
  BookOpenIcon,
  Settings,
  SettingsIcon,
  Users,
  UsersIcon,
} from "lucide-react-native";
import ClassroomHeader from "@/components/Classroom/ClassroomHeader";
import { useClassroomStore } from "@/stores/classroomStore";
import { useUserStore } from "@/stores/userStore";
import { useReadingAssignmentStore } from "@/stores/readingAssignmentStore";
import { useActiveReadingAssignments } from "@/services/ClassroomService";
import AssignmentCard from "@/components/Classroom/AssignmentCard";

export default function CurrentClassroom() {
  const params = useLocalSearchParams<{ id: string }>();
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );
  const user = useUserStore((state) => state.user);
  console.log("SELECTED CLASSROOM:", selectedClassroom?.id);

  const setReadingAssignments = useReadingAssignmentStore(
    (state) => state.setReadingAssignments
  );
  const { data: readingAssignments, isLoading: isReadingAssignmentsLoading, refetch: refetchAssignments } =
    useActiveReadingAssignments(selectedClassroom?.id || "");

  useFocusEffect(
    useCallback(() => {
      refetchAssignments();
    }, [selectedClassroom?.id])
  );

  useEffect(() => {
    if (readingAssignments) {
      setReadingAssignments(readingAssignments);
      console.log("READING ASSIGNMENTS:", readingAssignments);
    }
  }, [readingAssignments, setReadingAssignments]);

  return (
    <ScrollView>
      <View>
        <ClassroomHeader
          name={`${selectedClassroom?.name}`}
          joinCode={`${selectedClassroom?.joinCode}`}
        />
        <View className="p-8">
          {/* <Text>id:{params.id}</Text> */}
          <View className="items-center justify-between flex-row w-full">
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="font-bold text-[22px]">Activities</Text>

              <View className="flex flex-row space-x-4 items-center gap-2">
                <View className="mx-3">
                  <UsersIcon
                    color="black"
                    onPress={() =>
                      router.push(`/classroom/${params.id}/studentslist`)
                    }
                  />
                </View>
                <SettingsIcon
                  color="black"
                  onPress={() => {
                    router.push(`/classroom/${params.id}/classroomsettings`);
                  }}
                />
              </View>
            </View>
          </View>
          {user?.role === "Teacher" ? <AddActivity /> : null}
          {isReadingAssignmentsLoading && (
            <View className="flex-1 justify-center items-center">
              <Text>Loading activities...</Text>
            </View>
          )}
          {!isReadingAssignmentsLoading &&
          readingAssignments &&
          readingAssignments!.length > 0 ? (
            <View className="flex flex-col gap-4">
              {readingAssignments!.map((item) => (
                <AssignmentCard key={item.id} assignment={item} />
              ))}
            </View>
          ) : (
            !isReadingAssignmentsLoading && (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500">No activities available.</Text>
              </View>
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
}
