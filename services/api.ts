import {
  mockCatalogCourses,
  mockCourses,
  mockFeaturedCourses,
} from "@/mockdata/courses";
import { mockUser, mockUserStats } from "@/mockdata/user";
import type {
  AppSettings,
  CompleteRegistrationRequest,
  Course,
  SortOption,
  User,
  UserProfile,
  UserStats,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Simulate API delay
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export type ApiErrorCode =
  | "unauthorized"
  | "needs_complete_registration"
  | "validation"
  | "network"
  | "unknown";

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;

  constructor(status: number, code: ApiErrorCode, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiError";
  }
}

type ApiErrorResponseBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

type UserProfileResponse = {
  id: string;
  external_uuid: string;
  email: string;
  name: string;
  surname: string;
  registration_date: string;
  birthdate: string;
  avatar: string;
  completed_courses: number;
  in_progress_courses: number;
  streak: number;
};

const USER_PROFILE_STORAGE_KEY = "intruct.userProfile";

const REGISTRATION_NOT_COMPLETED_ERROR = "registration was not completed";

let needsCompleteRegistrationHandler: (() => void) | null = null;

export const setNeedsCompleteRegistrationHandler = (
  handler: (() => void) | null
) => {
  needsCompleteRegistrationHandler = handler;
};

const emitNeedsCompleteRegistration = () => {
  try {
    needsCompleteRegistrationHandler?.();
  } catch {
    // Best-effort: the caller will still get the ApiError
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isRegistrationNotCompletedBody = (
  value: unknown
): value is { error: string } => {
  return isRecord(value) && typeof value.error === "string";
};

const getApiBaseUrl = (): string | null => {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!raw) return null;
  return raw.replace(/\/+$/, "");
};

const readJsonResponse = async (res: Response): Promise<unknown | null> => {
  try {
    const json = await res.json();

    if (
      isRegistrationNotCompletedBody(json) &&
      json.error === REGISTRATION_NOT_COMPLETED_ERROR
    ) {
      emitNeedsCompleteRegistration();
      throw new ApiError(
        res.status || 400,
        "needs_complete_registration",
        REGISTRATION_NOT_COMPLETED_ERROR
      );
    }

    return json;
  } catch {
    return null;
  }
};

const mapUserProfile = (data: UserProfileResponse): UserProfile => {
  return {
    id: data.id,
    externalUuid: data.external_uuid,
    email: data.email,
    name: data.name,
    surname: data.surname,
    registrationDate: data.registration_date,
    birthdate: data.birthdate,
    avatar: data.avatar,
    completedCourses: data.completed_courses,
    inProgressCourses: data.in_progress_courses,
    streak: data.streak,
  };
};

// Profile API
export const profileApi = {
  async getProfile(token: string): Promise<UserProfile> {
    await delay(250);

    if (!token) {
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    const baseUrl = getApiBaseUrl();

    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.status === 401) {
          throw new ApiError(401, "unauthorized", "Unauthorized");
        }

        if (!res.ok) {
          const body = (await readJsonResponse(
            res
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Failed to load profile";

          throw new ApiError(
            res.status,
            "needs_complete_registration",
            message
          );
        }

        const json = (await readJsonResponse(
          res
        )) as UserProfileResponse | null;

        if (!json) {
          throw new ApiError(500, "unknown", "Invalid profile response");
        }

        return mapUserProfile(json);
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (err instanceof Error) {
          throw new ApiError(0, "network", err.message);
        }
        throw new ApiError(0, "network", "Network error");
      }
    }

    // Mock fallback (no backend base URL configured)
    try {
      const raw = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (!raw) {
        throw new ApiError(
          404,
          "needs_complete_registration",
          "Profile not found"
        );
      }

      const parsed = JSON.parse(raw) as UserProfile | null;
      if (!parsed || typeof parsed !== "object") {
        throw new ApiError(500, "unknown", "Invalid stored profile");
      }

      return parsed;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (err instanceof Error) {
        throw new ApiError(0, "unknown", err.message);
      }
      throw new ApiError(0, "unknown", "Unknown error");
    }
  },
};

// Auth API
export const authApi = {
  async completeRegistration(
    token: string,
    payload: CompleteRegistrationRequest
  ): Promise<UserProfile> {
    await delay(300);

    if (!token) {
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    if (!payload.name || !payload.surname || !payload.birthdate) {
      throw new ApiError(422, "validation", "Missing required fields");
    }

    const baseUrl = getApiBaseUrl();

    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/auth/complete-registration`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: payload.name,
            surname: payload.surname,
            birthdate: payload.birthdate,
            avatar: payload.avatar,
          }),
        });

        if (res.status === 401) {
          throw new ApiError(401, "unauthorized", "Unauthorized");
        }

        if (res.status === 422) {
          const body = (await readJsonResponse(
            res
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Validation error";
          throw new ApiError(422, "validation", message);
        }

        if (!res.ok) {
          const body = (await readJsonResponse(
            res
          )) as ApiErrorResponseBody | null;
          const message =
            body?.error?.message || "Failed to complete registration";
          throw new ApiError(res.status, "unknown", message);
        }

        const json = (await readJsonResponse(
          res
        )) as UserProfileResponse | null;
        if (!json) {
          throw new ApiError(
            500,
            "unknown",
            "Invalid complete-registration response"
          );
        }

        return mapUserProfile(json);
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (err instanceof Error) {
          throw new ApiError(0, "network", err.message);
        }
        throw new ApiError(0, "network", "Network error");
      }
    }

    // Mock fallback (no backend base URL configured)
    const profile: UserProfile = {
      id: mockUser.id,
      externalUuid: mockUser.id,
      email: mockUser.email,
      name: payload.name,
      surname: payload.surname,
      registrationDate: new Date().toISOString(),
      birthdate: payload.birthdate,
      avatar: payload.avatar || mockUser.avatar || "",
      completedCourses: 0,
      inProgressCourses: 0,
      streak: 0,
    };

    try {
      await AsyncStorage.setItem(
        USER_PROFILE_STORAGE_KEY,
        JSON.stringify(profile)
      );
    } catch {
      // Best-effort storage
    }

    return profile;
  },
};

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

  async leaveReview(courseId: string, reviewGrade: number): Promise<void> {
    await delay(400);

    // Stub: real backend will validate auth, ownership, and store the review.
    if (!courseId) return;
    if (reviewGrade < 1 || reviewGrade > 5) return;
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
