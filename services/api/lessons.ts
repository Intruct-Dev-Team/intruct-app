import type {
  GetLessonResponse,
  Lesson,
  LessonMaterial,
  TestQuestion,
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

export const lessonsApi = {
  async getLessonById(lessonId: number, token: string): Promise<Lesson> {
    await delay(DELAYS.lessons);

    if (!token) {
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    if (!Number.isFinite(lessonId)) {
      throw new ApiError(400, "validation", "Lesson ID is required");
    }

    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
      throw new ApiError(500, "unknown", "API base URL is not configured");
    }

    try {
      const res = await fetch(`${baseUrl}/lessons/${lessonId}`, {
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
          messageFromJson || payload.text || "Failed to load lesson";
        throw new ApiError(res.status, "unknown", message);
      }

      const json = (await readJsonResponse(res)) as GetLessonResponse | null;
      if (!json || typeof json.id !== "number") {
        throw new ApiError(500, "unknown", "Invalid lesson response");
      }

      const lessonContent =
        typeof json.content === "string" ? json.content : "";
      const lessonMaterial: LessonMaterial | null =
        lessonContent.trim().length > 0
          ? {
              id: `lesson_${json.id}_content`,
              title: "Lesson",
              content: lessonContent,
            }
          : null;

      const quizzes = Array.isArray(json.quizzes) ? json.quizzes : [];
      const questions: TestQuestion[] = quizzes
        .filter(
          (q) => typeof q.question === "string" && q.question.trim().length > 0,
        )
        .map((q, index) => {
          const options = Array.isArray(q.options)
            ? q.options.filter((o) => typeof o === "string")
            : [];
          const correctIndex =
            typeof q.correct_index === "number" ? q.correct_index : 0;

          return {
            id: String(q.id ?? `quiz_${json.id}_${index}`),
            question: q.question ?? "",
            type: "multiple-choice",
            options,
            correctAnswer: correctIndex,
          };
        });

      return {
        id: String(json.id),
        title: json.title || "",
        materials: lessonMaterial ? [lessonMaterial] : [],
        questions,
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
  },

  async finishLesson(lessonId: number, token: string): Promise<void> {
    await delay(DELAYS.lessons);

    if (!token) {
      throw new ApiError(401, "unauthorized", "Token is required");
    }

    if (!Number.isFinite(lessonId)) {
      throw new ApiError(400, "validation", "Lesson ID is required");
    }

    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
      throw new ApiError(500, "unknown", "API base URL is not configured");
    }

    try {
      const res = await fetch(`${baseUrl}/lessons/${lessonId}/finish`, {
        method: "PUT",
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
          messageFromJson || payload.text || "Failed to finish lesson";
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
  },
};
