import {
  mockCatalogCourses,
  mockCourses,
  mockFeaturedCourses,
} from "@/mockdata/courses";
import { mockUser, mockUserStats } from "@/mockdata/user";
import type { AppSettings, Course, SortOption, User, UserStats } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Simulate API delay
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

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

  async setCoursePublication(
    courseId: string,
    isPublic: boolean
  ): Promise<Course | null> {
    await delay(400);

    const updatedAt = new Date().toISOString();

    const updateInList = (list: Course[]): Course | null => {
      const idx = list.findIndex((c) => c.id === courseId);
      if (idx === -1) return null;
      const updated: Course = { ...list[idx], isPublic, updatedAt };
      list[idx] = updated;
      return updated;
    };

    return updateInList(mockCourses) ?? updateInList(mockFeaturedCourses);
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
const SETTINGS_STORAGE_KEY = "intruct.appSettings";

let didLoadSettingsFromStorage = false;
let inMemorySettings: AppSettings = {
  theme: "system",
  language: "en",
  defaultCourseLanguage: "en",
  notifications: true,
};

const loadSettingsFromStorage = async () => {
  if (didLoadSettingsFromStorage) return;
  didLoadSettingsFromStorage = true;

  try {
    const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw) as Partial<AppSettings> | null;
    if (!parsed || typeof parsed !== "object") return;

    inMemorySettings = { ...inMemorySettings, ...parsed };
  } catch {
    // Best-effort storage
  }
};

const saveSettingsToStorage = async () => {
  try {
    await AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(inMemorySettings)
    );
  } catch {
    // Best-effort storage
  }
};

export const settingsApi = {
  async getSettings(): Promise<AppSettings> {
    await delay(200);
    await loadSettingsFromStorage();
    return inMemorySettings;
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    await delay(300);
    await loadSettingsFromStorage();
    inMemorySettings = { ...inMemorySettings, ...settings };
    await saveSettingsToStorage();
    return inMemorySettings;
  },
};

// Catalog API
export const catalogApi = {
  async searchCourses(params: {
    query?: string;
    category?: string;
    sortBy?: SortOption;
  }): Promise<Course[]> {
    await delay(400);

    let results = [...mockCatalogCourses];

    // Filter by search query
    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.author?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (params.category && params.category !== "all") {
      results = results.filter((course) => course.category === params.category);
    }

    // Sort results
    switch (params.sortBy) {
      case "popular":
        results.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      case "newest":
        results.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "rating":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "students":
        results.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      default:
        // Default to popular
        results.sort((a, b) => (b.students || 0) - (a.students || 0));
    }

    return results;
  },
};
