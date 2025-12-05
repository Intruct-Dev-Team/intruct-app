import { useThemeColors } from "@/hooks/use-theme-colors";
import { Card, YStack } from "tamagui";

export function CatalogCourseCardSkeleton() {
  const colors = useThemeColors();

  return (
    <Card
      padding="$4"
      backgroundColor={colors.cardBackground}
      borderRadius="$4"
      borderWidth={0}
    >
      <YStack gap="$2">
        {/* Title skeleton */}
        <YStack
          height={18}
          borderRadius="$2"
          backgroundColor="$gray4"
          width="75%"
          opacity={0.6}
        />

        {/* Description skeleton (1 line) */}
        <YStack
          height={13}
          borderRadius="$2"
          backgroundColor="$gray4"
          width="90%"
          opacity={0.6}
        />

        {/* Author and stats skeleton */}
        <YStack
          height={12}
          borderRadius="$2"
          backgroundColor="$gray4"
          width="70%"
          opacity={0.6}
          marginTop="$1"
        />
      </YStack>
    </Card>
  );
}
