import { useTheme } from "@/contexts/theme-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ReactNode } from "react";
import { Text, XStack, YStack } from "tamagui";

interface SettingsItemProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  rightElement?: ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
}

export function SettingsItem({
  icon,
  title,
  description,
  rightElement,
  onPress,
  showDivider = false,
}: SettingsItemProps) {
  const colors = useThemeColors();
  const { activeTheme } = useTheme();
  const iconBackground = activeTheme === "dark" ? "$gray4" : "$gray2";

  return (
    <>
      <XStack
        padding="$4"
        gap="$3"
        alignItems="center"
        justifyContent="space-between"
        pressStyle={
          onPress
            ? {
                opacity: 0.7,
              }
            : undefined
        }
        onPress={onPress}
      >
        <XStack gap="$3" alignItems="center" flex={1}>
          {icon && (
            <YStack
              width={48}
              height={48}
              alignItems="center"
              justifyContent="center"
              backgroundColor={iconBackground}
              borderRadius="$3"
            >
              {icon}
            </YStack>
          )}
          <YStack flex={1} gap="$1">
            <Text fontSize="$5" fontWeight="500" color={colors.textPrimary}>
              {title}
            </Text>
            {description && (
              <Text fontSize="$3" color={colors.textSecondary}>
                {description}
              </Text>
            )}
          </YStack>
        </XStack>
        {rightElement}
      </XStack>
      {showDivider && (
        <YStack
          height={1}
          backgroundColor="$gray5"
          marginLeft={icon ? 76 : 16}
        />
      )}
    </>
  );
}
