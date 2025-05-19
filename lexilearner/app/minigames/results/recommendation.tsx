import BackHeader from "@/components/BackHeader";
import ReadingContent from "@/components/ReadingContent";
import { Button } from "@/components/ui/button";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { ReadingContentType } from "@/models/ReadingContent";

export default function Recommendation() {
  const { data } = useLocalSearchParams();

  const [recommendation, setRecommendation] = useState<ReadingContentType>();

  useEffect(() => {
    const parsed = data ? JSON.parse(data as string) : null;
    if (parsed) {
      setRecommendation(parsed.recommendations[0]);
    }
  }, []);

  if (!recommendation) return <Redirect href="/home" />;

  return (
    <View className="flex-1 bg-lightGray">
      <ScrollView className="px-6 pt-8">
        <BackHeader />

        <View className="items-center space-y-4 mt-6">
          <Text className="text-[24px] font-bold text-center">
            Try reading this next!
          </Text>

          <View className="w-full bg-white rounded-xl p-4 shadow-md m-5 flex flex-col">
            <ReadingContent
              type={"Recommended"}
              id={recommendation.id}
              content={recommendation.content}
              title={recommendation.title}
              author={recommendation.author}
              description={recommendation.description}
              cover={recommendation.cover}
              genres={recommendation.genres}
              difficulty={recommendation.difficulty}
            />
          </View>
        </View>
      </ScrollView>

      <View className="p-5">
        <Button
          className="bg-blue m-5 mb-24 shadow-main"
          onPress={() => router.replace("/home")}
        >
          <Text>Finish</Text>
        </Button>
      </View>
    </View>
  );
}
