import ReadContentHeader from "@/components/ReadContentHeader";
import ChatBubble from "@/components/Reading/ChatBubble";
import { Button } from "@/components/ui/button";
import { useDictionaryStore } from "@/stores/dictionaryStore";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Circle } from "react-native-svg";

export enum personEnum {
  Narrator = "Narrator",
  Self = "Self",
}

type bubble = {
  id: number;
  text: string;
  type: personEnum;
};

const story =
  'It was a normal morning for everybody in town. The children played in the backyard and the adults enjoyed a warm plate of breakfast. Despite the good weather and happy children, one child chose to stay inside the house. She sat on her bed and stared at a pile of papers in front of her—all of them marked failed. She began to weep. All of a sudden, she stood up and picked the papers. Enraged, she ripped every piece of paper, one by one.  "This is horrible! My parents shouldn\'t know about my poor performance in school!" It was a normal morning for everybody in town. The children played in the backyard and the adults enjoyed a warm plate of breakfast. Despite the good weather and happy children, one child chose to stay inside the house. She sat on her bed and stared at a pile of papers in front of her—all of them marked failed. She began to weep. All of a sudden, she stood up and picked the papers. Enraged, she ripped every piece of paper, one by one.  "This is horrible! My parents shouldn\'t know about my poor performance in school!" ';

const index = () => {
  const [bubbles, setBubbles] = useState<Array<bubble>>([]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const word = useDictionaryStore((state) => state.word);

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

  const onPress = () => {
    if (chunkIndex < chunks.length) {
      const newBubble = {
        text: chunks[chunkIndex],
        id: chunkIndex,
        type: personEnum.Narrator,
      };
      setBubbles((prev) => [...prev, newBubble]);
      setChunkIndex((prev) => prev + 1);
    }
  };

  const defineWord = useMemo(() => {
    if (word) {
      const newBubble = {
        text: word,
        id: chunkIndex,
        type: personEnum.Self,
      };
      setBubbles((prev) => [...prev, newBubble]);
      setChunkIndex((prev) => prev + 1);
    }
    console.log("huh");
    return;
  }, [word]);

  console.log("what the what bro", bubbles);
  return (
    <View className="flex-1 px-8">
      <ReadContentHeader
        title={"Test story fr"}
        handleBack={() => router.back()}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {bubbles.map((item, index) => (
          <View key={item.id} className="mb-3">
            <ChatBubble
              key={item.id}
              text={item.text}
              showIcon={index === bubbles.length - 1} // Only show icon on last bubble
              onPress={() => defineWord}
              person={item.type}
            />
          </View>
        ))}
      </ScrollView>

      <View className="pb-4">
        <Button onPress={onPress} disabled={chunkIndex >= chunks.length}>
          <Text className="font-bold">
            {chunkIndex >= chunks.length ? "Story Complete" : "Next"}
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default index;
