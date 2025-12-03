import { useThemeColors } from "@/hooks/use-theme-colors";
import { ReactNode } from "react";
import { ScrollView, YStack } from "tamagui";

interface ScreenContainerProps {
  children: ReactNode;
}

export function ScreenContainer({ children }: ScreenContainerProps) {
  const colors = useThemeColors();

  return (
    <ScrollView backgroundColor={colors.background} flex={1}>
      <YStack padding="$4" paddingTop="$6" gap="$4" paddingBottom="$8">
        {children}
      </YStack>
    </ScrollView>
  );
}
