import { AuthButton } from "@/components/auth/AuthButton";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, XStack, YStack } from "tamagui";

export default function SignupScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { signUp, isLoading } = useAuth();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Screen options={{ title: "Sign Up", headerBackTitle: "Back" }} />
            <YStack flex={1} padding="$5" justifyContent="center" gap="$4">
                <Text fontSize="$8" fontWeight="bold" color={colors.textPrimary} textAlign="center">
                    Create Account
                </Text>

                <AuthButton
                    title="Sign Up with Mock User"
                    onPress={signUp}
                    loading={isLoading}
                />

                {/* Back to Login Option */}
                <XStack justifyContent="center" gap="$2" marginTop="$4">
                    <Text color={colors.textSecondary} fontSize="$4">
                        Already have an account?
                    </Text>
                    <Text
                        color="$blue9"
                        fontSize="$4"
                        fontWeight="600"
                        onPress={() => router.push("/(auth)/login")}
                    >
                        Log In
                    </Text>
                </XStack>
            </YStack>
        </SafeAreaView>
    );
}
