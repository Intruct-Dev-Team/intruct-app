import { useThemeColors } from "@/hooks/use-theme-colors";
import { Card, Progress, Text, XStack, YStack } from "tamagui";

interface CourseCardProps {
  title: string;
  description: string;
  lessons?: number;
  progress?: number;
  status?: "generating" | "ready" | "failed";
  onPress?: () => void;
}

export function CourseCard({
  title,
  description,
  lessons,
  progress,
  status,
  onPress,
}: CourseCardProps) {
  const colors = useThemeColors();

  const isGenerating = status === "generating";
  const isFailed = status === "failed";

  // `progress` represents number of completed lessons. Compute percent
  // for UI elements that expect percentage (0-100).
  const percentComplete =
    progress !== undefined && lessons !== undefined && lessons > 0
      ? Math.round((progress / lessons) * 100)
      : progress;

  const shouldShowProgress =
    !isGenerating &&
    !isFailed &&
    (lessons !== undefined || progress !== undefined);

  return (
    <Card
      padding="$4"
      backgroundColor={colors.cardBackground}
      borderRadius="$4"
      borderWidth={0}
      pressStyle={{
        scale: 0.98,
        opacity: 0.95,
      }}
      onPress={onPress}
    >
      <YStack gap="$3">
        <Text
          fontSize="$6"
          fontWeight="600"
          color={colors.textPrimary}
          letterSpacing={-0.2}
        >
          {title}
        </Text>
        <Text color={colors.textSecondary} fontSize="$3" lineHeight="$2">
          {description}
        </Text>

        {isGenerating ? (
          <XStack gap="$2" alignItems="center" marginTop="$1">
            <Text color={colors.textTertiary} fontSize="$2" fontWeight="600">
              Generating
            </Text>
          </XStack>
        ) : isFailed ? (
          <XStack gap="$2" alignItems="center" marginTop="$1">
            <Text color={colors.textTertiary} fontSize="$2" fontWeight="600">
              Creation failed
            </Text>
          </XStack>
        ) : null}

        {shouldShowProgress && (
          <>
            <XStack gap="$2" alignItems="center" marginTop="$1">
              {lessons !== undefined && (
                <>
                  <Text
                    color={colors.textTertiary}
                    fontSize="$2"
                    fontWeight="500"
                  >
                    {lessons} lessons
                  </Text>
                  {progress !== undefined && (
                    <Text color={colors.textTertiary} fontSize="$2">
                      •
                    </Text>
                  )}
                </>
              )}
              {progress !== undefined && (
                <Text
                  color={colors.textTertiary}
                  fontSize="$2"
                  fontWeight="500"
                >
                  {percentComplete}% complete
                </Text>
              )}
            </XStack>

            {progress !== undefined && (
              <Progress
                value={
                  typeof percentComplete === "number" ? percentComplete : 0
                }
                backgroundColor="$gray5"
                height={6}
                borderRadius="$2"
              >
                <Progress.Indicator
                  animation="bouncy"
                  backgroundColor={colors.primary}
                />
              </Progress>
            )}
          </>
        )}
      </YStack>
    </Card>
  );
}
