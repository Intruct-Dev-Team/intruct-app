import { CourseCard } from "@/components/course-card";
import { CreateCourseCard } from "@/components/create-course-card";
import { PageHeader } from "@/components/page-header";
import { ScreenContainer } from "@/components/screen-container";
import { StatsCard } from "@/components/stats-card";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { coursesApi, userApi } from "@/services/api";
import type { Course, UserStats } from "@/types";
import { Clock, Flame, TrendingUp } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { H2, Text, XStack, YStack } from "tamagui";

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, coursesData] = await Promise.all([
        userApi.getUserStats(),
        coursesApi.getMyCourses(),
      ]);
      setStats(statsData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <ScreenContainer>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Text color={colors.textSecondary}>Loading...</Text>
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
          value={stats.completed}
          label="Completed"
        />
        <StatsCard
          icon={Clock}
          type="inProgress"
          value={stats.inProgress}
          label="Courses in Progress"
        />
        <StatsCard
          icon={Flame}
          type="streak"
          value={stats.dayStreak}
          label="Day Streak"
        />
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
            onPress={() => console.log("Open course:", course.id)}
          />
        ))}
      </YStack>
    </ScreenContainer>
  );
}
