import { CourseCard, CourseCardSkeleton } from "@/components/cards";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseGeneration } from "@/contexts/course-generation-context";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ApiError, coursesApi, lessonProgressApi } from "@/services/api";
import type { Course } from "@/types";
import { useFocusEffect } from "@react-navigation/native";
import { Plus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, H1, ScrollView, Text, YStack } from "tamagui";

export default function CoursesScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { session } = useAuth();
  const { notify } = useNotifications();
  const {
    localCourses,
    openCreatingModal,
    deletedBackendIds,
    deleteCourseByBackendId,
  } = useCourseGeneration();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const coursesRef = useRef<Course[]>([]);

  useEffect(() => {
    coursesRef.current = courses;
  }, [courses]);

  const courseCreatedAtValue = (course: Course): number => {
    const raw = course.createdAt;
    const value = typeof raw === "string" ? Date.parse(raw) : NaN;
    return Number.isFinite(value) ? value : 0;
  };

  const deletedBackendIdsSet = useMemo(
    () => new Set(deletedBackendIds),
    [deletedBackendIds],
  );

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
    setCoursesError(null);
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
      if (err instanceof ApiError) {
        setCoursesError(err.message);
      } else {
        setCoursesError("Failed to load courses.");
      }
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  const handleDeleteCourse = useCallback(
    async (course: Course) => {
      const token = session?.access_token;
      const courseId = course.backendId;

      if (!token || !courseId) {
        notify({ type: "error", message: "Couldn’t delete course." });
        return;
      }

      await deleteCourseByBackendId(courseId);
      // Collapse in-place (no full refetch)
      setCourses((prev) => prev.filter((c) => c.backendId !== courseId));
    },
    [deleteCourseByBackendId, notify, session?.access_token],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const localBackendIds = useMemo(() => {
    return new Set(
      localCourses
        .map((c) => c.backendId)
        .filter((id): id is number => typeof id === "number"),
    );
  }, [localCourses]);

  const pollingBackendIdsKey = useMemo(() => {
    const ids = courses
      .filter((c) => {
        const id = c.backendId;
        if (typeof id !== "number") return false;
        if (deletedBackendIdsSet.has(id)) return false;
        if (localBackendIds.has(id)) return false;
        return c.state === "creation" || c.status === "generating";
      })
      .map((c) => c.backendId as number)
      .sort((a, b) => a - b);

    return ids.length ? ids.join(",") : "";
  }, [courses, deletedBackendIdsSet, localBackendIds]);

  useEffect(() => {
    const token = session?.access_token;
    if (!token) return;
    if (!pollingBackendIdsKey) return;

    let cancelled = false;
    let inFlight = false;

    const tick = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const backendIds = pollingBackendIdsKey
          .split(",")
          .map((v) => Number(v))
          .filter((v) => Number.isFinite(v) && v > 0);

        for (const backendId of backendIds) {
          if (cancelled) return;

          try {
            const stateRes = await coursesApi.getCourseState(token, backendId);
            const state = stateRes.state;

            if (state === "creation") {
              const local = coursesRef.current.find(
                (c) => c.backendId === backendId,
              );
              const createdAtMs = local?.createdAt
                ? Date.parse(local.createdAt)
                : NaN;
              const isCreatedAtValid = Number.isFinite(createdAtMs);
              const ageMs = isCreatedAtValid ? Date.now() - createdAtMs : 0;
              const maxAgeMs = 24 * 60 * 60 * 1000;

              if (isCreatedAtValid && ageMs >= maxAgeMs) {
                setCourses((prev) =>
                  prev.map((c) =>
                    c.backendId === backendId
                      ? {
                          ...c,
                          state: "failed",
                          status: "failed",
                          updatedAt: new Date().toISOString(),
                        }
                      : c,
                  ),
                );
              }

              continue;
            }

            if (state === "failed") {
              setCourses((prev) =>
                prev.map((c) =>
                  c.backendId === backendId
                    ? {
                        ...c,
                        state,
                        status: "failed",
                        updatedAt: new Date().toISOString(),
                      }
                    : c,
                ),
              );
              continue;
            }

            if (state === "created" || state === "published") {
              const full = await coursesApi.getCourseById(
                String(backendId),
                token,
              );
              if (!full) continue;

              setCourses((prev) =>
                prev.map((c) =>
                  c.backendId === backendId
                    ? {
                        ...c,
                        ...full,
                        backendId,
                        state,
                        status: "ready",
                      }
                    : c,
                ),
              );
            }
          } catch (err) {
            console.error("[CoursesScreen] state poll failed", backendId, err);
          }
        }
      } finally {
        inFlight = false;
      }
    };

    void tick();
    const interval = setInterval(() => {
      void tick();
    }, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pollingBackendIdsKey, session?.access_token]);

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

  // When a course is being generated we create a local placeholder.
  // The backend may also return the same course immediately (often with 0 lessons).
  // Prefer the local placeholder entry and hide the duplicate backend entry.
  const allCourses = [
    ...localCourses.filter((c) => {
      const id = c.backendId;
      return !(typeof id === "number" && deletedBackendIdsSet.has(id));
    }),
    ...courses.filter((c) => {
      const id = c.backendId;
      if (typeof id === "number" && deletedBackendIdsSet.has(id)) return false;
      return !(typeof id === "number" && localBackendIds.has(id));
    }),
  ].sort((a, b) => {
    return courseCreatedAtValue(b) - courseCreatedAtValue(a);
  });

  if (coursesError && allCourses.length === 0) {
    return (
      <YStack flex={1}>
        {header}
        <ScrollView backgroundColor={colors.background} flex={1}>
          <YStack padding="$4" gap="$4" paddingBottom="$8">
            <YStack
              gap="$3"
              padding="$4"
              backgroundColor={colors.cardBackground}
            >
              <Text color={colors.textPrimary} fontSize="$5" fontWeight="600">
                Couldn’t load courses
              </Text>
              <Text color={colors.textSecondary} fontSize="$4" fontWeight="400">
                {coursesError}
              </Text>
            </YStack>
          </YStack>
        </ScrollView>
        {createCourseFab}
      </YStack>
    );
  }

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
              <Text color={colors.textSecondary}>You have no courses yet.</Text>
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
          {coursesError ? (
            <YStack
              padding="$4"
              borderRadius="$4"
              backgroundColor={colors.cardBackground}
            >
              <Text color={colors.textSecondary}>{coursesError}</Text>
            </YStack>
          ) : null}
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
                  onDelete={
                    course.status === "failed"
                      ? () => void handleDeleteCourse(course)
                      : undefined
                  }
                  onPress={() =>
                    course.status === "generating" || course.status === "failed"
                      ? openCreatingModal(course.id, course)
                      : router.push(
                          `/course/${
                            typeof course.backendId === "number"
                              ? String(course.backendId)
                              : course.id
                          }` as any,
                        )
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
