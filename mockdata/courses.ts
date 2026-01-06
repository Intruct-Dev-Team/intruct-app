import type { Course, CourseCategory } from "@/types";

const now = new Date().toISOString();

export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "React Native Mastery",
    description: "Build real-world mobile apps with React Native and Expo.",
    lessons: 2,
    progress: 0,
    createdAt: now,
    updatedAt: now,
    category: "mobile",
    author: "Intruct",
    rating: 4.7,
    students: 1240,
    isPublic: true,
    status: "ready",
    modules: [
      {
        id: "module-1",
        title: "Foundations",
        lessons: [
          {
            id: "lesson-1",
            title: "Introduction to React Native",
            materials: [
              {
                id: "lesson-1-mat-1",
                title: "What is React Native?",
                content:
                  "# What is React Native?\n\nReact Native lets you build native apps using JavaScript and React.\n",
              },
            ],
            questions: [
              {
                id: "lesson-1-q-1",
                question: "React Native maps your UI to…",
                type: "multiple-choice",
                options: [
                  "HTML elements",
                  "Native UI components",
                  "Flash objects",
                ],
                correctAnswer: 1,
                explanation:
                  "React Native renders to native platform UI components.",
              },
              {
                id: "lesson-1-q-2",
                question: "Expo is…",
                type: "multiple-choice",
                options: [
                  "A database",
                  "A toolchain for building React Native apps",
                  "A CSS framework",
                ],
                correctAnswer: 1,
              },
            ],
          },
          {
            id: "lesson-2",
            title: "Components and Styling",
            materials: [
              {
                id: "lesson-2-mat-1",
                title: "Core components",
                content:
                  "# Core components\n\nYou compose screens from components like View, Text, and Pressable.\n",
              },
            ],
            questions: [
              {
                id: "lesson-2-q-1",
                question: "Which prop controls text truncation?",
                type: "multiple-choice",
                options: ["numberOfLines", "maxLines", "truncate"],
                correctAnswer: 0,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "course-2",
    title: "TypeScript Essentials",
    description: "Learn practical TypeScript for modern React projects.",
    lessons: 1,
    progress: 0,
    createdAt: now,
    updatedAt: now,
    category: "typescript",
    author: "Intruct",
    rating: 4.5,
    students: 860,
    isPublic: false,
    status: "ready",
    modules: [
      {
        id: "module-2",
        title: "Basics",
        lessons: [
          {
            id: "lesson-3",
            title: "Types and Interfaces",
            materials: [
              {
                id: "lesson-3-mat-1",
                title: "Structural typing",
                content:
                  "# Structural typing\n\nTypeScript uses structural typing, so shape matters more than names.\n",
              },
            ],
            questions: [
              {
                id: "lesson-3-q-1",
                question: "In TypeScript, type compatibility is primarily…",
                type: "multiple-choice",
                options: ["Nominal", "Structural", "Dynamic"],
                correctAnswer: 1,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const mockFeaturedCourses: Course[] = [];

export const mockCatalogCourses: Course[] = [
  ...mockCourses,
  ...mockFeaturedCourses,
];

export const courseCategories: CourseCategory[] = [
  { id: "all", name: "All", slug: "all" },
  { id: "mobile", name: "Mobile", slug: "mobile" },
  { id: "typescript", name: "TypeScript", slug: "typescript" },
];

/* Legacy mock data removed/disabled
export const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Native Mastery",
    description: "Go from zero to hero with React Native. Build real-world apps.",
    lessons: 4,
    modules: [
      {
        id: "m-1-1",
        title: "Module 1: Foundations",
        lessons: [
          {
            id: "1-l-1",
            title: "1.1 Introduction to React Native",
            materials: [
              {
                id: "1-l-1-m-1",
                title: "What is React Native?",
                content:
                  "# What is React Native?\n\nThis lesson introduces the basics of React Native.",
              },
            ],
            questions: [
              {
                id: "1-l-1-q-1",
                question: "React Native maps JSX components to...",
                type: "multiple-choice",
                options: [
                  "Web Views",
                  "Native UI Widgets",
                  "HTML Elements",
                  "Flash Objects",
                ],
                correctAnswer: 1,
                explanation: "React Native renders real native UI widgets.",
              },
            ],
          },
        ],
      },
    ],
    progress: 0,
    isPublic: true,
    rating: 4.8,
    students: 1205,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: now,
    category: "development",
    author: "Intruct",
  },
];
* /
import type { Course, CourseCategory } from "@/types";

const now = new Date().toISOString();

export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "React Native Mastery",
    description: "Build real-world mobile apps with React Native and Expo.",
    lessons: 2,
    createdAt: now,
    updatedAt: now,
    category: "mobile",
    author: "Intruct",
    rating: 4.7,
    students: 1240,
    isPublic: true,
    status: "ready",
    modules: [
      {
        id: "module-1",
        title: "Foundations",
        lessons: [
          {
            id: "lesson-1",
            title: "Introduction to React Native",
            materials: [
              {
                id: "lesson-1-mat-1",
                title: "What is React Native?",
                content:
                  "# What is React Native?\n\nReact Native lets you build native apps using JavaScript and React.\n",
              },
            ],
            questions: [
              {
                id: "lesson-1-q-1",
                question: "React Native maps your UI to…",
                type: "multiple-choice",
                options: ["HTML elements", "Native UI components", "Flash objects"],
                correctAnswer: 1,
                explanation:
                  "React Native renders to native platform UI components.",
              },
              {
                id: "lesson-1-q-2",
                question: "Expo is…",
                type: "multiple-choice",
                options: [
                  "A database",
                  "A toolchain for building React Native apps",
                  "A CSS framework",
                ],
                correctAnswer: 1,
              },
            ],
          },
          {
            id: "lesson-2",
            title: "Components and Styling",
            materials: [
              {
                id: "lesson-2-mat-1",
                title: "Core components",
                content:
                  "# Core components\n\nYou compose screens from components like View, Text, and Pressable.\n",
              },
            ],
            questions: [
              {
                id: "lesson-2-q-1",
                question: "Which prop controls text truncation?",
                type: "multiple-choice",
                options: ["numberOfLines", "maxLines", "truncate"],
                correctAnswer: 0,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "course-2",
    title: "TypeScript Essentials",
    description: "Learn practical TypeScript for modern React projects.",
    lessons: 1,
    createdAt: now,
    updatedAt: now,
    category: "typescript",
    author: "Intruct",
    rating: 4.5,
    students: 860,
    isPublic: true,
    status: "ready",
    modules: [
      {
        id: "module-2",
        title: "Basics",
        lessons: [
          {
            id: "lesson-3",
            title: "Types and Interfaces",
            materials: [
              {
                id: "lesson-3-mat-1",
                title: "Structural typing",
                content:
                  "# Structural typing\n\nTypeScript uses structural typing, so shape matters more than names.\n",
              },
            ],
            questions: [
              {
                id: "lesson-3-q-1",
                question: "In TypeScript, type compatibility is primarily…",
                type: "multiple-choice",
                options: ["Nominal", "Structural", "Dynamic"],
                correctAnswer: 1,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const mockFeaturedCourses: Course[] = [];

export const mockCatalogCourses: Course[] = [
  ...mockCourses,
  ...mockFeaturedCourses,
];

export const courseCategories: CourseCategory[] = [
  { id: "all", name: "All", slug: "all" },
  { id: "mobile", name: "Mobile", slug: "mobile" },
  { id: "typescript", name: "TypeScript", slug: "typescript" },
];
const now = new Date().toISOString();

export const mockCourses = [
  {
    id: "1",
    title: "React Native Mastery",
    description: "Go from zero to hero with React Native. Build real-world apps.",
    lessons: 4,
    modules: [
      {
        id: "m-1-1",
        title: "Module 1: Foundations",
        lessons: [
          {
            id: "1-l-1",
            title: "1.1 Introduction to React Native",
            materials: [
              {
                id: "1-l-1-m-1",
                title: "What is React Native?",
                content:
                  "# What is React Native?\n\nThis lesson introduces the basics of React Native.",
              },
            ],
            questions: [
              {
                id: "1-l-1-q-1",
                question: "React Native maps JSX components to...",
                type: "multiple-choice",
                options: [
                  "Web Views",
                  "Native UI Widgets",
                  "HTML Elements",
                  "Flash Objects",
                ],
                correctAnswer: 1,
                explanation: "React Native renders real native UI widgets.",
              },
            ],
          },
        ],
      },
    ],
    progress: 0,
    isPublic: true,
    rating: 4.8,
    students: 1205,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: now,
    category: "development",
    author: "Intruct",
  },
];

export const mockFeaturedCourses = [];

export const mockCatalogCourses = [...mockCourses];

export const courseCategories = [
  { id: "all", name: "All", slug: "all" },
  { id: "development", name: "Development", slug: "development" },
  { id: "design", name: "Design", slug: "design" },
  { id: "business", name: "Business", slug: "business" },
];

/*
Legacy mock data (kept as commented text to avoid template-literal parsing issues in expo lint).
This block can be removed later if desired.

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Native Mastery",
    description: "Go from zero to hero with React Native. Build real-world apps.",
    lessons: 4,
    modules: [
      {
        id: "m-1-1",
        title: "Module 1: Foundations",
        lessons: [
          {
            id: "1-l-1",
            title: "1.1 Introduction to React Native",
            materials: [
              {
                id: "1-l-1-m-1",
                title: "What is React Native?",
                content: `# What is React Native?

React Native is an open-source framework created by Meta Platforms, Inc. It is used to develop applications for Android, Android TV, iOS, macOS, tvOS, Web, Windows and UWP by enabling developers to use the React framework along with native platform capabilities.

## How it works

At its core, React Native invokes Native views with JavaScript. It uses a "bridge" (or the new architecture, JSI) to communicate between the JavaScript thread and the Native Main thread.

### Key Concepts

1.  **Components**: React Native provides a set of Core Components (View, Text, Image) that map to native UI building blocks.
2.  **JSX**: Write your UI markup right inside your JavaScript code.
3.  **Flexbox**: Layout your UI using the same Flexbox algorithm you know from the web.

## Hello World

\`\`\`tsx
import React from 'react';
import { Text, View } from 'react-native';

const HelloWorld = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Hello, world!</Text>
    </View>
  );
              {
                id: "1-l-1-q-1",
                question: "React Native maps JSX components to...",
                type: "multiple-choice",
                options: [
                  "Web Views",
                  "Native UI Widgets",
                  "HTML Elements",
                  "Flash Objects",
                ],
                correctAnswer: 1,
                explanation:
                  "React Native renders real native UI widgets, not webviews.",
              },
              {
                id: "1-l-1-q-2",
                question:
                content:
                  "# What is React Native?\n\nThis lesson introduces the basics of React Native and how it renders native UI from JavaScript.",
                correctAnswer: 1,
                explanation:
                  "False. React Native apps render native views, unlike hybrid apps like Ionic/Cordova.",
              },
            ],
          },
          {
            id: "1-l-2",
            title: "1.2 Core Components",
            materials: [
              {
                id: "1-l-2-m-1",
                title: "View, Text, and Image",
                content: `# Core Components

## View
The most fundamental component for building a UI, \`View\` is a container that supports layout with flexbox, style, some touch handling, and accessibility controls.
              {
                id: "1-l-2-fc-1",
                front: "What component is used to display images?",
                content:
                  "# Core Components\n\nCore components like View and Text form the building blocks of React Native UIs.",
                id: "1-l-2-fc-2",
                front: "Can <Text> components be nested?",
                back: "Yes, nested Text components inherit styles from their parents.",
              },
              {
                id: "1-l-2-fc-3",
                front: "Does <View> scroll by default?",
                back: "No, you need to use <ScrollView> or <FlatList> for scrolling.",
              },
            ],
            questions: [
              {
                id: "1-l-2-q-1",
                question: "Which component handles scrolling?",
                content:
                  "# React Navigation\n\nThis lesson covers basic stack navigation concepts.",
                explanation:
                  "The View component is static. ScrollView (or lists) are required for scrolling content.",
              },
              {
                id: "1-l-2-q-2",
                question: "Can <View> contain text directly?",
                type: "true-false",
                options: ["True", "False"],
                correctAnswer: 1,
                explanation:
                  "In React Native, all strings must be wrapped in a <Text> component.",
              },
            ],
          },
        ],
      },
      {
        id: "m-1-2",
        title: "Module 2: Navigation",
        lessons: [
          {
            id: "1-l-3",
            title: "2.1 React Navigation Basics",
            materials: [
              {
                id: "1-l-3-m-1",
                title: "Stack Navigator",
                content: `# React Navigation

Routing and navigation for your Expo and React Native apps.

## Stack Navigator
The most common form of navigation. It provides a way for your app to transition between screens where each new screen is placed on top of a stack.

\`\`\`tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
\`\`\`
                back: "The default browser history or native push/pop transitions.",
              },
            ],
            questions: [
              {
                id: "1-l-3-q-1",
                question:
                content:
                  "# Passing Parameters\n\nYou can pass params to a route using the second argument of navigation helpers.",
                explanation:
                  "NavigationContainer manages our navigation tree and contains the navigation state.",
              },
            ],
          },
          {
            id: "1-l-4",
            title: "2.2 Passing Parameters",
            materials: [
              {
                id: "1-l-4-m-1",
                title: "Route Params",
                content:
                  "# Generics\n\nThis lesson introduces constraints and default type parameters.",

\`\`\`tsx
navigation.navigate('Details', {
  itemId: 86,
  otherParam: 'anything you want here',
});
\`\`\`

Read them in your screen component:

\`\`\`tsx
function DetailsScreen({ route, navigation }) {
  const { itemId, otherParam } = route.params;
  // ...
}
\`\`\`
`,
              },
            ],
            questions: [
              {
                id: "1-l-4-q-1",
                question:
                  "Can you pass functions as params (technically)?",
                type: "multiple-choice",
                options: [
                  "Yes, but it generates a warning",
                  "No, it crashes",
                  "Yes, it is best practice",
                ],
                correctAnswer: 0,
                explanation:
                  "Params should be serializable. Passing functions works but triggers a warning because it breaks hydration usually.",
              },
            ],
          },
        ],
      },
    ],
    progress: 1, // Let's say user finished lesson 1
    isPublic: true,
    rating: 4.8,
    students: 1205,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-20T10:00:00Z",
  },
];

      {
        id: "m-2-1",
        title: "Module 1: Type System Power",
        lessons: [
          {
            id: "2-l-1",
            title: "1.1 Generics Deep Dive",
            materials: [
              {
                id: "2-l-1-m-1",
                title: "Constraints and Defaults",
                content: `# Generics

## Constraints
You can limit the types that a type variable can accept.

\`\`\`ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); 
  return arg;
}
\`\`\`
                id: "2-l-1-fc-1",
                front: "What keyword is used to constrain a generic?",
                back: "extends",
              },
              {
                id: "2-l-1-fc-2",
                front: "Can a generic have a default type?",
                back: "Yes, using `= Type` syntax.",
              },
            ],
            questions: [
              {
                id: "2-l-1-q-1",
                question: "Why use generic constraints?",
                content:
                  "# Mapped Types\n\nMapped types iterate over keys to produce new types.",
                  "To ensure the type has certain properties",
                  "To make the code faster",
                ],
                correctAnswer: 1,
                explanation:
                  "Constraints ensure that the generic type passed in adheres to a specific contract (interface).",
              },
            ],
          },
          {
            id: "2-l-2",
            title: "1.2 Mapped Types",
            materials: [
              {
                id: "2-l-2-m-1",
                title: "Creating Types from Types",
                content: `# Mapped Types

Mapped types allow you to create new types based on old ones by iterating over property keys.

\`\`\`ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
/**
 * type FeatureOptions = {
 *    darkMode: boolean;
 *    newUserProfile: boolean;
 * }
  * /
                front: "What operator is used to get keys of a type?",
                back: "keyof",
              },
            ],
            questions: [
              {
                id: "2-l-2-q-1",
                question: "Mapped types iterate over...",
                content:
                  "# Pick and Omit\n\nPick selects properties; Omit removes properties.",
                explanation: "They iterate over keys using `[P in keyof T]`.",
              },
            ],
          },
        ],
      },
      {
        id: "m-2-2",
        title: "Module 2: Utility Types",
        lessons: [
          {
            id: "2-l-3",
            title: "2.1 Pick and Omit",
            materials: [
              {
                id: "2-l-3-m-1",
                title: "Pick & Omit",
                content: `# Pick and Omit

## Pick
Constructs a type by picking the set of properties Keys from Type.

\`\`\`ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;
\`\`\`

                front: "What does Pick<T, K> do?",
                back: "Selects a subset of properties (K) from T.",
              },
              {
                id: "2-l-3-fc-2",
                front: "What does Omit<T, K> do?",
                back: "Removes a subset of properties (K) from T.",
              },
            ],
            questions: [
              {
                id: "2-l-3-q-1",
                question: "Which one allows you to exclude fields?",
                content:
                  "# Partial and Required\n\nPartial makes properties optional; Required makes them required.",
              },
            ],
          },
          {
            id: "2-l-4",
            title: "2.2 Partial and Required",
            materials: [
              {
                id: "2-l-4-m-1",
                title: "Modifying Optionality",
                content: `# Partial and Required

## Partial<Type>
Constructs a type with all properties of Type set to optional.

\`\`\`ts
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}
\`\`\`
              {
                id: "2-l-4-fc-2",
                front: "What makes all properties required?",
                back: "Required<T>",
              },
            ],
            questions: [
              {
                id: "2-l-4-q-1",
                question:
                  "True or False: Required<T> removes '?' from properties.",
                type: "true-false",
                options: ["True", "False"],
                correctAnswer: 0,
                explanation:
                  "True. It forces all properties to be present (non-optional).",
              },
            ],
          },
        ],
      },
    ],
    category: "development",
    author: "Matt Pocock",
    rating: 5.0,
    students: 5430,
    isPublic: true,
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-15T10:00:00Z",
  },
];

export const mockFeaturedCourses: Course[] = []; // Empty as requested to only have the two specific courses
export const courseCategories: CourseCategory[] = [
  { id: "all", name: "All", slug: "all" },
  { id: "development", name: "Development", slug: "development" },
  { id: "design", name: "Design", slug: "design" },
  { id: "business", name: "Business", slug: "business" },
];

*/
