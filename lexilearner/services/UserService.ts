import { axiosInstance } from "@/utils/axiosInstance";

import { API_URL } from "../utils/constants";
import { useQuery } from "@tanstack/react-query";

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

export const getSessionById = async () => { };

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
