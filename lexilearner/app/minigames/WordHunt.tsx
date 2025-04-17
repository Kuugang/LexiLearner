import {
  ColorValue,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react-native";

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
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  if (lives == 0) {
    alert("No more lives!" + score);
  }

  const answers = ["hood", "weak", "peep", "quietly", "child", "nothing"]; //mga sakto
  const allWord = [...answers, "paramore", "laptop", "phone"];
  const [random, setRandomWord] = useState<string[]>([]);

  const [correct, setCorrect] = useState<number[]>([]);

  // stackoverflow aah
  useEffect(() => {
    let randomized = allWord
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    setRandomWord(randomized);
  }, []);

  const onPress = (word: string, clickedWord: number) => {
    if (answers.includes(word) && lives > 0) {
      setScore(score + 1);
      setCorrect((prev) => [...prev, clickedWord]);
    } else {
      setLives(lives - 1);
    }
  };

  return (
    <ScrollView className="bg-lightGray">
      <View>
        <BackHeader />

        <Progress
          value={(score / answers.length) * 100}
          className="web:w-[60%] bg-background"
          indicatorClassName="bg-[#8383FF]"
        />

        <View className="p-8">
          <View className="items-center">
            <View className="flex flex-row gap-2 justify-center items-center">
              <Heart fill="#8383FF" />
              <Text className="text-3xl font-black">Word Hunt</Text>
            </View>
            <Text className="text-center font-medium p-3">
              Find words that have appeared in the book!
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3 justify-center mt-6">
            {random.map((word, i) => (
              <WordHuntBtn
                key={i}
                word={word}
                onPress={() => {
                  onPress(word, i);
                }}
                disabled={correct.includes(i) || lives === 0}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
