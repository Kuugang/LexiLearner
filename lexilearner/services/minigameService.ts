import { API_URL } from "../utils/constants";
import { Minigame, MinigameType } from "@/models/Minigame";

import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { MinigameLog } from "@/models/MinigameLog";

export const useRandomMinigames = (readingSessionId: string) => {
  return useQuery<Minigame[], Error>({
    queryKey: ["random-minigames", readingSessionId],
    queryFn: () => getRandomMinigames(readingSessionId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const getRandomMinigames = async (
  readingSessionId: string,
): Promise<Minigame[]> => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/minigames/${readingSessionId}/random`,
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching minigames:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch minigames.",
    );
  }
};

export const useGetMinigameById = (minigameId: string) => {
  return useQuery<Minigame, Error>({
    queryKey: ["minigame", minigameId],
    queryFn: () => getMinigameById(minigameId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const getMinigameById = async (
  minigameId: string,
): Promise<Minigame> => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/minigames/${minigameId}`,
    );
    console.log("Minigame fetched from api:", response.data.data);

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching minigame:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch minigame.",
    );
  }
};

const createMinigameLog = async (
  minigameLog: MinigameLog,
  type: MinigameType,
): Promise<MinigameLog> => {
  try {
    let url = `${API_URL}/minigames/logs/`;

    console.log(minigameLog);
    // public Guid Id { get; set; }
    // public Guid MinigameId { get; set; }
    // public Guid PupilId { get; set; }
    // public string Result { get; set; }
    // public DateTime CreatedAt { get; set; }
    // public Guid ReadingSessionId { get; set; }

    switch (type) {
      case MinigameType.WordsFromLetters:
        url += "wordsfromletters";
        break;
      case MinigameType.FillInTheBlanks:
        url += "fillintheblanks";
        break;

      case MinigameType.SentenceRearrangement:
        url += "sentencerearrangement";
        break;

      case MinigameType.WordHunt:
        url += "wordhunt";
        break;

      case MinigameType.TwoTruthsOneLie:
        url += "twotruthsonelie";
        break;
    }
    console.log(url);

    const response = await axiosInstance.post(url, minigameLog);

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to create minigame log.", error);
    throw new Error(
      error?.response?.data?.message || "Failed to create minigame log.",
    );
  }
};

export const useCreateMinigameLog = () => {
  return useMutation({
    mutationFn: ({
      minigameLog,
      type,
    }: {
      minigameLog: MinigameLog;
      type: MinigameType;
    }) => createMinigameLog(minigameLog, type),
    onSuccess: (data) => {
      console.log("Minigame log created", data);
    },
    onError: (error) => {
      console.error("Error creating minigame log:", error);
    },
  });
};
