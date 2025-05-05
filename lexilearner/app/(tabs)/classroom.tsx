import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View, Image } from "react-native";
import { NewClassroomBtn } from "../../components/Classroom/MainClassroomBtns";
import ClassroomCard from "../../components/Classroom/ClassroomCard";

// temp aah aah ahashahsah hardcoded hasha

export default function Classroom() {
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
          {/* fetch classrooms ni bro*/}
          <NewClassroomBtn />
          <ClassroomCard id="1" sectionName="Grade 6 - F2" studentCount={29} />
          <ClassroomCard id="2" sectionName="Grade 6 - F3" studentCount={38} />
          <ClassroomCard id="3" sectionName="Grade 6 - F4" studentCount={1} />
        </View>
      </View>
    </ScrollView>
  );
}
