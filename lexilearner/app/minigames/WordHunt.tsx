import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react-native";
import { useWordHuntMinigameStore } from "@/stores/miniGameStore";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { Minigame, MinigameType } from "@/models/Minigame";
import { useCreateMinigameLog } from "@/services/minigameService";

export function WordHuntBtn({
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
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center rounded-xl p-3 shadow-main ${
        isCorrect ? "bg-green-300" : isIncorrect ? "bg-red-300" : "bg-white"
      }`}
      style={{ width: "30%", height: "30%", aspectRatio: 1 }}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          fontWeight: "bold",
        }}
        className="font-bold"
      >
        {word}
      </Text>
    </Pressable>
  );
}

export default function WordHunt({ minigame }: { minigame: Minigame }) {
  const { mutate: triggerCreateMinigameLog } = useCreateMinigameLog();

  const correctAnswers = useWordHuntMinigameStore(
    (state) => state.correctAnswers,
  );
  const allWords = useWordHuntMinigameStore((state) => state.allWords);
  const lives = useWordHuntMinigameStore((state) => state.lives);
  const streak = useWordHuntMinigameStore((state) => state.streak);
  const shuffledWords = useWordHuntMinigameStore(
    (state) => state.shuffledWords,
  );

  const correctAttempts = useWordHuntMinigameStore(
    (state) => state.correctAttempts,
  );
  const incorrectAttempts = useWordHuntMinigameStore(
    (state) => state.incorrectAttempts,
  );
  const setShuffled = useWordHuntMinigameStore((state) => state.setShuffled);
  const addCorrectAttempt = useWordHuntMinigameStore(
    (state) => state.addCorrectAttempt,
  );
  const addIncorrectAttempt = useWordHuntMinigameStore(
    (state) => state.addIncorrectAttempt,
  );
  const setCorrectAnswers = useWordHuntMinigameStore(
    (state) => state.setCorrectAnswers,
  );
  const setWrongAnswers = useWordHuntMinigameStore(
    (state) => state.setWrongAnswers,
  );
  const setAllWords = useWordHuntMinigameStore((state) => state.setAllWords);
  const incrementStreak = useWordHuntMinigameStore(
    (state) => state.incrementStreak,
  );
  const resetGameState = useWordHuntMinigameStore(
    (state) => state.resetGameState,
  );
  const resetStreak = useWordHuntMinigameStore((state) => state.resetStreak);
  const decrementLives = useWordHuntMinigameStore(
    (state) => state.decrementLives,
  );

  const gameOver = useMiniGameStore((state) => state.gameOver);
  const incrementMinigamesIndex = useMiniGameStore(
    (state) => state.incrementMinigamesIndex,
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      },
    );

    const correct = JSON.parse(minigame.metaData).correct;
    const wrong = JSON.parse(minigame.metaData).wrong;
    const combined = JSON.parse(minigame.metaData).combined;

    //resetGameState();
    setCorrectAnswers(correct);
    setWrongAnswers(wrong);
    setAllWords(combined);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    setShuffled(allWords);
  }, [allWords]);

  const onPress = useCallback(
    (word: string) => {
      if (correctAnswers.includes(word) && lives > 0) {
        incrementStreak();
        addCorrectAttempt(word);
      } else {
        addIncorrectAttempt(word);
        decrementLives();
        resetStreak();
      }
    },
    [lives, streak, correctAttempts, incorrectAttempts],
  );

  useEffect(() => {
    if (correctAnswers.length === 0) return;
    if (
      lives <= 0 ||
      correctAnswers.every((item) => correctAttempts.includes(item))
    ) {
      try {
        let score = correctAttempts.length;

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

        incrementMinigamesIndex();
      } catch (error) {
        console.error("Error during Word Hunt game over logic: ", error);
      }
    }
  }, [lives, correctAttempts]);

  return (
    <ScrollView className="bg-lightGray">
      <View className="p-8 gap-4">
        <Progress
          value={
            correctAnswers.length === 0
              ? 0
              : (correctAttempts.length / correctAnswers.length) * 100
          }
          className="web:w-[60%] bg-background"
          indicatorClassName="bg-[#8383FF]"
        />

        <View className="items-center flex gap-2">
          <View className="flex flex-row gap-2 justify-center items-center">
            <Text className="text-3xl font-black">Word Hunt</Text>
          </View>

          <View className="flex flex-row justify-center gap-3">
            {Array.from({ length: lives }).map((_, i) => (
              <Heart key={i} fill="#8383FF" />
            ))}
          </View>

          <Text className="text-center font-medium p-3">
            Find words that have appeared in the reading material!
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-3 justify-center mt-6">
          {shuffledWords.map((word, i) => (
            <WordHuntBtn
              key={i}
              word={word}
              onPress={() => onPress(word)}
              disabled={
                correctAttempts.includes(word) ||
                incorrectAttempts.includes(word) ||
                lives === 0 ||
                correctAttempts.length == correctAnswers.length
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

const styles = StyleSheet.create({});
