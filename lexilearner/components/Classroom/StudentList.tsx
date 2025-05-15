import React, { useState } from "react";
import { ScrollView, View, Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import ClassroomHeader from "./ClassroomHeader";
import { FontAwesome5 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import {
  getLeaderboardByClassroomId as apiGetLeaderboardByClassroomId,
  Pupil,
} from "@/services/ClassroomService";
import { useClassroomStore } from "@/stores/classroomStore";

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
    .map((part: string) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <View
      style={{ width: size * 4, height: size * 4 }}
      className="rounded-full bg-gray-300 items-center justify-center"
    >
      <Text className="font-semibold text-gray-700">{initials}</Text>
    </View>
  );
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <View className="w-8 h-8 items-center justify-center mr-3">
        <FontAwesome5 name="crown" size={22} color="#FFD700" />
      </View>
    );
  }
  const getBadgeStyle = () => {
    switch (rank) {
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-orange-400";
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

export default function StudentsList() {
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );

  const { data: students } = useQuery({
    queryFn: () => apiGetLeaderboardByClassroomId(selectedClassroom!.id),
    queryKey: ["leaderboard", selectedClassroom!.id],
    enabled: !!selectedClassroom,
  });

  console.log("leaderboard ni studentlist:", students);

  // Hardcoded data - replace with API data later server server
  // const students = [
  //   { id: 1, name: "chriskrt", level: 1200, avatar: null },
  //   { id: 2, name: "Jakeee", level: 890, avatar: null },
  //   { id: 3, name: "DIOOOOOOOO", level: 634, avatar: null },
  //   { id: 4, name: "Leeseo", level: 321, avatar: null },
  //   { id: 5, name: "User", level: 211, avatar: null },
  // ];

  const [activeTab, setActiveTab] = useState("pupils");

  return (
    <ScrollView className="bg-background flex-1">
      <ClassroomHeader name={"Grade 6"} joinCode={""}></ClassroomHeader>

      {/* Tabs */}
      <View className="flex-row p-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab("pupils")}
          className={`flex-1 py-2 ${
            activeTab === "pupils" ? "border-b-2 border-black" : ""
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
          className={`flex-1 py-2 ${
            activeTab === "leaderboard" ? "border-b-2 border-black" : ""
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
        {activeTab === "pupils"
          ? // Pupils tab content
            students.map((student: Pupil) => (
              <TouchableOpacity
                key={student.id}
                className="flex-row items-center bg-white rounded-lg p-4 mb-3 shadow-sm"
              >
                {/* Use DefaultAvatar for all students */}
                <View className="mr-4">
                  <DefaultAvatar name={`${student.firstName}`} size={12} />
                </View>

                <View className="flex-1">
                  <Text className="font-semibold text-base">
                    {`${student.firstName} ${student.lastName}`}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <MaterialIcons
                    name="bar-chart"
                    size={22}
                    color="#666"
                    style={{ marginRight: 16 }}
                  />
                  <FontAwesome name="trash-o" size={20} color="#FF6B6B" />
                </View>
              </TouchableOpacity>
            ))
          : // Leaderboard tab content - hardcoded without navigation
            students.map((student: Pupil, index: number) => (
              <View
                key={student.id}
                className="flex-row items-center bg-white rounded-lg p-4 mb-3 shadow-sm"
              >
                {index === 0 ? (
                  <View className="w-8 h-8 items-center justify-center mr-3">
                    <FontAwesome5 name="crown" size={22} color="#FFD700" />
                  </View>
                ) : (
                  <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center mr-3">
                    <Text className="font-bold text-black">{index + 1}</Text>
                  </View>
                )}

                {/* Avatar */}
                <View className="mr-3">
                  <DefaultAvatar name={`${student.firstName}`} size={12} />
                </View>

                {/* Name */}
                <View className="flex-1">
                  <Text className="font-semibold text-base">
                    {`${student.firstName} ${student.lastName}`}
                  </Text>
                </View>

                {/* Level */}
                <Text className="font-bold text-lg">{student.level} Lvl</Text>
              </View>
            ))}
      </View>
    </ScrollView>
  );
}
