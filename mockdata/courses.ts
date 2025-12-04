import { Course } from "@/types";

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to React Native",
    description: "Learn the basics of React and component-based development",
    lessons: 8,
    progress: 65,
    createdAt: "2025-11-15T10:00:00Z",
    updatedAt: "2025-12-03T14:30:00Z",
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description: "Master TypeScript type system and advanced patterns",
    lessons: 12,
    progress: 0,
    createdAt: "2025-11-20T09:00:00Z",
    updatedAt: "2025-11-20T09:00:00Z",
  },
  {
    id: "3",
    title: "React Native Fundamentals",
    description: "Build mobile apps with React Native",
    lessons: 15,
    progress: 30,
    createdAt: "2025-10-10T08:00:00Z",
    updatedAt: "2025-12-01T16:00:00Z",
  },
];

export const mockFeaturedCourses: Course[] = [
  {
    id: "4",
    title: "Machine Learning Basics",
    description: "Introduction to ML algorithms and concepts",
    lessons: 20,
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2025-11-01T10:00:00Z",
  },
  {
    id: "5",
    title: "Web Development Bootcamp",
    description: "Full-stack web development from scratch",
    lessons: 50,
    createdAt: "2025-10-15T10:00:00Z",
    updatedAt: "2025-10-15T10:00:00Z",
  },
];
