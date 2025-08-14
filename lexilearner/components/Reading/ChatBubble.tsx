import { useTranslationStore } from "@/stores/translationStore";
import { bubble } from "@/types/bubble";
import { personEnum } from "@/types/enum";
import axios from "axios";
import { CircleIcon, Volume2, Volume2Icon, X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Pressable, Text, View, Image } from "react-native";
import Tts from "react-native-tts";

const ChatBubble = ({
  icon,
  showIcon,
  onWordPress,
  onClosePress,
  bubble,
}: {
  bubble: bubble;
  showIcon: boolean;
  icon: any;
  onClosePress: () => void;
  onWordPress: (word: string) => void;
}) => {
  const [translation, setTranslation] = useState("");
  const getTranslation = useTranslationStore((state) => state.getTranslation);
  const storeTranslation = useTranslationStore(
    (state) => state.storeTranslation
  );

  const words = bubble.text.split(" ").map((word) => {
    const clean = word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ""); // for lookup
    return { original: word, clean };
  });

  const onAudioPress = (word: string) => {
    Tts.speak(word);
  };

  const fetchTranslation = async (word: string) => {
    const existingTranslation = getTranslation(word);
    if (existingTranslation !== undefined) {
      setTranslation(existingTranslation);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("from", "en_US");
      formData.append("to", "ceb_PH");
      formData.append("text", word);
      formData.append("platform", "dp");

      const { data } = await axios.post(
        "https://corsproxy.io/?url=https://lingvanex.com/translation/translate",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      storeTranslation(word, data.result);
      setTranslation(data.result);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslation("Translation failed");
    }
  };

  return (
    <View className="flex flex-row gap-2 items-end">
      {showIcon ? (
        <Image
          source={icon}
          className="rounded-full"
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
        />
      ) : (
        <View className="h-8" />
      )}

      {bubble.type === personEnum.Story || bubble.type === personEnum.Game ? (
        <View
          className={`flex-1 border-2 border-b-4 rounded-md p-3 ${
            bubble.type === personEnum.Game
              ? "border-accentBlue bg-vibrantBlue"
              : "border-lightGray-200 bg-white"
          }`}
        >
          <Text className="flex-row flex-wrap flex-shrink">
            {words.map((word, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  onWordPress(word.clean);
                  console.log(word.clean);
                  fetchTranslation(word.clean);
                }}
              >
                <Text className="text-base leading-5 px-0.5">
                  {word.original}
                </Text>
              </Pressable>
            ))}
          </Text>
        </View>
      ) : bubble.type === personEnum.Description ? (
        <View className="flex-1 border-2 border-accentBlue border-b-4 rounded-md p-3 bg-vibrantBlue">
          <View className="flex flex-row justify-between">
            <View className="flex flex-row gap-3">
              <Text className="font-bold text-lg">{bubble.text}</Text>
              <Pressable onPress={() => onAudioPress(bubble.text)}>
                <Volume2 fill={"#2F1E38"} />
              </Pressable>
            </View>
            <X color={"black"} onPress={onClosePress} />
          </View>
          <Text className="italic">({translation})</Text>
          <Text className="flex-row flex-wrap flex-shrink">
            {bubble.definition}
          </Text>
        </View>
      ) : bubble.type === personEnum.Self ? (
        <View className="flex-1 items-end">
          <View className="border-2 border-accentBlue border-b-4 rounded-md p-3 bg-vibrantBlue max-w-[80%]">
            <Text className="font-bold text-lg text-right">{bubble.text}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default ChatBubble;
