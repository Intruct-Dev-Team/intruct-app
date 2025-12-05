import { useThemeColors } from "@/hooks/use-theme-colors";
import { Card, XStack, YStack } from "tamagui";

export function UserProfileSkeleton() {
  const colors = useThemeColors();

  return (
    <Card
      backgroundColor={colors.cardBackground}
      borderRadius="$5"
      borderWidth={0}
      padding="$4"
    >
      <XStack gap="$3" alignItems="center" justifyContent="space-between">
        <XStack gap="$3" alignItems="center" flex={1}>
          {/* Avatar skeleton */}
          <YStack
            width={64}
            height={64}
            borderRadius="$10"
            backgroundColor="$gray4"
            opacity={0.6}
          />

          {/* Text skeleton */}
          <YStack flex={1} gap="$2">
            {/* Name skeleton */}
            <YStack
              height={16}
              borderRadius="$2"
              backgroundColor="$gray4"
              width="70%"
              opacity={0.6}
            />

            {/* Email skeleton */}
            <YStack
              height={14}
              borderRadius="$2"
              backgroundColor="$gray4"
              width="85%"
              opacity={0.6}
            />
          </YStack>
        </XStack>

        {/* Chevron skeleton */}
        <YStack
          width={20}
          height={20}
          borderRadius="$2"
          backgroundColor="$gray4"
          opacity={0.6}
        />
      </XStack>
    </Card>
  );
}
