import { API_URL } from "../utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { ReadingSession } from "@/models/ReadingSession";
import { useReadingSessionStore } from "@/stores/readingSessionStore";

const createReadingSession = async (
  ReadingMaterialId: string
): Promise<ReadingSession> => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/readingsessions/${ReadingMaterialId}`
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to create reading session.", error);
    throw new Error(
      error?.response?.data?.message || "Failed to create reading session."
    );
  }
};

export const useCreateReadingSession = () => {
  const queryClient = useQueryClient();
  const addSession = useReadingSessionStore((state) => state.addSession);
  return useMutation({
    mutationFn: (readingMaterialId: string) =>
      createReadingSession(readingMaterialId),
    onSuccess: (data) => {
      console.log("Reading session created:", data);
      addSession(data);
      queryClient.invalidateQueries({ queryKey: ["readingSessions"] });
    },
    onError: (error) => {
      console.error("Error creating reading session:", error);
    },
  });
};

const updateReadingSession = async (
  ReadingSession: ReadingSession
): Promise<ReadingSession> => {
  try {
    const response = await axiosInstance.put(
      `${API_URL}/readingsessions/${ReadingSession.id}`,
      ReadingSession
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Failed to update reading session.", error);
    throw new Error(
      error?.response?.data?.message || "Failed to update reading session."
    );
  }
};

export const useUpdateReadingSession = () => {
  const updateReadingSessionProgress = useReadingSessionStore(
    (state) => state.updateReadingSessionProgress
  );

  return useMutation({
    mutationFn: (readingSession: ReadingSession) =>
      updateReadingSession(readingSession),
    onSuccess: (data) => {
      console.log("Reading session updated:", data);
      updateReadingSessionProgress(data.id, data.completionPercentage);
    },
    onError: (error) => {
      console.error("Error updating session:", error);
    },
  });
};

export const getIncompleteReadingSessions = async () => {
  const response = await axiosInstance.get(
    `/readingsessions/incomplete/readingmaterials`,
    {
      validateStatus: () => true,
    }
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  console.log("Incomplete Reading Sessions:", response.data.data);
  return response.data.data;
};
