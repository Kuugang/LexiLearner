import { Choice, useTwoTruthsOneLieGameStore } from "@/stores/miniGameStore";
import { bubble, choice } from "@/types/bubble";
import { MessageTypeEnum, personEnum } from "@/types/enum";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { makeBubble } from "@/utils/makeBubble";

const ChoicesBubble = ({
  question,
  choices,
  onPress,
}: {
  question: string;
  choices: Choice[];
  onPress: (msg: bubble, msgType: MessageTypeEnum) => void;
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const onBtnPress = (ans: Choice) => {
    const answer = ans.answer ? "That's correct!" : "Aww, try again next time!";

    const bubble = makeBubble(ans.choice, "", personEnum.Self);
    const responseBubble = makeBubble(answer, "Story", personEnum.Game);

    onPress(bubble, MessageTypeEnum.STORY);
    setTimeout(() => onPress(responseBubble, MessageTypeEnum.STORY), 500);
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
        {choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
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
