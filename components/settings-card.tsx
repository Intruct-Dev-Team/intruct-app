import { useThemeColors } from "@/hooks/use-theme-colors";
import { ReactNode } from "react";
import { Card, YStack } from "tamagui";

interface SettingsCardProps {
  children: ReactNode;
}

export function SettingsCard({ children }: SettingsCardProps) {
  const colors = useThemeColors();

  return (
    <Card
      backgroundColor={colors.cardBackground}
      borderRadius="$5"
      borderWidth={0}
      overflow="hidden"
    >
      <YStack>{children}</YStack>
    </Card>
  );
}
