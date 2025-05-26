import { Text } from "@/components/ui/text";
import { ScrollView, View, Image } from "react-native";
import {
  JoinClassroomBtn,
  NewClassroomBtn,
} from "../../components/Classroom/MainClassroomBtns";
import ClassroomCard from "../../components/Classroom/ClassroomCard";
import { useGetClassroomsByRole } from "@/services/ClassroomService";
import { useUserStore } from "@/stores/userStore";
import LoadingScreen from "@/components/LoadingScreen";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function ClassroomScreen() {
  const user = useUserStore((state) => state.user);

  const {
    data: classrooms,
    isLoading,
    isError,
    refetch: refetchClassrooms,
  } = useGetClassroomsByRole(user?.role ?? "Pupil");

  useFocusEffect(
    useCallback(() => {
      refetchClassrooms();
    }, [user?.role, refetchClassrooms])
  );

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
          {!isLoading &&
          classrooms &&
          Array.isArray(classrooms) &&
          classrooms.length > 0 ? (
            classrooms.map((item) => (
              <ClassroomCard key={item.id} classroom={{ ...item }} />
            ))
          ) : (
            <Text className="text-center mt-4">No classrooms found</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
