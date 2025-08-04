import ReadContentHeader from "@/components/ReadContentHeader";
import ChatBubble from "@/components/Reading/ChatBubble";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/services/DictionaryService";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";

export enum personEnum {
  Narrator = "Narrator",
  Self = "Self",
}

export type bubble = {
  id: number;
  text: string;
  definition: string;
  type: personEnum;
};

const story =
  'It was a normal morning for everybody in town. The children played in the backyard and the adults enjoyed a warm plate of breakfast. Despite the good weather and happy children, one child chose to stay inside the house. $MINIGAME$ She sat on her bed and stared at a pile of papers in front of her—all of them marked failed. She began to weep. All of a sudden, she stood up and picked the papers. Enraged, she ripped every piece of paper, one by one.  "This is horrible! My parents shouldn\'t know about my poor performance in school!" It was a normal morning for everybody in town. The children played in the backyard and the adults enjoyed a warm plate of breakfast. Despite the good weather and happy children, one child chose to stay inside the house. She sat on her bed and stared at a pile of papers in front of her—all of them marked failed. She began to weep. All of a sudden, she stood up and picked the papers. Enraged, she ripped every piece of paper, one by one.  "This is horrible! My parents shouldn\'t know about my poor performance in school!" ';

const index = () => {
  const [bubbles, setBubbles] = useState<Array<bubble>>([]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [word, setWord] = useState<string | null>(null);
  const { data, isLoading } = useDictionary(word || "");
  const bubbleCount = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [bubbles]);

  const chunks = useMemo(() => {
    function splitStory(fullStory: string, sentencesPerChunk = 2) {
      // Find all sentences (ending with . ! or ?)
      const sentences = fullStory.match(/[^\.!?]+[\.!?]+/g) || [];
      const result: string[] = [];

      // Group them into chunks of 2 (or whatever you want)
      for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
        const chunk = sentences.slice(i, i + sentencesPerChunk).join(" ");
        result.push(chunk.trim());
      }

      return result;
    }
    return splitStory(story);
  }, []);

  useEffect(() => {
    if (!word || isLoading) return;

    if (word) {
      const newBubble = {
        text: word,
        definition: data,
        id: bubbleCount.current,
        type: personEnum.Self,
      };

      if (bubbles[bubbles.length - 1].type == personEnum.Self) {
        setBubbles((prev) => [...prev.slice(0, -1), newBubble]);
      } else {
        setBubbles((prev) => [...prev, newBubble]);
      }
      setWord(null);
      bubbleCount.current++;
    }
  }, [data, isLoading]);

  const onPress = () => {
    if (chunkIndex < chunks.length) {
      const newBubble = {
        text: chunks[chunkIndex],
        definition: "",
        id: bubbleCount.current,
        type: personEnum.Narrator,
      };
      setBubbles((prev) => [...prev, newBubble]);
      setChunkIndex((prev) => prev + 1);
      bubbleCount.current++;
    }
  };

  const defineWord = (word: string) => {
    if (word.length < 2) return;
    // if (!word) return;
    setWord(word);
  };

  console.log("what the what bro", bubbles);
  return (
    <View className="flex-1 bg-lightGray">
      <ReadContentHeader
        title="Test story fr"
        handleBack={() => router.back()}
        background="white"
      />

      <View className="flex-1 px-6 my-4">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          <View
            style={{ minHeight: screenHeight }}
            className="flex justify-end"
          >
            {bubbles.map((item) => (
              <View key={item.id} className="mb-3">
                <ChatBubble
                  bubble={item}
                  showIcon={item.type === personEnum.Narrator}
                  onWordPress={defineWord}
                />
              </View>
            ))}

            <View className="py-4">
              <Button onPress={onPress} disabled={chunkIndex >= chunks.length}>
                <Text className="font-bold text-black">
                  {chunkIndex >= chunks.length ? "Story Complete" : "Next"}
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default index;
