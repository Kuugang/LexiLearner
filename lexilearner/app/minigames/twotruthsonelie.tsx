import {
  ScrollView,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  useTwoTruthsOneLieGameStore,
  useMiniGameStore,
} from "@/stores/miniGameStore";
import { Minigame, MinigameType } from "@/models/Minigame";
import { useCreateMinigameLog } from "@/services/minigameService";
import { useUserStore } from "@/stores/userStore";

export default function TwoTruthsOneLie({
  minigame,
  nextGame,
}: {
  minigame: Minigame;
  nextGame: () => void;
}) {
  const { mutate: triggerCreateMinigameLog } = useCreateMinigameLog();
  const userRole = useUserStore((state) => state.user?.role);

  const [answered, setAnswered] = useState(false);

  const { choices, setChoices, setScore, resetGameState } =
    useTwoTruthsOneLieGameStore();

  const { gameOver, incrementMinigamesIndex } = useMiniGameStore();

  useEffect(() => {
    setChoices(JSON.parse(minigame.metaData).choices);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    return () => backHandler.remove();
  }, []);

  const handleAnswer = (answer: boolean) => {
    if (answered) return;
    setAnswered(true);

    try {
      let score = answer === true ? 0 : 1;
      console.log("Two Truths 1 Lie Game Over");
      if (userRole === "Pupil") {
        

      const minigameLog = gameOver({ score });

      if (!minigameLog) {
        throw Error("Minigame Log is null");
      }

      triggerCreateMinigameLog({
        minigameLog,
        type: MinigameType.TwoTruthsOneLie,
      });
    }
      setTimeout(() => {
        nextGame();
        resetGameState();
      }, 500);
    } catch (error) {
      console.error("Error during Two Truths One Lie game over logic: ", error);
    }
  };

  return (
    <ScrollView className="bg-lightGray h-full">
      <View className="flex gap-16 px-8 py-16">
        <View className="items-center gap-4">
          <Text className="text-4xl font-extrabold text-indigo-600">
            2 Truths 1 Lie
          </Text>
          <Text className="text-center text-lg font-medium text-gray-700">
            Can you find which one is the lie?
          </Text>
        </View>

        <View className="flex gap-4">
          {choices.map((choice: any, index: number) => (
            <View
              key={index}
              style={{
                padding: 20,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3,
                elevation: 3,
                margin: 4,
              }}
              className={` 
                ${
                  answered
                    ? choice.answer === true
                      ? "bg-greenCorrect"
                      : "bg-redIncorrect"
                    : "bg-white"
                }`}
            >
              <TouchableOpacity
                disabled={answered}
                onPress={() => handleAnswer(choice.answer)}
                className="w-full"
              >
                <Text className="text-lg font-semibold text-center text-gray-900">
                  {choice.choice}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
