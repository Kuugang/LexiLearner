import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import BackHeader from "@/components/BackHeader";

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

export default function _2Truths1Lie() {
  const choices = [
    { choice: "Cats say meow", answer: false },
    { choice: "The sky is green", answer: true },
    { choice: "Fish live in water", answer: false },
  ];
  const [score, setScore] = useState(0);

  const onPress = (answer: boolean) => {
    if (answer === true) {
      setScore(score + 1);
    }
  };

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
            {score}
          </Text>

          <View className="my-24">
            {choices.map((choice) => (
              <ChoicesBtn
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
