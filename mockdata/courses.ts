import { Course } from "@/types";

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to React Native",
    description: "Learn the basics of React and component-based development",
    lessons: 8,
    modules: [
      {
        id: "m-1",
        title: "Course Content",
        lessons: Array.from({ length: 8 }).map((_, i) => ({
          id: `1-l-${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
    ],
    // progress is number of completed lessons (not percent)
    progress: 2,
    isPublic: false,
    rating: null,
    students: null,
    createdAt: "2025-11-15T10:00:00Z",
    updatedAt: "2025-12-03T14:30:00Z",
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description: "Master TypeScript type system and advanced patterns",
    lessons: 12,
    modules: [
      {
        id: "m-2-1",
        title: "Course Content",
        lessons: [
          {
            id: "2-l-1",
            title: "Getting Started with TypeScript",
            materials: [
              {
                id: "2-l-1-m-1",
                title: "TypeScript Basics",
                content: `# TypeScript Basics

## Introduction
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing to JavaScript.

## Key Features
- **Static Type Checking**: Catch errors at compile time
- **Enhanced IDE Support**: Better autocompletion and refactoring
- **Modern JavaScript Features**: Use ES6+ syntax today
- **Interfaces and Types**: Define contracts for your code

## Setting Up TypeScript
\`\`\`bash
npm install -D typescript
npx tsc --init
\`\`\`

## Your First TypeScript Program
\`\`\`typescript
interface Greeting {
  message: string;
  name: string;
}

function greet(greeting: Greeting): void {
  console.log(\`\${greeting.message}, \${greeting.name}!\`);
}

greet({ message: "Hello", name: "World" });
\`\`\`

## Basic Types
- \`string\`: Text data
- \`number\`: Numeric values
- \`boolean\`: True or false
- \`any\`: Bypass type checking
- \`unknown\`: Safe alternative to any
- \`never\`: Represents impossible values

## Next Steps
Learn about interfaces and how to structure your TypeScript projects effectively.`,
              },
            ],
            questions: [
              {
                id: "2-l-1-q-1",
                question: "What is TypeScript primarily used for?",
                type: "multiple-choice",
                options: [
                  "Adding static typing to JavaScript",
                  "Replacing JavaScript entirely",
                  "Running on servers only",
                  "Mobile app development",
                ],
                correctAnswer: 0,
                explanation:
                  "TypeScript is a typed superset of JavaScript that adds optional static type checking while remaining compatible with existing JavaScript code.",
              },
              {
                id: "2-l-1-q-2",
                question:
                  "True or False: TypeScript code can run directly in the browser.",
                type: "true-false",
                options: ["True", "False"],
                correctAnswer: 1,
                explanation:
                  "TypeScript must be compiled to JavaScript first before it can run in browsers or Node.js environments.",
              },
            ],
          },
          {
            id: "2-l-2",
            title: "Advanced TypeScript Concepts",
            materials: [
              {
                id: "2-l-2-m-1",
                title: "Advanced Types and Generics",
                content: `# Advanced TypeScript Concepts

## Generics
Generics allow you to create reusable components that work with multiple types while maintaining type safety.

### Generic Functions
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const str = identity<string>("hello");
const num = identity<number>(42);
\`\`\`

### Generic Interfaces
\`\`\`typescript
interface Container<T> {
  value: T;
  getValue(): T;
}

const stringContainer: Container<string> = {
  value: "hello",
  getValue() {
    return this.value;
  },
};
\`\`\`

## Union and Intersection Types
### Union Types
Represent a value that can be one of several types:
\`\`\`typescript
type ID = string | number;
function printID(id: ID) {
  console.log(\`ID: \${id}\`);
}
\`\`\`

### Intersection Types
Combine multiple types into one:
\`\`\`typescript
interface Named {
  name: string;
}

interface Aged {
  age: number;
}

type Person = Named & Aged;
\`\`\`

## Utility Types
- \`Partial<T>\`: Make all properties optional
- \`Required<T>\`: Make all properties required
- \`Pick<T, K>\`: Select specific properties
- \`Omit<T, K>\`: Exclude specific properties
- \`Record<K, T>\`: Create a type with specific keys

## Conditional Types
\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>; // false
\`\`\``,
              },
            ],
            questions: [
              {
                id: "2-l-2-q-1",
                question:
                  "What is the primary purpose of generics in TypeScript?",
                type: "multiple-choice",
                options: [
                  "To create reusable components that work with multiple types",
                  "To improve runtime performance",
                  "To reduce file size",
                  "To simplify syntax",
                ],
                correctAnswer: 0,
                explanation:
                  "Generics enable you to write code that works with different types while maintaining type safety and reusability.",
              },
              {
                id: "2-l-2-q-2",
                question: "What does the Partial<T> utility type do?",
                type: "short-answer",
                correctAnswer: "makes all properties optional",
                explanation:
                  "Partial<T> constructs a type with all properties of T set to optional, allowing you to omit any properties when creating instances.",
              },
            ],
          },
        ],
      },
    ],
    // a small number of completed lessons
    progress: 1,
    isPublic: true,
    rating: 4.6,
    students: 1024,
    createdAt: "2025-11-20T09:00:00Z",
    updatedAt: "2025-11-20T09:00:00Z",
  },
  {
    id: "3",
    title: "React Native Fundamentals",
    description: "Build mobile apps with React Native",
    lessons: 15,
    modules: [
      {
        id: "m-3",
        title: "Course Content",
        lessons: Array.from({ length: 15 }).map((_, i) => ({
          id: `3-l-${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
    ],
    // around half completed
    progress: 7,
    isPublic: false,
    rating: null,
    students: null,
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
    modules: [
      {
        id: "m-4-1",
        title: "Course Content",
        lessons: Array.from({ length: 20 }).map((_, i) => ({
          id: `4-l-${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
    ],
    isPublic: true,
    rating: 4.7,
    students: 5400,
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2025-11-01T10:00:00Z",
  },
  {
    id: "5",
    title: "Web Development Bootcamp",
    description: "Full-stack web development from scratch",
    lessons: 50,
    modules: [
      {
        id: "m-5-1",
        title: "Course Content",
        lessons: Array.from({ length: 50 }).map((_, i) => ({
          id: `5-l-${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
    ],
    isPublic: true,
    rating: 4.9,
    students: 23400,
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
    modules: [
      {
        id: "cat-1-m1",
        title: "Module 1",
        lessons: Array.from({ length: 12 }).map((_, i) => ({
          id: `cat1-m1-l${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
      {
        id: "cat-1-m2",
        title: "Module 2",
        lessons: Array.from({ length: 12 }).map((_, i) => ({
          id: `cat1-m2-l${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
    ],
    category: "development",
    author: "Dr. Sarah Johnson",
    rating: 4.8,
    students: 12453,
    isPublic: true,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-01T10:00:00Z",
  },
  {
    id: "cat-2",
    title: "Web Development Masterclass",
    description: "Master HTML, CSS, JavaScript, and modern frameworks",
    lessons: 32,
    modules: [
      {
        id: "cat-2-m1",
        title: "Module 1",
        lessons: Array.from({ length: 16 }).map((_, i) => ({
          id: `cat2-m1-l${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
      {
        id: "cat-2-m2",
        title: "Module 2",
        lessons: Array.from({ length: 16 }).map((_, i) => ({
          id: `cat2-m2-l${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
    ],
    category: "development",
    author: "Mike Chen",
    rating: 4.9,
    students: 8932,
    isPublic: true,
    createdAt: "2025-10-15T10:00:00Z",
    updatedAt: "2025-10-15T10:00:00Z",
  },
  {
    id: "cat-3",
    title: "Data Science Fundamentals",
    description:
      "Introduction to data analysis, statistics, and machine learning",
    lessons: 28,
    modules: [
      {
        id: "cat-3-m1",
        title: "Module 1",
        lessons: Array.from({ length: 14 }).map((_, i) => ({
          id: `cat3-m1-l${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
      {
        id: "cat-3-m2",
        title: "Module 2",
        lessons: Array.from({ length: 14 }).map((_, i) => ({
          id: `cat3-m2-l${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
    ],
    category: "development",
    author: "Prof. Emily Davis",
    rating: 4.7,
    students: 15234,
    isPublic: true,
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-08-20T10:00:00Z",
  },
  {
    id: "cat-4",
    title: "UI/UX Design Principles",
    description: "Learn to create beautiful and functional user interfaces",
    lessons: 18,
    modules: [
      {
        id: "cat-4-m1",
        title: "Module 1",
        lessons: Array.from({ length: 18 }).map((_, i) => ({
          id: `cat4-m1-l${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
    ],
    category: "design",
    author: "Alex Rivera",
    rating: 4.6,
    students: 6789,
    isPublic: true,
    createdAt: "2025-09-10T10:00:00Z",
    updatedAt: "2025-09-10T10:00:00Z",
  },
  {
    id: "cat-5",
    title: "Digital Marketing Strategy",
    description: "Master SEO, social media, and content marketing",
    lessons: 22,
    modules: [
      {
        id: "cat-5-m1",
        title: "Module 1",
        lessons: Array.from({ length: 22 }).map((_, i) => ({
          id: `cat5-m1-l${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
    ],
    category: "business",
    author: "Jennifer Lee",
    rating: 4.5,
    students: 9876,
    isPublic: true,
    createdAt: "2025-07-15T10:00:00Z",
    updatedAt: "2025-07-15T10:00:00Z",
  },
  {
    id: "cat-6",
    title: "Mobile App Development",
    description: "Build iOS and Android apps with React Native",
    lessons: 35,
    modules: [
      {
        id: "cat-6-m1",
        title: "Module 1",
        lessons: Array.from({ length: 35 }).map((_, i) => ({
          id: `cat6-m1-l${i + 1}`,
          title: `Lesson ${i + 1}`,
        })),
      },
    ],
    category: "development",
    author: "David Park",
    rating: 4.8,
    students: 11234,
    isPublic: true,
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
