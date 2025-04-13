import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../utils/constants";

export const getProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    //modularize this
    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (![200, 204].includes(response.status)) {
      throw new Error(`Profile fetch failed: ${data.message}`);
    }

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
      requestData.append(key, updateProfileForm[key]);
    } else {
      // Convert other values to string before appending
      requestData.append(key, updateProfileForm[key].toString());
    }
  });

  const response = await fetch(`${API_URL}/users/me`, {
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

export const checkUserExist = async (fieldType: string, fieldValue: string) => {
  try {
    const response = await fetch(
      `${API_URL}/users/check-user?fieldType=${fieldType}&fieldValue=${fieldValue}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// DD:
export const deleteAccount = async () => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Account deletion failed");
  }

  return data;
};
