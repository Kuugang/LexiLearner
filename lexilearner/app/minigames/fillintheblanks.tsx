import React, { useEffect, useState, useCallback } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useFillInTheBlankMiniGameStore } from "@/stores/miniGameStore";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { View, ScrollView, TouchableOpacity, BackHandler } from "react-native";
import { Text } from "~/components/ui/text";
import { Heart } from "lucide-react-native";
import { Minigame, MinigameType } from "@/models/Minigame";
import { useCreateMinigameLog } from "@/services/minigameService";

export default function FillInTheBlank({
  minigame,
  nextGame,
}: {
  minigame: Minigame;
  nextGame: () => void;
}) {
  const { mutate: triggerCreateMinigameLog } = useCreateMinigameLog();

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const {
    choices,
    phrases,
    correctAnswer,
    lives,
    decrementLives,
    setPhrases,
    setCorrectAnswer,
    setChoices,
    answers,
    addAnswer,
    resetGameState,
  } = useFillInTheBlankMiniGameStore();

  const { gameOver, incrementMinigamesIndex } = useMiniGameStore();

  const shake = useSharedValue(0);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      },
    );
    resetGameState();
    setPhrases(JSON.parse(minigame.metaData).question);
    setCorrectAnswer(JSON.parse(minigame.metaData).correctAnswer);
    setChoices(JSON.parse(minigame.metaData).choices);
    return () => backHandler.remove();
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

  useEffect(() => {
    console.log(choices);
  }, [choices]);

  useEffect(() => {
    if (!answer) return;
    if (lives <= 0 || answer === correctAnswer) {
      try {
        let score = answer === correctAnswer ? 1 : 0;
        console.log("FIll in the blank Game Over");
        const minigameLog = gameOver({
          answers,
          score,
        });

        if (!minigameLog) {
          throw Error("Minigame Log is null");
        }

        triggerCreateMinigameLog({
          minigameLog,
          type: MinigameType.FillInTheBlanks,
        });

        setTimeout(() => {
          nextGame();
          resetGameState();
        }, 500);
      } catch (error) {
        console.error(
          "Error during Fill in the blank game over logic: ",
          error,
        );
      }
    }
  }, [answer]);

  const handleAnswer = async (index: number) => {
    setAnswer(choices[index]);
    addAnswer(choices[index]);

    if (choices[index] === correctAnswer) {
      setIsCorrect(true);
      await new Promise((res) => setTimeout(res, 500));
    } else {
      setIsCorrect(false);
      await new Promise((res) => setTimeout(res, 500));
      setIsCorrect(null);
      setAnswer(null);
      decrementLives();
    }
  };

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
              <Text className="text-3xl font-black text-indigo-600 ">
                Fill in the Blank
              </Text>
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
                {phrases.split("{{blank}}")[0]}
                <Text
                  className={`text-2xl font-semibold flex flex-row flex-wrap underline ${textClass} text-blue-500`}
                >
                  {answer ||
                    "_".repeat(
                      choices.length > 0
                        ? Math.max(...choices.map((c: any) => c.length))
                        : 5,
                    )}
                </Text>
                {phrases.split("{{blank}}")[1]}
              </Text>
            </Animated.View>

            <View className="flex flex-col gap-4 items-center">
              {choices.map((choice: any, index: any) => {
                return (
                  <View
                    key={index}
                    className="shadow-xl shadow-blue-700 bg-white border border-gray-300 p-4 rounded-md w-full"
                  >
                    <TouchableOpacity onPress={() => handleAnswer(index)}>
                      <Text className="text-xl font-semibold text-center">
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
