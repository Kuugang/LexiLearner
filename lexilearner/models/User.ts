export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  twoFactorEnabled: boolean;
  phoneNumber: string;
  role: string;

  pupil?: Pupil;
}

export interface TeacherProfile {
  user: User;
}

export interface Pupil {
  id?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  level?: number;
}
