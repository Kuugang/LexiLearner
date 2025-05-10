import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View, Image } from "react-native";
import { NewClassroomBtn } from "../../components/Classroom/MainClassroomBtns";
import ClassroomCard from "../../components/Classroom/ClassroomCard";
import { getByTeacherId as apiGetByTeacherId } from "@/services/ClassroomService";
import { useEffect, useState } from "react";
import { useClassroomStore } from "@/stores/classroomStore";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function ClassroomScreen() {
  console.log("RERENDER TEST HAHAHA");
  const classroom = useClassroomStore((state) => state.classrooms);
  const setClassroom = useClassroomStore((state) => state.setClassrooms);

  // useEffect(() => {
  //   const fetchClassrooms = async () => {
  //     const response = await apiGetByTeacherId();
  //     setClassroom(response.data);
  //   };

  //   fetchClassrooms();
  // }, [classroom, setClassroom]);

  const {
    data: classrooms,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["classroomsData"], queryFn: apiGetByTeacherId });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error fetching classrooms</Text>
      </View>
    );
  }

  setClassroom(classrooms?.data);

  // TODO: updateclassroom shit asjdhkj taga add mo add sa list React-Query

  // const mutation = useMutation({
  //   mutationFn: apiGetByTeacherId,
  //   onSuccess: (data) => {
  //     setClassroom(data.data);
  //   },
  // });

  return (
    <ScrollView className="bg-white">
      <View>
        <View
          style={{
            height: 150,
            width: "100%",
            borderBottomLeftRadius: 40,
          }}
          className="bg-yellowOrange p-4"
        >
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
          <NewClassroomBtn />
          {classroom.map((classroom) => (
            // <ClassroomCard
            //   id={classroom.id}
            //   key={classroom.id}
            //   sectionName={classroom.name}
            //   studentCount={29}
            // />
            <ClassroomCard key={classroom.id} classroom={classroom} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
