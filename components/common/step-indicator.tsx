import { useThemeColors } from "@/hooks/use-theme-colors";
import { Text, XStack, YStack } from "tamagui";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const colors = useThemeColors();

  return (
    <YStack gap="$2">
      <XStack gap="$2">
        {Array.from({ length: totalSteps }).map((_: unknown, index: number) => (
          <YStack
            key={index}
            flex={1}
            height={4}
            backgroundColor={index < currentStep ? colors.primary : "$gray5"}
            borderRadius="$2"
          />
        ))}
      </XStack>
      <Text fontSize="$3" color={colors.textSecondary}>
        Step {currentStep} of {totalSteps}
      </Text>
    </YStack>
  );
}
