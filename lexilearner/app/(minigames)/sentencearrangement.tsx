import { useSentenceRearrangementMiniGameStore } from "@/stores/miniGameStore";
import { arrange, bubble } from "@/types/bubble";
import { MessageTypeEnum, personEnum } from "@/types/enum";
import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { makeBubble } from "@/utils/makeBubble";

const SentenceArrangementBtn = ({
  text,
  disabled,
  onPress,
}: {
  text: string;
  disabled: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      className="bg-white py-1 px-4 rounded-md"
      onPress={onPress}
      disabled={disabled}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

const SentenceArrangementBubble = ({
  partsblocks,
  correctAnswer,
  explanation,
  onPress,
}: {
  partsblocks: string[];
  correctAnswer: string;
  explanation: string;
  onPress: (msg: bubble, msgType: MessageTypeEnum) => void;
}) => {
  const [isAudio, setIsAudio] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const {
    currentAnswer,
    addPartToCurrentAnswer,
    removePartFromCurrentAnswer,
    parts,
    resetGameState,
    setParts,
  } = useSentenceRearrangementMiniGameStore();

  // init bruh
  useEffect(() => {
    resetGameState();
    setParts(partsblocks);
  }, []);

  useEffect(() => {
    if (currentAnswer.length === partsblocks.length) {
      let bubble;
      if (correctAnswer === currentAnswer.join("")) {
        bubble = makeBubble("That's correct!", "", personEnum.Game);
      } else {
        bubble = makeBubble("Aww, try again next time!", "", personEnum.Game);
      }

      setTimeout(() => onPress(bubble, MessageTypeEnum.STORY), 500);
      setIsFinished(true);
      return;
    }
  }, [currentAnswer]);

  console.log("parts", parts);
  console.log("current", currentAnswer);
  return (
    <View>
      {/* answers bubble */}
      <View className="flex-row gap-2 items-end">
        <Image
          source={require("@/assets/images/storyIcons/narrator.png")}
          className="rounded-full"
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
        />
        <View className="flex-1 border-2 border-accentBlue border-b-4 rounded-md p-3 bg-vibrantBlue">
          <Text className="mb-2">What do you think the next sentence is?</Text>
          <View className="flex-row flex-wrap gap-2">
            {currentAnswer.map((part, index) => (
              <SentenceArrangementBtn
                key={index}
                text={part}
                onPress={() => removePartFromCurrentAnswer(index)}
                disabled={isFinished}
              />
            ))}
          </View>
        </View>
      </View>
      {/* choices bubble */}
      <View className="flex-row gap-2 pt-1 items-end">
        <View className="flex-1 border-2 border-accentBlue border-b-4 rounded-md p-3 bg-vibrantBlue">
          <View className="flex-wrap flex-row gap-2">
            {parts.map((part, index) => (
              <SentenceArrangementBtn
                key={index}
                text={part}
                onPress={() => {
                  addPartToCurrentAnswer(part);
                  setParts(parts.filter((_, i) => i !== index));
                }}
                disabled={isFinished}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default SentenceArrangementBubble;
