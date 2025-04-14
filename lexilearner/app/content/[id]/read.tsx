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
} from "react-native";
import Tts from "react-native-tts";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useBooks } from "@/context/ReadingContentProvider";
import { Input } from "~/components/ui/input";

export default function Read() {
  const { width } = useWindowDimensions();
  const { selectedBook } = useBooks();
  const averageWordWidth = 60;
  const numColumns = Math.floor(width / averageWordWidth);

  const [selectedWord, setSelectedWord] = useState("");
  const [isDefinitionLoading, setIsDefinitionLoading] = useState(true);
  const [definitionVisible, setDefinitionVisible] = useState(false);
  const [definitionCache, setdefinitionCache] = useState<
    Record<string, string>
  >({});

  const [translationCache, setTranslationCache] = useState<
    Record<string, string>
  >({});

  const [html, setHtml] = useState("");

  const words = useMemo(
    () => selectedBook?.Content.split(" "),
    [selectedBook?.Content],
  ); // Memoize word splitting

  const getTranslation = async (word: string) => {
    const formData = new URLSearchParams();
    formData.append("from", "en_US");
    formData.append("to", "ceb_PH");
    formData.append("text", word);
    formData.append("platform", "dp");

    const { data } = await axios.post(
      "https://corsproxy.io/?url=https://lingvanex.com/translation/translate",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return data;
  };

  const getDefinition = async (word: string) => {
    const { data } = await axios.get(
      `https://corsproxy.io/?url=https://googledictionary.freecollocation.com/meaning?word=${word}`,
    );
    return data;
  };

  const handleDisplayDefinition = async (word: string) => {
    if (definitionCache[word]) {
      setHtml(definitionCache[word]);
      return;
    }

    try {
      setIsDefinitionLoading(true);
      const data = await getDefinition(word);

      const $ = cheerio.load(data);
      $('script, style, link[rel="stylesheet"]').remove();

      $("#smaller").closest("div").remove();
      $("img.forEmbed").remove();

      const html = $("#forEmbed").html();
      if (html === null) {
        setHtml(`
              <div style="text-align: center; padding: 20px;">
                <p style="font-size: 18px; color: #888;">🧐 Definition not found</p>
              </div>
            `);
        return;
      }

      const translation = await getTranslation(word);
      setTranslationCache((prev) => ({ ...prev, [word]: translation.result }));
      setdefinitionCache((prev) => ({ ...prev, [word]: html }));
      setHtml(html);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error:", error);
      }
    } finally {
      setIsDefinitionLoading(false);
    }
  };

  const handleWordPress = (word: string) => {
    setSelectedWord(word);
    setDefinitionVisible(true);
    handleDisplayDefinition(word);
  };

  const handlePronounce = () => {
    if (selectedWord) {
      Tts.speak(selectedWord);
    }
  };

  return (
    <>
      <FlatList
        className="p-6 bg-background h-screen"
        data={words}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <Pressable
            onLongPress={() => handleWordPress(item)}
            className="mr-1 mb-1"
          >
            <Text>{item}</Text>
          </Pressable>
        )}
      />
      <Modal visible={definitionVisible} animationType="slide">
        <ScrollView>
          <Input
            className="rounded-lg text-black"
            value={selectedWord}
            onChangeText={(text: string) => setSelectedWord(text)}
            onBlur={() => handleDisplayDefinition(selectedWord)}
          />

          <Text>{translationCache[selectedWord]}</Text>

          <Pressable onPress={handlePronounce} className="mt-4">
            <FontAwesomeIcon size={24} icon={faVolumeUp} />
          </Pressable>
          <Pressable
            onPress={() => setDefinitionVisible(false)}
            className="mt-4 bg-gray-200 p-2 rounded"
          >
            <Text>Close</Text>
          </Pressable>

          {isDefinitionLoading ? (
            <Text>Fetching Definition</Text>
          ) : (
            <RenderHtml contentWidth={width} source={{ html }} />
          )}
        </ScrollView>
      </Modal>
    </>
  );
}
