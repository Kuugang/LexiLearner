import React, { useState, useMemo } from "react";
import cheerio from "react-native-cheerio";
import RenderHtml from "react-native-render-html";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  useWindowDimensions,
  ScrollView,
  unstable_batchedUpdates,
} from "react-native";
import Tts from "react-native-tts";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useBooks } from "@/context/ReadingContentProvider";
import { Button, ButtonText } from "@/components/ui/button";

export default function Read() {
  const { width } = useWindowDimensions();
  const { selectedBook, getBookById } = useBooks();

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [definition, setDefinition] = useState<string>("");
  const [definitionVisible, setDefinitionVisible] = useState<boolean>(false);
  const [cache, setCache] = useState<Record<string, string>>({});
  const [html, setHtml] = useState("");

  const words = useMemo(
    () => selectedBook?.Content.split(" "),
    [selectedBook?.Content],
  ); // Memoize word splitting

  const handleWordPress = async (word: string) => {
    // Batch initial state updates
    unstable_batchedUpdates(() => {
      setSelectedWord(word);
      setDefinitionVisible(true);
    });

    // Check cache
    if (cache[word]) {
      setDefinition(cache[word]);
      return;
    }

    try {
      const { data } = await axios.get(
        `https://googledictionary.freecollocation.com/meaning?word=${word}`,
      );

      requestAnimationFrame(() => {
        const $ = cheerio.load(data);
        $('script, style, link[rel="stylesheet"]').remove();

        $("div")
          .filter(function (this: HTMLElement): boolean {
            const style = $(this).attr("style") ?? "";
            return (
              style.includes("float:right") &&
              style.includes("text-align:right")
            );
          })
          .remove();
        $("img.forEmbed[url]").each(function (this: HTMLElement) {
          const url = $(this).attr("url");
          if (
            url ===
            "http://www.gstatic.com/dictionary/static/sounds/de/0/twin.mp3"
          ) {
            $(this).remove();
          }
        });

        const html = $("#forEmbed").html();

        setCache((prev) => ({ ...prev, [word]: html }));
        setHtml(html);
      });
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error:", error);
      }
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

      <Modal visible={definitionVisible} animationType="slide">
        <ScrollView>
          <Text className="text-lg font-bold">{selectedWord}</Text>

          <Pressable onPress={handlePronounce} className="mt-4">
            <FontAwesomeIcon size={24} icon={faVolumeUp} />
          </Pressable>
          <Pressable
            onPress={() => setDefinitionVisible(false)}
            className="mt-4 bg-gray-200 p-2 rounded"
          >
            <Text>Close</Text>
          </Pressable>

          <RenderHtml contentWidth={width} source={{ html }} />
        </ScrollView>
      </Modal>
    </View>
  );
}
