import { API_URL } from "../utils/constants";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { ReadingSession } from "@/models/ReadingSession";
import { useReadingSessionStore } from "@/stores/readingSessionStore";

const createReadingSession = async (
  ReadingMaterialId: string,
): Promise<ReadingSession> => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/readingsessions/${ReadingMaterialId}`,
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to create reading session.", error);
    throw new Error(
      error?.response?.data?.message || "Failed to create reading session.",
    );
  }
};

export const useCreateReadingSession = () => {
  const addSession = useReadingSessionStore((state) => state.addSession);
  return useMutation({
    mutationFn: (readingMaterialId: string) =>
      createReadingSession(readingMaterialId),
    onSuccess: (data) => {
      console.log("Session created:", data);
      addSession(data);
    },
    onError: (error) => {
      console.error("Error creating session:", error);
    },
  });
};
