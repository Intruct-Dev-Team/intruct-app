import { useThemeColors } from "@/hooks/use-theme-colors";
import { Course } from "@/types";
import { BookOpen, Star, Users } from "@tamagui/lucide-icons";
import { Button, Card, Text, XStack, YStack } from "tamagui";

interface CatalogCourseCardProps {
  course: Course;
  onEnroll?: () => void;
}

export function CatalogCourseCard({
  course,
  onEnroll,
}: CatalogCourseCardProps) {
  const colors = useThemeColors();

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
    >
      <YStack gap="$3">
        <Text
          fontSize="$6"
          fontWeight="600"
          color={colors.textPrimary}
          letterSpacing={-0.2}
        >
          {course.title}
        </Text>

        <Text color={colors.textSecondary} fontSize="$3" lineHeight="$2">
          {course.description}
        </Text>

        {course.author && (
          <XStack gap="$2" alignItems="center">
            <YStack
              width={24}
              height={24}
              alignItems="center"
              justifyContent="center"
              backgroundColor={colors.primary}
              borderRadius="$10"
            >
              <Text fontSize="$2" fontWeight="600" color="white">
                {course.author.charAt(0)}
              </Text>
            </YStack>
            <Text fontSize="$2" color={colors.textTertiary}>
              by {course.author}
            </Text>
          </XStack>
        )}

        <XStack gap="$4" alignItems="center">
          {course.rating && (
            <XStack gap="$1" alignItems="center">
              <Star size={14} color="#FF9800" fill="#FF9800" />
              <Text fontSize="$2" fontWeight="600" color={colors.textPrimary}>
                {course.rating}
              </Text>
            </XStack>
          )}

          {course.students && (
            <XStack gap="$1" alignItems="center">
              <Users size={14} color={colors.textTertiary} />
              <Text fontSize="$2" color={colors.textTertiary}>
                {course.students.toLocaleString()}
              </Text>
            </XStack>
          )}

          <XStack gap="$1" alignItems="center">
            <BookOpen size={14} color={colors.textTertiary} />
            <Text fontSize="$2" color={colors.textTertiary}>
              {course.lessons} lessons
            </Text>
          </XStack>
        </XStack>

        <Button
          backgroundColor={colors.primary}
          color="white"
          borderRadius="$3"
          fontWeight="600"
          fontSize="$4"
          height={44}
          marginTop="$2"
          pressStyle={{
            opacity: 0.9,
            scale: 0.98,
          }}
          onPress={onEnroll}
        >
          Enroll Now
        </Button>
      </YStack>
    </Card>
  );
}
