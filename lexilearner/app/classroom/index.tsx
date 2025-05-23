import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View, Image } from "react-native";
import {
  JoinClassroomBtn,
  NewClassroomBtn,
} from "../../components/Classroom/MainClassroomBtns";
import ClassroomCard from "../../components/Classroom/ClassroomCard";
import { getByRoleId as apiGetRoleById } from "@/services/ClassroomService";
import { useEffect, useState } from "react";
import { useClassroomStore } from "@/stores/classroomStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/userStore";
import LoadingScreen from "@/components/LoadingScreen";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

const extractArrayFromResponse = (data: any): any[] => {
  if (!data) return [];

  if (data.data && data.data.$values) return data.data.$values;

  if (data.$values) return data.$values;

  if (Array.isArray(data)) return data;

  if (data.data && Array.isArray(data.data)) return data.data;

  console.warn("Could not extract array from response:", data);
  return [];
};

export default function ClassroomScreen() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({
        queryKey: ["classroomsData", user?.role],
      });
    }, [user?.role])
  );

  const {
    data: classrooms,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => apiGetRoleById(user?.role || ""),
    queryKey: ["classroomsData", user?.role],
    enabled: !!user?.role,
  });

  if (isLoading) {
    return (
      <LoadingScreen visible={isLoading} overlay={true} message="Loading..." />
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error fetching classrooms</Text>
      </View>
    );
  }

  const classroomArray = extractArrayFromResponse(classrooms);

  return (
    <ScrollView className="bg-white">
      <View>
        <View className="h-[150px] w-full rounded-bl-[40px] bg-yellowOrange p-4">
          <View className="flex-row items-center justify-between px-4 h-full">
            <Text className="text-[22px] font-bold leading-tight">
              Your{"\n"}Classrooms
            </Text>

            <Image
              source={require("@/assets/images/Juicy/Office-desk.png")}
              resizeMode="contain"
              className="h-64 w-64"
            />
          </View>
        </View>

        <View className="p-8">
          {user?.role === "Teacher" ? (
            <NewClassroomBtn />
          ) : (
            <JoinClassroomBtn />
          )}
          {Array.isArray(classroomArray) && classroomArray.length > 0 ? (
            classroomArray.map((item) => (
              <ClassroomCard key={item.id} classroom={item} />
            ))
          ) : (
            <Text className="text-center mt-4">No classrooms found</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
