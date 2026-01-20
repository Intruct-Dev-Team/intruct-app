import {
  CourseCard,
  CourseCardSkeleton,
  CreateCourseCard,
  StatsCard,
  StatsCardSkeleton,
} from "@/components/cards";
import { PageHeader, ScreenContainer } from "@/components/layout";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { coursesApi } from "@/services/api";
import type { Course } from "@/types";
import { Clock, Flame, TrendingUp } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { H2, XStack, YStack } from "tamagui";

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const coursesData = await coursesApi.getMyCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <StatsCard icon={Flame} type="streak" value={null} label="Day Streak" />
      </XStack>

      <CreateCourseCard onPress={() => router.push("/create-course")} />

      <YStack gap="$3.5" marginTop="$3">
        <H2 fontSize="$7" fontWeight="700" color={colors.textPrimary}>
          My Courses
        </H2>

        {courses.map((course) => (
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
