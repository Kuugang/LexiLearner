import { axiosInstance } from "@/utils/axiosInstance";

import { API_URL } from "../utils/constants";

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/users/me`);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch profile",
    );
  }
};

export const updateProfile = async (updateProfileForm: Record<string, any>) => {
  const requestData = new FormData();

  Object.keys(updateProfileForm).forEach((key) => {
    const value = updateProfileForm[key];
    if (value instanceof File || value instanceof Blob) {
      requestData.append(key, value);
    } else {
      requestData.append(key, value?.toString());
    }
  });

  try {
    const response = await axiosInstance.put(`/users/me`, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "";
    throw Error(message);
  }
};

export const checkUserExist = async (fieldType: string, fieldValue: string) => {
  const response = await axiosInstance.get(
    `/users/check-user?fieldType=${fieldType}&fieldValue=${fieldValue}`,
    {
      validateStatus: () => true,
    },
  );
  return response.data;
};

export const deleteAccount = async () => {
  const response = await axiosInstance.delete(`/users/me`);
  return response.data;
};
