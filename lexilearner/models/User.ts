export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  twoFactorEnabled: boolean;
  phoneNumber: string;
  role: string;

  age?: number;
  level?: number;
}

export interface TeacherProfile {
  user: User;
}

export interface StudentProfile {
  user: User;
  readingLevel: number;
  age: number;
  gradeLevel: number;
}
