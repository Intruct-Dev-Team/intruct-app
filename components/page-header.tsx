import { useThemeColors } from "@/hooks/use-theme-colors";
import { H2, Text, YStack } from "tamagui";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const colors = useThemeColors();

  return (
    <YStack gap="$2" marginBottom="$2">
      <H2 fontSize="$9" fontWeight="700" color={colors.textPrimary}>
        {title}
      </H2>
      {subtitle && (
        <Text color={colors.textSecondary} fontSize="$4" fontWeight="400">
          {subtitle}
        </Text>
      )}
    </YStack>
  );
}
