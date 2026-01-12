import { useThemeColors } from "@/hooks/use-theme-colors";
import { WifiOff } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { Button, Text, YStack } from "tamagui";

export default function NoInternetScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <YStack
        flex={1}
        backgroundColor={colors.background}
        padding="$4"
        gap="$4"
        justifyContent="center"
      >
        <YStack alignItems="center" justifyContent="center" gap="$3">
          <WifiOff size={44} color={colors.textSecondary} />
          <Text fontSize="$8" fontWeight="700" color={colors.textPrimary}>
            No internet connection
          </Text>
          <Text
            fontSize="$4"
            color={colors.textSecondary}
            textAlign="center"
            lineHeight="$2"
          >
            Please check your connection and try again.
          </Text>
        </YStack>

        <Button
          size="$5"
          backgroundColor={colors.primary}
          color="white"
          onPress={() => router.back()}
        >
          Try again
        </Button>
      </YStack>
    </>
  );
}
