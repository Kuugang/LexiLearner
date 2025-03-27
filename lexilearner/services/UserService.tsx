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
