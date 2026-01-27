import { CourseCard, CourseCardSkeleton } from "@/components/cards";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseGeneration } from "@/contexts/course-generation-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { coursesApi, lessonProgressApi } from "@/services/api";
import type { Course } from "@/types";
import { useFocusEffect } from "@react-navigation/native";
import { Plus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, H1, ScrollView, Text, YStack } from "tamagui";

export default function CoursesScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { session } = useAuth();
  const { localCourses, openCreatingModal } = useCourseGeneration();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const courseCreatedAtValue = (course: Course): number => {
    const raw = course.createdAt;
    const value = typeof raw === "string" ? Date.parse(raw) : NaN;
    return Number.isFinite(value) ? value : 0;
  };

  const header = (
    <YStack backgroundColor={colors.cardBackground}>
      <YStack padding="$4" paddingTop="$6" gap="$1">
        <H1 fontSize="$9" fontWeight="700" color={colors.textPrimary}>
          My Courses
        </H1>
        <Text color={colors.textSecondary} fontSize="$4" fontWeight="400">
          All courses you are currently taking
        </Text>
      </YStack>
    </YStack>
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const token = session?.access_token;
      if (!token) {
        setCourses([]);
        return;
      }

      const c = await coursesApi.getMyCourses(token);
      setCourses(c);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      // Keep progress fresh without refetching network data on tab switches.
      let isActive = true;

      const syncLocalProgress = async () => {
        if (!courses || courses.length === 0) return;

        const updated = await Promise.all(
          courses.map(async (course) => {
            const backendProgress = course.progress ?? 0;
            const localProgress = await lessonProgressApi.getCompletedCount(
              course.id,
            );
            const effectiveProgress = Math.max(backendProgress, localProgress);

            if (effectiveProgress === backendProgress) return course;
            return { ...course, progress: effectiveProgress };
          }),
        );

        if (isActive) setCourses(updated);
      };

      void syncLocalProgress();
      return () => {
        isActive = false;
      };
    }, [courses]),
  );

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

  if (loading) {
    return (
      <YStack flex={1}>
        {header}
        <ScrollView backgroundColor={colors.background} flex={1}>
          <YStack padding="$4" gap="$4" paddingBottom="$8">
            <YStack gap="$3">
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </YStack>
          </YStack>
        </ScrollView>
        {createCourseFab}
      </YStack>
    );
  }

  const localBackendIds = new Set(
    localCourses
      .map((c) => c.backendId)
      .filter((id): id is number => typeof id === "number"),
  );

  // When a course is being generated we create a local placeholder.
  // The backend may also return the same course immediately (often with 0 lessons).
  // Prefer the local placeholder entry and hide the duplicate backend entry.
  const allCourses = [
    ...localCourses,
    ...courses.filter((c) => {
      const id = c.backendId;
      return !(typeof id === "number" && localBackendIds.has(id));
    }),
  ].sort((a, b) => {
    return courseCreatedAtValue(b) - courseCreatedAtValue(a);
  });

  if (!allCourses || allCourses.length === 0) {
    return (
      <YStack flex={1}>
        <YStack backgroundColor={colors.cardBackground}>
          <YStack padding="$4" paddingTop="$6" gap="$1">
            <H1 fontSize="$9" fontWeight="700" color={colors.textPrimary}>
              My Courses
            </H1>
            <Text color={colors.textSecondary} fontSize="$4" fontWeight="400">
              Your enrolled courses will appear here
            </Text>
          </YStack>
        </YStack>
        <ScrollView backgroundColor={colors.background} flex={1}>
          <YStack padding="$4" gap="$4" paddingBottom="$8">
            <YStack gap="$3">
              <Text color="$color">You have no courses yet.</Text>
            </YStack>
          </YStack>
        </ScrollView>
        {createCourseFab}
      </YStack>
    );
  }

  return (
    <YStack flex={1}>
      {header}
      <ScrollView backgroundColor={colors.background} flex={1}>
        <YStack padding="$4" gap="$4" paddingBottom="$8">
          <YStack gap="$3">
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
                    course.status === "generating" || course.status === "failed"
                      ? openCreatingModal(course.id)
                      : router.push(`/course/${course.id}` as any)
                  }
                />
              );
            })}
          </YStack>
        </YStack>
      </ScrollView>
      {createCourseFab}
    </YStack>
  );
}
