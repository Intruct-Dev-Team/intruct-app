import FlashcardView from "@/components/lesson/FlashcardView";
import LessonMaterialView from "@/components/lesson/LessonMaterialView";
import TestView from "@/components/lesson/TestView";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { mockCourses } from "@/mockdata/courses";
import type { Course, Lesson } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack, getTokenValue } from "tamagui";

type LessonPhase = "material" | "flashcards" | "test";

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [phase, setPhase] = useState<LessonPhase>("material");
  const [completedPhases, setCompletedPhases] = useState<LessonPhase[]>([]);
  const [currentPhaseProgress, setCurrentPhaseProgress] = useState(0);

  const resolveThemeColor = (color: string): string => {
    return color.startsWith("$")
      ? (getTokenValue(color as never) as string)
      : color;
  };

  useEffect(() => {
    if (typeof id !== "string") return;

    let foundLesson: Lesson | undefined;
    let foundCourse: Course | undefined;

    for (const course of mockCourses) {
      for (const module of course.modules || []) {
        const lessonCandidate = module.lessons.find((l) => l.id === id);
        if (lessonCandidate) {
          foundLesson = lessonCandidate;
          foundCourse = course;
          break;
        }
      }
      if (foundLesson) break;
    }

    setLesson(foundLesson ?? null);
    setCourseTitle(foundCourse?.title ?? "");
  }, [id]);

  useEffect(() => {
    setCurrentPhaseProgress(0);
  }, [phase]);

  const progressWidth = useSharedValue(5);

  const progressPercent = useMemo(() => {
    if (!lesson) return 5;
    const flashcardsCount = lesson.flashcards?.length ?? 0;
    const questionsCount = lesson.questions?.length ?? 0;
    const totalSteps = 1 + flashcardsCount + questionsCount;
    if (totalSteps <= 0) return 5;

    let completedSteps = 0;
    if (completedPhases.includes("material")) completedSteps += 1;

    if (completedPhases.includes("flashcards")) {
      completedSteps += flashcardsCount;
    } else if (phase === "flashcards") {
      completedSteps += Math.min(currentPhaseProgress, flashcardsCount);
    }

    if (completedPhases.includes("test")) {
      completedSteps += questionsCount;
    } else if (phase === "test") {
      completedSteps += Math.min(currentPhaseProgress, questionsCount);
    }

    return Math.max(5, (completedSteps / totalSteps) * 100);
  }, [lesson, completedPhases, phase, currentPhaseProgress]);

  useEffect(() => {
    progressWidth.value = withTiming(progressPercent, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  }, [progressPercent, progressWidth]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  if (!lesson) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: resolveThemeColor(colors.background),
        }}
        edges={["bottom"]}
      >
        <Stack.Screen options={{ title: "Loading..." }} />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text color={colors.textSecondary}>Loading lesson...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  const handleMaterialComplete = () => {
    setCompletedPhases((prev) =>
      prev.includes("material") ? prev : [...prev, "material"]
    );
    if ((lesson.flashcards?.length ?? 0) > 0) {
      setPhase("flashcards");
    } else if ((lesson.questions?.length ?? 0) > 0) {
      setPhase("test");
    } else {
      router.back();
    }
  };

  const handleFlashcardsComplete = () => {
    setCompletedPhases((prev) =>
      prev.includes("flashcards") ? prev : [...prev, "flashcards"]
    );
    if ((lesson.questions?.length ?? 0) > 0) {
      setPhase("test");
    } else {
      router.back();
    }
  };

  const handleTestComplete = (_score: number) => {
    setCompletedPhases((prev) =>
      prev.includes("test") ? prev : [...prev, "test"]
    );
    router.back();
  };

  const renderContent = () => {
    switch (phase) {
      case "material":
        return (
          <LessonMaterialView
            title={lesson.title}
            courseTitle={courseTitle}
            materials={lesson.materials || []}
            onComplete={handleMaterialComplete}
            nextLabel={
              (lesson.flashcards?.length ?? 0) > 0 ? "Start Flashcards" : "Next"
            }
          />
        );
      case "flashcards":
        return (
          <FlashcardView
            cards={lesson.flashcards || []}
            onComplete={handleFlashcardsComplete}
            onProgress={(index) => setCurrentPhaseProgress(index)}
          />
        );
      case "test":
        return (
          <TestView
            questions={lesson.questions || []}
            onComplete={handleTestComplete}
            onProgress={(index) => setCurrentPhaseProgress(index)}
          />
        );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: resolveThemeColor(colors.background) }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title:
            phase === "material"
              ? "Lesson"
              : phase === "flashcards"
              ? "Flashcards"
              : "Test",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: resolveThemeColor(colors.background),
          },
          headerTitleStyle: {
            color: resolveThemeColor(colors.textPrimary),
          },
          headerTintColor: resolveThemeColor(colors.primary),
          headerShadowVisible: false,
        }}
      />

      <YStack
        height={4}
        backgroundColor="$gray5"
        width="100%"
        overflow="hidden"
      >
        <Animated.View
          style={[
            {
              height: "100%",
              backgroundColor: resolveThemeColor(colors.primary),
              shadowColor: resolveThemeColor(colors.primary),
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 10,
              elevation: 5,
            },
            animatedProgressStyle,
          ]}
        />
      </YStack>

      {renderContent()}
    </SafeAreaView>
  );
}
