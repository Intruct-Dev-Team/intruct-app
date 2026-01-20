/**
 * API Layer Refactored
 * - Clean separation of concerns
 * - Consolidated error handling
 * - Optimized delay constants
 * - Removed verbose logging
 * - Type-safe throughout
 */

import {
  mockCatalogCourses,
  mockCourses,
  mockFeaturedCourses,
} from "@/mockdata/courses";
import { mockUser } from "@/mockdata/user";
import type {
  AppSettings,
  CompleteRegistrationRequest,
  Course,
  CreateCourseResponse,
  SortOption,
  UploadCourseContentRequest,
  UserProfile,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ============================================================================
   Configuration & Utilities
   ============================================================================ */

const DELAYS = {
  profile: 250,
  auth: 300,
  courses: 400,
  settings: 200,
  catalog: 400,
} as const;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* ============================================================================
   Error Handling
   ============================================================================ */

export type ApiErrorCode =
  | "unauthorized"
  | "needs_complete_registration"
  | "validation"
  | "network"
  | "unknown";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/* ============================================================================
   Type Definitions (Internal)
   ============================================================================ */

interface ApiErrorResponseBody {
  error?: { code?: string; message?: string };
}

interface UserProfileResponse {
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
}

/* ============================================================================
   Constants & Event Handling
   ============================================================================ */

const USER_PROFILE_STORAGE_KEY = "intruct.userProfile";
const REGISTRATION_NOT_COMPLETED_ERROR = "registration was not completed";

let needsCompleteRegistrationHandler: (() => void) | null = null;

export const setNeedsCompleteRegistrationHandler = (
  handler: (() => void) | null,
): void => {
  needsCompleteRegistrationHandler = handler;
};

const emitNeedsCompleteRegistration = (): void => {
  try {
    needsCompleteRegistrationHandler?.();
  } catch {
    // Silent
  }
};

/* ============================================================================
   Helpers
   ============================================================================ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isRegistrationNotCompletedBody = (
  value: unknown,
): value is { error: string } =>
  isRecord(value) && typeof value.error === "string";

const getApiBaseUrl = (): string | null => {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL;
  return raw ? raw.replace(/\/+$/, "") : null;
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
        REGISTRATION_NOT_COMPLETED_ERROR,
      );
    }

    return json;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    return null;
  }
};

const mapUserProfile = (data: UserProfileResponse): UserProfile => ({
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
});

const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const data = base64.includes(",") ? base64.split(",")[1] : base64;
        resolve(data || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
};

/* ============================================================================
   Profile API
   ============================================================================ */

export const profileApi = {
  async getProfile(token: string): Promise<UserProfile> {
    await delay(DELAYS.profile);

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
          const rawBody = await res.clone().text();

          if (rawBody.includes(REGISTRATION_NOT_COMPLETED_ERROR)) {
            throw new ApiError(
              401,
              "needs_complete_registration",
              "Registration not completed",
            );
          }

          throw new ApiError(401, "unauthorized", rawBody || "Unauthorized");
        }

        if (!res.ok) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Failed to load profile";
          throw new ApiError(
            res.status,
            res.status === 400 ? "validation" : "unknown",
            message,
          );
        }

        const json = (await readJsonResponse(
          res,
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

    // Mock fallback
    try {
      const raw = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfile | null;
        if (parsed && isRecord(parsed)) {
          return parsed;
        }
      }
      throw new ApiError(
        0,
        "network",
        "Backend not configured - getProfile requires API",
      );
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(0, "unknown", "Profile storage error");
    }
  },

  async getUserById(userId: number): Promise<UserProfile> {
    await delay(DELAYS.profile);

    const baseUrl = getApiBaseUrl();

    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/users/${userId}/profile`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (res.status === 404) {
          throw new ApiError(404, "unknown", "User not found");
        }

        if (!res.ok) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Failed to load user profile";
          throw new ApiError(res.status, "unknown", message);
        }

        const json = (await readJsonResponse(
          res,
        )) as UserProfileResponse | null;

        if (!json) {
          throw new ApiError(500, "unknown", "Invalid user profile response");
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

    throw new ApiError(
      0,
      "network",
      "Backend not configured - getUserById requires API",
    );
  },
};

/* ============================================================================
   Auth API
   ============================================================================ */

export const authApi = {
  async completeRegistration(
    token: string,
    payload: CompleteRegistrationRequest,
  ): Promise<UserProfile> {
    await delay(DELAYS.auth);

    if (!token) {
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    if (!payload.name || !payload.surname || !payload.birthdate) {
      throw new ApiError(422, "validation", "Missing required fields");
    }

    const baseUrl = getApiBaseUrl();

    if (baseUrl) {
      try {
        const birthdateISO = payload.birthdate.includes("T")
          ? payload.birthdate
          : `${payload.birthdate}T00:00:00Z`;

        let avatarToSend = "";
        if (payload.avatar) {
          if (payload.avatar.startsWith("http")) {
            avatarToSend = await imageUrlToBase64(payload.avatar);
          } else if (payload.avatar.startsWith("data:image")) {
            avatarToSend = payload.avatar.split(",")[1] || "";
          }
        }

        const requestBody = {
          name: payload.name,
          surname: payload.surname,
          birthdate: birthdateISO,
          avatar: avatarToSend || "",
        };

        const res = await fetch(`${baseUrl}/auth/complete-registration`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (res.status === 401) {
          throw new ApiError(401, "unauthorized", "Unauthorized");
        }

        if (res.status === 422) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Validation error";
          throw new ApiError(422, "validation", message);
        }

        if (!res.ok) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message =
            body?.error?.message || "Failed to complete registration";
          throw new ApiError(res.status, "unknown", message);
        }

        const json = (await readJsonResponse(
          res,
        )) as UserProfileResponse | null;

        if (!json) {
          throw new ApiError(
            500,
            "unknown",
            "Invalid complete-registration response",
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

    // Mock fallback
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
        JSON.stringify(profile),
      );
    } catch {
      // Silent
    }

    return profile;
  },
};

/* ============================================================================
   Courses API
   ============================================================================ */

export const coursesApi = {
  async getMyCourses(): Promise<Course[]> {
    await delay(DELAYS.courses);
    return mockCourses;
  },

  async getFeaturedCourses(): Promise<Course[]> {
    await delay(DELAYS.courses);
    return mockFeaturedCourses;
  },

  async getCourseById(id: string): Promise<Course | null> {
    await delay(DELAYS.courses);
    const allCourses = [...mockCourses, ...mockFeaturedCourses];
    return allCourses.find((course) => course.id === id) || null;
  },

  async setCoursePublication(
    courseId: string,
    isPublic: boolean,
  ): Promise<Course | null> {
    await delay(DELAYS.courses);

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
    await delay(DELAYS.courses);

    // Stub: real backend will validate auth, ownership, and store review
    if (!courseId || reviewGrade < 1 || reviewGrade > 5) return;
  },

  async createCourse(
    token: string,
    data: {
      title: string;
      description: string;
      file: Blob;
      language: string;
    },
  ): Promise<number> {
    await delay(DELAYS.courses);

    if (!token) {
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    if (!data.title || !data.file || !data.language) {
      throw new ApiError(400, "validation", "Missing required fields");
    }

    const baseUrl = getApiBaseUrl();

    if (baseUrl) {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("file", data.file);
        formData.append("language", data.language);

        const res = await fetch(`${baseUrl}/course`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        });

        if (res.status === 401) {
          throw new ApiError(401, "unauthorized", "Unauthorized");
        }

        if (res.status === 400) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Validation error";
          throw new ApiError(400, "validation", message);
        }

        if (!res.ok) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Failed to create course";
          throw new ApiError(res.status, "unknown", message);
        }

        const json = (await readJsonResponse(
          res,
        )) as CreateCourseResponse | null;

        if (!json || typeof json.course_id !== "number") {
          throw new ApiError(500, "unknown", "Invalid create course response");
        }

        return json.course_id;
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (err instanceof Error) {
          throw new ApiError(0, "network", err.message);
        }
        throw new ApiError(0, "network", "Network error");
      }
    }

    throw new ApiError(
      0,
      "network",
      "Backend not configured - createCourse requires API",
    );
  },

  async uploadCourseContent(
    courseId: number,
    data: UploadCourseContentRequest,
  ): Promise<void> {
    await delay(DELAYS.courses);

    if (!courseId) {
      throw new ApiError(400, "validation", "Course ID is required");
    }

    if (!data.course_title || !data.modules) {
      throw new ApiError(400, "validation", "Missing required fields");
    }

    const baseUrl = getApiBaseUrl();

    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/courses/${courseId}/upload`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course_title: data.course_title,
            language: data.language,
            last_updated: data.last_updated,
            total_modules: data.total_modules,
            total_lessons: data.total_lessons,
            modules: data.modules,
          }),
        });

        if (res.status === 404) {
          throw new ApiError(404, "unknown", "Course not found");
        }

        if (res.status === 400) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Validation error";
          throw new ApiError(400, "validation", message);
        }

        if (!res.ok) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message =
            body?.error?.message || "Failed to upload course content";
          throw new ApiError(res.status, "unknown", message);
        }
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (err instanceof Error) {
          throw new ApiError(0, "network", err.message);
        }
        throw new ApiError(0, "network", "Network error");
      }
    }

    throw new ApiError(
      0,
      "network",
      "Backend not configured - uploadCourseContent requires API",
    );
  },
};

