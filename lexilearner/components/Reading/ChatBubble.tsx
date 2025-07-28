import { CircleIcon } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { Circle } from "react-native-svg";

const ChatBubble = ({
  text,
  person,
  showIcon = false,
}: {
  text: string;
  person?: string;
  showIcon?: boolean;
}) => {
  return (
    <View className="flex flex-row gap-2 items-end">
      {showIcon ? (
        <CircleIcon
          height={32}
          width={32}
          fill="rgb(255, 205, 55)"
          className="mt-1"
        />
      ) : (
        <View className="w-8 h-8" />
      )}

      <View className="flex-1 border-2 border-lightGray border-b-4 rounded-md p-3">
        <Text className="text-base leading-5">{text}</Text>
      </View>
    </View>
  );
};

export default ChatBubble;
