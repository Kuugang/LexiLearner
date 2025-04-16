import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import { useScreenTime } from "~/hooks/useScreenTime";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Heart } from "lucide-react-native";
import BackHeader from "@/components/BackHeader";
import { CorrectSound } from "@/utils/sounds";
import { Progress } from "@/components/ui/progress";

const LetterButton = memo(({ letter, onPress, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={{ opacity: disabled ? 0.5 : 1 }}
  >
    <Text className="text-6xl font-black">{letter}</Text>
  </TouchableOpacity>
));

const GuessSlot = memo(({ letter, onPress, isCorrect }) => {
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shake.value }],
    };
  });

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
    <Animated.View
      style={animatedStyle}
      className={`border p-4 rounded-md ${borderClass}`}
    >
      <TouchableOpacity onPress={onPress}>
        <Text className={`text-2xl font-black ${textClass}`}>{letter}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

function WordFromLetters() {
  const [isCorrect, setIsCorrect] = useState<true | false | null>(null);
  const wordsFromLetters: WordsFromLettersType = {
    letters: ["A", "E", "T", "C", "R"],
    words: ["CATER", "CRATE", "REACT", "TRACE", "RECTA", "CARTE"],
  };

  const [guess, setGuess] = useState(Array(5).fill(""));
  const [usedIndices, setUsedIndices] = useState([]);

  const [correctAnswers, setCorrectAnswers] = useState<[string] | []>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<[string] | []>([]);
  const [streak, setStreak] = useState<number>(0);

  // useScreenTime((duration) => {
  //   console.log(`User spent ${duration} seconds here.`);
  // });

  const resetGuess = useCallback(() => {
    setGuess(Array(5).fill(""));
    setUsedIndices([]);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    if (!guess.includes("")) {
      const word = guess.join("");
      if (wordsFromLetters.words.includes(word)) {
        setStreak(streak + 1);
        setIsCorrect(true);
        CorrectSound.play();
        if (!correctAnswers.includes(word)) {
          setCorrectAnswers((prev) => [...prev, word]);
        }
        setTimeout(() => {
          resetGuess();
        }, 500);
      } else {
        setStreak(0);
        if (!incorrectAnswers.includes(word)) {
          setIncorrectAnswers((prev) => [...prev, word]);
        }
        setIsCorrect(false);
        setTimeout(() => {
          resetGuess();
        }, 500);
      }
    }
  }, [guess]);

  const addLetterToGuess = useCallback((letter: string, index: number) => {
    setGuess((current) => {
      const firstEmptyIndex = current.indexOf("");
      if (firstEmptyIndex === -1) return current;

      const updated = [...current];
      updated[firstEmptyIndex] = letter;
      return updated;
    });

    setUsedIndices((current) => [...current, index]);
  }, []);

  const removeLetterFromGuess = useCallback((slotIndex: number) => {
    setGuess((current) => {
      if (current[slotIndex] === "") return current;

      const updated = [...current];
      updated[slotIndex] = "";
      return updated;
    });

    setUsedIndices((current) => {
      const updated = [...current];
      return updated.slice(0, -1);
    });
  }, []);

  return (
    <ScrollView className="bg-lightGray">
      <View className="flex p-8 gap-4">
        <BackHeader />

        <Progress
          value={Math.floor(
            (correctAnswers.length / wordsFromLetters.words.length) * 100,
          )}
          className="web:w-[60%] bg-background"
          indicatorClassName="bg-[#8383FF]"
        />

        <View className="flex gap-36 py-16">
          <View className="flex gap-4">
            <View className="flex flex-row gap-2 justify-center items-center">
              <Heart fill="#8383FF" />
              <Text className="text-3xl font-black">Words From Letters</Text>
            </View>
            <Text className="text-center font-medium">
              Match and create words with the jumbled letters below!
            </Text>
          </View>

          {/* Guess slots */}
          <View className="flex flex-row gap-2 justify-center">
            {guess.map((letter, i) => (
              <GuessSlot
                key={`slot-${i}`}
                letter={letter}
                onPress={() => letter !== "" && removeLetterFromGuess(i)}
                isCorrect={isCorrect}
              />
            ))}
          </View>

          {/* Letter buttons */}
          <View className="flex flex-row gap-6 justify-center">
            {wordsFromLetters.letters.map((letter, i) => (
              <LetterButton
                key={`letter-${i}`}
                letter={letter}
                disabled={usedIndices.includes(i)}
                onPress={() => addLetterToGuess(letter, i)}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default WordFromLetters;
