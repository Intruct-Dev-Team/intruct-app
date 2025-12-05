import { useThemeColors } from "@/hooks/use-theme-colors";
import { Card, YStack } from "tamagui";

export function CourseCardSkeleton() {
  const colors = useThemeColors();

  return (
    <Card
      padding="$4"
      backgroundColor={colors.cardBackground}
      borderRadius="$4"
      borderWidth={0}
    >
      <YStack gap="$3">
        {/* Title skeleton */}
        <YStack
          height={20}
          borderRadius="$2"
          backgroundColor="$gray4"
          width="80%"
          opacity={0.6}
        />

        {/* Description skeleton (2 lines) */}
        <YStack gap="$2">
          <YStack
            height={14}
            borderRadius="$2"
            backgroundColor="$gray4"
            width="100%"
            opacity={0.6}
          />
          <YStack
            height={14}
            borderRadius="$2"
            backgroundColor="$gray4"
            width="85%"
            opacity={0.6}
          />
        </YStack>

        {/* Stats skeleton */}
        <YStack
          height={12}
          borderRadius="$2"
          backgroundColor="$gray4"
          width="60%"
          opacity={0.6}
          marginTop="$1"
        />

        {/* Progress bar skeleton */}
        <YStack
          height={6}
          borderRadius="$2"
          backgroundColor="$gray4"
          width="100%"
          opacity={0.6}
        />
      </YStack>
    </Card>
  );
}
