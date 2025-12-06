
import { AuthButton } from "@/components/auth/AuthButton";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export default function WelcomeScreen() {
    const colors = useThemeColors();
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Screen options={{ headerShown: false }} />
            <YStack flex={1} padding="$5" justifyContent="space-between" paddingVertical="$8">
                <YStack alignItems="center" marginTop="$10" gap="$4">
                    <LinearGradient
                        width={120}
                        height={120}
                        borderRadius="$4"
                        colors={["#4c669f", "#3b5998", "#192f6a"]}
                        start={[0, 0]}
                        end={[1, 1]}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Text fontSize={70} color="white" fontWeight="bold">
                            I
                        </Text>
                    </LinearGradient>
                    <Text
                        fontSize="$9"
                        fontWeight="800"
                        color={colors.textPrimary}
                        textAlign="center"
                    >
                        Intruct
                    </Text>
                    <Text
                        fontSize="$5"
                        color={colors.textSecondary}
                        textAlign="center"
                        maxWidth={300}
                    >
                        Master new skills with our interactive learning platform.
                    </Text>
                </YStack>

                <YStack gap="$4">
                    <Text
                        fontSize="$6"
                        fontWeight="600"
                        color={colors.textPrimary}
                        textAlign="center"
                        marginBottom="$2"
                    >
                        Do you have an account?
                    </Text>

                    <AuthButton
                        title="Yes, sign in"
                        onPress={() => router.push("/(auth)/login")}
                    />

                    <Button
                        size="$5"
                        borderRadius="$6"
                        backgroundColor="transparent"
                        borderWidth={1}
                        borderColor="$gray8"
                        pressStyle={{ opacity: 0.8 }}
                        onPress={() => router.push("/(auth)/signup")}
                        color={colors.textPrimary}
                    >
                        <Text color={colors.textPrimary} fontWeight="600" fontSize="$4">No, create account</Text>
                    </Button>
                </YStack>
            </YStack>
        </SafeAreaView>
    );
}
