import type {
  Course,
  CreateCourseResponse,
  UploadCourseContentRequest,
} from "@/types";

import {
  ApiError,
  type ApiErrorResponseBody,
  DELAYS,
  delay,
  emitServerUnavailable,
  getApiBaseUrl,
  isRecord,
  readErrorPayload,
  readJsonResponse,
} from "./core";
import {
  getCompletedCountForCourse,
  loadLessonCompletionFromStorage,
} from "./lessonProgress";

const COURSE_LANGUAGE_CODE_TO_BACKEND: Record<string, string> = {
  en: "English",
  sr: "Srpski",
  zh: "中文",
  hi: "हिन्दी",
  ru: "Русский",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  pt: "Português",
};

type BackendCourseItem = {
  id?: number;
  title?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  lessons_number?: number;
  finished_lessons?: number;
  is_public?: boolean;
  is_mine?: boolean;
};

const mapBackendCourseItemToCourse = (item: BackendCourseItem): Course => {
  const backendId = typeof item.id === "number" ? item.id : undefined;
  const now = new Date().toISOString();

  const lessons =
    typeof item.lessons_number === "number" ? item.lessons_number : 0;
  const progress =
    typeof item.finished_lessons === "number" ? item.finished_lessons : 0;

  const course: Course = {
    id: String(backendId ?? `course_${Date.now()}`),
    backendId,
    title: item.title || "",
    description: item.description || "",
    lessons,
    progress,
    createdAt: item.created_at || now,
    updatedAt: item.updated_at || item.created_at || now,
    isPublic: item.is_public,
    isMine: item.is_mine,
    status: lessons === 0 ? "generating" : "ready",
  };

  const key = backendId ? `backend:${backendId}` : `id:${course.id}`;
  const localProgress = getCompletedCountForCourse(key);
  return { ...course, progress: Math.max(course.progress ?? 0, localProgress) };
};

