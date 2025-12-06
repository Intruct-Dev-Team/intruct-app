import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
    id: string;
    email: string;
    name: string;
} | null;

type AuthContextType = {
    user: User;
    signIn: () => void;
    signUp: () => void;
    signOut: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: () => { },
    signUp: () => { },
    signOut: () => { },
    isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState(true); // Start true to check storage
    const rootSegment = useSegments()[0];
    const router = useRouter();

    useEffect(() => {
        // Check for persisted user on mount
        const loadUser = async () => {
            try {
                const jsonUser = await AsyncStorage.getItem("user");
                if (jsonUser) {
                    setUser(JSON.parse(jsonUser));
                }
            } catch (error) {
                console.error("Failed to load user", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

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
                signUp,
                signOut,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
