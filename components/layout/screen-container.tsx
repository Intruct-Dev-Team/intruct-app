import { useThemeColors } from "@/hooks/use-theme-colors";
import { ReactNode } from "react";
import { RefreshControl } from "react-native";
import { ScrollView, YStack } from "tamagui";

interface ScreenContainerProps {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function ScreenContainer({
  children,
  refreshing,
  onRefresh,
}: ScreenContainerProps) {
  const colors = useThemeColors();

  return (
    <ScrollView
      backgroundColor={colors.background}
      flex={1}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={Boolean(refreshing)}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    >
      <YStack padding="$4" paddingTop="$6" gap="$4" paddingBottom="$8">
        {children}
      </YStack>
    </ScrollView>
  );
}
