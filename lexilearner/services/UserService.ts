import { axiosInstance } from "@/utils/axiosInstance";

import { API_URL } from "../utils/constants";
import { useQueries } from "@tanstack/react-query";
import { makeMultipartFormDataRequest } from "@/utils/utils";
import { getAllReadingSessions } from "./ReadingSessionService";
import { ReadingContentType } from "@/models/ReadingContent";

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/users/me`);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch profile"
    );
  }
};

export const updateProfile = async (updateProfileForm: Record<string, any>) => {
  const response = await makeMultipartFormDataRequest(
    `/users/me`,
    updateProfileForm,
    "PUT",
    null
  );

  const result = await response.json();

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(result.message);
  }

  return result;
};

export const checkUserExist = async (fieldType: string, fieldValue: string) => {
  const response = await axiosInstance.get(
    `/users/check-user?fieldType=${fieldType}&fieldValue=${fieldValue}`,
    {
      validateStatus: () => true,
    }
  );

  if (response.status === 429) {
    throw Error("Slow down!");
  }

  return response.data;
};

export const deleteAccount = async () => {
  const response = await axiosInstance.delete(`/users/me`);

  if (response.status !== 200 && response.status !== 204) {
    throw new Error(response.data.message);
  }

  return response.data;
};

export const createSession = async () => {
  const response = await axiosInstance.post("/users/me/sessions", {
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}; // 1 session 1 new row

export const endSession = async (sessionId: string) => {
  const response = await axiosInstance.put(`/users/me/sessions/${sessionId}`, {
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const getTotalSession = async () => {
  const response = await axiosInstance.get("/users/me/sessions", {
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const getSessionById = async () => {};

export const recordLoginStreak = async () => {
  const response = await axiosInstance.put("/users/me/streak", {
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const getLoginStreak = async () => {
  const response = await axiosInstance.get("/users/me/streak", {
    validateStatus: () => true,
  });
  console.log("Get login streak response: ", response.data.data);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const getPupilAchievements = async () => {
  const response = await axiosInstance.get(`/achievements`, {
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    console.error(response.data.message);
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const useProfileStats = (isPupil: boolean) => {
  return useQueries({
    queries: [
      {
        queryKey: ["achievements"],
        queryFn: getPupilAchievements,
        enabled: isPupil,
      },
      {
        queryKey: ["totalSession"],
        queryFn: getTotalSession,
        refetchOnWindowFocus: true,
        enabled: isPupil,
      },
      {
        queryKey: ["loginStreak"],
        queryFn: getLoginStreak,
        enabled: isPupil,
      },
      {
        queryKey: ["readingSessions"],
        queryFn: getAllReadingSessions,
        select: (data: any) => data.length,
        enabled: isPupil,
      },
    ],
  });
};
