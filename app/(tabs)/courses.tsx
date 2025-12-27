import { CourseCard, CourseCardSkeleton } from "@/components/cards";
import { PageHeader, ScreenContainer } from "@/components/layout";
import { useCourseGeneration } from "@/contexts/course-generation-context";
import { coursesApi } from "@/services/api";
import type { Course } from "@/types";
import { useRouter } from "expo-router";
import { Plus } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { H2, Text, YStack } from "tamagui";

export default function CoursesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createdCourses, generatingCourses, openCreatingModal } =
    useCourseGeneration();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const createCourseFab = (
    <Pressable onPress={() => router.push("/create-course" as any)}>
      <YStack
        position="absolute"
        right={16}
        bottom={insets.bottom + 16}
        width={56}
        height={56}
        borderRadius={16}
        backgroundColor="$blue9"
        alignItems="center"
        justifyContent="center"
      >
        <Plus size={24} color="white" />
      </YStack>
    </Pressable>
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

  const allCourses = [...createdCourses, ...courses];

  if (
    (!allCourses || allCourses.length === 0) &&
    (!generatingCourses || generatingCourses.length === 0)
  ) {
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
      {createCourseFab}
    </YStack>
  );
}
