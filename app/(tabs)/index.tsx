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
import { ApiError, coursesApi, lessonProgressApi } from "@/services/api";
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
  const [refreshing, setRefreshing] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const courseCreatedAtValue = (course: Course): number => {
    const raw = course.createdAt;
    const value = typeof raw === "string" ? Date.parse(raw) : NaN;
    return Number.isFinite(value) ? value : 0;
  };

  const loadData = useCallback(
    async (opts?: { showLoading?: boolean }) => {
      const showLoading = opts?.showLoading ?? true;

      if (showLoading) setLoading(true);
      setCoursesError(null);
      try {
        const token = session?.access_token;
        if (!token) {
          setCourses([]);
          return;
        }

        const coursesData = await coursesApi.getMyCourses(token);
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to load courses:", error);
        if (error instanceof ApiError) {
          setCoursesError(error.message);
        } else {
          setCoursesError("Failed to load courses.");
        }
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [session?.access_token],
  );

  useEffect(() => {
    void loadData({ showLoading: true });
  }, [loadData]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadData({ showLoading: false });
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      // Keep progress fresh without refetching network data on tab switches.
      let isActive = true;

      const syncLocalProgress = async () => {
        if (!courses || courses.length === 0) return;

        const getCourseKey = (course: Course): string => {
          return course.backendId
            ? `backend:${course.backendId}`
            : `id:${course.id}`;
        };

        const updated = await Promise.all(
          courses.map(async (course) => {
            const backendProgress = course.progress ?? 0;
            const localProgress = await lessonProgressApi.getCompletedCount(
              getCourseKey(course),
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

  const coursesToShow = useMemo(() => {
    const sorted = [...courses].sort((a, b) => {
      return courseCreatedAtValue(b) - courseCreatedAtValue(a);
    });

    return sorted.slice(0, 4);
  }, [courses]);

  if (loading || !profile) {
    return (
      <ScreenContainer refreshing={refreshing} onRefresh={handleRefresh}>
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
    <ScreenContainer refreshing={refreshing} onRefresh={handleRefresh}>
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
          value={profile.streak}
          label="Day Streak"
          isActive={profile.isStreakActiveToday}
        />
      </XStack>

      <CreateCourseCard onPress={() => router.push("/create-course")} />

      <YStack gap="$3.5" marginTop="$3">
        <H2 fontSize="$7" fontWeight="700" color={colors.textPrimary}>
          Recent courses
        </H2>

        {coursesError ? (
          <YStack padding="$4" backgroundColor={colors.cardBackground}>
            <H2 fontSize="$5" fontWeight="600" color={colors.textPrimary}>
              Couldn’t load courses
            </H2>
            <YStack marginTop="$2">
              <H2 fontSize="$3" fontWeight="400" color={colors.textSecondary}>
                {coursesError}
              </H2>
            </YStack>
          </YStack>
        ) : coursesToShow.length === 0 ? (
          <YStack padding="$4" backgroundColor={colors.cardBackground}>
            <H2 fontSize="$5" fontWeight="600" color={colors.textPrimary}>
              No courses yet
            </H2>
            <YStack marginTop="$2">
              <H2 fontSize="$3" fontWeight="400" color={colors.textSecondary}>
                Create a course to get started.
              </H2>
            </YStack>
          </YStack>
        ) : (
          coursesToShow.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              status={course.status}
              lessons={course.lessons}
              progress={course.progress}
              onPress={() =>
                course.status === "generating" || course.status === "failed"
                  ? openCreatingModal(course.id, course)
                  : router.push(`/course/${course.id}` as any)
              }
            />
          ))
        )}
      </YStack>
    </ScreenContainer>
  );
}
