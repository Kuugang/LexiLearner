import { memo, useMemo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ReadingContentType } from "@/models/ReadingContent";
import { useReadingContentStore } from "@/stores/readingContentStore";
import { useGetCoverFromGDrive } from "@/hooks/useExtractDriveFileId";

function ReadingContent(props: ReadingContentType) {
  const setSelectedContent = useReadingContentStore(
    (state) => state.setSelectedContent
  );
  const imageUrl = useMemo(
    () => useGetCoverFromGDrive(props.cover),
    [props.cover]
  );
  const onPress = () => {
    setSelectedContent(props);
    router.push(`/content/${props.id}`);
  };

  if (props.type === "Recommended") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex flex-row gap-4 justify-start items-start p-4"
      >
        <Image
          source={{
            uri: imageUrl,
          }}
          className="rounded-lg mr-4"
          style={{ width: 100, height: 140 }}
          alt=""
        />
        <View className="flex-1">
          <Text className="font-bold text-lg">{props.title}</Text>
          <Text className="text-base">By {props.author}</Text>
          <Text className="text-sm" numberOfLines={5} ellipsizeMode="tail">
            {props.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (props.type === "ScrollView") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{ width: 100 }}
        className="flex flex-col gap-2 justify-start items-start"
      >
        <Image
          source={{
            uri: imageUrl,
          }}
          style={{ width: "100%", height: 140 }}
          resizeMode="contain"
          alt=""
        />
        <View className="flex-1">
          <Text className="font-bold">{props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (props.type === "QueryView") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex flex-row gap-2 justify-start items-start"
      >
        <Image
          source={{
            uri: imageUrl,
          }}
          style={{ width: 100, height: 140 }}
          resizeMode="contain"
        />

        <View className="flex-1 flex flex-col gap-2 w-full p-2">
          <Text className="font-bold">{props.title}</Text>
          <Text
            className="text-sm text-gray-700"
            numberOfLines={5}
            ellipsizeMode="tail"
          >
            {props.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return null;
}

export default memo(ReadingContent);
