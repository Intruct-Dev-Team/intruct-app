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

export const mockCatalogCourses: Course[] = [
  {
    id: "cat-1",
    title: "Complete Python Bootcamp",
    description:
      "Learn Python from scratch with hands-on projects and exercises",
    lessons: 24,
    category: "development",
    author: "Dr. Sarah Johnson",
    rating: 4.8,
    students: 12453,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-01T10:00:00Z",
  },
  {
    id: "cat-2",
    title: "Web Development Masterclass",
    description: "Master HTML, CSS, JavaScript, and modern frameworks",
    lessons: 32,
    category: "development",
    author: "Mike Chen",
    rating: 4.9,
    students: 8932,
    createdAt: "2025-10-15T10:00:00Z",
    updatedAt: "2025-10-15T10:00:00Z",
  },
  {
    id: "cat-3",
    title: "Data Science Fundamentals",
    description:
      "Introduction to data analysis, statistics, and machine learning",
    lessons: 28,
    category: "development",
    author: "Prof. Emily Davis",
    rating: 4.7,
    students: 15234,
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-08-20T10:00:00Z",
  },
  {
    id: "cat-4",
    title: "UI/UX Design Principles",
    description: "Learn to create beautiful and functional user interfaces",
    lessons: 18,
    category: "design",
    author: "Alex Rivera",
    rating: 4.6,
    students: 6789,
    createdAt: "2025-09-10T10:00:00Z",
    updatedAt: "2025-09-10T10:00:00Z",
  },
  {
    id: "cat-5",
    title: "Digital Marketing Strategy",
    description: "Master SEO, social media, and content marketing",
    lessons: 22,
    category: "business",
    author: "Jennifer Lee",
    rating: 4.5,
    students: 9876,
    createdAt: "2025-07-15T10:00:00Z",
    updatedAt: "2025-07-15T10:00:00Z",
  },
  {
    id: "cat-6",
    title: "Mobile App Development",
    description: "Build iOS and Android apps with React Native",
    lessons: 35,
    category: "development",
    author: "David Park",
    rating: 4.8,
    students: 11234,
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2025-11-01T10:00:00Z",
  },
];

export const courseCategories = [
  { id: "all", name: "All", slug: "all" },
  { id: "development", name: "Development", slug: "development" },
  { id: "design", name: "Design", slug: "design" },
  { id: "business", name: "Business", slug: "business" },
];
