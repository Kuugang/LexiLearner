import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  FadeIn,
  LinearTransition,
} from "react-native-reanimated";
import { useSentenceRearrangementMiniGameStore } from "@/stores/miniGameStore";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Heart, Shuffle } from "lucide-react-native";
import { Minigame } from "@/models/Minigame";

export default function SentenceArrangement({
  minigame,
}: {
  minigame: Minigame;
}) {
  const sentenceArrangementData = {
    correctAnswer: JSON.parse(minigame.metaData).correctAnswer,
    parts: JSON.parse(minigame.metaData).parts,
  };
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const lives = useSentenceRearrangementMiniGameStore((state) => state.lives);
  const decrementLives = useSentenceRearrangementMiniGameStore(
    (state) => state.decrementLives,
  );
  const correctAnswer = useSentenceRearrangementMiniGameStore(
    (state) => state.correctAnswer,
  );
  const parts = useSentenceRearrangementMiniGameStore((state) => state.parts);
  const setCorrectAnswer = useSentenceRearrangementMiniGameStore(
    (state) => state.setCorrectAnswer,
  );
  const setParts = useSentenceRearrangementMiniGameStore(
    (state) => state.setParts,
  );
  const currentAnswer = useSentenceRearrangementMiniGameStore(
    (state) => state.currentAnswer,
  );
  const addPartToCurrentAnswer = useSentenceRearrangementMiniGameStore(
    (state) => state.addPartToCurrentAnswer,
  );
  const removePartFromCurrentAnswer = useSentenceRearrangementMiniGameStore(
    (state) => state.removePartFromCurrentAnswer,
  );
  const resetCurrentAnswer = useSentenceRearrangementMiniGameStore(
    (state) => state.resetCurrentAnswer,
  );
  const resetGameState = useSentenceRearrangementMiniGameStore(
    (state) => state.resetGameState,
  );

  useEffect(() => {
    setCorrectAnswer(
      sentenceArrangementData.correctAnswer.map((text: string) => text),
    );
    setParts(sentenceArrangementData.parts);
  }, []);

  const addPart = useCallback(
    async (index: number) => {
      const update = [...parts];
      const selectedPart = update[index];

      const newAnswer = [...currentAnswer, selectedPart];
      addPartToCurrentAnswer(selectedPart);

      update.splice(index, 1);
      setParts(update);

      if (update.length === 0) {
        if (JSON.stringify(newAnswer) === JSON.stringify(correctAnswer)) {
          setIsCorrect(true);
          await new Promise((res) => setTimeout(res, 500));
        } else {
          setIsCorrect(false);
          await new Promise((res) => setTimeout(res, 500));
          setTimeout(() => null, 500);
          decrementLives();
          resetCurrentAnswer();
          setParts(sentenceArrangementData.parts);
          setIsCorrect(null);
        }
      }
    },
    [parts, currentAnswer],
  );

  const removePart = useCallback(
    (index: number) => {
      removePartFromCurrentAnswer(index);
    },
    [parts, currentAnswer],
  );

  const shake = useSharedValue(0);

  useEffect(() => {
    if (isCorrect === false) {
      shake.value = withSequence(
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [isCorrect]);

  const shakeAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const borderClass =
    isCorrect === true
      ? "border-green-500"
      : isCorrect === false
        ? "border-red-500"
        : "";

  const textClass =
    isCorrect === true
      ? "text-green-500"
      : isCorrect === false
        ? "text-red-500"
        : "";

  return (
    <ScrollView className="bg-lightGray">
      <View className="flex p-8 gap-4">
        {/* <Progress */}
        {/*   value={80} */}
        {/*   className="web:w-[60%] bg-background" */}
        {/*   indicatorClassName="bg-[#8383FF]" */}
        {/* /> */}

        <View className="flex gap-36 py-16">
          <View className="flex gap-4">
            <View className="flex flex-row gap-2 justify-center items-center">
              <Text className="text-3xl font-black text-center">
                Sentence Arrangement
              </Text>
            </View>
            <View className="flex flex-row justify-center gap-3">
              {Array.from({ length: lives }).map((_, i) => (
                <Heart key={i} fill="#8383FF" />
              ))}
            </View>
            <Text className="text-center font-medium">
              Arrange the word blocks to make the sentence!
            </Text>
          </View>

          <View className="flex gap-4">
            <Animated.View
              style={[answerContainerStyle, shakeAnimationStyle]}
              className={`border p-4 rounded-md ${borderClass}`}
            >
              <View className="flex flex-row gap-2 flex-wrap">
                {currentAnswer.map((part, index) => {
                  const partStyle = getPartStyle(
                    index % 2 === 0 ? "white" : "#7dd3fc",
                  );

                  return (
                    <Animated.View
                      key={index}
                      entering={FadeIn.duration(300)}
                      style={partStyle}
                    >
                      <TouchableOpacity onPress={() => removePart(index)}>
                        <Text
                          style={{ fontSize: 16, fontWeight: "500" }}
                          className={textClass}
                        >
                          {part}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>

            <View className="flex flex-col gap-4 items-center">
              {parts && parts.length > 0 ? (
                parts.map((part, index) => {
                  const isLeft = index % 2 === 0 ? true : false;
                  return (
                    <Animated.View key={index} layout={LinearTransition}>
                      <View
                        style={getPartStyle(
                          index % 2 === 0 ? "white" : "#7dd3fc",
                        )}
                        className={isLeft ? "left-10" : "right-10"}
                      >
                        <TouchableOpacity onPress={() => addPart(index)}>
                          <Text style={{ fontSize: 16, fontWeight: "500" }}>
                            {part}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  );
                })
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const answerContainerStyle = {
  minHeight: 80,
  padding: 10,
  borderWidth: 1,
  borderColor: "#e0e0e0",
  borderRadius: 12,
  backgroundColor: "#f9f9f9",
};

const getPartStyle = (color: string) => ({
  backgroundColor: color,
  padding: 12,
  borderRadius: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1.5,
  elevation: 2,
});
