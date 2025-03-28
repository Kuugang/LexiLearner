import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../utils/constants";

export const getProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    //modularize this
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateProfile = async (updateProfileForm: Record<string, any>) => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  let requestData = new FormData();

  // Append each field from updateProfileForm to FormData
  Object.keys(updateProfileForm).forEach((key) => {
    if (
      updateProfileForm[key] instanceof File ||
      updateProfileForm[key] instanceof Blob
    ) {
      // If it's a file, append it correctly
      requestData.append(key, updateProfileForm[key]);
    } else {
      // Convert other values to string before appending
      requestData.append(key, updateProfileForm[key].toString());
    }
  });

  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`, // Do not set 'Content-Type', let FormData handle it
    },
    body: requestData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Update profile failed: " + data.message);
  }

  return data;
};
