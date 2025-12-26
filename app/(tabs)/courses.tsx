import { CourseCard, CourseCardSkeleton } from "@/components/cards";
import { PageHeader, ScreenContainer } from "@/components/layout";
import { useCourseGeneration } from "@/contexts/course-generation-context";
import { coursesApi } from "@/services/api";
import type { Course } from "@/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { H2, Text, YStack } from "tamagui";

export default function CoursesScreen() {
  const router = useRouter();
  const { createdCourses, generatingCourses, openCreatingModal } =
    useCourseGeneration();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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
    );
  }

  const allCourses = [...createdCourses, ...courses];

  if (
    (!allCourses || allCourses.length === 0) &&
    (!generatingCourses || generatingCourses.length === 0)
  ) {
    return (
      <ScreenContainer>
        <PageHeader
          title="Courses"
          subtitle="Your enrolled courses will appear here"
        />
        <YStack gap="$3">
          <Text color="$color">You have no courses yet.</Text>
        </YStack>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <PageHeader
        title="My Courses"
        subtitle="All courses you are currently taking"
      />

      <YStack gap="$3">
        <H2 fontSize="$7" fontWeight="700">
          My Courses
        </H2>

        {generatingCourses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            description="Generating course..."
            progress={Math.round(course.progress)}
            onPress={() => openCreatingModal(course.id)}
          />
        ))}

        {allCourses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            lessons={course.lessons}
            progress={course.progress}
            onPress={() => router.push(`/course/${course.id}` as any)}
          />
        ))}
      </YStack>
    </ScreenContainer>
  );
}
