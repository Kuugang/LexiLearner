import axios from "axios";
import { API_URL } from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("bearerToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});
