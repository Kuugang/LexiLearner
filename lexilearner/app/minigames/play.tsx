import {
  useGetMinigameById,
  useRandomMinigames,
} from "@/services/minigameService";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { useLocalSearchParams } from "expo-router";
import { memo, useState } from "react";
import WordsFromLetters from "./wordsfromletters";
import FillInTheBlank from "./fillintheblanks";
import SentenceArrangement from "./sentencearrangement";

function Play() {
  const params = useLocalSearchParams();
  const readingSesisonIdParam = params.readingSessionId;

  const readingSesisonId = Array.isArray(readingSesisonIdParam)
    ? readingSesisonIdParam[0]
    : readingSesisonIdParam;

  // const { data, isLoading } = useRandomMinigames(readingSesisonId);

  const game = useMiniGameStore((state) => state.game);
  const setGame = useMiniGameStore((state) => state.setGame);

  const { data: minigame } = useGetMinigameById(
    "11ea5fac-3949-4379-bedd-2a72789ff7b0",
  );

  console.log(minigame);

  if (!minigame) return null;

  //return WordsFromLetters(minigame);
  //return FillInTheBlank(minigame);
  return SentenceArrangement(minigame);
}

export default memo(Play);
