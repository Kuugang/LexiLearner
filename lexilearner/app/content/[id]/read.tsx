import ChoicesBubble from "@/app/(minigames)/choices";
import ReadContentHeader from "@/components/ReadContentHeader";
import ChatBubble from "@/components/Reading/ChatBubble";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/services/DictionaryService";
import { useReadingContentStore } from "@/stores/readingContentStore";
import { bubble, choice } from "@/types/bubble";
import { personEnum } from "@/types/enum";
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

enum MessageTypeEnum {
  STORY = "story",
  CHOICES = "mg_choices",
  REARRANGE = "mg_rearrange",
  IMAGE = "image",
}

type Message = {
  id: number;
  type: MessageTypeEnum;
  payload: bubble | choice;
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

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [messages]);

  // parse each chunk into (chat/story) bubble type with props

  // TODO: izustand nlng nis Message[] para makaaccess sa mga minigames na bubbles and add bubbles
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
            },
          } satisfies Message;
        }

        return {
          id: bubbleCount.current++,
          type: MessageTypeEnum.STORY,
          payload: {
            text: text.trim(),
            person: person || "Story",
            type: personEnum.Story,
          },
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

  const onPress = () => {
    if (chunkIndex < parsedBubbles!.length) {
      const newMessage = parsedBubbles[chunkIndex];
      setMessages((prev) => [...prev, newMessage]);
      setChunkIndex((prev) => prev + 1);
    }
  };

  const defineWord = (word: string) => {
    if (word.length < 2) return;
    // if (!word) return;
    setWord(word);
  };

  const onClosePress = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  function getIconSource(icon: string) {
    return iconMap[icon] || iconMap["Story"];
  }

  const addStoryMessage = (msg: bubble) => {
    const newMsg: Message = {
      id: bubbleCount.current++,
      type: MessageTypeEnum.STORY,
      payload: msg,
    };
    setMessages((prev) => [...prev, newMsg]);
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
                  : msg.type === MessageTypeEnum.CHOICES
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
                  : null}
              </View>
            ))}

            <View className="py-4">
              <Button
                onPress={onPress}
                disabled={chunkIndex >= parsedBubbles!.length}
              >
                <Text className="font-bold text-black">
                  {chunkIndex >= parsedBubbles!.length
                    ? "Story Complete"
                    : "Next"}
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Read;
