import BackHeader from "@/components/BackHeader";
import ReadingContent from "@/components/ReadingContent";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View, Text } from "react-native";

export default function recommendation() {
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
              id={"123"}
              content={`
                This edition is part of the Beginner Books collection, which aims to encourage early readers with its simple language and visual storytelling. It’s a perfect book for both independent reading and family read-aloud sessions.
              `}
              title={"Cat In The Hat"}
              author={"Dr. Seuss"}
              description="Beginner Books are fun, funny, and easy to read. These unjacketed hardcover early readers encourage children to read all on their own using simple words and illustrations. Perfect for practicing readers ages 3–7, and lucky parents too!"
              cover="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1468890477i/233093.jpg"
              genres={["Fiction"]}
              difficulty={10}
            />
          </View>
        </View>
      </ScrollView>

      <View className="p-5">
        <Button
          className="bg-blue m-5 mb-24 shadow-main"
          onPress={() => router.push("/home")}
        >
          <Text>Finish</Text>
        </Button>
      </View>
    </View>
  );
}
