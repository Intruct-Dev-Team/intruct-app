// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: number;
  modules?: Module[];
  progress?: number;
  createdAt: string;
  updatedAt: string;
  category?: string;
  author?: string;
  // rating/students are nullable to represent private/unavailable values
  rating?: number | null;
  students?: number | null;
  // Public or private course flag
  isPublic?: boolean;
  // Course generation status (backend-driven).
  status?: "generating" | "ready";
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  materials?: LessonMaterial[];
  questions?: TestQuestion[];
}

export interface LessonMaterial {
  id: string;
  title: string;
  content: string; // markdown formatted text
}

export interface TestQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[]; // for multiple-choice and true-false
  correctAnswer: string | number; // index for multiple-choice, boolean string for true-false, text for short-answer
  explanation?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
}

export type SortOption = "popular" | "newest" | "rating" | "students";

// Statistics types
export interface UserStats {
  completed: number;
  inProgress: number;
  dayStreak: number;
}

// Settings types
export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: string;
  defaultCourseLanguage: string;
  notifications: boolean;
}

// Language option
export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

// Settings item
export interface SettingsMenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: string;
}

// Backend user profile (camelCase client shape; API is snake_case)
export interface UserProfile {
  id: string;
  externalUuid: string;
  email: string;
  name: string;
  surname: string;
  registrationDate: string;
  birthdate: string; // YYYY-MM-DD
  avatar: string;
  completedCourses: number;
  inProgressCourses: number;
  streak: number;
}

export interface CompleteRegistrationRequest {
  name: string;
  surname: string;
  birthdate: string; // YYYY-MM-DD
  avatar: string;
}
