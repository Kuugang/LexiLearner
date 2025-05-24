import React from "react";
import { View, TouchableOpacity, Pressable } from "react-native";
import { router } from "expo-router";
import { CircleUser, Search, X } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { StreakIcon } from "@/components/Streak";
import LoginStreak from "@/components/LoginStreak";

interface HeaderSearchBarProps {
  user: any;
  streak: number;
  showStreak: boolean;
  setShowStreakModal: (show: boolean) => void;
  activeWeekdays: boolean[];
  placeholder?: string;
  searchValue: string;
  onSearchChange: (text: string) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: () => void;
  onClearSearch?: () => void;
}

export const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
  user,
  streak,
  showStreak,
  setShowStreakModal,
  activeWeekdays,
  placeholder = "Search stories...",
  searchValue,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  onClearSearch,
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

      <View className="flex-1 relative">
        {/* Search Icon */}
        <Search
          size={18}
          color="#6B7280"
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            zIndex: 1,
          }}
        />

        {/* Input Field jake bajo*/}
        <Input
          className="rounded-full w-full"
          value={searchValue}
          onChangeText={onSearchChange}
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
          placeholder={placeholder}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="never"
          selectTextOnFocus={false}
          placeholderTextColor="#9CA3AF"
          style={{
            backgroundColor: "#D1D5DB",
            borderRadius: 25,
            height: 44,
            paddingVertical: 0,
            paddingHorizontal: 20,
            paddingLeft: 50,
            paddingRight: searchValue ? 45 : 20,
            fontSize: 16,
            lineHeight: 20,
            textAlignVertical: "center",
            includeFontPadding: false,
          }}
        />

        {/* Clear Button */}
        {searchValue ? (
          <Pressable
            onPress={onClearSearch}
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              zIndex: 1,
              padding: 4,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 12,
            }}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <X size={16} color="#6B7280" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};
