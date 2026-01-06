import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import type { Session, User } from "@supabase/supabase-js";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useNotifications } from "@/contexts/NotificationsContext";

import { supabase } from "../utils/supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signInWithGoogle: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
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
    if (typeof message === "string" && message.trim().length > 0)
      return message;
  }

  return "Something went wrong. Please try again.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { notify } = useNotifications();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession ? nextSession.user : null);
      setIsLoading(false);
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

      if (!userInfo.data?.idToken) {
        throw new Error("No ID token present!");
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: userInfo.data.idToken,
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
    if (isLoading) return;

    const inAuthGroup = rootSegment === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, rootSegment, isLoading, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
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
