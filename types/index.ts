/** Supabase/Auth user representation (deprecated for profile data; use UserProfile) */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Course types
export interface Course {
  id: string;
  backendId?: number;
  title: string;
  description: string;
  lessons: number;
  modules?: Module[];
  progress?: number;
  createdAt: string;
  updatedAt: string;
  category?: string;
  author?: string;
  rating?: number | null; // nullable: private/unavailable
  students?: number | null; // nullable: private/unavailable
  isPublic?: boolean;
  isMine?: boolean;
  status?: "generating" | "ready" | "failed"; // backend-driven
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  /** Optional ordering value from backend (serial_number) */
  serialNumber?: number;
  /** Optional timestamps from backend */
  createdAt?: string;
  updatedAt?: string;
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

// Statistics types (deprecated; profile now includes completedCourses, inProgressCourses)
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
// Single source of truth for user data from backend
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
  birthdate: string; // YYYY-MM-DD
  avatar?: string; // Optional – can be empty or undefined
}

// API Response types for Swagger endpoints

// POST /course response
export interface CreateCourseResponse {
  course_id: number;
}

// PATCH /courses/{course_id}/upload request types
export interface UploadQuizRequest {
  question: string;
  options: string[];
  correct_index: number;
}

export interface UploadLessonRequest {
  lesson_id: number;
  lesson_title: string;
  content: string;
  quiz?: UploadQuizRequest[];
}

export interface UploadModuleRequest {
  module_id: number;
  module_title: string;
  lessons: UploadLessonRequest[];
}

export interface UploadCourseContentRequest {
  course_title: string;
  language: string;
  last_updated: string;
  total_modules: number;
  total_lessons: number;
  modules: UploadModuleRequest[];
}

// GET /lessons/{lesson_id} response types (Swagger)
export interface LessonQuizItemResponse {
  id?: number;
  question?: string;
  options?: string[];
  correct_index?: number;
  serial_number?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GetLessonResponse {
  id?: number;
  course_id?: number;
  module_id?: number;
  serial_number?: number;
  title?: string;
  description?: string;
  content?: string;
  quizzes?: LessonQuizItemResponse[];
  created_at?: string;
  updated_at?: string;
}
