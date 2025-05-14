import BackHeader from "@/components/BackHeader";
import ReadingContent from "@/components/ReadingContent";
import { getReadingMaterialById as apiGetReadingMaterialById } from "@/services/ReadingMaterialService";
import { useReadingSessionStore } from "@/stores/readingSessionStore";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, Text, View } from "react-native";

function library() {
  const sessions = useReadingSessionStore((state) => state.sessions);
  const filteredSessions = sessions?.filter(
    (session) => session.completionPercentage < 100
  );

  const { data: readingMaterials, isLoading } = useQuery({
    queryKey: [
      "readingMaterials",
      filteredSessions?.map((s) => s.readingMaterialId),
    ],
    queryFn: async () => {
      const materials = await Promise.all(
        (filteredSessions || []).map((session) =>
          apiGetReadingMaterialById(session.readingMaterialId)
        )
      );
      return materials;
    },
    enabled: (filteredSessions || []).length > 0,
  });

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
          <View className="flex flex-row flex-wrap gap-[12px]">
            {readingMaterials?.map((material, index) => (
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
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default library;
