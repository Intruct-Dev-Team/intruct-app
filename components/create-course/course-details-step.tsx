import { useThemeColors } from "@/hooks/use-theme-colors";
import { Input, Text, TextArea, YStack } from "tamagui";

interface CourseDetailsStepProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function CourseDetailsStep({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: CourseDetailsStepProps) {
  const colors = useThemeColors();

  return (
    <YStack gap="$4" flex={1}>
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
          placeholder="e.g., Introduction to Machine Learning"
          value={title}
          onChangeText={onTitleChange}
          backgroundColor={colors.cardBackground}
        />
      </YStack>

      <YStack gap="$3" flex={1}>
        <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
          Description
        </Text>
        <TextArea
          size="$4"
          placeholder="Describe what students will learn in this course..."
          value={description}
          onChangeText={onDescriptionChange}
          backgroundColor={colors.cardBackground}
          flex={1}
          minHeight={150}
          verticalAlign="top"
          textAlignVertical="top"
        />
      </YStack>
    </YStack>
  );
}
