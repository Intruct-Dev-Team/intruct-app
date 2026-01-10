import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import type { Session, User } from "@supabase/supabase-js";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useNotifications } from "@/contexts/NotificationsContext";
import { ApiError, profileApi } from "@/services/api";

import { supabase } from "../utils/supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  needsCompleteRegistration: boolean;
  profileLoading: boolean;
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
  needsCompleteRegistration: false,
  profileLoading: false,
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

  return "Something went wrong. Please try again.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { notify } = useNotifications();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [needsCompleteRegistration, setNeedsCompleteRegistrationState] =
    useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const rootSegment = useSegments()[0];
  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession ? initialSession.user : null);
      setIsLoading(false);
      setProfileLoading(Boolean(initialSession?.access_token));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession ? nextSession.user : null);
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
        title: "Login failed",
        message: getSafeAuthErrorMessage(error),
      });
      throw error;
    }

    notify({ type: "success", title: "Welcome", message: "You’re signed in." });
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
        title: "Registration failed",
        message: getSafeAuthErrorMessage(error),
      });
      throw error;
    }

    if (!newSession) {
      notify({
        type: "info",
        title: "Check your email",
        message: "Please confirm your email to finish registration.",
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
          title: "Google sign-in failed",
          message: getSafeAuthErrorMessage(error),
        });
      } else {
        notify({
          type: "success",
          title: "Welcome",
          message: "You’re signed in.",
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
              title: "Google sign-in unavailable",
              message: "Play services are not available on this device.",
            });
            return;
          default:
            break;
        }
      }

      notify({
        type: "error",
        title: "Google sign-in failed",
        message: getSafeAuthErrorMessage(error),
      });
      console.error("Google sign-in error", error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      await GoogleSignin.signOut();
      notify({
        type: "success",
        title: "Signed out",
        message: "You’re signed out.",
      });
    } catch (error) {
      notify({
        type: "error",
        title: "Sign out failed",
        message: "Couldn’t sign out. Please try again.",
      });
      console.error("Error signing out", error);
    }
  };

  useEffect(() => {
    const token = session?.access_token;
    if (!token) return;

    let cancelled = false;

    setProfileLoading(true);

    const loadProfile = async () => {
      try {
        await profileApi.getProfile(token);
        if (cancelled) return;
        setNeedsCompleteRegistrationState(false);
      } catch (error: unknown) {
        if (cancelled) return;

        if (error instanceof ApiError) {
          if (error.code === "unauthorized") {
            notify({
              type: "error",
              title: "Session expired",
              message: "Please sign in again.",
            });
            await signOut();
            router.replace("/(auth)/welcome");
            return;
          }

          if (error.code === "needs_complete_registration") {
            setNeedsCompleteRegistrationState(true);
            return;
          }

          if (error.code === "network") {
            notify({
              type: "error",
              title: "Network error",
              message: "Please try again.",
            });
            return;
          }

          notify({
            type: "error",
            title: "Couldn’t load profile",
            message: error.message,
          });
          return;
        }

        notify({
          type: "error",
          title: "Couldn’t load profile",
          message: "Please try again.",
        });
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [notify, router, session?.access_token, signOut]);

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
      router.replace("/(onboarding)/complete-registration");
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
        needsCompleteRegistration,
        profileLoading,
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
