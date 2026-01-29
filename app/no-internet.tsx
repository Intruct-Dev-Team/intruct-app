import { useThemeColors } from "@/hooks/use-theme-colors";
import { t } from "@/localization/i18n";
import NetInfo from "@react-native-community/netinfo";
import { WifiOff } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Button, Text, YStack } from "tamagui";

export default function NoInternetScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [checking, setChecking] = useState(false);

  const handleTryAgain = useCallback(async () => {
    try {
      setChecking(true);
      const state = await NetInfo.fetch();

      const isOffline =
        state.isConnected === false || state.isInternetReachable === false;
      if (isOffline) return;

      if (router.canGoBack()) {
        router.back();
        return;
      }

      router.replace("/");
    } finally {
      setChecking(false);
    }
  }, [router]);

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
            {t("No internet connection")}
          </Text>
          <Text
            fontSize="$4"
            color={colors.textSecondary}
            textAlign="center"
            lineHeight="$2"
          >
            {t("Please check your connection and try again.")}
          </Text>
        </YStack>

        <Button
          size="$5"
          backgroundColor={colors.primary}
          color={colors.primaryText}
          disabled={checking}
          onPress={() => void handleTryAgain()}
        >
          {t("Try again")}
        </Button>
      </YStack>
    </>
  );
}
