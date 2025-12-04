import { mockCourses, mockFeaturedCourses } from "@/mockdata/courses";
import { mockUser, mockUserStats } from "@/mockdata/user";
import { Course, User, UserStats } from "@/types";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// User API
export const userApi = {
  async getCurrentUser(): Promise<User> {
    await delay(300);
    return mockUser;
  },

  async getUserStats(): Promise<UserStats> {
    await delay(300);
    return mockUserStats;
  },

  async updateUser(data: Partial<User>): Promise<User> {
    await delay(500);
    return { ...mockUser, ...data };
  },
};

// Courses API
export const coursesApi = {
  async getMyCourses(): Promise<Course[]> {
    await delay(400);
    return mockCourses;
  },

  async getFeaturedCourses(): Promise<Course[]> {
    await delay(400);
    return mockFeaturedCourses;
  },

  async getCourseById(id: string): Promise<Course | null> {
    await delay(300);
    const allCourses = [...mockCourses, ...mockFeaturedCourses];
    return allCourses.find((course) => course.id === id) || null;
  },

  async createCourse(data: {
    title: string;
    description: string;
    files: string[];
    links: string[];
  }): Promise<Course> {
    await delay(6000); // Simulate AI processing
    return {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      lessons: Math.floor(Math.random() * 10) + 5,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};

// Settings API
export const settingsApi = {
  async getSettings() {
    await delay(200);
    return {
      theme: "system" as const,
      language: "en",
      notifications: true,
    };
  },

  async updateSettings(settings: any) {
    await delay(300);
    return settings;
  },
};
