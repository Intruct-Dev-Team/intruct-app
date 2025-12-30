import { useThemeColors } from "@/hooks/use-theme-colors";
import { languageOptions } from "@/mockdata/settings";
import { Globe, Lightbulb, Paperclip } from "@tamagui/lucide-icons";
import { Card, Text, XStack, YStack } from "tamagui";

interface ReviewStepProps {
  title: string;
  description: string;
  filesCount: number;
  contentLanguage: string;
}

export function ReviewStep({
  title,
  description,
  filesCount,
  contentLanguage,
}: ReviewStepProps) {
  const colors = useThemeColors();
  const selectedLanguage =
    languageOptions.find((l) => l.code === contentLanguage) ||
    languageOptions[0];

  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <Text fontSize="$7" fontWeight="700" color={colors.textPrimary}>
          Review & Create
        </Text>
        <Text fontSize="$4" color={colors.textSecondary}>
          Review your course details before creating
        </Text>
      </YStack>

      <Card
        padding="$4"
        backgroundColor={colors.cardBackground}
        borderRadius="$4"
        borderWidth={0}
      >
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
            {title || "name"}
          </Text>
          <Text fontSize="$4" color={colors.textSecondary}>
            {description || "course description"}
          </Text>
          <XStack gap="$4" marginTop="$2">
            <XStack gap="$2" alignItems="center">
              <Paperclip size={16} color={colors.textTertiary} />
              <Text fontSize="$3" color={colors.textTertiary}>
                {filesCount} files attached
              </Text>
            </XStack>
            <XStack gap="$2" alignItems="center">
              <Globe size={16} color={colors.textTertiary} />
              <Text fontSize="$3" color={colors.textTertiary}>
                {selectedLanguage.label}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </Card>

      <Card
        padding="$4"
        backgroundColor="$blue2"
        borderRadius="$4"
        borderWidth={0}
      >
        <XStack gap="$3" alignItems="flex-start">
          <Lightbulb size={20} color="$blue10" />
          <Text fontSize="$3" color="$blue11" lineHeight="$2">
            Our AI will analyze your materials and create a structured course
            with lessons, tests, and flashcards. This usually takes a couple of
            minutes.
          </Text>
        </XStack>
      </Card>
    </YStack>
  );
}
