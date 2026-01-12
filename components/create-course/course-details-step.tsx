import { useThemeColors } from "@/hooks/use-theme-colors";
import { languageOptions } from "@/mockdata/settings";
import { ChevronRight } from "@tamagui/lucide-icons";
import { Button, Input, Text, TextArea, XStack, YStack } from "tamagui";

interface CourseDetailsStepProps {
  title: string;
  description: string;
  contentLanguage: string;
  onLanguagePress: () => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function CourseDetailsStep({
  title,
  description,
  contentLanguage,
  onLanguagePress,
  onTitleChange,
  onDescriptionChange,
}: CourseDetailsStepProps) {
  const colors = useThemeColors();
  const selectedLanguage =
    languageOptions.find((l) => l.code === contentLanguage) ||
    languageOptions[0];

  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <Text fontSize="$7" fontWeight="700" color={colors.textPrimary}>
          Course Details
        </Text>
        <Text fontSize="$4" color={colors.textSecondary}>
          Give your course a name and description
        </Text>
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
          Course Title
        </Text>
        <Input
          size="$4"
          placeholder="e.g. Introduction to Machine Learning"
          value={title}
          onChangeText={onTitleChange}
          backgroundColor={colors.cardBackground}
        />
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
          Description
        </Text>
        <TextArea
          size="$4"
          placeholder="Describe what students will learn in this course..."
          value={description}
          onChangeText={onDescriptionChange}
          backgroundColor={colors.cardBackground}
          height={150}
          flexGrow={0}
          flexShrink={0}
          verticalAlign="top"
          textAlignVertical="top"
        />
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
          Content Language
        </Text>
        <Button
          size="$4"
          onPress={onLanguagePress}
          backgroundColor={colors.cardBackground}
          borderWidth={1}
          borderColor="$gray7"
        >
          <XStack flex={1} alignItems="center" justifyContent="space-between">
            <XStack gap="$2" alignItems="center">
              <Text fontSize="$6">{selectedLanguage.flag}</Text>
              <Text fontSize="$4" color={colors.textPrimary}>
                {selectedLanguage.label}
              </Text>
            </XStack>
            <ChevronRight size={18} color={colors.textTertiary} />
          </XStack>
        </Button>
      </YStack>
    </YStack>
  );
}
