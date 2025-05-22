import React, { useEffect, useState, useCallback, memo } from "react";
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
import { View, ScrollView, TouchableOpacity, BackHandler } from "react-native";
import { Text } from "~/components/ui/text";
import { Heart } from "lucide-react-native";
import { Minigame, MinigameType } from "@/models/Minigame";
import { useCreateMinigameLog } from "@/services/minigameService";
import { useUserStore } from "@/stores/userStore";

// Consistent colors for parts - alternate between these two
const PART_COLORS = ["#FFFFFF", "#7dd3fc"];

// Memoized Part component to prevent unnecessary re-renders
const Part = memo(
  ({
    part,
    index,
    onPress,
    colorIndex,
  }: {
    part: string;
    index: number;
    onPress: (index: number, colorIndex: number) => void;
    colorIndex: number;
  }) => {
    const partStyle = {
      backgroundColor: PART_COLORS[colorIndex % 2],
      padding: 12,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 3,
      margin: 4,
    };

    const isLeft = index % 2 === 0;

    return (
      <Animated.View layout={LinearTransition.duration(300)} style={partStyle}>
        <TouchableOpacity onPress={() => onPress(index, colorIndex)}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{part}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

// Memoized Answer Part component
const AnswerPart = memo(
  ({
    part,
    index,
    onPress,
    textClass,
    colorIndex,
  }: {
    part: string;
    index: number;
    onPress: (index: number) => void;
    textClass: string;
    colorIndex: number;
  }) => {
    const partStyle = {
      backgroundColor: PART_COLORS[colorIndex % 2],
      padding: 12,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 3,
      margin: 4,
    };

    return (
      <Animated.View
        key={`answer-${index}`}
        entering={FadeIn.duration(300)}
        style={partStyle}
      >
        <TouchableOpacity onPress={() => onPress(index)}>
          <Text
            style={{ fontSize: 16, fontWeight: "600" }}
            className={textClass}
          >
            {part}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

export default function SentenceArrangement({
  minigame,
  nextGame,
}: {
  minigame: Minigame;
  nextGame: () => void;
}) {
  const sentenceArrangementData = React.useMemo(
    () => ({
      correctAnswer: JSON.parse(minigame.metaData).correctAnswer,
      parts: JSON.parse(minigame.metaData).parts,
    }),
    [minigame.metaData],
  );

  const userRole = useUserStore((state) => state.user?.role);

  const { mutate: triggerCreateMinigameLog } = useCreateMinigameLog();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState("");
  // Track color indices for each part
  const [colorIndices, setColorIndices] = useState<number[]>([]);
  // Track color indices for answer parts
  const [answerColorIndices, setAnswerColorIndices] = useState<number[]>([]);

  // Use selectors to minimize re-renders
  const {
    lives,
    decrementLives,
    correctAnswer,
    parts,
    setCorrectAnswer,
    setParts,
    currentAnswer,
    addPartToCurrentAnswer,
    removePartFromCurrentAnswer,
    resetCurrentAnswer,
    answers,
    addAnswer,
    resetGameState,
  } = useSentenceRearrangementMiniGameStore();

  const { gameOver, incrementMinigamesIndex } = useMiniGameStore();

  // Initialize game state
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    if (parts.length === 0) {
      setCorrectAnswer(
        sentenceArrangementData.correctAnswer.map(
          (text: string): string => text,
        ),
      );
      setParts(sentenceArrangementData.parts);
    }

    setColorIndices(
      sentenceArrangementData.parts.map(
        (_: any, idx: number): number => idx % 2,
      ),
    );

    setAnswerColorIndices([]);

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (lives <= 0 || isCorrect) {
      try {
        const score = isCorrect ? 1 : 0;

        console.log("Sentence Rearrangement Game Over");
        if (userRole === "Pupil") {

        const minigameLog = gameOver({ answers, score });

        if (!minigameLog) {
          throw Error("Minigame Log is null");
        }

        triggerCreateMinigameLog({
          minigameLog,
          type: MinigameType.SentenceRearrangement,
        });}

        setTimeout(() => {
          nextGame();
          resetGameState();
        }, 500);
      } catch (error) {
        console.error(
          "Error during sentence arrangement game over logic: ",
          error,
        );
      }
    }
  }, [isCorrect, lives]);

  // Add part to answer - memoized to avoid recreating on every render
  const addPart = useCallback(
    async (index: number, colorIndex: number) => {
      // Update parts
      const update = [...parts];
      const selectedPart = update[index];

      // Update current answer
      const newAnswer = [...currentAnswer, selectedPart];
      addPartToCurrentAnswer(selectedPart);

      // Update color indices for answers
      const newAnswerColorIndices = [...answerColorIndices, colorIndex];
      setAnswerColorIndices(newAnswerColorIndices);

      // Remove the part from available parts
      update.splice(index, 1);
      setParts(update);

      // Also remove the color index
      const newColorIndices = [...colorIndices];
      newColorIndices.splice(index, 1);
      setColorIndices(newColorIndices);

      if (update.length === 0) {
        addAnswer(newAnswer);

        if (JSON.stringify(newAnswer) === JSON.stringify(correctAnswer)) {
          setFeedback("Correct! Great job!");
          setIsCorrect(true);
          await new Promise((res) => setTimeout(res, 500));
        } else {
          setFeedback("Try again!");
          setIsCorrect(false);
          await new Promise((res) => setTimeout(res, 500));
          decrementLives();
          resetCurrentAnswer();
          setParts(sentenceArrangementData.parts);
          // Reset color indices
          setColorIndices(
            sentenceArrangementData.parts.map((_: any, idx: number) => idx % 2),
          );
          setAnswerColorIndices([]);
          setIsCorrect(null);
          setTimeout(() => setFeedback(""), 1500);
        }
      }
    },
    [parts, currentAnswer, correctAnswer, colorIndices, answerColorIndices],
  );

  // Remove part from answer - memoized
  const removePart = useCallback(
    (index: number) => {
      const colorIndex = answerColorIndices[index];

      // Add the color index back to the parts array
      setColorIndices([...colorIndices, colorIndex]);

      // Remove the color index from the answer
      const newAnswerColorIndices = [...answerColorIndices];
      newAnswerColorIndices.splice(index, 1);
      setAnswerColorIndices(newAnswerColorIndices);

      // Remove the part from the answer
      removePartFromCurrentAnswer(index);
    },
    [answerColorIndices, colorIndices],
  );

  // Animation for incorrect answers
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

  // Style classes based on correctness
  const borderClass =
    isCorrect === true
      ? "border-green-500"
      : isCorrect === false
        ? "border-red-500"
        : "border-gray-300";

  const textClass =
    isCorrect === true
      ? "text-green-500"
      : isCorrect === false
        ? "text-red-500"
        : "";

  // Memoize the parts list to prevent unnecessary re-renders
  const partsList = React.useMemo(() => {
    return parts.map((part, index) => (
      <Part
        key={`part-${part}-${index}`}
        part={part}
        index={index}
        onPress={addPart}
        colorIndex={colorIndices[index]}
      />
    ));
  }, [parts, colorIndices, addPart]);

  // Answer container styles
  const answerContainerStyle = {
    minHeight: 100,
    padding: 16,
    borderWidth: 2,
    borderColor:
      isCorrect === null ? "#e0e0e0" : isCorrect ? "#22c55e" : "#ef4444",
    borderRadius: 16,
    backgroundColor: "#f9f9f9",
    marginVertical: 16,
  };

  return (
    <ScrollView className="bg-lightGray">
      <View className="flex p-8 gap-6">
        <View className="flex py-12">
          <View className="flex gap-6">
            <View className="flex flex-row gap-2 justify-center items-center">
              <Text className="text-3xl font-black text-center text-indigo-600">
                Sentence Arrangement
              </Text>
            </View>

            <View className="flex flex-row justify-center gap-3">
              {Array.from({ length: lives }).map((_, i) => (
                <Heart key={i} fill="#8383FF" size={24} />
              ))}
            </View>

            <Text className="text-center font-medium text-gray-700 text-lg">
              Arrange the word blocks to make the sentence!
            </Text>

            {feedback ? (
              <Animated.Text
                entering={FadeIn.duration(300)}
                className={`text-center font-bold text-lg ${isCorrect ? "text-green-500" : "text-red-500"}`}
              >
                {feedback}
              </Animated.Text>
            ) : null}
          </View>

          <View className="flex gap-6">
            <Animated.View
              style={[answerContainerStyle, shakeAnimationStyle]}
              className={`border-2 rounded-lg ${borderClass}`}
            >
              <View className="flex flex-row gap-2 flex-wrap justify-center">
                {currentAnswer.map((part, index) => (
                  <AnswerPart
                    key={`answer-part-${index}`}
                    part={part}
                    index={index}
                    onPress={removePart}
                    textClass={textClass}
                    colorIndex={answerColorIndices[index]}
                  />
                ))}
              </View>
            </Animated.View>

            <View className="flex flex-row flex-wrap gap-3 justify-center items-center">
              {partsList}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
