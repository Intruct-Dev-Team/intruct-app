import { X } from "@tamagui/lucide-icons";
import { Button, Text, XStack, YStack } from "tamagui";

import type {
  NotificationAction,
  NotificationType,
} from "@/contexts/NotificationsContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { t } from "@/localization/i18n";

type NotificationToastProps = {
  type: NotificationType;
  title?: string;
  message: string;
  action?: NotificationAction;
  dismissible?: boolean;
  onDismiss?: () => void;
};

function getTypeStyles(
  type: NotificationType,
  colors: ReturnType<typeof useThemeColors>,
) {
  switch (type) {
    case "success":
      return {
        backgroundColor: colors.stats.completed.background,
        borderColor: colors.stats.completed.icon,
        titleColor: colors.textPrimary,
        messageColor: colors.textSecondary,
        actionColor: colors.primary,
      };
    case "info":
      return {
        backgroundColor: "$blue2",
        borderColor: "$blue10",
        titleColor: colors.textPrimary,
        messageColor: colors.textSecondary,
        actionColor: colors.primary,
      };
    case "error":
      return {
        backgroundColor: "$red2",
        borderColor: "$red10",
        titleColor: colors.textPrimary,
        messageColor: colors.textSecondary,
        actionColor: colors.primary,
      };
    default: {
      const exhaustiveCheck: never = type;
      return exhaustiveCheck;
    }
  }
}

export function NotificationToast({
  type,
  title,
  message,
  action,
  dismissible = true,
  onDismiss,
}: NotificationToastProps) {
  const colors = useThemeColors();
  const styles = getTypeStyles(type, colors);

  return (
    <YStack
      backgroundColor={styles.backgroundColor}
      borderColor={styles.borderColor}
      borderWidth={1}
      borderRadius="$6"
      padding="$4"
      gap="$2"
      maxWidth={520}
      width="100%"
      alignSelf="center"
    >
      <XStack alignItems="center" justifyContent="space-between" gap="$3">
        <YStack flex={1} gap="$1">
          {title ? (
            <Text fontSize="$4" fontWeight="700" color={styles.titleColor}>
              {title}
            </Text>
          ) : null}
          <Text fontSize="$3" color={styles.messageColor}>
            {message}
          </Text>
        </YStack>

        {dismissible ? (
          <Button
            size="$2"
            circular
            chromeless
            icon={X}
            onPress={onDismiss}
            accessibilityLabel={t("Dismiss notification")}
            alignSelf="center"
          />
        ) : null}
      </XStack>

      {action ? (
        <XStack justifyContent="flex-start">
          <Button
            size="$3"
            chromeless
            onPress={action.onPress}
            accessibilityLabel={action.label}
            color={styles.actionColor}
          >
            {action.label}
          </Button>
        </XStack>
      ) : null}
    </YStack>
  );
}
