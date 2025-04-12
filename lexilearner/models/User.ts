export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // username: string;
  // twoFactorEnabled: boolean;
  // phoneNumber: string;
  // role?: string;
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
