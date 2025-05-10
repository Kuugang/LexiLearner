import { Text } from "@/components/ui/text";
import { StyleSheet, ScrollView, View, Image } from "react-native";
import { NewClassroomBtn } from "../../components/Classroom/MainClassroomBtns";
import ClassroomCard from "../../components/Classroom/ClassroomCard";
import ClassroomScreen from "../classroom";

export default function Classroom() {
  return (
    <View>
      <ClassroomScreen />
    </View>
  );
}
