import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const dictionary_key = process.env.EXPO_PUBLIC_DICTIONARY_API;

const dictionary = async (word: string) => {
  if (word.length <= 2) return "No definition found.";
  try {
    const response = await axiosInstance.post(
      `https://www.dictionaryapi.com/api/v3/references/sd2/json/${word}?key=${dictionary_key}`,
      {
        validateState: () => true,
      }
    );

    const data = response.data;

    if (Array.isArray(data) && data[0]?.shortdef?.[0]) {
      return data[0].shortdef[0];
    }

    return "No definition found.";
  } catch (err) {
    console.log("Error fetching dictionary definition", err);
    return "Failed to fetch definition.";
  }
};

export const useDictionary = (word: string) => {
  return useQuery({
    queryKey: ["dictionary", word],
    queryFn: () => dictionary(word),
    enabled: !!word,
  });
};
