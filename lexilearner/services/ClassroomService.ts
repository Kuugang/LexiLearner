import { useUserStore } from "@/stores/userStore";
import { axiosInstance } from "@/utils/axiosInstance";

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

export const leaveClassroom = async () => {};
export const addPupilToClassroom = async () => {};
export const removePupilFromClassroom = async () => {};
export const getPupilsFromClassroom = async () => {};

export const createReadingAssignment = async () => {};
export const getReadingAssignments = async () => {}; // use get ACTIVE assignments endpoint
export const updateReadingAssignment = async () => {};
export const deleteReadingAssignment = async () => {};
