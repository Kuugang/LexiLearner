import ReadingContent from "@/components/ReadingContent";
import { ReadingContentType } from "@/models/ReadingContent";
import { getIncompleteReadingSessions } from "@/services/ReadingSessionService";
import { useReadingSessionStore } from "@/stores/readingSessionStore";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

function library() {
  const currentlyReading = useReadingSessionStore(
    (state) => state.currentlyReading
  );
  const setCurrentlyReading = useReadingSessionStore(
    (state) => state.setCurrentlyReading
  );

  const { data: readingMaterials, isLoading } = useQuery({
    queryKey: ["readingSessions"],
    queryFn: getIncompleteReadingSessions,
    enabled: !!currentlyReading,
  });

  useEffect(() => {
    if (readingMaterials) {
      setCurrentlyReading(readingMaterials);
    }
  }, [readingMaterials]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-background">
      <View>
        <View className="flex p-8">
          <Text className="text-[24px] font-bold">Continue Reading</Text>
          <View className="flex flex-row flex-wrap gap-4">
            {readingMaterials?.map(
              (material: ReadingContentType, index: number) => (
                <View key={index}>
                  <ReadingContent
                    type="ScrollView"
                    id={material.id}
                    title={material.title}
                    description={material.description}
                    cover={material.cover}
                    content={material.content}
                    genres={material.genres}
                    difficulty={material.difficulty}
                  />
                </View>
              )
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default library;
