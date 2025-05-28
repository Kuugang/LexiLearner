import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { CorrectSound, IncorrectSound } from "@/utils/sounds";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react-native";
import { useWordHuntMinigameStore } from "@/stores/miniGameStore";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { Minigame, MinigameType } from "@/models/Minigame";
import { useCreateMinigameLog } from "@/services/minigameService";
import { useUserStore } from "@/stores/userStore";

function WordHuntBtn({
  word,
  onPress,
  disabled,
  isCorrect,
  isIncorrect,
}: {
  word: string;
  onPress: () => void;
  disabled: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isCorrect || isIncorrect) {
      scale.value = withSequence(
        withSpring(1.1),
        withTiming(1, { duration: 150 }),
      );
    }
  }, [isCorrect, isIncorrect]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`items-center justify-center rounded-xl p-3 shadow-md ${
          isCorrect
            ? "bg-greenCorrect"
            : isIncorrect
              ? "bg-redIncorrect"
              : "bg-white"
        }`}
        style={{
          width: 92,
          height: 92,
        }}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className="font-bold text-lg text-center text-gray-800"
        >
          {word}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function WordHunt({
  minigame,
  nextGame,
}: {
  minigame: Minigame;
  nextGame: () => void;
}) {
  const { mutate: triggerCreateMinigameLog } = useCreateMinigameLog();
  const userRole = useUserStore((state) => state.user?.role);

  const {
    correctAnswers,
    allWords,
    lives,
    streak,
    shuffledWords,
    correctAttempts,
    incorrectAttempts,
    setShuffled,
    addCorrectAttempt,
    addIncorrectAttempt,
    setCorrectAnswers,
    setWrongAnswers,
    setAllWords,
    incrementStreak,
    resetGameState,
    resetStreak,
    decrementLives,
  } = useWordHuntMinigameStore();

  const { gameOver } = useMiniGameStore();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    const correct = JSON.parse(minigame.metaData).correct;
    const wrong = JSON.parse(minigame.metaData).wrong;
    const combined = JSON.parse(minigame.metaData).combined;

    if (allWords.length === 0) {
      setCorrectAnswers(correct);
      setWrongAnswers(wrong);
      setAllWords(combined);
      setShuffled(combined);
    }
    return () => backHandler.remove();
  }, []);

  const onPress = useCallback(
    (word: string) => {
      if (correctAnswers.includes(word) && lives > 0) {
        CorrectSound.play();
        incrementStreak();
        addCorrectAttempt(word);
      } else {
        IncorrectSound.play();
        addIncorrectAttempt(word);
        decrementLives();
        resetStreak();
      }
    },
    [correctAnswers, lives, streak, correctAttempts, incorrectAttempts],
  );

  useEffect(() => {
    if (correctAnswers.length === 0) return;
    if (
      lives <= 0 ||
      correctAnswers.every((item) => correctAttempts.includes(item))
    ) {
      try {
        const score = correctAttempts.length;

        console.log("Word Hunt Game Over");

        if (userRole === "Pupil") {
          const minigameLog = gameOver({
            score,
            correctAttempts,
            incorrectAttempts,
            streak,
          });

          if (!minigameLog) {
            throw Error("Minigame Log is null");
          }

          triggerCreateMinigameLog({
            minigameLog,
            type: MinigameType.WordHunt,
          });
        }

        setTimeout(() => {
          nextGame();
          resetGameState();
        }, 500);
      } catch (error) {
        console.error("Error during Word Hunt game over logic: ", error);
      }
    }
  }, [lives, correctAttempts]);

  return (
    <ScrollView className="bg-lightGray">
      <View className="m-4 p-6 gap-6">
        <Progress
          value={
            correctAnswers.length === 0
              ? 0
              : (correctAttempts.length / correctAnswers.length) * 100
          }
          className="web:w-[60%] bg-background"
          indicatorClassName="bg-[#8383FF]"
        />

        <View className="items-center gap-2">
          <Text className="text-3xl font-black text-indigo-600">Word Hunt</Text>
          <View className="flex flex-row justify-center gap-1">
            {Array.from({ length: lives }).map((_, i) => (
              <Heart key={i} fill="#8383FF" />
            ))}
          </View>
          <Text className="text-center font-medium text-base text-gray-600">
            Find words that have appeared in the reading material!
          </Text>
        </View>
        <View className="flex-row flex-wrap justify-center gap-2 mt-6">
          {shuffledWords.map((word, i) => (
            <WordHuntBtn
              key={i}
              word={word}
              onPress={() => onPress(word)}
              disabled={
                correctAttempts.includes(word) ||
                incorrectAttempts.includes(word) ||
                lives === 0 ||
                correctAttempts.length === correctAnswers.length
              }
              isCorrect={correctAttempts.includes(word)}
              isIncorrect={incorrectAttempts.includes(word)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
