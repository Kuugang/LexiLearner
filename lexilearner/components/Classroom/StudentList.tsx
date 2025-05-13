import React, { useState } from "react";
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Text } from "@/components/ui/text";
import BackHeader from "@/components/BackHeader";
import { useClassroomStore } from "@/stores/classroomStore";
import { router } from "expo-router";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import ClassroomHeader from "./ClassroomHeader";

// Default Avatar component using initials
const DefaultAvatar = ({
  name,
  size = 12,
}: {
  name: string;
  size?: number;
}) => {
  // Get first letter of first and last name (if available)
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Convert size to actual pixel dimensions
  const dimensionStyle = { width: size * 4, height: size * 4 };

  return (
    <View
      style={dimensionStyle}
      className="rounded-full bg-gray-300 items-center justify-center"
    >
      <Text className="font-semibold text-gray-700">{initials}</Text>
    </View>
  );
};

// Component for displaying rank badge
const RankBadge = ({ rank }: { rank: number }) => {
  const getBadgeStyle = () => {
    switch (rank) {
      case 1:
        return "bg-yellow-400"; // Gold
      case 2:
        return "bg-gray-400"; // Silver
      case 3:
        return "bg-orange-400"; // Bronze
      default:
        return "bg-gray-200";
    }
  };

  return (
    <View
      className={`w-8 h-8 rounded-full ${getBadgeStyle()} items-center justify-center mr-3`}
    >
      <Text className="font-bold text-white">{rank}</Text>
    </View>
  );
};

// Component for student row in leaderboard
const StudentRow = ({
  rank,
  student,
  onPress,
}: {
  rank: number;
  student: { name: string; avatar?: string; level: number };
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center bg-white rounded-lg p-4 mb-3 shadow-sm"
  >
    <RankBadge rank={rank} />

    {/* Use conditional rendering for avatar */}
    {student.avatar ? (
      <Image
        source={{ uri: student.avatar }}
        className="w-12 h-12 rounded-full mr-3"
        resizeMode="cover"
      />
    ) : (
      <View className="mr-3">
        <DefaultAvatar name={student.name} size={12} />
      </View>
    )}

    <View className="flex-1">
      <Text className="font-semibold text-base">{student.name}</Text>
    </View>
    <Text className="font-bold text-lg">{student.level} Lvl</Text>
  </TouchableOpacity>
);

export default function StudentsList() {
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );

  // Mock data - replace with actual data from your store/API
  const [students] = useState([
    { id: 1, name: "chriskrt", level: 1200, avatar: null },
    { id: 2, name: "Jakeee", level: 690, avatar: null },
    { id: 3, name: "DIOOOOOOOO", level: 634, avatar: null },
    { id: 4, name: "Leeseo", level: 321, avatar: null },
    { id: 5, name: "User", level: 211, avatar: null },
  ]);

  // Navigation state for tabs
  const [activeTab, setActiveTab] = useState<"pupils" | "leaderboard">(
    "pupils"
  );

  // Handle student press
  const handleStudentPress = (studentId: number) => {
    // Navigate to student profile or details
    console.log("Navigate to student:", studentId);
    // You might want to navigate to a student detail page:
    // router.push(`/classroom/${selectedClassroom?.id}/student/${studentId}`);
  };

  return (
    <ScrollView className="bg-background flex-1">
      {/* Header with classroom info */}
      <ClassroomHeader name="" joinCode="" />

      {/* Tabs */}
      <View className="flex-row p-4">
        <TouchableOpacity
          onPress={() => setActiveTab("pupils")}
          className={`flex-1 p-3 rounded-lg mr-2 ${
            activeTab === "pupils" ? "bg-white shadow-sm" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "pupils" ? "text-black" : "text-gray-500"
            }`}
          >
            Pupils
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("leaderboard")}
          className={`flex-1 p-3 rounded-lg ml-2 ${
            activeTab === "leaderboard"
              ? "bg-white shadow-sm"
              : "bg-transparent"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "leaderboard" ? "text-black" : "text-gray-500"
            }`}
          >
            Leaderboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      <View className="p-4">
        {activeTab === "pupils" ? (
          // Pupils tab content
          students.map((student, index) => (
            <TouchableOpacity
              key={student.id}
              onPress={() => handleStudentPress(student.id)}
              className="flex-row items-center bg-white rounded-lg p-4 mb-3 shadow-sm"
            >
              {/* Use conditional rendering for avatar */}
              {student.avatar ? (
                <Image
                  source={{ uri: student.avatar }}
                  className="w-12 h-12 rounded-full mr-4"
                  resizeMode="cover"
                />
              ) : (
                <View className="mr-4">
                  <DefaultAvatar name={student.name} size={12} />
                </View>
              )}

              <View className="flex-1">
                <Text className="font-semibold text-base">{student.name}</Text>
              </View>

              <View className="flex-row items-center">
                <MaterialIcons
                  name="bar-chart"
                  size={22}
                  color="#666"
                  style={{ marginRight: 8 }}
                />
                <FontAwesome name="trash-o" size={20} color="#FF6B6B" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          // Leaderboard tab content
          <>
            {/* Top 3 with special styling */}
            {students.slice(0, 3).map((student, index) => (
              <StudentRow
                key={student.id}
                rank={index + 1}
                student={{ ...student, avatar: student.avatar ?? undefined }}
                onPress={() => handleStudentPress(student.id)}
              />
            ))}

            {/* Small separator */}
            <View className="h-4" />

            {/* Rest of the students */}
            {students.slice(3).map((student, index) => (
              <StudentRow
                key={student.id}
                rank={index + 4}
                student={{ ...student, avatar: student.avatar ?? undefined }}
                onPress={() => handleStudentPress(student.id)}
              />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}
