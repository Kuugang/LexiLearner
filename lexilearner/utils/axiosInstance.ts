import axios from "axios";
import { API_URL } from "./constants";

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// axiosInstance.interceptors.request.use((config) => {
//   const fullUrl = `${config.baseURL}${config.url}`;
//   console.log("Request URL:", fullUrl);
//   return config;
// });
