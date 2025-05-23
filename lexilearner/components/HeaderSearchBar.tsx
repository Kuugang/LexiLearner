// components/HeaderSearchBar.tsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { CircleUser, Search } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { StreakIcon } from "@/components/Streak";
import LoginStreak from "@/components/LoginStreak";

interface HeaderSearchBarProps {
  user: any;
  streak: number;
  showStreak: boolean;
  setShowStreakModal: (show: boolean) => void;
  activeWeekdays: boolean[];
  onSearchFocus?: () => void;
  placeholder?: string;
}

export const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
  user,
  streak,
  showStreak,
  setShowStreakModal,
  activeWeekdays,
  onSearchFocus,
  placeholder = "Search stories...",
}) => {
  const STREAK_COLOR = "#FF663E";

  return (
    <View className="flex flex-row items-center w-full px-6 py-4 bg-white">
      {/* Profile Icon */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/profile")}
        style={{ marginRight: 10 }}
      >
        <CircleUser color="#FFD43B" size={30} />
      </TouchableOpacity>

      {/* Streak Icon - Only for Pupils */}
      {user?.role === "Pupil" && (
        <View style={{ marginRight: 20 }}>
          <LoginStreak
            isVisible={showStreak}
            onClose={() => setShowStreakModal(false)}
            activeWeekdays={activeWeekdays}
          />

          <TouchableOpacity onPress={() => setShowStreakModal(true)}>
            <View className="flex flex-row items-center">
              <StreakIcon color={STREAK_COLOR} size={28} />
              <Text
                className="text-xl font-bold ml-1"
                style={{ color: STREAK_COLOR }}
              >
                {streak}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-1">
        <TouchableOpacity
          onPress={onSearchFocus}
          activeOpacity={0.8}
          style={{
            backgroundColor: "#D1D5DB",
            borderRadius: 25,
            paddingVertical: 8,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Search size={20} color="#6B7280" style={{ marginRight: 12 }} />
          <Text style={{ color: "#6B7280", fontSize: 16 }}>{placeholder}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
