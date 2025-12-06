
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";

export default function ForgotPasswordScreen() {
    const colors = useThemeColors();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Screen options={{ title: "Forgot Password" }} />
            <YStack flex={1} alignItems="center" justifyContent="center">
                <Text color={colors.textPrimary}>Forgot Password Screen</Text>
            </YStack>
        </SafeAreaView>
    );
}
