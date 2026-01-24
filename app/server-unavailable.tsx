import { useThemeColors } from "@/hooks/use-theme-colors";
import { AlertTriangle } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { Button, Text, YStack } from "tamagui";

export default function ServerUnavailableScreen() {
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
          <AlertTriangle size={44} color={colors.textSecondary} />
          <Text fontSize="$8" fontWeight="700" color={colors.textPrimary}>
            Server temporarily unavailable
          </Text>
          <Text
            fontSize="$4"
            color={colors.textSecondary}
            textAlign="center"
            lineHeight="$2"
          >
            The server is not responding right now. Please try again in a
            moment.
          </Text>
        </YStack>

        <Button
          size="$5"
          backgroundColor={colors.primary}
          color={colors.primaryText}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
              return;
            }

            router.replace("/");
          }}
        >
          Try again
        </Button>
      </YStack>
    </>
  );
}
