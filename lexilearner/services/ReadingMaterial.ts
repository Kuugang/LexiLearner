import { useQuery } from "@tanstack/react-query";
import { fetchStories } from "@/utils/mockup";

export const useStories = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: fetchStories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
