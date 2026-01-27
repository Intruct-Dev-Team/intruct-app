import type { Lesson } from "./lesson";

export type CourseStatus = "generating" | "ready" | "failed";

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
  rating?: number | null;
  students?: number | null;
  isPublic?: boolean;
  isMine?: boolean;
  status?: CourseStatus;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}
