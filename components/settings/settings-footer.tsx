import { useThemeColors } from "@/hooks/use-theme-colors";
import { Text, YStack } from "tamagui";

export function SettingsFooter() {
  const colors = useThemeColors();

  return (
    <YStack gap="$2" alignItems="center" paddingVertical="$6">
      <Text fontSize="$3" color={colors.textSecondary}>
        Intruct v1.0.0
      </Text>
      <Text fontSize="$2" color={colors.textTertiary}>
        © 2025 Instruct. All rights reserved.
      </Text>
    </YStack>
  );
}
