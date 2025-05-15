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

export default function TwoTruthsOneLie({ minigame }: { minigame: Minigame }) {
  const { mutate: triggerCreateMinigameLog } = useCreateMinigameLog();
  const [answered, setAnswered] = useState(false);
  const choices = useTwoTruthsOneLieGameStore((state) => state.choices);
  const setChoices = useTwoTruthsOneLieGameStore((state) => state.setChoices);
  const setScore = useTwoTruthsOneLieGameStore((state) => state.setScore);
  const resetGameState = useTwoTruthsOneLieGameStore(
    (state) => state.resetGameState,
  );

  const gameOver = useMiniGameStore((state) => state.gameOver);
  const incrementMinigameIndex = useMiniGameStore(
    (state) => state.incrementMinigamesIndex,
  );

  useEffect(() => {
    //resetGameState();
    setChoices(JSON.parse(minigame.metaData).choices);

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const handleAnswer = (answer: boolean) => {
    setAnswered(true);

    try {
      let score = answer === true ? 0 : 1;
      const minigameLog = gameOver({
        score,
      });

      if (!minigameLog) {
        throw Error("Minigame Log is null");
      }

      triggerCreateMinigameLog({
        minigameLog,
        type: MinigameType.TwoTruthsOneLie,
      });

      incrementMinigameIndex();
    } catch (error) {
      console.error("Error during Two Truths One Lie game over logic: ", error);
    }
  };

  return (
    <ScrollView className="bg-lightGray h-full">
      <View className="flex gap-32 px-8 py-16">
        <View>
          <View className="flex flex-row gap-2 justify-center items-center">
            <Text className="text-3xl font-black">2 Truths 1 Lie</Text>
          </View>
          <Text className="text-center font-medium p-3">
            Can you find which one is the lie?
          </Text>
        </View>

        <View className="flex gap-2">
          {choices.map((choice: any, index: number) => (
            <TouchableOpacity
              key={index}
              disabled={answered}
              onPress={() => handleAnswer(choice.answer)}
            >
              <View
                className={`items-center justify-center rounded-xl p-3 shadow-main my-1 
                ${answered ? (choice.answer === true ? "bg-green-400" : "bg-red-400") : "bg-[#d1d5db] "}`}
              >
                <Text className="font-semibold text-center">
                  {choice.choice}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
