import { StudentProfile, TeacherProfile, User } from "./User";

export interface Classroom {
  id: string;
  teacher: TeacherProfile;
  joinCode: string;
  name: string;
  description?: string;
}

export interface ClassroomEnrollment {
  classroom: Classroom;
  pupil: StudentProfile;
}
