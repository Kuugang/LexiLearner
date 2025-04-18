import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import { usePathname } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useWordsFromLettersMiniGameStore } from "@/stores/miniGameStore";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { View, ScrollView, TouchableOpacity, BackHandler } from "react-native";
import { Text } from "~/components/ui/text";
import { Heart, Shuffle } from "lucide-react-native";
import { CorrectSound } from "@/utils/sounds";
import { Progress } from "@/components/ui/progress";

export default function WordsFromLetters() {
  const wordsFromLetters = {
    letters: ["A", "E", "T", "C", "R"],
    words: ["CATER", "CRATE", "REACT", "TRACE", "RECTA", "CARTE"],
  };

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const lives = useWordsFromLettersMiniGameStore((state) => state.lives);
  const decrementLives = useWordsFromLettersMiniGameStore(
    (state) => state.decrementLives,
  );
  const letters = useWordsFromLettersMiniGameStore((state) => state.letters);
  const setLetters = useWordsFromLettersMiniGameStore(
    (state) => state.setLetters,
  );
  const guess = useWordsFromLettersMiniGameStore((state) => state.guess);
  const setGuess = useWordsFromLettersMiniGameStore((state) => state.setGuess);
  const storeShuffleLetters = useWordsFromLettersMiniGameStore(
    (state) => state.shuffleLetters,
  );
  const usedIndices = useWordsFromLettersMiniGameStore(
    (state) => state.usedIndices,
  );
  const addUsedIndex = useWordsFromLettersMiniGameStore(
    (state) => state.addUsedIndex,
  );
  const removeUsedIndex = useWordsFromLettersMiniGameStore(
    (state) => state.removeUsedIndex,
  );
  const resetUsedIndices = useWordsFromLettersMiniGameStore(
    (state) => state.resetUsedIndices,
  );
  const shuffleLetters = useCallback(storeShuffleLetters, [
    letters,
    usedIndices,
  ]);
  const correctAnswers = useWordsFromLettersMiniGameStore(
    (state) => state.correctAnswers,
  );
  const addCorrectAnswer = useWordsFromLettersMiniGameStore(
    (state) => state.addCorrectAnswer,
  );
  const incorrectAnswers = useWordsFromLettersMiniGameStore(
    (state) => state.incorrectAnswers,
  );
  const addIncorrectAnswer = useWordsFromLettersMiniGameStore(
    (state) => state.addIncorrectAnswer,
  );
  const streak = useWordsFromLettersMiniGameStore((state) => state.streak);
  const incrementStreak = useWordsFromLettersMiniGameStore(
    (state) => state.incrementStreak,
  );
  const resetStreak = useWordsFromLettersMiniGameStore(
    (state) => state.resetStreak,
  );

  const setGame = useMiniGameStore((state) => state.setGame);
  const pathname = usePathname(); // This gives you the current path

  useEffect(() => {
    setGame(pathname);
    setLetters(wordsFromLetters.letters);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const resetGuess = useCallback(() => {
    setGuess(Array(5).fill(""));
    resetUsedIndices();
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    if (!guess.includes("")) {
      const word = guess.join("");
      if (wordsFromLetters.words.includes(word)) {
        incrementStreak();
        setIsCorrect(true);
        CorrectSound.play();

        if (!correctAnswers.includes(word)) {
          addCorrectAnswer(word);
        }

        setTimeout(resetGuess, 500);
      } else {
        addIncorrectAnswer(word);
        resetStreak();
        decrementLives();
        setIsCorrect(false);
        setTimeout(resetGuess, 500);
      }
    }
  }, [guess]);

  const addLetterToGuess = useCallback(
    (letter: string, index: number) => {
      const updated = [...guess];
      const emptyIndex = updated.indexOf("");
      if (emptyIndex !== -1) {
        updated[emptyIndex] = letter;
        setGuess(updated);
        addUsedIndex(emptyIndex, index);
      }
    },
    [guess, setGuess],
  );

  const removeLetterFromGuess = useCallback(
    (slotIndex: number) => {
      if (guess[slotIndex] === "") return;

      const updatedGuess = [...guess];
      updatedGuess[slotIndex] = "";

      setGuess(updatedGuess);
      removeUsedIndex(slotIndex);
    },
    [guess, setGuess, removeUsedIndex],
  );

  const progressValue = useMemo(
    () =>
      Math.floor((correctAnswers.length / wordsFromLetters.words.length) * 100),
    [correctAnswers.length, wordsFromLetters.words.length],
  );

  return (
    <ScrollView className="bg-lightGray">
      <View className="flex p-8 gap-4">
        <Progress
          value={progressValue}
          className="web:w-[60%] bg-background"
          indicatorClassName="bg-[#8383FF]"
        />

        <View className="flex gap-36 py-16">
          <View className="flex gap-4">
            <View className="flex flex-row gap-2 justify-center items-center">
              <Text className="text-3xl font-black">Words From Letters</Text>
            </View>
            <View className="flex flex-row justify-center gap-3">
              {Array.from({ length: lives }).map((_, i) => (
                <Heart key={i} fill="#8383FF" />
              ))}
            </View>
            <Text className="text-center font-medium">
              Match and create words with the jumbled letters below!
            </Text>
          </View>

          <GuessContainer
            guess={guess}
            isCorrect={isCorrect}
            removeLetterFromGuess={removeLetterFromGuess}
          />

          <View className="flex flex-row gap-4">
            <View className="flex flex-row gap-6 justify-center">
              {letters && letters.length > 0 ? (
                letters.map((letter: string, i: number) => (
                  <LetterButton
                    key={`letter-${i}`}
                    letter={letter}
                    disabled={usedIndices.includes(i)}
                    onPress={() => addLetterToGuess(letter, i)}
                  />
                ))
              ) : (
                <Text>Loading letters...</Text>
              )}
            </View>

            <TouchableOpacity onPress={shuffleLetters}>
              <Shuffle size={50} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const LetterButton = memo(
  ({
    letter,
    onPress,
    disabled = false,
  }: {
    letter: string;
    onPress: (event: any) => void;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Text className="text-6xl font-black">{letter}</Text>
    </TouchableOpacity>
  ),
);

const GuessSlot = memo(
  ({
    letter,
    onPress,
    isCorrect,
  }: {
    letter: string;
    onPress: (event: any) => void;
    isCorrect: boolean | null;
  }) => {
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

    const animatedStyle = useAnimatedStyle(() => ({
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
      <Animated.View
        style={animatedStyle}
        className={`border p-4 rounded-md ${borderClass}`}
      >
        <TouchableOpacity onPress={onPress}>
          <Text className={`text-2xl font-black ${textClass}`}>{letter}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const GuessContainer = memo(
  ({
    guess,
    isCorrect,
    removeLetterFromGuess,
  }: {
    guess: string[];
    isCorrect: boolean | null;
    removeLetterFromGuess: (i: number) => void;
  }) => (
    <View className="flex flex-row gap-2 justify-center">
      {guess.map((letter: string, i: number) => (
        <GuessSlot
          key={`slot-${i}`}
          letter={letter}
          onPress={() => letter !== "" && removeLetterFromGuess(i)}
          isCorrect={isCorrect}
        />
      ))}
    </View>
  ),
);
