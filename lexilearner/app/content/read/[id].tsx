import React, { useState, useMemo } from "react";
import { View, Text, FlatList, Pressable, Modal } from "react-native";
import Tts from "react-native-tts";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useBooks } from "@/context/ReadingContentProvider";

const Read = () => {
  const { selectedBook, getBookById } = useBooks();

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [definition, setDefinition] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [cache, setCache] = useState<Record<string, string>>({}); // Cache for definitions

  const words = useMemo(
    () => selectedBook?.Content.split(" "),
    [selectedBook?.Content],
  ); // Memoize word splitting

  const handleWordPress = async (word: string) => {
    setSelectedWord(word);
    setModalVisible(true);

    if (cache[word]) {
      setDefinition(cache[word]); // Use cached definition if available
      return;
    }

    try {
      const res = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );
      const wordDefinition =
        res.data[0]?.meanings[0]?.definitions[0]?.definition ||
        "Definition not found.";
      setCache((prev) => ({ ...prev, [word]: wordDefinition })); // Store in cache
      setDefinition(wordDefinition);
    } catch (error) {
      setDefinition("Definition not found.");
    }
  };

  const handlePronounce = () => {
    if (selectedWord) {
      Tts.speak(selectedWord);
    }
  };

  return (
    <View className="p-8">
      <FlatList
        data={words}
        keyExtractor={(_, index) => index.toString()}
        numColumns={10} // Helps balance rendering
        renderItem={({ item }) => (
          <Pressable onLongPress={() => handleWordPress(item)}>
            <Text className="text-blue-600">{item} </Text>
          </Pressable>
        )}
      />

      {/* Modal for Definition and Pronunciation */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-80 bg-white p-6 rounded-lg">
            <Text className="text-lg font-bold">{selectedWord}</Text>
            <Text className="mt-2">{definition}</Text>
            <Pressable onPress={handlePronounce} className="mt-4">
              <FontAwesomeIcon size={24} icon={faVolumeUp} />
            </Pressable>
            <Pressable
              onPress={() => setModalVisible(false)}
              className="mt-4 bg-gray-200 p-2 rounded"
            >
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Read;
