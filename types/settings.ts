export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: string;
  defaultCourseLanguage: string;
  notifications: boolean;
}

export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

export interface SettingsMenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
}

export type SortOption = "popular" | "newest" | "rating" | "students";
