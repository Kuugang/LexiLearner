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
import { useFillInTheBlankMiniGameStore } from "@/stores/miniGameStore";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { View, ScrollView, TouchableOpacity, BackHandler } from "react-native";
import { Text } from "~/components/ui/text";
import { Heart, Shuffle } from "lucide-react-native";
import { Minigame } from "@/models/Minigame";

export default function FillInTheBlank(props: Minigame) {
  const fillInTheBlankData = {
    phrases: JSON.parse(props.metaData).question,
    correctAnswer: JSON.parse(props.metaData).correctAnswer,
    choices: JSON.parse(props.metaData).choices,
  };

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  const lives = useFillInTheBlankMiniGameStore((state) => state.lives);
  const decrementLives = useFillInTheBlankMiniGameStore(
    (state) => state.decrementLives,
  );
  const setPhrases = useFillInTheBlankMiniGameStore(
    (state) => state.setPhrases,
  );
  const setCorrectAnswer = useFillInTheBlankMiniGameStore(
    (state) => state.setCorrectAnswer,
  );
  const setChoices = useFillInTheBlankMiniGameStore(
    (state) => state.setChoices,
  );
  const addAnswer = useFillInTheBlankMiniGameStore((state) => state.addAnswer);
  const resetGameState = useFillInTheBlankMiniGameStore(
    (state) => state.resetGameState,
  );

  const shake = useSharedValue(0);

  useEffect(() => {
    //resetGameState();
    setPhrases(fillInTheBlankData.phrases);
    setCorrectAnswer(fillInTheBlankData.correctAnswer);
    setChoices(fillInTheBlankData.choices);
  }, []);

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

  const handleAnswer = useCallback(
    async (index: number) => {
      setAnswer(fillInTheBlankData.choices[index]);
      addAnswer(fillInTheBlankData.choices[index]);

      console.log(
        fillInTheBlankData.choices[index],
        fillInTheBlankData.correctAnswer,
      );

      if (
        fillInTheBlankData.choices[index] === fillInTheBlankData.correctAnswer
      ) {
        setIsCorrect(true);
        await new Promise((res) => setTimeout(res, 500));
      } else {
        setIsCorrect(false);
        await new Promise((res) => setTimeout(res, 500));
        setIsCorrect(null);
        setAnswer(null);
        decrementLives();
      }
    },
    [answer],
  );

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
      ? "!text-green-500"
      : isCorrect === false
        ? "!text-red-500"
        : "";

  return (
    <ScrollView className="bg-lightGray">
      <View className="flex p-8 gap-4">
        <View className="flex gap-12 py-16">
          <View className="flex gap-4">
            <View className="flex flex-row gap-2 justify-center items-center">
              <Text className="text-3xl font-black">Fill in the Blank</Text>
            </View>
            <View className="flex flex-row justify-center gap-3">
              {Array.from({ length: lives }).map((_, i) => (
                <Heart key={i} fill="#8383FF" />
              ))}
            </View>
            <Text className="text-center font-medium">
              Choose the right word to fill in the blank!
            </Text>
          </View>

          <View className="flex gap-12">
            <Animated.View
              style={[shakeAnimationStyle]}
              className={borderClass}
            >
              <Text className="text-2xl font-semibold flex flex-row flex-wrap">
                {fillInTheBlankData.phrases.split("{{blank}}")[0]}
                <Text
                  className={`text-2xl font-semibold flex flex-row flex-wrap underline ${textClass} text-blue-500`}
                >
                  {answer ||
                    "_".repeat(
                      Math.max(
                        ...fillInTheBlankData.choices.map((c: any) => c.length),
                      ),
                    )}
                </Text>
                {fillInTheBlankData.phrases.split("{{blank}}")[1]}
              </Text>
            </Animated.View>

            <View className="flex flex-col gap-4 items-center">
              {fillInTheBlankData.choices.map((choice: any, index: any) => {
                return (
                  <View
                    key={index}
                    className="shadow-xl shadow-blue-700 bg-white border border-gray-300 p-4 rounded-md w-full"
                  >
                    <TouchableOpacity onPress={() => handleAnswer(index)}>
                      <Text className="text-2xl font-bold text-center">
                        {choice}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
