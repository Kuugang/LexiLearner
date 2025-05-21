import {
  useGetMinigameById,
  useRandomMinigames,
  useCompleteMinigameSession,
  useGetMinigameLogByMIDRSID,
} from "@/services/minigameService";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { memo, useEffect } from "react";
import WordsFromLetters from "./wordsfromletters";
import FillInTheBlank from "./fillintheblanks";
import SentenceArrangement from "./sentencearrangement";
import { Minigame, MinigameType } from "@/models/Minigame";
import WordHunt from "./WordHunt";
import TwoTruthsOneLie from "./twoTruthsOneLie";
import { View, Text, ActivityIndicator } from "react-native";
import { useReadingSessionStore } from "@/stores/readingSessionStore";
import { useReadingAssignmentStore } from "@/stores/readingAssignmentStore";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Dimensions } from "react-native";
import { router } from "expo-router";
import { useCreateAssignmentLog } from "@/services/ClassroomService";

const { width } = Dimensions.get("window");

function Play() {
  const selectedReadingAssignment = useReadingAssignmentStore(
    (state) => state.selectedReadingAssignment,
  );

  const { mutateAsync: CreateAssignmentLog } = useCreateAssignmentLog();

  const translateX = useSharedValue(0);

  const currentReadingSession = useReadingSessionStore(
    (state) => state.currentSession,
  );

  const {
    minigamesIndex,
    incrementMinigamesIndex,
    setMinigamesIndex,
    currentMinigame,
    setCurrentMinigame,
    minigames,
    setMinigames,
  } = useMiniGameStore();

  if (!currentReadingSession) return null;

  const { mutateAsync: completeMinigamesSession } =
    useCompleteMinigameSession();

  const { data: randomMinigames, refetch: fetchRandomMinigames } =
    useRandomMinigames(currentReadingSession.id);

  const assignmentMinigameId = selectedReadingAssignment?.minigameId ?? "";
  const { data: assignmentMinigame, refetch: fetchAssignmentMinigame } =
    useGetMinigameById(assignmentMinigameId);

  const { refetch: refetchMinigameLog } =
    selectedReadingAssignment != null
      ? useGetMinigameLogByMIDRSID(
          selectedReadingAssignment?.minigameId ?? "",
          currentReadingSession?.id,
        )
      : { refetch: async () => undefined };

  useEffect(() => {
    if (selectedReadingAssignment) fetchAssignmentMinigame();
    else fetchRandomMinigames();

    if (currentMinigame) {
      translateX.value = withTiming(-width * minigamesIndex, {
        duration: 300,
      });
    }
  }, []);

  useEffect(() => {
    if (currentMinigame) return;

    if (selectedReadingAssignment != null && assignmentMinigame != null) {
      setMinigames([assignmentMinigame]);
      setCurrentMinigame(assignmentMinigame);
    } else if (selectedReadingAssignment == null && randomMinigames != null) {
      setMinigames(randomMinigames);
      setCurrentMinigame(randomMinigames[minigamesIndex]);
    }
  }, [assignmentMinigame, randomMinigames]);

  const handleFinishMinigamesSession = async () => {
    try {
      const data = await completeMinigamesSession(currentReadingSession.id);

      setCurrentMinigame(null);
      setMinigames([]);
      setMinigamesIndex(0);

      if (selectedReadingAssignment != null) {
        const minigamelog = await refetchMinigameLog();

        if (minigamelog && minigamelog.data && minigamelog.data.id) {
          console.log("fetched minigamelog: ", minigamelog);

          await CreateAssignmentLog({
            readingAssignmentId: selectedReadingAssignment.id,
            minigamelogId: minigamelog.data?.id,
          });
        }
      }

      const routePath =
        data?.achievements?.length > 0
          ? "/minigames/results/achievements"
          : "/minigames/results/levelup";

      router.replace({
        pathname: routePath,
        params: {
          data: JSON.stringify(data),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to complete minigames session:", error.message);
        console.error(error);
      } else {
        console.error("Failed to complete minigames session:", error);
      }
    }
  };

  const nextGame = () => {
    console.log("Next Game");
    const nextIndex = minigamesIndex + 1;
    if ((selectedReadingAssignment && nextIndex == 1) || nextIndex > 2) {
      handleFinishMinigamesSession();
    }
    setCurrentMinigame(minigames[nextIndex]);

    translateX.value = withTiming(-width * nextIndex, {
      duration: 300,
    });

    incrementMinigamesIndex();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const getMinigameComponent = (minigame: Minigame) => {
    switch (minigame.minigameType) {
      case MinigameType.WordsFromLetters:
        return <WordsFromLetters minigame={minigame} nextGame={nextGame} />;
      case MinigameType.FillInTheBlanks:
        return <FillInTheBlank minigame={minigame} nextGame={nextGame} />;
      case MinigameType.SentenceRearrangement:
        return <SentenceArrangement minigame={minigame} nextGame={nextGame} />;
      case MinigameType.WordHunt:
        return <WordHunt minigame={minigame} nextGame={nextGame} />;
      case MinigameType.TwoTruthsOneLie:
        return <TwoTruthsOneLie minigame={minigame} nextGame={nextGame} />;
      default:
        return <Text>Unknown minigame type</Text>;
    }
  };

  if (!currentMinigame)
    return (
      <View className="flex-1 justify-center items-center absolute inset-0 z-50">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Preparing content...</Text>
      </View>
    );

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
