import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReadingContentType } from "@/models/ReadingContent";
import { useReadingContentStore } from "@/stores/readingContentStore";
import { useRouter } from "expo-router";

interface BookCardProps {
  book: ReadingContentType;
}

function BookCard({ book, selected }: BookCardProps & { selected?: boolean }) {
  const setSelectedContent = useReadingContentStore(
    (state) => state.setSelectedContent
  );

  const screenWidth = require("react-native").Dimensions.get("window").width;
  const cardWidth = screenWidth / 3;
  var isSelected = false;

  const handlePress = () => {
    if (selected) {
      isSelected = false;
      setSelectedContent(null);
    } else {
      isSelected = true;
      setSelectedContent(book);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`m-1 rounded-xl overflow-hidden ${
        selected ? "border-2 border-blue-500" : "border border-lightGray"
      }`}
      style={{
        width: cardWidth,
      }}
      onPress={handlePress}
    >
      <Image
        source={{ uri: book.cover }}
        style={{
          width: "100%",
          height: 120,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        resizeMode="cover"
      />
      <View style={{ padding: 8 }}>
        <Text numberOfLines={2} style={{ fontWeight: "bold", fontSize: 14 }}>
          {book.title} BOOK CARD BITCH
        </Text>
        <Text numberOfLines={1} style={{ color: "#666", fontSize: 12 }}>
          {book.author}
        </Text>
      </View>
      {selected && (
        <View className="absolute top-2 right-2 bg-white rounded-full p-0.5">
          <Ionicons name="checkmark-circle" size={24} color="#4F8EF7" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default memo(BookCard);
