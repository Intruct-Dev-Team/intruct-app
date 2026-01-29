import type { UserProfile } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import type { Session, User } from "@supabase/supabase-js";
import type { Href } from "expo-router";
import { usePathname, useRouter, useSegments } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNotifications } from "@/contexts/NotificationsContext";
import { t } from "@/localization/i18n";
import {
  ApiError,
  lessonProgressApi,
  profileApi,
  setNeedsCompleteRegistrationHandler,
} from "@/services/api";

import { supabase } from "../utils/supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  needsCompleteRegistration: boolean;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  setNeedsCompleteRegistration: (value: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  needsCompleteRegistration: false,
  profileLoading: false,
  refreshProfile: async () => {},
  setNeedsCompleteRegistration: () => {},
  signInWithGoogle: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

function getSafeAuthErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return t("Something went wrong. Please try again.");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { notify } = useNotifications();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [needsCompleteRegistration, setNeedsCompleteRegistrationState] =
    useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const rootSegment = useSegments()[0];
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setNeedsCompleteRegistrationHandler(() => {
      if (!user) return;

      setNeedsCompleteRegistrationState(true);

      if (rootSegment === "(onboarding)") return;

      const href = `/(onboarding)/complete-registration?returnTo=${encodeURIComponent(
        pathname,
      )}`;
      router.replace(href as Href);
    });

    return () => {
      setNeedsCompleteRegistrationHandler(null);
    };
  }, [pathname, rootSegment, router, user]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession ? initialSession.user : null);
      setProfile(null);
      setIsLoading(false);
      setProfileLoading(Boolean(initialSession?.access_token));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession ? nextSession.user : null);
      if (!nextSession) {
        setProfile(null);
      }
      setIsLoading(false);

      if (__DEV__ && event === "SIGNED_IN" && nextSession?.access_token) {
        console.log("JWT access_token:", nextSession.access_token);
      }

      if (nextSession?.access_token) {
        setProfileLoading(true);
      } else {
        setProfileLoading(false);
        setNeedsCompleteRegistrationState(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);

    if (error) {
      notify({
        type: "error",
        title: t("Login failed"),
        message: getSafeAuthErrorMessage(error),
      });
      throw error;
    }

    notify({
      type: "success",
      title: t("Welcome"),
      message: t("You’re signed in."),
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    const {
      data: { session: newSession },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      notify({
        type: "error",
        title: t("Registration failed"),
        message: getSafeAuthErrorMessage(error),
      });
      throw error;
    }

    if (!newSession) {
      notify({
        type: "info",
        title: t("Check your email"),
        message: t("Please confirm your email to finish registration."),
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const idToken = (userInfo as { data?: { idToken?: string } }).data
        ?.idToken;
      if (!idToken) {
        throw new Error("No ID token present!");
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) {
        notify({
          type: "error",
          title: t("Google sign-in failed"),
          message: getSafeAuthErrorMessage(error),
        });
      } else {
        notify({
          type: "success",
          title: t("Welcome"),
          message: t("You’re signed in."),
        });
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            return;
          case statusCodes.IN_PROGRESS:
            return;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            notify({
              type: "error",
              title: t("Google sign-in unavailable"),
              message: t("Play services are not available on this device."),
            });
            return;
          default:
            break;
        }
      }

      notify({
        type: "error",
        title: t("Google sign-in failed"),
        message: getSafeAuthErrorMessage(error),
      });
      console.error("Google sign-in error", error);
    }
  };

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      await GoogleSignin.signOut();
      setProfile(null); // Reset in-memory lesson progress cache
      lessonProgressApi.resetCache(); // Clear all AsyncStorage except theme settings
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToDelete = allKeys.filter(
        (key) => !key.startsWith("theme") && key !== "activeTheme",
      );
      await AsyncStorage.multiRemove(keysToDelete);
      notify({
        type: "success",
        title: t("Signed out"),
        message: t("You’re signed out."),
      });
    } catch (error) {
      notify({
        type: "error",
        title: t("Sign out failed"),
        message: t("Couldn’t sign out. Please try again."),
      });
      console.error("Error signing out", error);
    }
  }, [notify]);

  const refreshProfile = useCallback(async () => {
    const token = session?.access_token;

    if (needsCompleteRegistration) {
      console.log("[AuthContext] Skipping profile load - registration needed");
      return;
    }

    if (!token) return;

    setProfileLoading(true);

    try {
      console.log("[AuthContext] Loading profile with token...");
      const backendProfile = await profileApi.getProfile(token);
      setProfile(backendProfile);
      setNeedsCompleteRegistrationState(false);
    } catch (error: unknown) {
      console.log("[AuthContext] Error loading profile:", error);

      if (error instanceof ApiError) {
        console.log(
          "[AuthContext] ApiError - code:",
          error.code,
          "status:",
          error.status,
          "message:",
          error.message,
        );

        if (error.code === "unauthorized") {
          console.log("[AuthContext] Unauthorized - signing out");
          notify({
            type: "error",
            title: t("Session expired"),
            message: t("Please sign in again."),
          });
          await signOut();
          router.replace("/(auth)/welcome");
          return;
        }

        if (error.code === "needs_complete_registration") {
          console.log("[AuthContext] Needs complete registration");
          setProfile(null);
          setNeedsCompleteRegistrationState(true);
          return;
        }

        if (error.code === "network") {
          console.warn(
            "[AuthContext] Network error - continuing without profile",
          );
          return;
        }

        console.log("[AuthContext] Other ApiError - showing notification");
        notify({
          type: "error",
          title: t("Couldn't load profile"),
          message: error.message,
        });
        return;
      }

      console.log("[AuthContext] Unknown error type:", typeof error);

      notify({
        type: "error",
        title: t("Couldn’t load profile"),
        message: t("Please try again."),
      });
    } finally {
      setProfileLoading(false);
    }
  }, [
    needsCompleteRegistration,
    notify,
    router,
    session?.access_token,
    signOut,
  ]);

  useEffect(() => {
    const token = session?.access_token;

    // Если уже знаем что нужна регистрация - не делаем запросы
    if (needsCompleteRegistration) {
      console.log("[AuthContext] Skipping profile load - registration needed");
      return;
    }

    if (!token) return;

    let cancelled = false;

    setProfileLoading(true);

    const loadProfile = async () => {
      try {
        console.log("[AuthContext] Loading profile with token...");
        const backendProfile = await profileApi.getProfile(token);
        if (cancelled) return;
        setProfile(backendProfile);
        setNeedsCompleteRegistrationState(false);
      } catch (error: unknown) {
        console.log("[AuthContext] Error loading profile:", error);
        if (cancelled) return;

        if (error instanceof ApiError) {
          console.log(
            "[AuthContext] ApiError - code:",
            error.code,
            "status:",
            error.status,
            "message:",
            error.message,
          );

          if (error.code === "unauthorized") {
            console.log("[AuthContext] Unauthorized - signing out");
            notify({
              type: "error",
              title: t("Session expired"),
              message: t("Please sign in again."),
            });
            await signOut();
            router.replace("/(auth)/welcome");
            return;
          }

          if (error.code === "needs_complete_registration") {
            console.log("[AuthContext] Needs complete registration");
            setProfile(null);
            setNeedsCompleteRegistrationState(true);
            return;
          }

          if (error.code === "network") {
            console.warn(
              "[AuthContext] Network error - continuing without profile",
            );
            return;
          }

          console.log("[AuthContext] Other ApiError - showing notification");
          notify({
            type: "error",
            title: t("Couldn't load profile"),
            message: error.message,
          });
          return;
        }

        console.log("[AuthContext] Unknown error type:", typeof error);

        notify({
          type: "error",
          title: t("Couldn’t load profile"),
          message: t("Please try again."),
        });
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [
    needsCompleteRegistration,
    notify,
    router,
    session?.access_token,
    signOut,
  ]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = rootSegment === "(auth)";
    const inOnboardingGroup = rootSegment === "(onboarding)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/welcome");
      return;
    }

    if (!user) return;

    if (profileLoading) return;

    if (needsCompleteRegistration && !inOnboardingGroup) {
      const href = `/(onboarding)/complete-registration?returnTo=${encodeURIComponent(
        pathname,
      )}`;
      router.replace(href as Href);
      return;
    }

    if (!needsCompleteRegistration && (inAuthGroup || inOnboardingGroup)) {
      router.replace("/(tabs)");
    }
  }, [
    user,
    rootSegment,
    isLoading,
    router,
    needsCompleteRegistration,
    profileLoading,
  ]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        needsCompleteRegistration,
        profileLoading,
        refreshProfile,
        setNeedsCompleteRegistration: (value: boolean) =>
          setNeedsCompleteRegistrationState(value),
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
