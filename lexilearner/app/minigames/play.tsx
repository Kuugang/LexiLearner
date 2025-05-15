import {
  useGetMinigameById,
  useRandomMinigames,
  useCompleteMinigameSession,
} from "@/services/minigameService";
import {
  useMiniGameStore,
  useFillInTheBlankMiniGameStore,
  useSentenceRearrangementMiniGameStore,
  useTwoTruthsOneLieGameStore,
  useWordsFromLettersMiniGameStore,
  useWordHuntMinigameStore,
} from "@/stores/miniGameStore";
import { memo, useEffect, useRef } from "react";
import WordsFromLetters from "./wordsfromletters";
import FillInTheBlank from "./fillintheblanks";
import SentenceArrangement from "./sentencearrangement";
import { Minigame, MinigameType } from "@/models/Minigame";
import WordHunt from "./WordHunt";
import TwoTruthsOneLie from "./twoTruthsOneLie";
import { View, Text } from "react-native";
import { useReadingSessionStore } from "@/stores/readingSessionStore";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Dimensions } from "react-native";
import { router } from "expo-router";
import { useUserStore } from "@/stores/userStore";

const { width } = Dimensions.get("window");

function Play() {
  const translateX = useSharedValue(0);
  const currentReadingSession = useReadingSessionStore(
    (state) => state.currentSession,
  );

  const minigamesIndex = useMiniGameStore((state) => state.minigamesIndex);
  const prevMinigamesIndex = useRef(minigamesIndex);
  const setMinigamesIndex = useMiniGameStore(
    (state) => state.setMinigamesIndex,
  );
  const currentMinigame = useMiniGameStore((state) => state.currentMinigame);

  const setCurrentMinigame = useMiniGameStore(
    (state) => state.setCurrentMinigame,
  );
  const minigames = useMiniGameStore((state) => state.minigames);
  const setMinigames = useMiniGameStore((state) => state.setMinigames);

  if (!currentReadingSession) return null;

  const { data: randomMinigames, isLoading: minigamesLoading } =
    useRandomMinigames(currentReadingSession.id);

  const { mutateAsync: completeMinigamesSession } =
    useCompleteMinigameSession();

  useEffect(() => {
    if (minigamesLoading) return;
    if (!randomMinigames) return;

    setMinigames(randomMinigames);
    setCurrentMinigame(randomMinigames[minigamesIndex]);
  }, [minigamesLoading]);

  useEffect(() => {
    const handleComplete = async () => {
      try {
        return await completeMinigamesSession(currentReadingSession.id);
      } catch (error) {
        console.error("Failed to complete minigame session:", error);
      }
    };

    if (minigamesIndex > 2) {
      handleComplete().then((data) => {
        setCurrentMinigame(null);
        setMinigames([]);
        setMinigamesIndex(0);
        useWordsFromLettersMiniGameStore.getState().resetGameState();
        useFillInTheBlankMiniGameStore.getState().resetGameState();
        useSentenceRearrangementMiniGameStore.getState().resetGameState();
        useWordHuntMinigameStore.getState().resetGameState();
        useTwoTruthsOneLieGameStore.getState().resetGameState();

        if (data?.achievements.length > 0) {
          router.replace({
            pathname: "/minigames/results/achievements",
            params: {
              data: JSON.stringify(data),
            },
          });
          return;
        }

        router.replace({
          pathname: "/minigames/results/levelup",
          params: {
            data: JSON.stringify(data),
          },
        });
      });
      return;
    }

    if (prevMinigamesIndex.current === minigamesIndex) return;

    setCurrentMinigame(minigames[minigamesIndex]);

    const timeout = setTimeout(() => {
      translateX.value = withTiming(-width * minigamesIndex, { duration: 300 });
    }, 400);

    prevMinigamesIndex.current = minigamesIndex;

    return () => clearTimeout(timeout);
  }, [minigamesIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const getMinigameComponent = (minigame: Minigame) => {
    switch (minigame.minigameType) {
      case MinigameType.WordsFromLetters:
        return <WordsFromLetters minigame={minigame} />;
      case MinigameType.FillInTheBlanks:
        return <FillInTheBlank minigame={minigame} />;
      case MinigameType.SentenceRearrangement:
        return <SentenceArrangement minigame={minigame} />;
      case MinigameType.WordHunt:
        return <WordHunt minigame={minigame} />;
      case MinigameType.TwoTruthsOneLie:
        return <TwoTruthsOneLie minigame={minigame} />;
      default:
        return <Text>Unknown minigame type</Text>;
    }
  };

  if (!currentMinigame) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, overflow: "hidden" }}>
      <Animated.View
        style={[
          {
            flexDirection: "row",
            width: width * minigames.length,
          },
          animatedStyle,
        ]}
      >
        {minigames.map((minigame, i) => (
          <View key={i} style={{ width }}>
            {getMinigameComponent(minigame)}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

export default memo(Play);
