import {
  useResolvedThemeColor,
  useThemeColors,
} from "@/hooks/use-theme-colors";
import { ChevronRight, Trash2 } from "@tamagui/lucide-icons";
import { Button, Card, Progress, Text, XStack, YStack } from "tamagui";

interface CourseCardProps {
  title: string;
  description: string;
  lessons?: number;
  progress?: number;
  status?: "generating" | "ready" | "failed";
  onPress?: () => void;
  onDelete?: () => void;
}

export function CourseCard({
  title,
  description,
  lessons,
  progress,
  status,
  onPress,
  onDelete,
}: CourseCardProps) {
  const colors = useThemeColors();
  const chevronColor = useResolvedThemeColor(colors.textTertiary);
  const trashColor = useResolvedThemeColor("$red9");

  const isGenerating = status === "generating";
  const isFailed = status === "failed";
  const isReady = !isGenerating && !isFailed;

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

  const isCompleted =
    !isGenerating &&
    !isFailed &&
    typeof lessons === "number" &&
    lessons > 0 &&
    typeof progress === "number" &&
    progress >= lessons;

  const progressIndicatorColor = isCompleted
    ? colors.stats.completed.icon
    : colors.primary;

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
      <XStack alignItems="stretch" gap="$3">
        <YStack flex={1} gap="$3">
          <YStack gap="$2">
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
          </YStack>

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
                    backgroundColor={progressIndicatorColor}
                  />
                </Progress>
              )}
            </>
          )}
        </YStack>

        {isReady && onPress && (
          <YStack
            width={44}
            flexShrink={0}
            alignSelf="stretch"
            justifyContent="center"
            alignItems="center"
            pointerEvents="none"
          >
            <ChevronRight size={18} color={chevronColor} />
          </YStack>
        )}

        {isFailed && onDelete && (
          <YStack
            width={44}
            flexShrink={0}
            alignSelf="stretch"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              chromeless
              padding={0}
              width={44}
              height={44}
              icon={<Trash2 size={18} color={trashColor} />}
              onPress={(event) => {
                (event as any)?.stopPropagation?.();
                onDelete();
              }}
            />
          </YStack>
        )}
      </XStack>
    </Card>
  );
}