/* ============================================================================
   Settings API
   ============================================================================ */

const SETTINGS_STORAGE_KEY = "intruct.appSettings";

let didLoadSettingsFromStorage = false;
let inMemorySettings: AppSettings = {
  theme: "system",
  language: "en",
  defaultCourseLanguage: "en",
  notifications: true,
};

const loadSettingsFromStorage = async (): Promise<void> => {
  if (didLoadSettingsFromStorage) return;
  didLoadSettingsFromStorage = true;

  try {
    const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw) as Partial<AppSettings> | null;
    if (parsed && isRecord(parsed)) {
      inMemorySettings = { ...inMemorySettings, ...parsed };
    }
  } catch {
    // Silent
  }
};

const saveSettingsToStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(inMemorySettings),
    );
  } catch {
    // Silent
  }
};

export const settingsApi = {
  async getSettings(): Promise<AppSettings> {
    await delay(DELAYS.settings);
    await loadSettingsFromStorage();
    return inMemorySettings;
  },

  async updateSettings(
    settings: Partial<AppSettings>,
  ): Promise<AppSettings> {
    await delay(DELAYS.settings);
    await loadSettingsFromStorage();
    inMemorySettings = { ...inMemorySettings, ...settings };
    await saveSettingsToStorage();
    return inMemorySettings;
  },
};

/* ============================================================================
   Catalog API
   ============================================================================ */

export const catalogApi = {
  async searchCourses(params: {
    query?: string;
    category?: string;
    sortBy?: SortOption;
  }): Promise<Course[]> {
    await delay(DELAYS.catalog);

    let results = [...mockCatalogCourses];

    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.author?.toLowerCase().includes(query),
      );
    }

    if (params.category && params.category !== "all") {
      results = results.filter((course) => course.category === params.category);
    }

    if (params.sortBy) {
      const sortFn = (a: Course, b: Course): number => {
        switch (params.sortBy) {
          case "popular":
          case "students":
            return (b.students || 0) - (a.students || 0);
          case "newest":
            return (
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
            );
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      };
      results.sort(sortFn);
    }

    return results;
  },
};
