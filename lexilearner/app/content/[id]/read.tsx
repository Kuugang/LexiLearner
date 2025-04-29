import React, { useState, useMemo, useCallback, memo } from "react";
import cheerio from "react-native-cheerio";
import RenderHtml from "react-native-render-html";
import Tts from "react-native-tts";
import axios from "axios";
import { useReadingContentStore } from "@/stores/readingContentStore";

import { useDefinitionStore } from "@/stores/definitionStore";
import { useTranslationStore } from "@/stores/translationStore";

//Components
import {
  useWindowDimensions,
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Input } from "~/components/ui/input";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";

export default function Read() {
  const { width } = useWindowDimensions();
  const selectedContent = useReadingContentStore(
    (state) => state.selectedContent,
  );

  const [selectedWord, setSelectedWord] = useState("");
  const [isDefinitionLoading, setIsDefinitionLoading] = useState(false);
  const [definitionVisible, setDefinitionVisible] = useState(false);
  const [html, setHtml] = useState("");
  const [translation, setTranslation] = useState("");

  const getDefinition = useDefinitionStore((state) => state.getDefinition);
  const storeDefinition = useDefinitionStore((state) => state.storeDefinition);

  const getTranslation = useTranslationStore((state) => state.getTranslation);
  const storeTranslation = useTranslationStore(
    (state) => state.storeTranslation,
  );

  if (!selectedContent) {
    return null;
  }

  const fetchTranslation = async (word: string) => {
    const translation = getTranslation(word);
    if (translation != undefined) {
      setTranslation(translation);
      return;
    }

    try {
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
      storeTranslation(word, data.result);
      setTranslation(data.result);
    } catch (error) {
      console.error("Translation error:", error);
      return { result: "Translation failed" };
    }
  };

  const fetchDefinition = useCallback(async (word: string) => {
    try {
      const { data } = await axios.get(
        `https://corsproxy.io/?url=https://googledictionary.freecollocation.com/meaning?word=${word}`,
      );
      return data;
    } catch (error) {
      console.error("Definition error:", error);
      return null;
    }
  }, []);

  const handleDisplayDefinition = useCallback(
    async (word: string) => {
      if (!word.trim()) return;

      setTranslation("");
      let definition = getDefinition(word);
      if (definition !== undefined) {
        setHtml(definition);
        fetchTranslation(word);
        return;
      }

      try {
        setIsDefinitionLoading(true);
        const data = await fetchDefinition(word);

        if (!data) {
          const notFoundHtml = `
          <div style="text-align: center; padding: 20px;">
            <p style="font-size: 18px; color: #888;">🧐 Definition not found</p>
          </div>
          `;
          setHtml(notFoundHtml);
          storeDefinition(word, notFoundHtml);
          setIsDefinitionLoading(false);
          return;
        }

        const $ = cheerio.load(data);
        $('script, style, link[rel="stylesheet"]').remove();
        $("#smaller").closest("div").remove();
        $("img.forEmbed").remove();

        const html = $("#forEmbed").html();
        if (html === null) {
          const notFoundHtml = `
          <div style="text-align: center; padding: 20px;">
            <p style="font-size: 18px; color: #888;">🧐 Definition not found</p>
          </div>
          `;
          setHtml(notFoundHtml);
          storeDefinition(word, notFoundHtml);
        } else {
          setHtml(html);
          storeDefinition(word, html);
          fetchTranslation(word);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error:", error);
          const errorHtml = `
          <div style="text-align: center; padding: 20px;">
            <p style="font-size: 18px; color: #888;">❌ Error loading definition</p>
          </div>
          `;
          setHtml(errorHtml);
        }
      } finally {
        setIsDefinitionLoading(false);
      }
    },
    [fetchDefinition, fetchTranslation],
  );

  const handleWordPress = useCallback(
    (word: string) => {
      const cleanedWord = word.replace(/[^\w\s]/gi, "");
      setSelectedWord(cleanedWord);
      setDefinitionVisible(true);
      handleDisplayDefinition(cleanedWord);
    },
    [handleDisplayDefinition],
  );

  const handlePronounce = useCallback(() => {
    if (selectedWord) {
      Tts.speak(selectedWord);
    }
  }, [selectedWord]);

  const WordComponent = memo(
    ({ word, onPress }: { word: string; onPress: () => void }) => (
      <Pressable onPress={onPress} className="mr-1 mb-1">
        <Text className="text-black">{word}</Text>
      </Pressable>
    ),
  );

  const getWordPressHandler = useCallback(
    (word: string) => () => handleWordPress(word),
    [handleWordPress],
  );

  const paragraphs: string[] = useMemo(() => {
    if (typeof selectedContent.Content !== "string") return [];
    return selectedContent.Content.split("\n\n").filter(
      (paragraph) => paragraph.trim().length > 0,
    );
  }, [selectedContent.Content]);

  const paragraphWordsArray = useMemo(() => {
    return paragraphs.map((p) =>
      p.split(" ").filter((word) => word.trim().length > 0),
    );
  }, [paragraphs]);

  const renderParagraph = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    const words = paragraphWordsArray[index];

    return (
      <View className="flex-row flex-wrap mb-2">
        {words.map((word, index) => (
          <WordComponent
            key={index}
            word={word}
            onPress={getWordPressHandler(word)}
          />
        ))}

        {/* <FlashList */}
        {/*   className="p-2 bg-background " */}
        {/*   data={words} */}
        {/*   renderItem={({ item }) => <Text>{item}</Text>} */}
        {/*   estimatedItemSize={estimatedItemSize} */}
        {/*   contentContainerStyle={{ paddingHorizontal: 20 }} */}
        {/* /> */}
      </View>
    );
  };

  const estimatedItemSize = useMemo(() => {
    if (paragraphs.length === 0) return 100;
    const averageLength =
      paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length;
    return Math.max(50, Math.min(300, averageLength / 4));
  }, [paragraphs]);

  return (
    <>
      <View style={{ flex: 1 }} className="bg-background">
        <FlashList
          className="p-2 bg-background "
          data={paragraphs}
          renderItem={renderParagraph}
          estimatedItemSize={estimatedItemSize}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />

        {/* {paragraphs.map((p, pIndex) => { */}
        {/*   const words = paragraphWordsArray[pIndex]; */}
        {/*   return ( */}
        {/*     <View key={`${pIndex}`} className="flex flex-wrap"> */}
        {/*       {words.map((word, wIndex) => ( */}
        {/*         <WordComponent */}
        {/*           key={`${pIndex} "" + ""+ ${wIndex}`} */}
        {/*           word={word} */}
        {/*           onPress={() => getWordPressHandler(word)} */}
        {/*         /> */}
        {/*       ))} */}
        {/*     </View> */}
        {/*   ); */}
        {/* })} */}
      </View>

      <Modal
        visible={definitionVisible}
        animationType="slide"
        transparent={false}
      >
        <View className="p-4 flex-1">
          <Input
            className="rounded-lg text-black mb-4"
            value={selectedWord}
            onChangeText={setSelectedWord}
            onBlur={() => handleDisplayDefinition(selectedWord)}
          />
          <Text className="mb-2 text-lg font-medium">{translation}</Text>

          <View className="flex-row justify-between mb-4">
            <View className="flex-row">
              <Pressable onPress={handlePronounce} className="p-2 mr-4">
                <FontAwesomeIcon size={24} icon={faVolumeUp} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => setDefinitionVisible(false)}
              className="bg-gray-200 p-2 rounded"
            >
              <Text>Close</Text>
            </Pressable>
          </View>

          {isDefinitionLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#0000ff" />
              <Text className="mt-2">Loading definition...</Text>
            </View>
          ) : (
            <ScrollView className="flex-1">
              <RenderHtml contentWidth={width} source={{ html }} />
            </ScrollView>
          )}
        </View>
      </Modal>
    </>
  );
}
