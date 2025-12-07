import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
    id: string;
    email: string;
    name: string;
    picture?: string;
} | null;

type AuthContextType = {
    user: User;
    signIn: () => void;
    signInWithGoogle: () => void;
    signUp: () => void;
    signOut: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: () => { },
    signInWithGoogle: () => { },
    signUp: () => { },
    signOut: () => { },
    isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState(true);
    const rootSegment = useSegments()[0];
    const router = useRouter();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
            offlineAccess: true,
        });

        // Check for persisted user on mount
        const loadUser = async () => {
            try {
                const jsonUser = await AsyncStorage.getItem("user");
                if (jsonUser) {
                    setUser(JSON.parse(jsonUser));
                } else {
                    // Optional: Try silent sign-in if no local user but maybe Google session exists
                    /*
                    const isSignedIn = await GoogleSignin.hasPlayServices();
                    if (isSignedIn) {
                        try {
                            const userInfo = await GoogleSignin.signInSilently();
                            if (userInfo.data?.user) {
                                const newUser: User = {
                                    id: userInfo.data.user.id,
                                    email: userInfo.data.user.email,
                                    name: userInfo.data.user.name ?? "User",
                                    picture: userInfo.data.user.photo ?? undefined,
                                };
                                setUser(newUser);
                                await AsyncStorage.setItem("user", JSON.stringify(newUser));
                            }
                        } catch (error) {
                            // Valid to fail silently if no session
                        }
                    }
                    */
                }
            } catch (error) {
                console.error("Failed to load user", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.data?.user) {
                const newUser: User = {
                    id: userInfo.data.user.id,
                    email: userInfo.data.user.email,
                    name: userInfo.data.user.name ?? "User",
                    picture: userInfo.data.user.photo ?? undefined,
                };
                setUser(newUser);
                await AsyncStorage.setItem("user", JSON.stringify(newUser));
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

    const signIn = () => {
        setIsLoading(true);
        setTimeout(async () => {
            const newUser = {
                id: "1",
                email: "demo@example.com",
                name: "Demo User",
            };
            setUser(newUser);
            try {
                await AsyncStorage.setItem("user", JSON.stringify(newUser));
            } catch (e) {
                console.error("Failed to save user", e);
            }
            setIsLoading(false);
        }, 1000);
    };

    const signUp = () => {
        setIsLoading(true);
        setTimeout(async () => {
            const newUser = {
                id: "1",
                email: "demo@example.com",
                name: "Demo User",
            };
            setUser(newUser);
            try {
                await AsyncStorage.setItem("user", JSON.stringify(newUser));
            } catch (e) {
                console.error("Failed to save user", e);
            }
            setIsLoading(false);
        }, 1000);
    };

    const signOut = async () => {
        setUser(null);
        try {
            await AsyncStorage.removeItem("user");
            await GoogleSignin.signOut();
        } catch (e) {
            console.error("Failed to remove user", e);
        }
    };

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = rootSegment === "(auth)";

        if (
            // If the user is not signed in and the initial segment is not anything in the auth group.
            !user &&
            !inAuthGroup
        ) {
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
                signIn,
                signInWithGoogle,
                signUp,
                signOut,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
