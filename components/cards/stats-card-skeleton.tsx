import { useThemeColors } from "@/hooks/use-theme-colors";
import { ComponentType } from "react";
import { Card, Text, View, YStack } from "tamagui";

interface StatsCardSkeletonProps {
  icon?: ComponentType<{ size?: number; color?: string }>;
  type?: "completed" | "inProgress" | "streak";
  label?: string;
}

// Skeleton should only replace the numeric value. Icon and label are rendered
// statically to match `StatsCard` appearance.
const DefaultIcon: ComponentType<{ size?: number; color?: string }> = ({
  size = 20,
}) => <View width={size} height={size} />;

export function StatsCardSkeleton({
  icon: Icon = DefaultIcon,
  type = "completed",
  label = "",
}: StatsCardSkeletonProps) {
  const colors = useThemeColors();
  const stat =
    colors.stats[type as "completed" | "inProgress" | "streak"] ||
    colors.stats.completed;

  return (
    <Card
      flex={1}
      padding="$3.5"
      backgroundColor={colors.cardBackground}
      borderRadius="$4"
      borderWidth={0}
    >
      <YStack gap="$2.5" alignItems="flex-start">
        <View
          backgroundColor={stat.background}
          padding="$2.5"
          borderRadius="$3"
          width={44}
          height={44}
          alignItems="center"
          justifyContent="center"
        >
          <Icon size={20} color={stat.icon} />
        </View>

        {/* Only the numeric value is a skeleton */}
        <YStack
          height={28}
          borderRadius="$2"
          backgroundColor="$gray4"
          width="60%"
          opacity={0.6}
        />

        {/* Label remains static */}
        <Text
          color={colors.textTertiary}
          fontSize="$2"
          fontWeight="500"
          numberOfLines={2}
        >
          {label}
        </Text>
      </YStack>
    </Card>
  );
}
