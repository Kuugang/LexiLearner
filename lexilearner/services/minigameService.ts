import { API_URL } from "../utils/constants";
import { Minigame } from "@/models/Minigame";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";

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
    console.log("Minigames fetched from api:", response.data.data);

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
