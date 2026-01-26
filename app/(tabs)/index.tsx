import {
  CourseCard,
  CourseCardSkeleton,
  CreateCourseCard,
  StatsCard,
  StatsCardSkeleton,
} from "@/components/cards";
import { PageHeader, ScreenContainer } from "@/components/layout";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseGeneration } from "@/contexts/course-generation-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { coursesApi, lessonProgressApi } from "@/services/api";
import type { Course } from "@/types";
import { useFocusEffect } from "@react-navigation/native";
import { Clock, Flame, TrendingUp } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { H2, XStack, YStack } from "tamagui";

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { profile, session } = useAuth();
  const { openCreatingModal } = useCourseGeneration();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const coursesData = await coursesApi.getMyCourses(session?.access_token);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to load courses:", error);
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

  const coursesToShow = useMemo(() => courses.slice(0, 4), [courses]);

  if (loading || !profile) {
    return (
      <ScreenContainer>
        <PageHeader
          title="Welcome back!"
          subtitle="Continue your learning journey"
        />

        <XStack gap="$3" justifyContent="space-between">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </XStack>

        <CreateCourseCard onPress={() => router.push("/create-course")} />

        <YStack gap="$3.5" marginTop="$3">
          <H2 fontSize="$7" fontWeight="700" color={colors.textPrimary}>
            My Courses
          </H2>
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </YStack>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <PageHeader
        title="Welcome back!"
        subtitle="Continue your learning journey"
      />

      <XStack gap="$3" justifyContent="space-between">
        <StatsCard
          icon={TrendingUp}
          type="completed"
          value={profile.completedCourses}
          label="Completed"
        />
        <StatsCard
          icon={Clock}
          type="inProgress"
          value={profile.inProgressCourses}
          label="Courses in Progress"
        />
        <StatsCard
          icon={Flame}
          type="streak"
          value={"null"}
          label="Day Streak"
        />
      </XStack>

      <CreateCourseCard onPress={() => router.push("/create-course")} />

      <YStack gap="$3.5" marginTop="$3">
        <H2 fontSize="$7" fontWeight="700" color={colors.textPrimary}>
          My Courses
        </H2>

        {coursesToShow.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            status={course.status}
            lessons={course.lessons}
            progress={course.progress}
            onPress={() =>
              course.status === "generating" || course.status === "failed"
                ? openCreatingModal(course.id)
                : router.push(`/course/${course.id}` as any)
            }
          />
        ))}
      </YStack>
    </ScreenContainer>
  );
}
