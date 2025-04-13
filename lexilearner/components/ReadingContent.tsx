import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useBooks } from "../context/ReadingContentProvider";

interface ReadingContentProps {
  Type: string;
  Id: string;
  Title: string;
  Author?: string;
  Description?: string;
  Cover: string;
  Content: string;
  Genre: string[];
  Difficulty: number;
}

function ReadingContent(props: ReadingContentProps) {
  const router = useRouter();
  const { selectBook } = useBooks();

  const onPress = () => {
    // Store all book details in context
    selectBook(props);
    // Navigate with just the ID
    router.push(`/content/${props.Id}`);
  };

  if (props.Type === "Recommended") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex flex-row gap-4 justify-start items-start p-4"
      >
        <Image
          source={{
            uri: props.Cover,
          }}
          className="rounded-lg mr-4"
          style={{ width: 100, height: 140 }}
          alt=""
        />
        <View className="flex-1">
          <Text className="font-bold text-lg">{props.Title}</Text>
          <Text className="text-base">By {props.Author}</Text>
          <Text className="text-sm" numberOfLines={5} ellipsizeMode="tail">
            {props.Description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (props.Type === "ScrollView") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{ width: 100 }}
        className="flex flex-col gap-2 justify-start items-start"
      >
        <Image
          source={{
            uri: props.Cover,
          }}
          style={{ width: "100%", height: 140 }}
          resizeMode="contain"
          alt=""
        />
        <View className="flex-1">
          <Text className="font-bold">{props.Title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return null; // Handle case where Type doesn't match
}

export default ReadingContent;
