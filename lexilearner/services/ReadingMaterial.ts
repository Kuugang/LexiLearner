import { useQuery } from "@tanstack/react-query";
import { fetchStories } from "@/utils/mockup";

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

export const getStories = async (): Promise<ReadingContentType[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/readingMaterials`);
    console.log("stories fetched from api:", response.data.data);

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching stories:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch stories."
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
    console.log("stories fetched from api:", response);

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
