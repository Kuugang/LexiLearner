import { Pupil } from "@/services/ClassroomService";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "./constants";

export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const validateField = (
  name: string,
  value: string,
  form: Record<string, any> = {},
) => {
  switch (name) {
    case "firstName":
      if (!value.trim() || !value) return "First Name is required.";
      if (!value) return "First Name is required.";
      if (value.length > 64)
        return "Length of First Name is at most 64 characters.";
      return "";

    case "lastName":
      if (!value.trim() || !value) return "Last Name is required.";
      if (!value) return "Last Name is required.";
      if (value.length > 64)
        return "Length of First Name is at most 64 characters.";
      return "";

    case "username":
      if (!value.trim() || !value) return "Username is required.";
      if (!value) return "Username is required.";
      return "";

    case "email":
      if (!value.trim() || !value) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email format.";
      return ""; // No error

    case "password":
      if (!value.trim() || !value) return "Password is required.";
      if (value.length < 6)
        return "Password must be at least 6 characters long.";
      if (!/[A-Z]/.test(value))
        return "Password must contain at least one uppercase letter.";
      if (!/[a-z]/.test(value))
        return "Password must contain at least one lowercase letter.";
      if (!/[0-9]/.test(value))
        return "Password must contain at least one number.";
      if (!/[^a-zA-Z0-9]/.test(value))
        return "Password must contain at least one special character.";
      return ""; // No error

    case "confirmPassword":
      if (value !== form.password) return "Passwords no not match.";
      return "";

    default:
      return "";
  }
};

export const displayPupilName = (pupil: Pupil): string => {
  return `${pupil.firstName} ${pupil.lastName}`;
};

export const getRandomColor = (name: string) => {
  const colors = [
    "#845EC2",
    "#D65DB1",
    "#FF6F91",
    "#FF9671",
    "#FFC75F",
    "#F9F871",
    "#0089BA",
    "#2C73D2",
  ];
  const hash = name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + acc;
  }, 0);
  return colors[hash % colors.length];
};

//shallow?
export const getChangedFields = (
  original: any,
  updated: any,
): Record<string, any> => {
  const changes: any = {};
  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changes[key] = updated[key];
    }
  }
  return changes;
};

export const getFormDataImageFromPickerAsset = async (
  asset: ImagePicker.ImagePickerAsset,
) => {
  const fileUri = asset.uri;
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) {
    throw new Error("File does not exist");
  }
  const extension =
    asset.fileName?.match(/\.[0-9a-z]+$/i)?.[0].slice(1) ?? "jpeg";

  const file = {
    uri: fileUri,
    type: asset.type + "/" + extension,
    name: asset.fileName,
  };
  console.log(file);
  return file;
};

export const makeMultipartFormDataRequest = async (
  path: string,
  data: Record<string, any> | null = null,
  method: "PUT" | "POST",
  headers: Record<string, string> | null = null,
) => {
  const formData = new FormData();
  if (data) {
    for (const prop in data) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        const value = data[prop];

        if (
          value &&
          typeof value === "object" &&
          ("mime" in value || "type" in value || "uri" in value)
        ) {
          const fileData = {
            uri: value.uri,
            type: value.mime || value.type || "image/jpeg",
            name: value.name || `file_${Date.now()}.jpg`,
          };

          console.log("Appending file:", prop, fileData);
          formData.append(prop, fileData as any);
        } else if (value !== null && value !== undefined) {
          console.log("Appending field:", prop, value);
          formData.append(prop, String(value));
        }
      }
    }
  }

  const url = `${API_URL}${path}`;

  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  const token = await AsyncStorage.getItem("accessToken");

  return fetch(url, {
    method: method,
    headers: {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });
};
