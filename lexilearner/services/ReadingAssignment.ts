import { Classroom } from "@/models/Classroom";
import { ReadingAssignment } from "@/models/ReadingMaterialAssignment";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getReadingAssignmentById = async (readingAssignmentId: string) => {
  const response = await axiosInstance.get(
    `/classroom/readingAssignments/${readingAssignmentId}`,
    {
      validateStatus: () => true,
    }
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const useGetReadingAssignmentById = (readingAssignmentId: string) => {
  return useQuery({
    queryKey: ["readingAssignment", readingAssignmentId],
    queryFn: () => getReadingAssignmentById(readingAssignmentId),
  });
};

const updateReadingAssignment = async (
  readingAssignmentId: string,
  readingAssignment: ReadingAssignment
) => {
  try {
    const response = await axiosInstance.put(
      `/classroom/readingAssignments/${readingAssignmentId}`,
      readingAssignment
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data.message);
  }
};

export const useUpdateReadingAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      readingAssignment,
    }: {
      readingAssignment: ReadingAssignment;
    }) => updateReadingAssignment(readingAssignment.id, readingAssignment),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["activeReadingAssignments"],
      }),
  });
};

export const deleteReadingAssignment = async () => {};
