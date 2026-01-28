import { useThemeColors } from "@/hooks/use-theme-colors";
import { Course } from "@/types";
import { normalizeAvatarUri } from "@/utils/avatar";
import { BookOpen, Star, Users } from "@tamagui/lucide-icons";
import { Avatar, Button, Card, Text, XStack, YStack } from "tamagui";

interface CatalogCourseCardProps {
  course: Course;
  onEnroll?: () => void;
}

export function CatalogCourseCard({
  course,
  onEnroll,
}: CatalogCourseCardProps) {
  const colors = useThemeColors();

  const authorName = course.author?.trim();
  const authorAvatarSrc = normalizeAvatarUri(
    course.authorAvatarUrl || undefined,
  );

  const ratingValue =
    typeof course.rating === "number" && Number.isFinite(course.rating)
      ? course.rating
      : null;
  const studentsValue =
    typeof course.students === "number" && Number.isFinite(course.students)
      ? course.students
      : null;

  const formattedRating =
    ratingValue === null
      ? null
      : Number.isInteger(ratingValue)
        ? String(ratingValue)
        : ratingValue.toFixed(1);

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

        {authorName ? (
          <XStack gap="$2" alignItems="center">
            <Avatar circular size={24}>
              <Avatar.Image
                src={authorAvatarSrc}
                source={authorAvatarSrc ? { uri: authorAvatarSrc } : undefined}
              />
              <Avatar.Fallback
                backgroundColor={colors.primary}
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="$2" fontWeight="600" color={colors.primaryText}>
                  {authorName.charAt(0)}
                </Text>
              </Avatar.Fallback>
            </Avatar>
            <Text fontSize="$2" color={colors.textTertiary}>
              by {authorName}
            </Text>
          </XStack>
        ) : null}

        <XStack gap="$4" alignItems="center">
          {ratingValue !== null ? (
            <XStack gap="$1" alignItems="center">
              <Star size={14} color="#FF9800" fill="#FF9800" />
              <Text fontSize="$2" fontWeight="600" color={colors.textPrimary}>
                {formattedRating}
              </Text>
            </XStack>
          ) : null}

          {studentsValue !== null ? (
            <XStack gap="$1" alignItems="center">
              <Users size={14} color={colors.textTertiary} />
              <Text fontSize="$2" color={colors.textTertiary}>
                {studentsValue.toLocaleString()}
              </Text>
            </XStack>
          ) : null}

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
          Start Course
        </Button>
      </YStack>
    </Card>
  );
}
