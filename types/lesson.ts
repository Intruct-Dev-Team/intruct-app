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
  content: string;
}

export type TestQuestionType =
  | "multiple-choice"
  | "true-false"
  | "short-answer";

export interface TestQuestion {
  id: string;
  question: string;
  type: TestQuestionType;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}
