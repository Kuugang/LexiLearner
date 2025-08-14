import ChoicesBubble from "@/app/(minigames)/choices";
import SentenceArrangementBubble from "@/app/(minigames)/sentencearrangement";
import ReadContentHeader from "@/components/ReadContentHeader";
import ChatBubble from "@/components/Reading/ChatBubble";
import { Button } from "@/components/ui/button";
import { useThrottle } from "@/hooks/useThrottle";
import { useDictionary } from "@/services/DictionaryService";
import { useReadingContentStore } from "@/stores/readingContentStore";
import { useTranslationStore } from "@/stores/translationStore";
import { arrange, bubble, choice } from "@/types/bubble";
import { MessageTypeEnum, personEnum } from "@/types/enum";
import { makeBubble } from "@/utils/makeBubble";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";

const iconMap: Record<string, any> = {
  Story: require("@/assets/images/storyIcons/narrator.png"),
  b1: require("@/assets/images/storyIcons/b1.png"),
  g1: require("@/assets/images/storyIcons/g1.png"),
  b2: require("@/assets/images/storyIcons/b2.png"),
  g2: require("@/assets/images/storyIcons/g2.png"),
};

export function getIconSource(icon: string) {
  return iconMap[icon] || iconMap["Story"];
}

type Message = {
  id: number;
  type: MessageTypeEnum;
  payload: bubble | choice | arrange;
};

const Read = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [word, setWord] = useState<string | null>(null);
  const { data, isLoading } = useDictionary(word || "");
  const bubbleCount = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { height: screenHeight } = useWindowDimensions();
  const selectedContent = useReadingContentStore(
    (state) => state.selectedContent
  );

  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [messages]);

  // parse each chunk into (chat/story) bubble type with props
  // TODO: i think better nay middle layer paras minigames TTOTT
  const parsedBubbles = useMemo<Message[]>(() => {
    if (!selectedContent?.content) return [];

    return selectedContent.content
      .split(/(?=\[\w*\])|(?=\$[A-Z]+\$)/g)
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 0)
      .map((chunk) => {
        const match = chunk.match(/^\[(\w*)\](.+)|^(\$[A-Z]+\$)/s);
        if (!match) return null;

        const [, person, text] = match;
        if (chunk.includes("$CHOICES$")) {
          return {
            id: bubbleCount.current++,
            type: MessageTypeEnum.CHOICES,
            payload: {
              question: "r u sure fr?",
              choices: [
                { choice: "basin", answer: true },
                { choice: "BAWAL", answer: false },
                { choice: "duka nako", answer: false },
              ],
              explanation: "taysa",
            },
          } satisfies Message;
        } else if (chunk.includes("$ARRANGE$")) {
          return {
            id: bubbleCount.current++,
            type: MessageTypeEnum.ARRANGE,
            payload: {
              correctAnswer: ["The spiders", "were busy", "last night frfr."],
              parts: ["last night frfr.", "The spiders", "were busy"],
              explanation: "hwaw",
            },
          } satisfies Message;
        }

        return {
          id: bubbleCount.current++,
          type: MessageTypeEnum.STORY,
          payload: makeBubble(text.trim(), person || "Story", personEnum.Story),
        } satisfies Message;
      })
      .filter((b): b is Message => b !== null);
  }, [selectedContent?.content]);

  useEffect(() => {
    if (!word || isLoading) return;

    if (word) {
      const newMessage: Message = {
        id: bubbleCount.current++,
        type: MessageTypeEnum.STORY,
        payload: {
          text: word,
          definition: data,
          person: "Story",
          type: personEnum.Description,
        },
      };

      if (
        (messages[messages.length - 1].payload as bubble).type ==
        personEnum.Description
      ) {
        setMessages((prev) => [...prev.slice(0, -1), newMessage]);
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }
      setWord(null);
    }
  }, [data, isLoading]);

  const onPress = useThrottle(() => {
    if (chunkIndex < parsedBubbles!.length) {
      const newMessage = parsedBubbles[chunkIndex];
      setMessages((prev) => [...prev, newMessage]);
      setChunkIndex((prev) => prev + 1);
    }

    if (chunkIndex == parsedBubbles.length) {
      setIsFinished(true);
    }
  });

  const defineWord = (word: string) => {
    if (word.length < 2) return;
    setWord(word);
  };

  const onClosePress = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const addStoryMessage = (msg: bubble, msgType: MessageTypeEnum) => {
    const newMsg: Message = {
      id: bubbleCount.current++,
      type: msgType,
      payload: msg,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const isNextDisabled = () => {
    const bubble = messages[messages.length - 1];
    if (bubble) {
      if (
        bubble.type === MessageTypeEnum.ARRANGE ||
        bubble.type === MessageTypeEnum.CHOICES
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <View className="flex-1 bg-lightGray">
      <ReadContentHeader
        title={selectedContent?.title!}
        handleBack={() => router.back()}
        background="white"
      />

      <View className="flex-1 px-6 my-4">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          <View
            style={{ minHeight: screenHeight }}
            className="flex justify-end"
          >
            {messages.map((msg) => (
              <View key={msg.id} className="py-1">
                {msg.type === MessageTypeEnum.STORY
                  ? (() => {
                      const bubblePayload = msg.payload as bubble;
                      return (
                        <ChatBubble
                          bubble={bubblePayload}
                          icon={getIconSource(bubblePayload.person)}
                          showIcon={
                            bubblePayload.type === personEnum.Story ||
                            bubblePayload.type === personEnum.Game
                          }
                          onWordPress={defineWord}
                          onClosePress={() => onClosePress(msg.id)}
                        />
                      );
                    })()
                  : // feel nako better ba naay minigame middle layer somewhere here??
                  msg.type === MessageTypeEnum.CHOICES
                  ? (() => {
                      const choicesPayload = msg.payload as choice;

                      return (
                        <ChoicesBubble
                          question={choicesPayload.question}
                          choices={choicesPayload.choices}
                          onPress={addStoryMessage}
                        />
                      );
                    })()
                  : msg.type === MessageTypeEnum.ARRANGE
                  ? (() => {
                      const arrangePayload = msg.payload as arrange;

                      return (
                        <SentenceArrangementBubble
                          correctAnswer={arrangePayload.correctAnswer.join("")}
                          partsblocks={arrangePayload.parts}
                          explanation={arrangePayload.explanation}
                          onPress={addStoryMessage}
                        />
                      );
                    })()
                  : null}
              </View>
            ))}
          </View>
          <View className="py-4">
            {!isFinished ? (
              <Button
                onPress={() => {
                  onPress();
                }}
                disabled={isNextDisabled()}
              >
                <Text className="font-bold text-black">Next</Text>
              </Button>
            ) : (
              <View className="items-center">
                <Text className="py-4">End of Story</Text>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onPress={() => {
                    router.push("/(minigames)/test");
                  }}
                >
                  <Text className="font-bold text-black">Story Completed</Text>
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Read;
