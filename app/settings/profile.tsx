import { AuthButton } from "@/components/auth/AuthButton";
import { AuthInput } from "@/components/auth/AuthInput";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { mockUser } from "@/mockdata/user";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ScrollView, Text, YStack } from "tamagui";

export default function ProfileScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { signOut } = useAuth(); // We can ignore the user from context for the form initial state if we prefer mockUser, or merge them.
    // Using mockUser as requested for "real user data" simulation

    const [name, setName] = useState(mockUser.name);
    const [email, setEmail] = useState(mockUser.email);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.back();
        }, 1000);
    };

    const handleSignOut = () => {
        signOut();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {/* Header */}
                    <YStack paddingHorizontal="$4" paddingVertical="$2" flexDirection="row" alignItems="center" gap="$2">
                        <Button
                            icon={<ChevronLeft size={28} color={colors.textPrimary} />}
                            chromeless
                            onPress={() => router.back()}
                            padding="$2"
                        />
                        <Text fontSize="$6" fontWeight="bold" color={colors.textPrimary}>
                            Edit Profile
                        </Text>
                    </YStack>

                    <YStack flex={1} padding="$5" gap="$6">
                        {/* Avatar Section */}
                        <YStack alignItems="center" marginTop="$4" gap="$4">
                            <YStack
                                width={100}
                                height={100}
                                borderRadius="$10"
                                backgroundColor="$blue5"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text fontSize={40} fontWeight="bold" color="white">
                                    {name?.[0]?.toUpperCase() || "U"}
                                </Text>
                            </YStack>
                            <Text fontSize="$4" color={colors.textSecondary}>
                                Update your profile information
                            </Text>
                        </YStack>

                        {/* Form Section */}
                        <YStack gap="$4">
                            <AuthInput
                                label="Full Name"
                                placeholder="Enter your name"
                                value={name}
                                onChangeText={setName}
                                backgroundColor="white"
                            />
                            <AuthInput
                                label="Email"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                backgroundColor="white"
                            />
                        </YStack>

                        <YStack flex={1} />

                        {/* Action Buttons */}
                        <YStack gap="$4" marginBottom="$4">
                            <AuthButton
                                title="Save Changes"
                                onPress={handleSave}
                                loading={isLoading}
                            />

                            <Button
                                size="$5"
                                backgroundColor="$red2" // Softer red background
                                color="$red10"
                                onPress={handleSignOut}
                                chromeless
                            >
                                Sign Out
                            </Button>
                        </YStack>
                    </YStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
