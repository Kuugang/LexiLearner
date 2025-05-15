import ReadingContent from "@/components/ReadingContent";
import { ReadingContentType } from "@/models/ReadingContent";
import { getReadingMaterialById as apiGetReadingMaterialById } from "@/services/ReadingMaterialService";
import { getIncompleteReadingSessions } from "@/services/ReadingSessionService";
import { useReadingSessionStore } from "@/stores/readingSessionStore";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, Text, View } from "react-native";

//TODO: tarungon
function library() {
    const { data: readingMaterials, isLoading } = useQuery({
        queryKey: ["readingSessions"],
        queryFn: getIncompleteReadingSessions,
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
                            ),
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default library;
