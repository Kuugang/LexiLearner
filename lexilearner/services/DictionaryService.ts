import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const dictionary_key = process.env.EXPO_PUBLIC_DICTIONARY_API;

const dictionary = async (word: string) => {
  try {
    const response = await axiosInstance.post(
      `https://www.dictionaryapi.com/api/v3/references/sd2/json/${word}?key=${dictionary_key}`,
      {
        validateState: () => true,
      }
    );
    console.log(response.data[0].shortdef[0]);
    return response.data[0].shortdef[0];
  } catch (err) {
    throw err;
  }
};

export const useDictionary = (word: string) => {
  return useQuery({
    queryKey: ["dictionary", word],
    queryFn: () => dictionary(word),
    enabled: !!word,
  });
};
