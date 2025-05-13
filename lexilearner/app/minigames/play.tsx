import {
  useGetMinigameById,
  useRandomMinigames,
} from "@/services/minigameService";
import {
  useFillInTheBlankMiniGameStore,
  useMiniGameStore,
  useSentenceRearrangementMiniGameStore,
  useTwoTruthsOneLieGameStore,
  useWordsFromLettersMiniGameStore,
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

const { width } = Dimensions.get("window");

function Play() {
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

  const { data: randomMinigames, isLoading } = useRandomMinigames(
    currentReadingSession.id,
  );

  const { data: minigame1 } = useGetMinigameById(
    "0e496c1e-fa16-4381-ac0a-b90be4329d37",
  );
  const { data: minigame2 } = useGetMinigameById(
    "02337be2-936a-43f5-bf44-4f5fde410b51",
  );
  const { data: minigame3 } = useGetMinigameById(
    "0212c829-28ce-4932-b8ab-e483ad25bf29",
  );
  const { data: minigame4 } = useGetMinigameById(
    "02b2ad3b-259a-42d0-b6bb-a241f78e78a5",
  );
  const { data: minigame5 } = useGetMinigameById(
    "09afe046-8d63-4ff6-a991-39edecb39be7",
  );

  useEffect(() => {
    if (isLoading) return;
    if (!randomMinigames) return;

    if (!minigame1 || !minigame2 || !minigame3 || !minigame4 || !minigame5)
      return;
    const games: Minigame[] = [
      minigame1,
      minigame2,
      minigame3,
      minigame4,
      minigame5,
    ];

    // setMinigames(games);
    // setCurrentMinigame(games[minigamesIndex]);
    setMinigames(randomMinigames);
    setCurrentMinigame(randomMinigames[minigamesIndex]);
  }, [isLoading]);

  const translateX = useSharedValue(0);
  useEffect(() => {
    if (minigamesIndex > 2) {
      setCurrentMinigame(null);
      setMinigames([]);
      setMinigamesIndex(0);
      router.replace("/home");
    }
    if (prevMinigamesIndex.current === minigamesIndex) return;
    let pastMinigame = currentMinigame;
    setCurrentMinigame(minigames[minigamesIndex]);
    const timeout = setTimeout(() => {
      translateX.value = withTiming(-width * minigamesIndex, { duration: 300 });
    }, 400);

    switch (pastMinigame?.minigameType) {
      case MinigameType.WordsFromLetters:
        useWordsFromLettersMiniGameStore.getState().resetGameState();
        break;
      case MinigameType.FillInTheBlanks:
        useFillInTheBlankMiniGameStore.getState().resetGameState();
        break;
      case MinigameType.SentenceRearrangement:
        useSentenceRearrangementMiniGameStore.getState().resetGameState();
        break;
      case MinigameType.WordHunt:
        useWordsFromLettersMiniGameStore.getState().resetGameState();
        break;
      case MinigameType.TwoTruthsOneLie:
        useTwoTruthsOneLieGameStore.getState().resetGameState();
        break;
    }
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
