import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View } from "react-native";
import { NewClassroomBtn } from "../classroom/MainClassroomBtns";
import ClassroomCard from "../classroom/ClassroomCard";
import ClassroomScreen from "../classroom/[id]/ClassroomScreen";

// temp aah aah ahashahsah hardcoded hasha

export default function Classroom() {
  return (
    <ScrollView>
      <View>
        <View className="bg-background-yellowOrange w-full rounded-bl-4xl h-32 drop-shadow-lg">
          <Text>Your Classrooms</Text>
        </View>

        <View className="p-8">
          {/* hardcoded aah IDs LOL  */}
          <NewClassroomBtn />
          <ClassroomCard id="1" sectionName="Grade 6 - F2" studentCount={29} />
          <ClassroomCard id="2" sectionName="Grade 6 - F3" studentCount={38} />
          <ClassroomCard id="3" sectionName="Grade 6 - F4" studentCount={1} />
        </View>
      </View>
    </ScrollView>
  );
}
