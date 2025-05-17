import BackHeader from "@/components/BackHeader";
import { router } from "expo-router";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { View, Image, TouchableOpacity, Text, ScrollView } from "react-native";
import { useStories } from "@/services/ReadingMaterialService";
import BookCard from "@/components/Classroom/BookCard";
import { useReadingContentStore } from "@/stores/readingContentStore";

export default function choosebook() {
  const { data: stories, isLoading: isStoriesLoading } = useStories(); // REFETCHES. preferably cached store shit lang ttot or idk
  const { selectedContent } = useReadingContentStore();

  return (
    <View className="flex-1">
      <ScrollView>
        <View className="p-8">
          <BackHeader />
          {isStoriesLoading && <Text>Loading stories...</Text>}
          <View className="flex flex-row flex-wrap m-4">
            {!isStoriesLoading && Array.isArray(stories) && stories.length > 0
              ? stories.map((item) => (
                  <BookCard
                    key={item.id}
                    book={item}
                    selected={
                      selectedContent != null && selectedContent.id === item.id
                    }
                  />
                ))
              : !isStoriesLoading && (
                  <Text className="text-gray-500">No stories available.</Text>
                )}
          </View>
        </View>
      </ScrollView>

      {selectedContent && (
        <View className="p-8 h-20 absolute bottom-0 w-full justify-center">
          <Button
            className="bg-yellowOrange mb-2 shadow-main"
            onPress={() => {
              router.back();
            }}
          >
            <Text> Done </Text>
          </Button>
        </View>
      )}
    </View>
  );
}
