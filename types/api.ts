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
