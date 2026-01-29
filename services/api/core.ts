import type { UserProfile } from "@/types";

/*
 * API core utilities shared across domain clients.
 * Keeps error handling + global navigation handlers centralized.
 */

export const DELAYS = {
  profile: 250,
  auth: 300,
  courses: 400,
  lessons: 350,
  settings: 200,
  catalog: 400,
} as const;

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

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

export interface ApiErrorResponseBody {
  error?: { code?: string; message?: string };
}

export interface UserProfileResponse {
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
  is_streak_active_today: boolean;
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const REGISTRATION_NOT_COMPLETED_ERROR =
  "registration was not completed";

const isRegistrationNotCompletedBody = (
  value: unknown,
): value is { error: string } =>
  isRecord(value) && typeof value.error === "string";

let needsCompleteRegistrationHandler: (() => void) | null = null;

let serverUnavailableHandler: (() => void) | null = null;

export const setNeedsCompleteRegistrationHandler = (
  handler: (() => void) | null,
): void => {
  needsCompleteRegistrationHandler = handler;
};

export const setServerUnavailableHandler = (
  handler: (() => void) | null,
): void => {
  serverUnavailableHandler = handler;
};

export const emitNeedsCompleteRegistration = (): void => {
  try {
    needsCompleteRegistrationHandler?.();
  } catch {
    // Silent
  }
};

export const emitServerUnavailable = (): void => {
  try {
    serverUnavailableHandler?.();
  } catch {
    // Silent
  }
};

export const getApiBaseUrl = (): string | null => {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL;
  return raw ? raw.replace(/\/+$/, "") : null;
};

export const readJsonResponse = async (
  res: Response,
): Promise<unknown | null> => {
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

export const readErrorPayload = async (
  res: Response,
): Promise<{ json: unknown | null; text: string | null }> => {
  try {
    const text = await res.text();
    const trimmed = text.trim();
    if (!trimmed) return { json: null, text: null };

    try {
      const json = JSON.parse(trimmed) as unknown;

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

      return { json, text: trimmed };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      return { json: null, text: trimmed };
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    return { json: null, text: null };
  }
};

export const mapUserProfile = (data: UserProfileResponse): UserProfile => ({
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
  isStreakActiveToday: data.is_streak_active_today,
});
