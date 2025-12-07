import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import { Session, User } from "@supabase/supabase-js";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    signInWithGoogle: () => void;
    signOut: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    signInWithGoogle: () => { },
    signOut: () => { },
    isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const rootSegment = useSegments()[0];
    const router = useRouter();

    useEffect(() => {
        // Configure Google Sign-In
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
            offlineAccess: true,
        });

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session ? session.user : null);
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session ? session.user : null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.data?.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                });

                if (error) {
                    console.error("Supabase Auth Error:", error.message);
                } else {
                    console.log("Supabase Auth Success");
                }
            } else {
                throw new Error('No ID token present!');
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        console.log("Sign in cancelled");
                        break;
                    case statusCodes.IN_PROGRESS:
                        console.log("Sign in is in progress");
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        console.log("Play services not available");
                        break;
                    default:
                        console.error("Something went wrong", error);
                }
            } else {
                console.error("Non-Google error", error);
            }
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            await GoogleSignin.signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = rootSegment === "(auth)";

        if (!user && !inAuthGroup) {
            // Redirect to the sign-in page.
            router.replace("/(auth)/welcome");
        } else if (user && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace("/(tabs)");
        }
    }, [user, rootSegment, isLoading]);

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                signInWithGoogle,
                signOut,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
