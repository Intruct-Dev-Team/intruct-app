import { t } from "@/localization/i18n";
import type { CompleteRegistrationRequest, UserProfile } from "@/types";

import {
  ApiError,
  type ApiErrorResponseBody,
  DELAYS,
  type UserProfileResponse,
  delay,
  emitServerUnavailable,
  getApiBaseUrl,
  mapUserProfile,
  readJsonResponse,
} from "./core";

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

export const authApi = {
  async completeRegistration(
    token: string,
    payload: CompleteRegistrationRequest,
  ): Promise<UserProfile> {
    await delay(DELAYS.auth);

    if (!token) {
      throw new ApiError(401, "unauthorized", t("Token is required"));
    }

    if (!payload.name) {
      throw new ApiError(422, "validation", t("Name is required"));
    }

    const baseUrl = getApiBaseUrl();

    if (baseUrl) {
      try {
        // Ensure birthdate is always provided (use current date if missing)
        let birthdateISO = payload.birthdate;
        if (!birthdateISO) {
          const today = new Date();
          const eighteenYearsAgo = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate(),
          );
          const pad = (n: number) => String(n).padStart(2, "0");
          birthdateISO = `${eighteenYearsAgo.getFullYear()}-${pad(eighteenYearsAgo.getMonth() + 1)}-${pad(eighteenYearsAgo.getDate())}`;
        }

        const birthdateWithTime = birthdateISO.includes("T")
          ? birthdateISO
          : `${birthdateISO}T00:00:00Z`;

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
          surname: payload.surname || "",
          birthdate: birthdateWithTime,
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
          throw new ApiError(401, "unauthorized", t("Unauthorized"));
        }

        if (res.status === 422) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message = body?.error?.message || t("Validation error");
          throw new ApiError(422, "validation", message);
        }

        if (!res.ok) {
          const body = (await readJsonResponse(
            res,
          )) as ApiErrorResponseBody | null;
          const message =
            body?.error?.message || t("Failed to complete registration");
          throw new ApiError(res.status, "unknown", message);
        }

        const json = (await readJsonResponse(
          res,
        )) as UserProfileResponse | null;

        if (!json) {
          throw new ApiError(
            500,
            "unknown",
            t("Invalid complete-registration response"),
          );
        }

        return mapUserProfile(json);
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (err instanceof Error) {
          emitServerUnavailable();
          throw new ApiError(0, "network", err.message);
        }
        emitServerUnavailable();
        throw new ApiError(0, "network", t("Network error"));
      }
    }

    emitServerUnavailable();
    throw new ApiError(
      0,
      "network",
      t("Backend not configured - completeRegistration requires API"),
    );
  },
};