export const coursesApi = {
  async getMyCourses(token?: string): Promise<Course[]> {
    await delay(DELAYS.courses);

    await loadLessonCompletionFromStorage();

    const baseUrl = getApiBaseUrl();

    // Courses endpoints require auth per swagger.
    if (!token) {
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/courses?in_mine=true`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Failed to load courses";
          throw new ApiError(res.status, "unknown", message);
        }

        // Backend returns { courses: [...] }
        const json = (await readJsonResponse(res)) as {
          courses?: unknown[];
        } | null;

        if (!json || !Array.isArray(json.courses)) {
          throw new ApiError(500, "unknown", "Invalid courses response");
        }

        return (json.courses as BackendCourseItem[]).map(
          mapBackendCourseItemToCourse,
        );
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (err instanceof Error) {
          emitServerUnavailable();
          throw new ApiError(0, "network", err.message);
        }
        emitServerUnavailable();
        throw new ApiError(0, "network", "Network error");
      }
    }

    emitServerUnavailable();
    throw new ApiError(
      0,
      "network",
      "Backend not configured - getMyCourses requires API",
    );
  },

  async getFeaturedCourses(token?: string): Promise<Course[]> {
    await delay(DELAYS.courses);

    await loadLessonCompletionFromStorage();

    const baseUrl = getApiBaseUrl();

    if (!token) {
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/courses?in_mine=false`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Failed to load courses";
          throw new ApiError(res.status, "unknown", message);
        }

        const json = (await readJsonResponse(res)) as {
          courses?: unknown[];
        } | null;

        if (!json || !Array.isArray(json.courses)) {
          throw new ApiError(500, "unknown", "Invalid courses response");
        }

        return (json.courses as BackendCourseItem[]).map(
          mapBackendCourseItemToCourse,
        );
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (err instanceof Error) {
          emitServerUnavailable();
          throw new ApiError(0, "network", err.message);
        }
        emitServerUnavailable();
        throw new ApiError(0, "network", "Network error");
      }
    }

    emitServerUnavailable();
    throw new ApiError(
      0,
      "network",
      "Backend not configured - getFeaturedCourses requires API",
    );
  },

  async getCourseById(id: string, token?: string): Promise<Course | null> {
    await delay(DELAYS.courses);

    await loadLessonCompletionFromStorage();

    const baseUrl = getApiBaseUrl();
    const numericId = Number(id);

    if (!token) {
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    if (!baseUrl) {
      emitServerUnavailable();
      throw new ApiError(
        0,
        "network",
        "Backend not configured - getCourseById requires API",
      );
    }

    if (!Number.isFinite(numericId)) {
      throw new ApiError(400, "validation", "Invalid course id");
    }

    {
      try {
        const res = await fetch(`${baseUrl}/courses/${numericId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const payload = await readErrorPayload(res);
          const messageFromJson =
            (payload.json as ApiErrorResponseBody | null)?.error?.message ||
            (isRecord(payload.json) && typeof payload.json.error === "string"
              ? payload.json.error
              : undefined) ||
            (payload.json as { message?: string } | null)?.message ||
            (payload.json as { detail?: string } | null)?.detail;
          const message =
            messageFromJson || payload.text || "Failed to load course";
          throw new ApiError(res.status, "unknown", message);
        }

        type BackendLessonItem = {
          id?: number;
          title?: string;
          description?: string;
          serial_number?: number;
          created_at?: string;
          updated_at?: string;
        };

        type BackendModuleItem = {
          id?: number;
          title?: string;
          description?: string;
          serial_number?: number;
          created_at?: string;
          updated_at?: string;
          lessons?: BackendLessonItem[];
        };

        type BackendGetCourseResponse = {
          id?: number;
          title?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
          lessons_number?: number;
          finished_lessons?: number;
          is_public?: boolean;
          is_mine?: boolean;
          modules?: BackendModuleItem[];
        };

        const json = (await readJsonResponse(
          res,
        )) as BackendGetCourseResponse | null;
        if (!json || typeof json.id !== "number") {
          throw new ApiError(500, "unknown", "Invalid course response");
        }

        const now = new Date().toISOString();

        const lessons =
          typeof json.lessons_number === "number" ? json.lessons_number : 0;
        const progress =
          typeof json.finished_lessons === "number" ? json.finished_lessons : 0;

        const course: Course = {
          id: String(json.id),
          backendId: json.id,
          title: json.title || "",
          description: json.description || "",
          lessons,
          progress,
          createdAt: json.created_at || now,
          updatedAt: json.updated_at || json.created_at || now,
          isPublic: json.is_public,
          isMine: json.is_mine,
          status: lessons === 0 ? "generating" : "ready",
          modules: Array.isArray(json.modules)
            ? json.modules.map((m) => ({
                id: String(m.id ?? `module_${Date.now()}`),
                title: m.title || "",
                lessons: Array.isArray(m.lessons)
                  ? m.lessons.map((l) => ({
                      id: String(l.id ?? `lesson_${Date.now()}`),
                      title: l.title || "",
                      serialNumber:
                        typeof l.serial_number === "number"
                          ? l.serial_number
                          : undefined,
                      createdAt: l.created_at,
                      updatedAt: l.updated_at || l.created_at,
                    }))
                  : [],
              }))
            : [],
        };

        const key = `backend:${json.id}`;
        const localProgress = getCompletedCountForCourse(key);
        return {
          ...course,
          progress: Math.max(course.progress ?? 0, localProgress),
        };
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (err instanceof Error) {
          emitServerUnavailable();
          throw new ApiError(0, "network", err.message);
        }
        emitServerUnavailable();
        throw new ApiError(0, "network", "Network error");
      }
    }
  },

  async publishCourse(token: string, courseId: number): Promise<void> {
    await delay(DELAYS.courses);

    if (!token) {
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    if (!courseId) {
      throw new ApiError(400, "validation", "Course ID is required");
    }

    const baseUrl = getApiBaseUrl();

    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/courses/${courseId}/publish`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.status === 401) {
          throw new ApiError(401, "unauthorized", "Unauthorized");
        }

        if (res.status === 403) {
          throw new ApiError(403, "unknown", "Not the owner of this course");
        }

        if (res.status === 404) {
          throw new ApiError(404, "unknown", "Course not found");
        }

        if (res.status === 409) {
          throw new ApiError(409, "unknown", "Course already published");
        }

        if (!res.ok) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || "Failed to publish course";
          throw new ApiError(res.status, "unknown", message);
        }
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (err instanceof Error) {
          emitServerUnavailable();
          throw new ApiError(0, "network", err.message);
        }
        emitServerUnavailable();
        throw new ApiError(0, "network", "Network error");
      }
    } else {
      throw new ApiError(
        0,
        "network",
        "Backend not configured - publishCourse requires API",
      );
    }
  },

  async setCoursePublication(
    courseId: string,
    isPublic: boolean,
  ): Promise<Course | null> {
    await delay(DELAYS.courses);

    // Deprecated – use publishCourse() instead
    if (!courseId) return null;
    throw new ApiError(
      0,
      "unknown",
      "Deprecated - use publishCourse() instead",
    );
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
      file:
        | Blob
        | {
            uri: string;
            name: string;
            type?: string;
          };
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
        const normalizedLanguage =
          COURSE_LANGUAGE_CODE_TO_BACKEND[data.language] ?? data.language;

        const normalizedFile =
          data.file instanceof Blob
            ? data.file
            : (() => {
                const name = data.file.name || "file";
                const nameLower = name.toLowerCase();
                const inferredType = nameLower.endsWith(".pdf")
                  ? "application/pdf"
                  : nameLower.endsWith(".txt")
                    ? "text/plain"
                    : undefined;

                return {
                  uri: data.file.uri,
                  name,
                  type: data.file.type || inferredType,
                };
              })();

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("file", normalizedFile as any);
        formData.append("language", normalizedLanguage);

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
          const payload = await readErrorPayload(res);

          const messageFromJson =
            (payload.json as ApiErrorResponseBody | null)?.error?.message ||
            (isRecord(payload.json) && typeof payload.json.error === "string"
              ? payload.json.error
              : undefined) ||
            (payload.json as { message?: string } | null)?.message ||
            (payload.json as { detail?: string } | null)?.detail;

          const message = messageFromJson || payload.text || "Validation error";
          throw new ApiError(400, "validation", message);
        }

        if (!res.ok) {
          const payload = await readErrorPayload(res);
          const messageFromJson =
            (payload.json as ApiErrorResponseBody | null)?.error?.message ||
            (isRecord(payload.json) && typeof payload.json.error === "string"
              ? payload.json.error
              : undefined) ||
            (payload.json as { message?: string } | null)?.message ||
            (payload.json as { detail?: string } | null)?.detail;
          const message =
            messageFromJson || payload.text || "Failed to create course";
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
          emitServerUnavailable();
          throw new ApiError(0, "network", err.message);
        }
        emitServerUnavailable();
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
          emitServerUnavailable();
          throw new ApiError(0, "network", err.message);
        }
        emitServerUnavailable();
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
