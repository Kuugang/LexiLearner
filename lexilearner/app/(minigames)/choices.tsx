import { Choice, useTwoTruthsOneLieGameStore } from "@/stores/miniGameStore";
import { bubble, choice } from "@/types/bubble";
import { personEnum } from "@/types/enum";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const ChoicesBubble = ({
  question,
  choices,
  onPress,
}: {
  question: string;
  choices: Choice[];
  onPress: (msg: bubble) => void;
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const onBtnPress = (ans: Choice) => {
    const bubble: bubble = {
      text: ans.choice,
      person: "",
      type: personEnum.Self,
    };

    onPress(bubble);

    const answer = ans.answer ? "That's correct!" : "Aww, try again next time!";
    const responseBubble: bubble = {
      text: answer,
      person: "Story",
      type: personEnum.Game,
    };

    setTimeout(() => onPress(responseBubble), 500);
  };
  return (
    <View className="flex flex-row gap-2 items-end">
      <Image
        source={require("@/assets/images/storyIcons/narrator.png")}
        className="rounded-full"
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
      <View className="flex-1 border-2 border-accentBlue border-b-4 rounded-md p-3 bg-vibrantBlue">
        <Text>{question}</Text>
        {choices.map((choice) => (
          <TouchableOpacity
            className="bg-white p-1 rounded-md justify-center items-center my-1"
            onPress={() => {
              onBtnPress(choice);
              setIsPressed(true);
            }}
            disabled={isPressed}
          >
            <Text>{choice.choice}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ChoicesBubble;
