import { CourseCard, CourseCardSkeleton } from "@/components/cards";
import { PageHeader, ScreenContainer } from "@/components/layout";
import { useCourseGeneration } from "@/contexts/course-generation-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { coursesApi } from "@/services/api";
import type { Course } from "@/types";
import { Plus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, H2, Text, YStack } from "tamagui";

export default function CoursesScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { localCourses, openCreatingModal } = useCourseGeneration();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const createCourseFab = (
    <YStack position="absolute" right={16} bottom={16}>
      <Button
        width={56}
        height={56}
        borderRadius={16}
        padding={0}
        backgroundColor={colors.primary}
        icon={<Plus size={24} color={colors.primaryText} />}
        onPress={() => router.push("/create-course" as any)}
      />
    </YStack>
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const c = await coursesApi.getMyCourses();
      setCourses(c);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <YStack flex={1}>
        <ScreenContainer>
          <PageHeader
            title="Courses"
            subtitle="All courses you are currently taking"
          />
          <YStack gap="$3">
            <H2 fontSize="$7" fontWeight="700">
              My Courses
            </H2>
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </YStack>
        </ScreenContainer>
        {createCourseFab}
      </YStack>
    );
  }

  const allCourses = [...localCourses, ...courses];

  if (!allCourses || allCourses.length === 0) {
    return (
      <YStack flex={1}>
        <ScreenContainer>
          <PageHeader
            title="Courses"
            subtitle="Your enrolled courses will appear here"
          />
          <YStack gap="$3">
            <Text color="$color">You have no courses yet.</Text>
          </YStack>
        </ScreenContainer>
        {createCourseFab}
      </YStack>
    );
  }

  return (
    <YStack flex={1}>
      <ScreenContainer>
        <PageHeader
          title="My Courses"
          subtitle="All courses you are currently taking"
        />

        <YStack gap="$3">
          <H2 fontSize="$7" fontWeight="700">
            My Courses
          </H2>

          {allCourses.map((course) => {
            return (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description || ""}
                status={course.status}
                lessons={course.lessons}
                progress={course.progress}
                onPress={() =>
                  course.status === "generating"
                    ? openCreatingModal(course.id)
                    : router.push(`/course/${course.id}` as any)
                }
              />
            );
          })}
        </YStack>
      </ScreenContainer>
      {createCourseFab}
    </YStack>
  );
}
