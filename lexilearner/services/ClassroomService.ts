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

export const getByTeacherId = async () => {
  const response = await axiosInstance.get("/classroom/teacher/me", {
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export const editClassroom = async (
  classroomForm: Record<string, any>,
  classroomId: string
) => {
  const response = await axiosInstance.put(
    `/classroom/${classroomId}`,
    classroomForm,
    { validateStatus: () => true }
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(response.data.message);
  }

  return response.data;
};
