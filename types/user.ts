/** Supabase/Auth user representation (deprecated for profile data; use UserProfile) */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Statistics types (deprecated; profile now includes completedCourses, inProgressCourses)
export interface UserStats {
  completed: number;
  inProgress: number;
  dayStreak: number;
}

// Backend user profile (camelCase client shape; API is snake_case)
export interface UserProfile {
  id: string;
  externalUuid: string;
  email: string;
  name: string;
  surname: string;
  registrationDate: string;
  birthdate: string;
  avatar: string;
  completedCourses: number;
  inProgressCourses: number;
  streak: number;
}

export interface CompleteRegistrationRequest {
  name: string;
  surname: string;
  birthdate: string;
  avatar?: string;
}
