import { bubble, personEnum } from "@/app/(content)";
import { useDictionary } from "@/services/DictionaryService";
import { useDictionaryStore } from "@/stores/dictionaryStore";
import { CircleIcon, Volume2, Volume2Icon } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Tts from "react-native-tts";

const ChatBubble = ({
  showIcon = false,
  onWordPress,
  bubble,
}: {
  bubble: bubble;
  showIcon?: boolean;
  onWordPress: (word: string) => void;
}) => {
  const words = bubble.text.split(" ").map((word) => {
    const clean = word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ""); // for lookup
    return { original: word, clean };
  });

  const onAudioPress = (word: string) => {
    Tts.speak(word);
  };

  return (
    <View className="flex flex-row gap-2 items-end">
      {showIcon ? (
        <CircleIcon
          height={32}
          width={32}
          fill="rgb(255, 205, 55)"
          className="mt-1"
        />
      ) : (
        <View className="h-8" />
      )}

      {bubble.type === personEnum.Narrator ? (
        <View className="flex-1 border-2 border-lightGray-200 border-b-4 rounded-md p-3 bg-white">
          <Text className="flex-row flex-wrap flex-shrink">
            {words.map((word, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  onWordPress(word.clean);
                }}
              >
                <Text className="text-base leading-5 px-0.5">
                  {word.original}
                </Text>
              </Pressable>
            ))}
          </Text>
        </View>
      ) : (
        <View className="flex-1 border-2 border-accentBlue border-b-4 rounded-md p-3 bg-vibrantBlue">
          <View className="flex flex-row gap-3">
            <Text className="font-bold text-lg">{bubble.text}</Text>
            <Pressable onPress={() => onAudioPress(bubble.text)}>
              <Volume2 fill={"#2F1E38"} />
            </Pressable>
          </View>
          <Text className="italic">(bisaya translation frfr)</Text>
          <Text className="flex-row flex-wrap flex-shrink">
            {bubble.definition}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ChatBubble;
