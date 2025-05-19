import { API_URL } from "../utils/constants";
import { Minigame, MinigameType } from "@/models/Minigame";

import { useMutation, UseQueryOptions } from "@tanstack/react-query";
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
  readingSessionId: string
): Promise<Minigame[]> => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/minigames/${readingSessionId}/random`
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching minigames:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch minigames."
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
  minigameId: string
): Promise<Minigame> => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/minigames/${minigameId}`
    );
    //console.log("Minigame fetched from api:", response.data.data);

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching minigame:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch minigame."
    );
  }
};

const createMinigameLog = async (
  minigameLog: MinigameLog,
  type: MinigameType
): Promise<MinigameLog> => {
  try {
    let url = `${API_URL}/minigames/logs/`;

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

    const response = await axiosInstance.post(url, minigameLog);

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to create minigame log.", error);
    throw new Error(
      error?.response?.data?.message || "Failed to create minigame log."
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
      //console.log("Minigame log created", data);
    },
    onError: (error) => {
      console.error("Error creating minigame log:", error);
    },
  });
};

const completeMinigameSession = async (
  readingSessionId: string
): Promise<Record<string, any>> => {
  try {
    const url = `${API_URL}/minigames/${readingSessionId}/complete`;
    const response = await axiosInstance.post(url);

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to complete minigame session.", error);
    throw new Error(
      error?.response?.data?.message || "Failed to complete minigame session."
    );
  }
};

export const useCompleteMinigameSession = () => {
  return useMutation({
    mutationFn: (readingSessionId: string) =>
      completeMinigameSession(readingSessionId),
    onSuccess: (data) => {
      console.log("Minigames session completed", data);
    },
    onError: (error) => {
      console.error("Failed to complete minigame session.", error);
    },
  });
};

const getMinigameLogByMinigameIdAndSessionId = async (
  minigameId: string,
  readingSessionId: string
): Promise<MinigameLog> => {
  try {
    const url = `${API_URL}/minigames/${minigameId}/sessions/${readingSessionId}/`;
    const response = await axiosInstance.get(url);

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to get minigamelog.", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch minigamelog."
    );
  }
};

export const useGetMinigameLogByMIDRSID = (
  minigameId: string,
  readingSessionId: string
) => {
  return useQuery<MinigameLog, Error>({
    queryKey: ["minigamelog"],
    queryFn: () =>
      getMinigameLogByMinigameIdAndSessionId(minigameId, readingSessionId),
    enabled: false
  });
};
