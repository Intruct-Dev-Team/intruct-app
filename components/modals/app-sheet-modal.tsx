import { useThemeColors } from "@/hooks/use-theme-colors";
import { X } from "@tamagui/lucide-icons";
import type { ReactNode } from "react";
import { Button, Sheet, Text, XStack, YStack } from "tamagui";

type AppSheetModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snapPoints: number[];

  title?: ReactNode;
  headerRight?: ReactNode;

  children: ReactNode;
};

export function AppSheetModal({
  open,
  onOpenChange,
  snapPoints,
  title,
  headerRight,
  children,
}: AppSheetModalProps) {
  const colors = useThemeColors();

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      modal
      snapPoints={snapPoints}
      dismissOnSnapToBottom
      dismissOnOverlayPress
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

      <Sheet.Frame
        backgroundColor={colors.background}
        padding="$4"
        paddingBottom="$6"
        gap="$4"
      >
        <Sheet.Handle />

        {title ? (
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$7" fontWeight="700" color={colors.textPrimary}>
              {title}
            </Text>

            {headerRight ?? (
              <YStack
                width={32}
                height={32}
                alignItems="center"
                justifyContent="center"
                backgroundColor="$gray4"
                borderRadius="$3"
                pressStyle={{ opacity: 0.7 }}
                onPress={() => onOpenChange(false)}
              >
                <X size={20} color={colors.textSecondary} />
              </YStack>
            )}
          </XStack>
        ) : headerRight ? (
          <XStack justifyContent="flex-end">{headerRight}</XStack>
        ) : (
          <XStack justifyContent="flex-end">
            <Button
              size="$3"
              chromeless
              icon={<X size={20} color={colors.textSecondary} />}
              onPress={() => onOpenChange(false)}
            />
          </XStack>
        )}

        {children}
      </Sheet.Frame>
    </Sheet>
  );
}
