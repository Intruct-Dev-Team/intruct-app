import LessonMaterialView from "@/components/lesson/LessonMaterialView";
import TestView from "@/components/lesson/TestView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ApiError, lessonProgressApi, lessonsApi } from "@/services/api";
import type { Lesson } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, YStack, getTokenValue } from "tamagui";

type LessonPhase = "material" | "test";

export default function LessonScreen() {
  const {
    id,
    courseKey: courseKeyParam,
    skipFinish,
  } = useLocalSearchParams<{
    id: string;
    courseKey?: string;
    skipFinish?: string;
  }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { session } = useAuth();
  const token = session?.access_token;

  const courseKey =
    typeof courseKeyParam === "string" && courseKeyParam.trim().length > 0
      ? courseKeyParam
      : undefined;

  const shouldSkipFinish = skipFinish === "1" || skipFinish === "true";

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [phase, setPhase] = useState<LessonPhase>("material");
  const [completedPhases, setCompletedPhases] = useState<LessonPhase[]>([]);
  const [currentPhaseProgress, setCurrentPhaseProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolveThemeColor = (color: string): string => {
    return color.startsWith("$")
      ? (getTokenValue(color as never) as string)
      : color;
  };

  useEffect(() => {
    if (typeof id !== "string") return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      const numericId = Number(id);

      if (!token) {
        setLesson(null);
        setCourseTitle("");
        setError("Token is required");
        return;
      }

      if (!Number.isFinite(numericId)) {
        setLesson(null);
        setCourseTitle("");
        setError("Invalid lesson id");
        return;
      }

      try {
        const lessonFromApi = await lessonsApi.getLessonById(numericId, token);
        if (cancelled) return;
        setLesson(lessonFromApi);
        setCourseTitle("");
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load lesson";
        setError(message);
      }
    };

    void load().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id, token]);

  useEffect(() => {
    setCurrentPhaseProgress(0);
  }, [phase]);

  const progressPercent = useMemo(() => {
    if (!lesson) return 5;

    const questionsCount = lesson.questions?.length ?? 0;
    const totalSteps = 1 + questionsCount;
    if (totalSteps <= 0) return 5;

    let completedSteps = 0;
    if (completedPhases.includes("material")) completedSteps += 1;

    if (completedPhases.includes("test")) {
      completedSteps += questionsCount;
    } else if (phase === "test") {
      completedSteps += Math.min(currentPhaseProgress, questionsCount);
    }

    return Math.max(5, (completedSteps / totalSteps) * 100);
  }, [lesson, completedPhases, phase, currentPhaseProgress]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: resolveThemeColor(colors.background),
        }}
        edges={["bottom"]}
      >
        <Stack.Screen options={{ title: "Loading..." }} />
        <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
          <Text color={colors.textSecondary}>Loading lesson...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: resolveThemeColor(colors.background),
        }}
        edges={["bottom"]}
      >
        <Stack.Screen options={{ title: "" }} />
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          gap="$3"
          padding="$6"
        >
          <Text color={colors.textPrimary} fontWeight="700">
            Couldn’t load lesson
          </Text>
          <Text color={colors.textSecondary} textAlign="center">
            {error}
          </Text>
          <Button
            onPress={() => {
              router.replace({
                pathname: "/course/lesson/[id]",
                params: {
                  id: String(id),
                  ...(courseKey ? { courseKey } : {}),
                  ...(skipFinish ? { skipFinish } : {}),
                },
              } as any);
            }}
          >
            Retry
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: resolveThemeColor(colors.background),
        }}
        edges={["bottom"]}
      >
        <Stack.Screen options={{ title: "" }} />
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          gap="$3"
          padding="$6"
        >
          <Text color={colors.textPrimary} fontWeight="700">
            Lesson not found
          </Text>
          <Button onPress={() => router.back()}>Go back</Button>
        </YStack>
      </SafeAreaView>
    );
  }

  const handleMaterialComplete = () => {
    setCompletedPhases((prev) =>
      prev.includes("material") ? prev : [...prev, "material"],
    );

    if ((lesson.questions?.length ?? 0) > 0) {
      setPhase("test");
      return;
    }

    if (shouldSkipFinish) {
      router.back();
      return;
    }

    void (async () => {
      try {
        if (!token) {
          setError("Token is required");
          return;
        }

        const lessonIdNumber = Number(lesson.id);
        if (!Number.isFinite(lessonIdNumber)) {
          setError("Invalid lesson id");
          return;
        }

        await lessonsApi.finishLesson(lessonIdNumber, token);

        if (courseKey) {
          await lessonProgressApi.markLessonCompleted(courseKey, lesson.id);
        }

        router.back();
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to finish lesson";
        setError(message);
      }
    })();
  };

  const handleTestComplete = (_score: number) => {
    setCompletedPhases((prev) =>
      prev.includes("test") ? prev : [...prev, "test"],
    );

    if (shouldSkipFinish) {
      router.back();
      return;
    }

    const lessonIdNumber = Number(lesson.id);

    void (async () => {
      try {
        if (!token) {
          setError("Token is required");
          return;
        }

        if (!Number.isFinite(lessonIdNumber)) {
          setError("Invalid lesson id");
          return;
        }

        await lessonsApi.finishLesson(lessonIdNumber, token);

        if (courseKey) {
          await lessonProgressApi.markLessonCompleted(courseKey, lesson.id);
        }

        router.back();
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to finish lesson";
        setError(message);
      }
    })();
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
            showHeader={false}
            nextLabel="Next"
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
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: resolveThemeColor(colors.background) }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title: "",
          headerTitle: () => (
            <YStack>
              <Text
                fontWeight="700"
                color={colors.textPrimary}
                numberOfLines={1}
              >
                {lesson.title}
              </Text>
              {courseTitle ? (
                <Text
                  color={colors.textSecondary}
                  fontSize="$2"
                  numberOfLines={1}
                >
                  {courseTitle}
                </Text>
              ) : null}
            </YStack>
          ),
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
        <YStack
          height={4}
          width={`${progressPercent}%`}
          backgroundColor={colors.primary}
        />
      </YStack>

      {renderContent()}
    </SafeAreaView>
  );
}
