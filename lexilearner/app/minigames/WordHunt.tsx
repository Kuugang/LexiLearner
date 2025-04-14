import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

export default function WordHunt() {
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  if (lives == 0) {
  }

  const answers = ["hood", "weak", "peep", "quietly", "child", "nothing"]; //mga sakto
  const allWord = [...answers, "paramore", "laptop", "phone"];
  const [random, setRandomWords] = useState<string[]>([]);

  // stackoverflow aah
  let randomized = allWord
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  const onPress = (word: string) => {
    if (answers.includes(word)) {
      setScore(score + 1);
    } else {
      setLives(lives - 1);
    }
  };

  return (
    <ScrollView>
      <View>
        <View className="p-8">
          <View className="items-center">
            <Text className="font-bold">WordHunt</Text>
            <Text>Find words that have appeared in the book!</Text>
            <Text>Score:{score}</Text>
            <Text>Lives:{lives}</Text>
          </View>

          <View className="flex-wrap flex-row gap-2 justify-center">
            {randomized.map((word, i) => (
              <WordHuntBtn
                word={word}
                onPress={() => {
                  onPress(word);
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export function WordHuntBtn({
  word,
  onPress,
}: {
  word: string;
  onPress: () => void;
}) {
  return (
    <View className="w-full shadow-main">
      <Pressable
        onPress={onPress}
        className="items-center justify-center rounded-xl border-2 border-gray-300 p-3"
        style={{ width: "30%", height: "30%", aspectRatio: 1 }}
      >
        <Text className="font-bold">{word}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
