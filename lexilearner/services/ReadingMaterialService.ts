import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axiosInstance";
import { API_URL } from "../utils/constants";

import { ReadingContentType } from "@/models/ReadingContent";

export const useStories = () => {
  return useQuery<ReadingContentType[], Error>({
    queryKey: ["stories"],
    queryFn: getStories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

const getStories = async (): Promise<ReadingContentType[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/readingMaterials`);

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching stories:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch stories."
    );
  }
};

export const useRecommendedStories = (isPupil: boolean) => {
  return useQuery<ReadingContentType[], Error>({
    queryKey: ["recommendedStories"],
    queryFn: getRecommendations,
    staleTime: 1000 * 60 * 60,
    enabled: !!isPupil,
  });
};

const getRecommendations = async (): Promise<ReadingContentType[]> => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/readingMaterials/recommendations`
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching recommended stories:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch recommended stories."
    );
  }
};

export const getFilteredStories = async (
  filters?: ReadingMaterialFilters
): Promise<ReadingContentType[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/readingMaterials`, {
      params: filters,
    });
    // console.log("stories fetched from api:", response);

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching stories:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch stories."
    );
  }
};

export interface ReadingMaterialFilters {
  Id?: string;
  Genre: string[];
  Title: string;
}

const getReadingMaterialById = async (readingMaterialId: string) => {
  const response = await axiosInstance.get(
    `/readingMaterials/${readingMaterialId}`,
    {
      validateStatus: () => true,
    }
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useGetReadingMaterialById = (readingMaterialId: string) => {
  return useQuery<ReadingContentType>({
    queryKey: ["readingMaterial", readingMaterialId],
    queryFn: () => getReadingMaterialById(readingMaterialId),
    enabled: !!readingMaterialId,
  });
};
