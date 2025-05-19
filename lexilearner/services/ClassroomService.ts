import { axiosInstance } from "@/utils/axiosInstance";

import { User, Pupil } from "@/models/User";
import {
  ReadingAssignment,
  ReadingAssignmentOverview,
} from "@/models/ReadingMaterialAssignment";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ReadingAssignmentLog } from "@/models/ReadingAssignmentLog";
export { Pupil };

export const createClassroom = async (classroomForm: Record<string, any>) => {
  const response = await axiosInstance.post(
    "/classroom/create",
    classroomForm,
    { validateStatus: () => true }
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data;
};

export const joinClassroom = async (joinCode: string) => {
  const response = await axiosInstance.post(`/classroom/${joinCode}`, {
    validateState: () => true,
  });
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const getByRoleId = async (role: string) => {
  let response;
  if (role === "Teacher") {
    response = await axiosInstance.get("/classroom/teacher/me", {
      validateStatus: () => true,
    });
  } else {
    response = await axiosInstance.get("/classroom/me", {
      validateStatus: () => true,
    });
  }

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const editClassroom = async (
  classroomForm: Record<string, any>,
  classroomId: string
) => {
  const requestData = new FormData();

  Object.keys(classroomForm).forEach((key) => {
    const value = classroomForm[key];
    if (value instanceof File || value instanceof Blob) {
      requestData.append(key, value);
    } else {
      requestData.append(key, value?.toString());
    }
  });

  console.log("requestData", requestData);

  try {
    const response = await axiosInstance.put(
      `classroom/${classroomId}`,
      requestData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const deleteClassroom = async (classroomId: string) => {
  const response = await axiosInstance.delete(`classroom/${classroomId}`);
  return response.data;
};

export const leaveClassroom = async (classroomId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/classroom/me/${classroomId}`,
      {
        validateStatus: () => true,
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to leave classroom");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error leaving classroom:", error);
    throw new Error(
      error.response?.data?.message || "Failed to leave classroom"
    );
  }
};

export const searchPupils = async (query: string): Promise<Pupil[]> => {
  try {
    const response = await axiosInstance.get(
      `/users/search?query=${query}&role=Pupil`,
      {
        validateStatus: () => true,
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data.message || "Failed to search pupils");
    }

    let users;
    if (response.data.data && response.data.data.$values) {
      users = response.data.data.$values;
    } else if (response.data.data) {
      users = response.data.data;
    } else {
      console.warn("Unexpected response format:", response.data);
      return [];
    }

    if (!Array.isArray(users)) {
      console.error("Expected an array but got, hoi:", typeof users);
      return [];
    }

    return users.map((user: User) => ({
      id: user.pupil?.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    }));
  } catch (error: any) {
    console.error("Error searching pupils:", error);
    return [];
  }
};

export const addPupilToClassroom = async (
  classroomId: string,
  pupilId: string
) => {
  try {
    console.log("Adding pupil with ID:", pupilId);
    const response = await axiosInstance.post(
      `/classroom/${classroomId}/pupils`,
      pupilId,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(
        response.data.message || "Failed to add pupil to classroom"
      );
    }

    return response.data;
  } catch (error: any) {
    console.error("Error adding pupil to classroom:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add pupil to classroom"
    );
  }
};

export const removePupilFromClassroom = async (
  classroomId: string,
  pupilId: string
) => {
  try {
    const response = await axiosInstance.delete(
      `/classroom/${classroomId}/pupils`,
      {
        data: pupilId,
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(
        response.data.message || "Failed to remove pupil from classroom"
      );
    }

    return response.data;
  } catch (error: any) {
    console.error("Error removing pupil from classroom:", error);
    throw new Error(
      error.response?.data?.message || "Failed to remove pupil from classroom"
    );
  }
};

export const getPupilsFromClassroom = async (
  classroomId: string
): Promise<Pupil[]> => {
  try {
    const response = await axiosInstance.get(
      `/classroom/${classroomId}/pupils`,
      {
        validateStatus: () => true,
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(
        response.data.message || "Failed to get pupils from classroom"
      );
    }

    let pupils;
    if (response.data && response.data.data && response.data.data.$values) {
      pupils = response.data.data.$values;
    } else if (response.data && response.data.data) {
      pupils = response.data.data;
    } else {
      console.warn("Unexpected response format:", response.data);
      return [];
    }

    if (!Array.isArray(pupils)) {
      console.warn("Expected an array but got, array oi:", typeof pupils);
      return [];
    }

    return pupils.map((pupil: any) => ({
      id: pupil.id || pupil.pupilId || "",
      firstName: pupil.firstName || (pupil.user && pupil.user.firstName) || "",
      lastName: pupil.lastName || (pupil.user && pupil.user.lastName) || "",
    }));
  } catch (error: any) {
    console.error("Error getting pupils from classroom:", error);
    return [];
  }
};

export const createReadingAssignment = async (variables: {
  classroomId: string;
  readingAssignmentForm: Record<string, any>;
}) => {
  const { classroomId, readingAssignmentForm } = variables;

  const response = await axiosInstance.post(
    `/classroom/${classroomId}/readingassignments`,
    readingAssignmentForm,
    { validateStatus: () => true }
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data;
};

export const useActiveReadingAssignments = (classroomId: string) => {
  return useQuery<ReadingAssignment[], Error>({
    queryKey: ["activeReadingAssignments"],
    queryFn: () => getReadingAssignments(classroomId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

const getReadingAssignments = async (
  classroomId: string
): Promise<ReadingAssignment[]> => {
  console.log(
    "Fetching active reading assignments for classroom:",
    classroomId
  );
  const response = await axiosInstance.get(
    `/classroom/${classroomId}/readingassignments/active`,
    { validateStatus: () => true }
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const getLeaderboardByClassroomId = async (classroomId: string) => {
  const response = await axiosInstance.get(
    `/classroom/${classroomId}/leaderboard`,
    {
      validateStatus: () => true,
    }
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

const getReadingAssignmentsOverviewByClassroomId = async (
  classroomId: string
): Promise<ReadingAssignmentOverview[]> => {
  const response = await axiosInstance.get(
    `/classroom/${classroomId}/readingAssignments/overview`,
    { validateStatus: () => true }
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const useReadingAssigmentsWStats = (classroomId: string) => {
  console.log("CALLED IT");
  return useQuery({
    queryKey: ["readingAssignmentsWStats"],
    queryFn: () => getReadingAssignmentsOverviewByClassroomId(classroomId),
  });
};

const createAssignmentLog = async (
  readingAssignmentId: string,
  minigamelogId: string
) => {
  const response = await axiosInstance.post(
    `classroom/readingAssignments/${readingAssignmentId}/logs/${minigamelogId}`,
    { validateStatus: () => true }
  );

  if (response.status !== 200 && response.status !== 201) {
    console.log(response.data);
    throw new Error(response.data.message);
  }

  return response.data;
};

export const useCreateAssignmentLog = () => {
  return useMutation({
    mutationFn: ({
      readingAssignmentId,
      minigamelogId,
    }: {
      readingAssignmentId: string;
      minigamelogId: string;
    }) => createAssignmentLog(readingAssignmentId, minigamelogId),
  });
};

const getReadingAssignmentLogsByReadingAssignmentId = async (
  readingAssignmentId: string
): Promise<ReadingAssignmentLog[]> => {
  const response = await axiosInstance.get(
    `classroom/readingAssignments/${readingAssignmentId}/logs`,
    { validateStatus: () => true }
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

export const useGetReadingAssignmentLogs = (readingAssignmentId: string) => {
  return useQuery({
    queryKey: ["assignmentlogs"],
    queryFn: () =>
      getReadingAssignmentLogsByReadingAssignmentId(readingAssignmentId),
  });
};
