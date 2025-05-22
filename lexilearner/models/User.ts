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

export function extractUser(data: Record<string, any>): User {
  const {
    id,
    email,
    firstName,
    lastName,
    userName,
    twoFactorEnabled,
    phoneNumber,
    role,
    pupil,
  } = data;

  const user: User = {
    id: id,
    email: email,
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    twoFactorEnabled: twoFactorEnabled,
    phoneNumber: phoneNumber,
    role: role,
  };

  if (role === "Pupil") {
    user.pupil = pupil;
  }
  return user;
}
