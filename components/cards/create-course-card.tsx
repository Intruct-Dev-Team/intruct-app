import { useThemeColors } from "@/hooks/use-theme-colors";
import { Plus } from "@tamagui/lucide-icons";
import { Button, Card, Text, YStack } from "tamagui";

interface CreateCourseCardProps {
  onPress?: () => void;
}

export function CreateCourseCard({ onPress }: CreateCourseCardProps) {
  const colors = useThemeColors();

  return (
    <Card
      padding="$5"
      backgroundColor={colors.primary}
      borderRadius="$5"
      borderWidth={0}
      marginTop="$2"
    >
      <YStack gap="$3.5">
        <Text
          color={colors.primaryText}
          fontSize="$7"
          fontWeight="600"
          letterSpacing={-0.3}
        >
          Create with AI
        </Text>
        <Text
          color={colors.primaryText}
          fontSize="$4"
          opacity={0.95}
          lineHeight="$2"
        >
          Attach materials to create a new course
        </Text>
        <Button
          backgroundColor={colors.cardBackground}
          color={colors.primary}
          borderRadius="$4"
          fontWeight="600"
          fontSize="$4"
          height={48}
          pressStyle={{
            opacity: 0.9,
            scale: 0.98,
          }}
          icon={<Plus size={20} />}
          onPress={onPress}
        >
          Create Course
        </Button>
      </YStack>
    </Card>
  );
}
