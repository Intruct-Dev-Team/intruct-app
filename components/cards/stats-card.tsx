import { useThemeColors } from "@/hooks/use-theme-colors";
import { ComponentType } from "react";
import { Card, Text, View, YStack } from "tamagui";

interface StatsCardProps {
  icon: ComponentType<{ size?: number; color?: string }>;
  type: "completed" | "inProgress" | "streak";
  value: number | string;
  label: string;
  isActive?: boolean; // Optional: for streak to indicate if active/inactive
}

export function StatsCard({
  icon: Icon,
  type,
  value,
  label,
  isActive,
}: StatsCardProps) {
  const colors = useThemeColors();
  const stat = colors.stats[type];

  // For streak, use gray if not active, otherwise use the default color
  const iconColor =
    type === "streak" && isActive === false ? "$gray9" : stat.icon;
  const backgroundColor =
    type === "streak" && isActive === false ? "$gray2" : stat.background;

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
          backgroundColor={backgroundColor}
          padding="$2.5"
          borderRadius="$3"
          width={44}
          height={44}
          alignItems="center"
          justifyContent="center"
        >
          <Icon size={20} color={iconColor} />
        </View>
        <Text fontSize="$9" fontWeight="700" color={colors.textPrimary}>
          {value}
        </Text>
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
