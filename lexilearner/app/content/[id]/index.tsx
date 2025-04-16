import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useBooks } from "@/context/ReadingContentProvider";
import { ReadingContentType } from "@/models/ReadingContent";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBookOpen, faPlus } from "@fortawesome/free-solid-svg-icons";
import BackHeader from "@/components/BackHeader";

export default function ReadIndex() {
  const params = useLocalSearchParams<{ id: string }>();
  const { selectedBook, getBookById } = useBooks();
  const [book, setBook] = useState<ReadingContentType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadBook = async () => {
      // If we already have the selected book and it matches the ID
      if (selectedBook && selectedBook.Id === params.id) {
        setBook(selectedBook);
        setLoading(false);
      } else if (params.id) {
        // Otherwise fetch it
        setLoading(true);
        const fetchedBook = await getBookById(params.id);
        setBook(fetchedBook);
        setLoading(false);
      }
    };

    loadBook();
  }, [params.id, selectedBook]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4">Loading book...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-lg">Book not found</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className="flex flex-col z-50 p-8 gap-6 bg-background"
        contentContainerStyle={{ alignItems: "center", gap: 24 }}
      >
        <View
          style={{
            zIndex: -1,
            position: "absolute",
            width: "120%",
            height: 160,
          }}
          className="-top-8 -left-8 bg-lightGrayOrange"
        />

        <BackHeader />

        <Image
          source={{
            uri: book.Cover,
          }}
          className="rounded-lg mr-4"
          style={{ width: 130, height: 185 }}
          alt=""
        />

        <Text className="text-2xl font-bold">{book.Title}</Text>
        {book.Author && <Text className="text-lg mb-2">{book.Author}</Text>}
        <View className="flex flex-row w-full justify-center gap-6">
          <View className="flex flex-col justify-center items-center gap-2">
            <Button
              style={{ borderRadius: "100%", width: 65, height: 65 }}
              className="bg-primary"
              variant={"default"}
              onPress={() => {
                router.push(`/content/${book.Id}/read`);
              }}
            >
              <FontAwesomeIcon size={30} icon={faBookOpen} />
            </Button>
            <Text className="font-bold">Read</Text>
          </View>

          <View className="flex flex-col justify-center items-center gap-2">
            <Button
              style={{ borderRadius: "100%", width: 65, height: 65 }}
              className="bg-primary"
              variant={"default"}
            >
              <FontAwesomeIcon size={30} icon={faPlus} />
            </Button>
            <Text className="font-bold">Add to Library</Text>
          </View>
        </View>

        {book.Description && (
          <Text className="text-sm mb-4 italic text-center">
            {book.Description}
          </Text>
        )}
        {/* <Text className="text-base mt-4">{book.Content}</Text> */}
        <View className="mt-4 flex-row justify-between">
          <Text>Genre: {book.Genre}</Text>
          <Text>Difficulty: {book.Difficulty}</Text>
        </View>
      </ScrollView>
    </>
  );
}
