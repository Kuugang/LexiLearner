import { Pupil, TeacherProfile, User } from "./User";

export interface Classroom {
  id: string;
  teacher: TeacherProfile;
  joinCode: string;
  name: string;
  description?: string;
  pupilCount?: number;
}

export interface ClassroomEnrollment {
  classroom: Classroom;
  pupil: Pupil;
}
