import { memo } from "react";
import { router } from "expo-router";
import { View, Text, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useReadingContentStore } from "@/stores/readingContentStore";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBookOpen, faPlus } from "@fortawesome/free-solid-svg-icons";
import BackHeader from "@/components/BackHeader";
import { useGetCoverFromGDrive } from "@/hooks/useExtractDriveFileId";

function ContentIndex() {
  const selectedContent = useReadingContentStore(
    (state) => state.selectedContent
  );
  const imageUrl = useGetCoverFromGDrive(selectedContent!.cover);
  if (!selectedContent) {
    return (
      <ScrollView
        className="flex flex-col z-50 p-8 gap-6 bg-background"
        contentContainerStyle={{ alignItems: "center", gap: 24 }}
      >
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-lg">Book not found</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView
        className="flex flex-col z-50 p-8 gap-6 bg-white"
        contentContainerStyle={{ alignItems: "center", gap: 24 }}
      >
        <View
          style={{
            zIndex: -1,
            position: "absolute",
            width: "120%",
          }}
          className="-top-8 -left-8 bg-yellowOrange h-[25vh] w-full"
        />

        <BackHeader />

        <Image
          source={{
            uri: imageUrl,
          }}
          className="rounded-lg mr-4"
          style={{ width: 130, height: 185 }}
          alt=""
        />

        <View className="flex flex-row items-center">
          <Text className="text-2xl font-bold">{selectedContent.title}</Text>
          <MaterialDifficulty difficulty={selectedContent.difficulty} />
        </View>
        {selectedContent.author && (
          <Text className="text-lg mb-2">{selectedContent.author}</Text>
        )}
        <View className="flex flex-row w-full justify-center gap-6">
          <View className="flex flex-col justify-center items-center gap-2">
            <Button
              style={{ borderRadius: "100%", width: 65, height: 65 }}
              className="bg-primary"
              variant={"default"}
              onPress={() => {
                router.push(`/content/${selectedContent.id}/read`);
              }}
            >
              <FontAwesomeIcon size={30} icon={faBookOpen} />
            </Button>
            <Text className="font-bold">Read</Text>
          </View>
          {/* 
          <View className="flex flex-col justify-center items-center gap-2">
            <Button
              style={{ borderRadius: "100%", width: 65, height: 65 }}
              className="bg-primary"
              variant={"default"}
            >
              <FontAwesomeIcon size={30} icon={faPlus} />
            </Button>
            <Text className="font-bold">Add to Library</Text>
          </View> */}
        </View>

        {selectedContent.description && (
          <Text className="text-sm mb-4 italic text-center">
            {selectedContent.description}
          </Text>
        )}
        <View className="mt-4 flex-row justify-between">
          <Text>Genre: {selectedContent.genres}</Text>
          <Text>Difficulty: {selectedContent.difficulty}</Text>
        </View>
      </ScrollView>
    </>
  );
}
export default memo(ContentIndex);

export function MaterialDifficulty({ difficulty }: { difficulty: number }) {
  var difficultyName, difficultyColor;
  switch (true) {
    case difficulty <= 40:
      difficultyName = "Easy";
      difficultyColor = "#90E190";
      break;
    case difficulty <= 80:
      difficultyName = "Medium";
      difficultyColor = "#99D6E9";
      break;
    case difficulty <= 100:
      difficultyName = "Hard";
      difficultyColor = "#FF663E";
      break;
  }

  return (
    <View
      className="ml-3 px-4 py-1 rounded-xl"
      style={{ backgroundColor: difficultyColor }}
    >
      <Text className="font-bold text-md">{difficultyName}</Text>
    </View>
  );
}
