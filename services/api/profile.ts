import AsyncStorage from "@react-native-async-storage/async-storage";

import type { UserProfile } from "@/types";

import {
  ApiError,
  type ApiErrorResponseBody,
  DELAYS,
  REGISTRATION_NOT_COMPLETED_ERROR,
  type UserProfileResponse,
  delay,
  emitServerUnavailable,
  getApiBaseUrl,
  isRecord,
  mapUserProfile,
  readJsonResponse,
} from "./core";

const USER_PROFILE_STORAGE_KEY = "intruct.userProfile";

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
          emitServerUnavailable();
          throw new ApiError(0, "network", err.message);
        }
        emitServerUnavailable();
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
      "Backend not configured - getUserById requires API",
    );
  },
};
