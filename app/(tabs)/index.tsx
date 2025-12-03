import { CourseCard } from "@/components/course-card";
import { CreateCourseCard } from "@/components/create-course-card";
import { PageHeader } from "@/components/page-header";
import { ScreenContainer } from "@/components/screen-container";
import { StatsCard } from "@/components/stats-card";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Clock, Flame, TrendingUp } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { H2, XStack, YStack } from "tamagui";

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();

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
          value={0}
          label="Completed"
        />
        <StatsCard
          icon={Clock}
          type="inProgress"
          value={2}
          label="Courses in Progress"
        />
        <StatsCard icon={Flame} type="streak" value={7} label="Day Streak" />
      </XStack>

      <CreateCourseCard onPress={() => router.push("/create-course")} />

      <YStack gap="$3.5" marginTop="$3">
        <H2 fontSize="$7" fontWeight="700" color={colors.textPrimary}>
          My Courses
        </H2>

        <CourseCard
          title="Introduction to React"
          description="Learn the basics of React and component-based development"
          lessons={8}
          progress={65}
          onPress={() => console.log("Open course")}
        />

        <CourseCard
          title="Advanced TypeScript"
          description="Master TypeScript type system and advanced patterns"
          onPress={() => console.log("Open course")}
        />
      </YStack>
    </ScreenContainer>
  );
}
