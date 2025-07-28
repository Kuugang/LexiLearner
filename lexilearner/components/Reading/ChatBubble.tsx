import { personEnum } from "@/app/(content)";
import { useDictionary } from "@/services/DictionaryService";
import { useDictionaryStore } from "@/stores/dictionaryStore";
import { CircleIcon } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Circle } from "react-native-svg";

const ChatBubble = ({
  text,
  person,
  showIcon = false,
  onPress,
}: {
  text: string;
  person?: personEnum;
  showIcon?: boolean;
  onPress: () => void;
}) => {
  const word = useDictionaryStore((state) => state.word);
  const setWord = useDictionaryStore((state) => state.setWord);

  const { data, isLoading } = useDictionary(word);

  console.log(data);

  const words = text.split(" ").map((word) => {
    const clean = word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ""); // for lookup
    return { original: word, clean };
  });

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
        <View className="w-8 h-8" />
      )}

      {person === personEnum.Narrator ? (
        <View className="flex-1 border-2 border-lightGray border-b-4 rounded-md p-3">
          <Text className="flex-row flex-wrap flex-shrink">
            {words.map(({ original }, index) => (
              <Pressable key={index} onPress={() => onPress}>
                <Text className="text-base leading-5 ">{original} </Text>
              </Pressable>
            ))}
          </Text>
        </View>
      ) : (
        <View className="flex-1 border-2 border-appBlue border-b-4 rounded-md p-3">
          <Text className="flex-row flex-wrap flex-shrink">{data}</Text>
        </View>
      )}
    </View>
  );
};

export default ChatBubble;
