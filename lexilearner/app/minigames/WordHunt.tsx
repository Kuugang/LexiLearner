import {
  BackHandler,
  ColorValue,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react-native";
import { useWordHuntGameStore } from "@/stores/miniGameStore";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { usePathname } from "expo-router";

export function WordHuntBtn({
  word,
  onPress,
  disabled,
}: {
  word: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center rounded-xl p-3 shadow-main ${
        disabled ? "bg-gray-300" : "bg-white"
      }`}
      style={{ width: "30%", height: "30%", aspectRatio: 1 }}
    >
      <Text className="font-bold">{word}</Text>
    </Pressable>
  );
}

export default function WordHunt() {
  const correctAnswers = useWordHuntGameStore((state) => state.correctAnswers);
  const wrongAnswers = useWordHuntGameStore((state) => state.wrongAnswers);
  const allWords = useWordHuntGameStore((state) => state.allWords);
  const lives = useWordHuntGameStore((state) => state.lives);
  const streak = useWordHuntGameStore((state) => state.streak);
  const shuffledWords = useWordHuntGameStore((state) => state.shuffledWords);
  const answered = useWordHuntGameStore((state) => state.answered);

  const setShuffled = useWordHuntGameStore((state) => state.setShuffled);
  const setAnswered = useWordHuntGameStore((state) => state.setAnswered);
  const setCorrectAnswers = useWordHuntGameStore(
    (state) => state.setCorrectAnswers,
  );
  const setWrongAnswers = useWordHuntGameStore(
    (state) => state.setWrongAnswers,
  );
  const setAllWords = useWordHuntGameStore((state) => state.setAllWords);
  const incrementStreak = useWordHuntGameStore(
    (state) => state.incrementStreak,
  );
  const newGame = useWordHuntGameStore((state) => state.newGame);
  const resetStreak = useWordHuntGameStore((state) => state.resetStreak);
  const decrementLives = useWordHuntGameStore((state) => state.decrementLives);

  const setGame = useMiniGameStore((state) => state.setGame);
  const pathname = usePathname(); // This gives you the current path

  // TODO morerender syag thrice somewhere diri HSHAHSAH
  useEffect(() => {
    const correct = ["hood", "weak", "peep", "quietly", "child", "nothing"];
    const wrong = ["paramore", "laptop", "phone"];
    const combined = [...correct, ...wrong];

    setCorrectAnswers(correct);
    setWrongAnswers(wrong);
    setAllWords(combined);
    newGame();
  }, []);

  useEffect(() => {
    setGame(pathname);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    setShuffled(allWords);
  }, [allWords]);

  const onPress = useCallback(
    (word: string) => {
      console.log("TEST: ", correctAnswers.includes(word));
      if (correctAnswers.includes(word) && lives > 0) {
        incrementStreak();
        setAnswered(word);
      } else {
        decrementLives();
        resetStreak();
      }
    },
    [lives, streak, answered],
  );

  console.log(correctAnswers, lives, streak);
  console.log("ANSWERED: ", answered);

  return (
    <ScrollView className="bg-lightGray">
      <View>
        <BackHeader />

        <Progress
          value={(streak / correctAnswers.length) * 100}
          className="web:w-[60%] bg-background"
          indicatorClassName="bg-[#8383FF]"
        />

        <View className="p-8">
          <View className="items-center">
            <View className="flex flex-row justify-center gap-3">
              {Array.from({ length: lives }).map((_, i) => (
                <Heart key={i} fill="#8383FF" />
              ))}
            </View>
            <View className="flex flex-row gap-2 justify-center items-center">
              <Text className="text-3xl font-black">Word Hunt</Text>
            </View>
            <Text className="text-center font-medium p-3">
              Find words that have appeared in the book!
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3 justify-center mt-6">
            {shuffledWords.map((word, i) => (
              <WordHuntBtn
                key={i}
                word={word}
                onPress={() => onPress(word)}
                disabled={
                  answered.includes(word) ||
                  lives === 0 ||
                  answered.length == correctAnswers.length
                }
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
