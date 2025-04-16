import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
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
  ActivityIndicator,
} from "react-native";
import Tts from "react-native-tts";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBooks } from "@/context/ReadingContentProvider";
import { Input } from "~/components/ui/input";

// Storage keys
const DEFINITION_CACHE_KEY = "definition_cache";
const TRANSLATION_CACHE_KEY = "translation_cache";

export default function Read() {
  const { width } = useWindowDimensions();
  const { selectedBook } = useBooks();
  const averageWordWidth = 60;
  const numColumns = Math.floor(width / averageWordWidth);

  // Add reference to cancel token
  const cancelTokenRef = useRef(null);

  const [selectedWord, setSelectedWord] = useState("");
  const [isDefinitionLoading, setIsDefinitionLoading] = useState(false);
  const [definitionVisible, setDefinitionVisible] = useState(false);
  const [definitionCache, setDefinitionCache] = useState({});
  const [translationCache, setTranslationCache] = useState({});
  const [html, setHtml] = useState("");

  // Load cached definitions and translations from AsyncStorage on component mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const definitionData = await AsyncStorage.getItem(DEFINITION_CACHE_KEY);
        const translationData = await AsyncStorage.getItem(
          TRANSLATION_CACHE_KEY,
        );

        if (definitionData) {
          setDefinitionCache(JSON.parse(definitionData));
        }

        if (translationData) {
          setTranslationCache(JSON.parse(translationData));
        }
      } catch (error) {
        console.error("Error loading cached data:", error);
      }
    };

    loadCachedData();
  }, []);

  // Save definition cache to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCacheToStorage = async () => {
      try {
        if (Object.keys(definitionCache).length > 0) {
          await AsyncStorage.setItem(
            DEFINITION_CACHE_KEY,
            JSON.stringify(definitionCache),
          );
        }
      } catch (error) {
        console.error("Error saving definition cache:", error);
      }
    };

    saveCacheToStorage();
  }, [definitionCache]);

  // Save translation cache to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCacheToStorage = async () => {
      try {
        if (Object.keys(translationCache).length > 0) {
          await AsyncStorage.setItem(
            TRANSLATION_CACHE_KEY,
            JSON.stringify(translationCache),
          );
        }
      } catch (error) {
        console.error("Error saving translation cache:", error);
      }
    };

    saveCacheToStorage();
  }, [translationCache]);

  // Optimize the splitting - use memoization with proper dependency
  const words = useMemo(() => {
    return selectedBook?.Content ? selectedBook.Content.split(" ") : [];
  }, [selectedBook?.Content]);

  const getTranslation = useCallback(
    async (word) => {
      // Check if translation is already in cache
      if (translationCache[word]) {
        return { result: translationCache[word] };
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
        return data;
      } catch (error) {
        console.error("Translation error:", error);
        return { result: "Translation failed" };
      }
    },
    [translationCache],
  );

  const getDefinition = useCallback(async (word: string) => {
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

      // Cancel previous request if it exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled due to new request.");
      }
      cancelTokenRef.current = axios.CancelToken.source();

      // Return cached definition if available
      if (definitionCache[word]) {
        setHtml(definitionCache[word]);
        return;
      }

      try {
        setIsDefinitionLoading(true);
        const data = await getDefinition(word);

        if (!data) {
          const notFoundHtml = `
          <div style="text-align: center; padding: 20px;">
            <p style="font-size: 18px; color: #888;">🧐 Definition not found</p>
          </div>
          `;
          setHtml(notFoundHtml);
          setDefinitionCache((prev) => ({ ...prev, [word]: notFoundHtml }));
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
          setDefinitionCache((prev) => ({ ...prev, [word]: notFoundHtml }));
        } else {
          setHtml(html);
          setDefinitionCache((prev) => ({ ...prev, [word]: html }));

          // Get translation in parallel
          getTranslation(word).then((translation) => {
            if (translation && translation.result) {
              setTranslationCache((prev) => ({
                ...prev,
                [word]: translation.result,
              }));
            }
          });
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
          // Don't cache errors
        }
      } finally {
        setIsDefinitionLoading(false);
      }
    },
    [definitionCache, getDefinition, getTranslation],
  );

  const handleWordPress = useCallback(
    (word: string) => {
      // Clean the word by removing punctuation
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

  // Memoize renderItem to prevent unnecessary re-renders
  const renderItem = useCallback(
    ({ item }) => (
      <Pressable onPress={() => handleWordPress(item)} className="mr-1 mb-1">
        <Text>{item}</Text>
      </Pressable>
    ),
    [handleWordPress],
  );

  // Use getItemLayout for fixed height items to improve performance
  const getItemLayout = useCallback(
    (data, index) => {
      const height = 25; // Approximate height of each item
      return {
        length: height,
        offset: height * Math.floor(index / numColumns),
        index,
      };
    },
    [numColumns],
  );

  return (
    <>
      <FlatList
        className="p-6 bg-background h-screen"
        data={words}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={numColumns}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={50}
        windowSize={10}
        removeClippedSubviews={true}
        initialNumToRender={100}
        updateCellsBatchingPeriod={50}
      />
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

          {translationCache[selectedWord] && (
            <Text className="mb-2 text-lg font-medium">
              {translationCache[selectedWord]}
            </Text>
          )}

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
