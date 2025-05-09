import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import BackHeader from "@/components/BackHeader";
import {
  use2Truths1LieGameStore,
  useMiniGameStore,
} from "@/stores/miniGameStore";
import { usePathname } from "expo-router";
import { Minigame } from "@/models/Minigame";

export function ChoicesBtn({
  sentence,
  onPress,
}: {
  sentence: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          className={`items-center justify-center rounded-xl p-3 shadow-main my-1 ${
            pressed ? "bg-gray-300" : "bg-white"
          }`}
        >
          <Text className="font-bold">{sentence}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function TwoTruthsOneLie({ minigame }: { minigame: Minigame }) {
  const choices = JSON.parse(minigame.metaData).choices;

  // const choices = use2Truths1LieGameStore((state) => state.choices);
  const score = use2Truths1LieGameStore((state) => state.score);

  // const setChoices = use2Truths1LieGameStore((state) => state.setChoices);
  const setScore = use2Truths1LieGameStore((state) => state.setScore);
  const newGame = use2Truths1LieGameStore((state) => state.newGame);

  useEffect(() => {
    newGame();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  const onPress = (answer: boolean) => {
    if (answer === true) {
      setScore();
    }
  };

  console.log("TEST: ", score);

  return (
    <ScrollView className="bg-lightGray">
      <BackHeader />

      <Progress
        value={1}
        className="web:w-[60%] bg-background"
        indicatorClassName="bg-[#8383FF]"
      />

      <View className="p-8 py-10">
        <View>
          <View className="flex flex-row gap-2 justify-center items-center">
            <Text className="text-3xl font-black">2 Truths 1 Lie</Text>
          </View>
          <Text className="text-center font-medium p-3">
            Can you find which one is the lie?
          </Text>

          <View className="my-24">
            {choices.map((choice, i) => (
              <ChoicesBtn
                key={i}
                sentence={choice.choice}
                onPress={() => {
                  onPress(choice.answer);
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
