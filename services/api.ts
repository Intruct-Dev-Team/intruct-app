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
  CreateCourseResponse,
  SortOption,
  UploadCourseContentRequest,
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
  handler: (() => void) | null,
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
  value: unknown,
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
        REGISTRATION_NOT_COMPLETED_ERROR,
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

// Helper function to convert image URL to base64
const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove data:image/...;base64, prefix if present
        const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
        resolve(base64Data || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.log("[imageUrlToBase64] Failed to convert image:", error);
    return "";
  }
};

// Profile API
export const profileApi = {
  async getProfile(token: string): Promise<UserProfile> {
    await delay(250);

    console.log(
      "[profileApi] getProfile called with token length:",
      token?.length,
    );

    if (!token) {
      console.log("[profileApi] No token provided");
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    const baseUrl = getApiBaseUrl();
    console.log("[profileApi] API base URL:", baseUrl);

    if (baseUrl) {
      try {
        console.log("[profileApi] Fetching from:", `${baseUrl}/user/profile`);
        const res = await fetch(`${baseUrl}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        console.log("[profileApi] Response status:", res.status);

        if (res.status === 401) {
          // Попытка прочитать body чтобы узнать причину 401
          let rawBody = "";
          try {
            // Сначала клонируем response чтобы прочитать и text и json
            const clonedRes = res.clone();
            rawBody = await clonedRes.text();
            console.log("[profileApi] 401 Unauthorized - raw body:", rawBody);
          } catch (e) {
            console.log("[profileApi] Failed to read raw body:", e);
          }

          // Теперь пытаемся распарсить как JSON
          const body = (await readJsonResponse(res)) as {
            error?: string;
          } | null;
          console.log("[profileApi] 401 Unauthorized - parsed body:", body);

          // Если в raw body есть "registration was not completed" - это новый пользователь
          if (rawBody.includes("registration was not completed")) {
            console.log(
              "[profileApi] Detected: user needs complete registration",
            );
            throw new ApiError(
              401,
              "needs_complete_registration",
              "Registration not completed",
            );
          }

          throw new ApiError(
            401,
            "unauthorized",
            body?.error || rawBody || "Unauthorized",
          );
        }

        if (!res.ok) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Failed to load profile";
          console.log("[profileApi] Non-OK response:", res.status, message);

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
          console.log("[profileApi] Invalid response - no JSON");
          throw new ApiError(500, "unknown", "Invalid profile response");
        }

        return mapUserProfile(json);
      } catch (err) {
        console.log("[profileApi] Fetch error:", err);
        if (err instanceof ApiError) throw err;
        if (err instanceof Error) {
          throw new ApiError(0, "network", err.message);
        }
        throw new ApiError(0, "network", "Network error");
      }
    }

    console.log("[profileApi] No base URL - using mock fallback");
    // Mock fallback (no backend base URL configured)
    // For development: try to return a mock profile if not found in storage
    try {
      const raw = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfile | null;
        if (parsed && typeof parsed === "object") {
          console.log("[profileApi] Returning cached profile:", parsed.id);
          return parsed;
        }
      }

      // If no API and no stored profile, return error requesting backend
      console.log("[profileApi] No cached profile and no API");
      throw new ApiError(
        0,
        "network",
        "Backend not configured - getProfile requires API",
      );
    } catch (err) {
      console.log("[profileApi] Storage error:", err);
      if (err instanceof ApiError) throw err;
      throw new ApiError(0, "unknown", "Profile storage error");
    }
  },

  async getUserById(userId: number): Promise<UserProfile> {
    await delay(250);

    const baseUrl = getApiBaseUrl();

    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/users/${userId}/profile`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
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

    // Mock fallback
    throw new ApiError(
      0,
      "network",
      "Backend not configured - getUserById requires API",
    );
  },
};

// Auth API
export const authApi = {
  async completeRegistration(
    token: string,
    payload: CompleteRegistrationRequest,
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
        console.log("[authApi] Sending complete-registration request:", {
          name: payload.name,
          surname: payload.surname,
          birthdate: payload.birthdate,
          hasAvatar: !!payload.avatar,
        });

        // Преобразуем birthdate в ISO datetime format (YYYY-MM-DDT00:00:00Z)
        const birthdateISO = payload.birthdate.includes("T")
          ? payload.birthdate
          : `${payload.birthdate}T00:00:00Z`;

        // Конвертируем avatar в base64
        let avatarToSend = "";
        if (payload.avatar) {
          if (payload.avatar.startsWith("http")) {
            console.log("[authApi] Converting avatar URL to base64...");
            avatarToSend = await imageUrlToBase64(payload.avatar);
            console.log("[authApi] Avatar base64 length:", avatarToSend.length);
          } else if (payload.avatar.startsWith("data:image")) {
            // Уже base64
            avatarToSend = payload.avatar.split(",")[1] || "";
          }
        }

        const requestBody = {
          name: payload.name,
          surname: payload.surname,
          birthdate: birthdateISO,
          avatar: avatarToSend || "",
        };

        console.log("[authApi] Request body:", requestBody);

        const res = await fetch(`${baseUrl}/auth/complete-registration`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        console.log("[authApi] Response status:", res.status);

        if (res.status === 401) {
          const rawBody = await res.clone().text();
          console.log("[authApi] 401 Unauthorized - raw body:", rawBody);
          throw new ApiError(401, "unauthorized", "Unauthorized");
        }

        if (res.status === 422) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Validation error";
          console.log("[authApi] 422 Validation error:", message);
          throw new ApiError(422, "validation", message);
        }

        if (!res.ok) {
          // Читаем raw body для отладки
          let rawBody = "";
          try {
            const clonedRes = res.clone();
            rawBody = await clonedRes.text();
            console.log("[authApi] Non-OK response - raw body:", rawBody);
          } catch (e) {
            console.log("[authApi] Failed to read raw body:", e);
          }

          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message =
            body?.error?.message ||
            rawBody ||
            "Failed to complete registration";
          console.log("[authApi] Error message:", message);
          throw new ApiError(res.status, "unknown", message);
        }

        const json = (await readJsonResponse(
          res,
        )) as UserProfileResponse | null;
        if (!json) {
          console.log("[authApi] Invalid response - no JSON");
          throw new ApiError(
            500,
            "unknown",
            "Invalid complete-registration response",
          );
        }

        console.log(
          "[authApi] Registration completed successfully - user ID:",
          json.id,
        );
        return mapUserProfile(json);
      } catch (err) {
        console.log("[authApi] Catch block - error:", err);
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
        JSON.stringify(profile),
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
    isPublic: boolean,
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

  async createCourse(
    token: string,
    data: {
      title: string;
      description: string;
      file: Blob;
      language: string;
    },
  ): Promise<number> {
    await delay(500);

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

    // Mock fallback (no backend base URL configured)
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
    await delay(500);

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

    // Mock fallback
    throw new ApiError(
      0,
      "network",
      "Backend not configured - uploadCourseContent requires API",
    );
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
      JSON.stringify(inMemorySettings),
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
          course.author?.toLowerCase().includes(query),
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
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
