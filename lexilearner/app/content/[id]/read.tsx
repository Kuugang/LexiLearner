import React, {
  useState,
  useMemo,
  useCallback,
  memo,
  useEffect,
  useRef,
} from "react";
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
  BackHandler,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Input } from "~/components/ui/input";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useReadingSessionStore } from "@/stores/readingSessionStore";
import { useCreateReadingSession } from "@/services/ReadingSessionService";

export default function Read() {
  const { width } = useWindowDimensions();
  const selectedContent = useReadingContentStore(
    (state) => state.selectedContent,
  );

  const scrollPercentageRef = useRef(0);
  const lastOffsetY = useRef(0);
  const flashListRef = useRef<FlashList<any>>(null);

  const [contentHeight, setContentHeight] = useState(0);
  const [visibleHeight, setVisibleHeight] = useState(0);
  const [isScrollEndReached, setScrollEndReached] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedWord, setSelectedWord] = useState("");
  const [isDefinitionLoading, setIsDefinitionLoading] = useState(false);
  const [definitionVisible, setDefinitionVisible] = useState(false);
  const [html, setHtml] = useState("");
  const [translation, setTranslation] = useState("");
  const [isContentReady, setIsContentReady] = useState(false);

  const getDefinition = useDefinitionStore((state) => state.getDefinition);
  const storeDefinition = useDefinitionStore((state) => state.storeDefinition);

  const getTranslation = useTranslationStore((state) => state.getTranslation);
  const storeTranslation = useTranslationStore(
    (state) => state.storeTranslation,
  );

  const getPastSession = useReadingSessionStore(
    (state) => state.getPastSession,
  );
  const updateReadingSessionProgress = useReadingSessionStore(
    (state) => state.updateReadingSessionProgress,
  );

  const {
    mutate: createReadingSession,
    // isPending,
    // error,
  } = useCreateReadingSession();

  const paragraphs = useMemo(() => {
    if (!selectedContent || typeof selectedContent.content !== "string")
      return [];
    return selectedContent.content
      .split("\n\n")
      .filter((paragraph) => paragraph.trim().length > 0);
  }, [selectedContent]);

  useEffect(() => {
    if (!selectedContent) return;

    const backAction = () => {
      updateReadingSessionProgress(
        selectedContent.id,
        scrollPercentageRef.current,
      );
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, [selectedContent, isContentReady]);

  const fetchTranslation = async (word: string) => {
    const existingTranslation = getTranslation(word);
    if (existingTranslation !== undefined) {
      setTranslation(existingTranslation);
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
      setTranslation("Translation failed");
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
    [fetchDefinition, getDefinition, storeDefinition],
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

  const processedParagraphs = useMemo(() => {
    return paragraphs.map((paragraph) => ({
      words: paragraph.split(" ").filter((word) => word.trim().length > 0),
    }));
  }, [paragraphs]);

  const ParagraphItem = memo(({ words }: { words: string[] }) => {
    return (
      <View className="flex-row flex-wrap mb-2">
        {words.map((word, wordIndex) => (
          <Pressable
            key={wordIndex}
            onPress={() => handleWordPress(word)}
            className="mr-1 mb-1"
          >
            <Text className="text-black">{word}</Text>
          </Pressable>
        ))}
      </View>
    );
  });

  const renderParagraph = useCallback(
    ({ item }: { item: any }) => <ParagraphItem words={item.words} />,
    [],
  );

  const estimatedItemSize = useMemo(() => {
    if (paragraphs.length === 0) return 100;
    const averageLength =
      paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length;
    return Math.max(50, Math.min(300, averageLength / 4));
  }, [paragraphs]);

  const handleEndReached = () => {
    if (initialLoad) {
      setInitialLoad(false);
    } else {
      setScrollEndReached(true);
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    const scrollY = contentOffset.y;
    const totalHeight = contentSize.height - layoutMeasurement.height;

    const scrolled = totalHeight > 0 ? scrollY / totalHeight : 0;

    scrollPercentageRef.current = Math.min(100, Math.round(scrolled * 100));

    if (scrollY < lastOffsetY.current) {
      setScrollEndReached(false);
    }

    lastOffsetY.current = scrollY;
  };

  if (!selectedContent) {
    return null;
  }

  const currentSession = getPastSession(selectedContent.id);

  if (!currentSession) {
    createReadingSession(selectedContent.id);
    return;
  }

  const [finalHeight, setFinalHeight] = useState(false);

  useEffect(() => {
    if (!isContentReady || contentHeight <= 0 || visibleHeight <= 0) return;

    if (!finalHeight) {
      // setFinalHeight(true);
      // return;
    }

    const scrollableHeight = contentHeight - visibleHeight;
    const percentage = currentSession?.completionPercentage ?? 0;
    const offsetToScroll = Math.max(0, scrollableHeight * (percentage / 100));

    const scrollTimer = setTimeout(() => {
      flashListRef.current?.scrollToOffset({
        offset: offsetToScroll,
        animated: true,
      });
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [isContentReady, contentHeight, visibleHeight]);

  return (
    <>
      <View style={{ flex: 1 }} className="bg-background">
        {!isContentReady && (
          <View className="flex-1 justify-center items-center absolute inset-0 z-50">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="mt-2">Preparing content...</Text>
          </View>
        )}

        <FlashList
          ref={flashListRef}
          keyExtractor={(item, index) => item.id || index.toString()}
          className="p-2 bg-background"
          data={processedParagraphs}
          renderItem={renderParagraph}
          estimatedItemSize={estimatedItemSize}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 80,
          }}
          onEndReachedThreshold={0.1}
          onEndReached={handleEndReached}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          onLayout={(e) => {
            setVisibleHeight(e.nativeEvent.layout.height);
          }}
          onContentSizeChange={(w, h) => {
            setContentHeight(h);
          }}
          onLoad={(elapsedTimeInMs) => {
            setIsContentReady(true);
          }}
        />

        {isScrollEndReached && (
          <View className="absolute bottom-4 right-4">
            <Text className="text-green-500 text-2xl">✅</Text>
          </View>
        )}
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
