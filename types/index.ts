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
  progress?: number;
  createdAt: string;
  updatedAt: string;
  category?: string;
  author?: string;
  rating?: number;
  students?: number;
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
