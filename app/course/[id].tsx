import { AppSheetModal } from "@/components/modals";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import {
  useResolvedThemeColor,
  useThemeColors,
} from "@/hooks/use-theme-colors";
import { t } from "@/localization/i18n";
import { ApiError, coursesApi, lessonProgressApi } from "@/services/api";
import type { Course, Module as CourseModule } from "@/types";
import { useFocusEffect } from "@react-navigation/native";
import {
  ArrowLeft,
  Globe,
  MoreVertical,
  Play,
  Star,
  Trash2,
} from "@tamagui/lucide-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, H2, Progress, Text, XStack, YStack } from "tamagui";

export default function CourseDetailPage() {
  const colors = useThemeColors();
  const completedIconColor = useResolvedThemeColor(colors.stats.completed.icon);
  const ratingStarColor = useResolvedThemeColor(colors.stats.streak.icon);
  const whiteIconColor = useResolvedThemeColor("$white1");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notify } = useNotifications();
  const { session } = useAuth();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    () => new Set(),
  );

  const loadCourse = useCallback(
    async (courseId: string) => {
      setLoading(true);
      setCourseError(null);
      try {
        const token = session?.access_token;
        if (!token) {
          setCourse(null);
          setCourseError(t("Sign in to view this course."));
          return;
        }

        const c = await coursesApi.getCourseById(courseId, token);
        setCourse(c);
      } catch (err) {
        console.error(err);
        if (err instanceof ApiError) {
          setCourseError(err.message);
        } else {
          setCourseError(t("Failed to load course."));
        }
      } finally {
        setLoading(false);
      }
    },
    [session?.access_token],
  );

  useEffect(() => {
    if (!id) return;
    void loadCourse(id);
  }, [id, loadCourse]);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      void loadCourse(id);
    }, [id, loadCourse]),
  );

  const courseKey = useMemo(() => {
    if (!course) return null;
    return course.backendId ? `backend:${course.backendId}` : `id:${course.id}`;
  }, [course]);

  const refreshCompletedLessonIds = useCallback(async () => {
    if (!courseKey) return;

    try {
      const ids = await lessonProgressApi.getCompletedLessonIds(courseKey);
      setCompletedLessonIds(ids);
    } catch {
      setCompletedLessonIds(new Set());
    }
  }, [courseKey]);

  useEffect(() => {
    void refreshCompletedLessonIds();
  }, [refreshCompletedLessonIds]);

  useFocusEffect(
    useCallback(() => {
      void refreshCompletedLessonIds();
    }, [refreshCompletedLessonIds]),
  );

  const handlePublish = async () => {
    if (!course || publishing) return;

    const token = session?.access_token;
    const courseId = course.backendId;

    if (!token || !courseId) {
      notify({ type: "error", message: t("Couldn’t publish course.") });
      return;
    }

    setPublishing(true);
    try {
      await coursesApi.publishCourse(token, courseId);
      setCourse({ ...course, isPublic: true });
      notify({ type: "success", message: t("Course published.") });
      setSettingsOpen(false);
    } catch {
      notify({ type: "error", message: t("Couldn’t publish course.") });
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!course || deleting) return;
    if (!canDelete) return;

    const token = session?.access_token;
    const courseId = course.backendId;

    if (!token || !courseId) {
      notify({ type: "error", message: t("Couldn’t delete course.") });
      return;
    }

    setDeleting(true);
    try {
      await coursesApi.deleteCourse(token, courseId);
      notify({ type: "success", message: t("Course deleted.") });
      setSettingsOpen(false);
      router.replace("/courses" as any);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : t("Couldn’t delete course.");
      notify({ type: "error", message });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <YStack flex={1} padding="$4" justifyContent="center" alignItems="center">
        <Stack.Screen options={{ headerShown: false }} />
        <Text color={colors.textSecondary}>{t("Loading course...")}</Text>
      </YStack>
    );
  }

  if (courseError) {
    return (
      <YStack
        flex={1}
        padding="$4"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Text color={colors.textPrimary} fontSize="$5" fontWeight="600">
          {t("Couldn’t load course")}
        </Text>
        <Text color={colors.textSecondary} textAlign="center">
          {courseError}
        </Text>
        <XStack gap="$3" marginTop="$2">
          <Button onPress={() => (id ? loadCourse(id) : undefined)}>
            {t("Retry")}
          </Button>
          <Button chromeless onPress={() => router.back()}>
            {t("Go back")}
          </Button>
        </XStack>
      </YStack>
    );
  }

  if (!course) {
    return (
      <YStack
        flex={1}
        padding="$4"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Text color={colors.textSecondary}>{t("Course not found.")}</Text>
        <Button chromeless onPress={() => router.back()}>
          {t("Go back")}
        </Button>
      </YStack>
    );
  }

  const isMine = !!course.isMine;
  const canRate = !isMine && (course.isInMine ?? !!course.isPublic);
  const canPublish = !course.isPublic && isMine;
  const canDelete = isMine;
  const showRateHeaderButton = course.isPublic && !isMine;

  const handleRate = async (reviewGrade: number) => {
    if (!canRate) return;

    const token = session?.access_token;
    const courseId = course.backendId;

    if (!token || !courseId) {
      notify({ type: "error", message: t("Couldn’t submit review.") });
      return;
    }

    try {
      await coursesApi.rateCourse(token, courseId, reviewGrade);
      notify({ type: "success", message: t("Thanks for your review.") });
      setRateOpen(false);
    } catch {
      notify({ type: "error", message: t("Couldn’t submit review.") });
    }
  };

  const modules = course.modules || [];
  const isSingleModule = modules.length <= 1;

  const sortLessons = (lessons: CourseModule["lessons"]) => {
    const copy = [...lessons];
    copy.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aTime !== bTime) return bTime - aTime;

      const aSerial = typeof a.serialNumber === "number" ? a.serialNumber : 0;
      const bSerial = typeof b.serialNumber === "number" ? b.serialNumber : 0;
      return aSerial - bSerial;
    });
    return copy;
  };

  const orderedLessons = modules
    .flatMap((m) => m.lessons)
    .slice()
    .sort((a, b) => {
      const aSerial = typeof a.serialNumber === "number" ? a.serialNumber : 0;
      const bSerial = typeof b.serialNumber === "number" ? b.serialNumber : 0;
      if (aSerial !== bSerial) return aSerial - bSerial;
      return a.id.localeCompare(b.id);
    });

  const backendProgress = course.progress ?? 0;
  const localProgress = completedLessonIds.size;
  const effectiveProgress = Math.max(backendProgress, localProgress);

  const backendCompletionSet = new Set(
    orderedLessons.slice(0, backendProgress).map((l) => l.id),
  );
  const completionSet = new Set([
    ...backendCompletionSet,
    ...completedLessonIds,
  ]);

  const nextLessonId = orderedLessons.find((l) => !completionSet.has(l.id))?.id;

  const isCourseCompleted =
    typeof course.lessons === "number" && course.lessons > 0
      ? effectiveProgress >= course.lessons
      : false;

  const percent =
    typeof effectiveProgress === "number" &&
    course.lessons &&
    course.lessons > 0
      ? Math.round((effectiveProgress / course.lessons) * 100)
      : 0;

  const bottomInset = insets.bottom ?? 0;
  const footerPaddingBottom = bottomInset + 16;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <YStack
              paddingHorizontal="$4"
              paddingVertical="$3"
              paddingTop="$6"
              backgroundColor={colors.cardBackground}
              elevation={2}
            >
              <XStack alignItems="center" gap="$3">
                <Button
                  size="$3"
                  chromeless
                  paddingLeft={0}
                  icon={<ArrowLeft size={20} color={colors.textPrimary} />}
                  onPress={() => router.back()}
                />

                {showRateHeaderButton ? (
                  <Button
                    marginLeft="auto"
                    size="$3"
                    chromeless
                    disabled={!canRate}
                    opacity={!canRate ? 0.6 : 1}
                    icon={<Star size={16} color={ratingStarColor} />}
                    onPress={() => {
                      if (!canRate) return;
                      setRateOpen(true);
                    }}
                  >
                    {t("Rate course")}
                  </Button>
                ) : (
                  <Button
                    marginLeft="auto"
                    size="$3"
                    chromeless
                    icon={<MoreVertical size={18} color={colors.textPrimary} />}
                    onPress={() => setSettingsOpen(true)}
                  />
                )}
              </XStack>

              <YStack marginTop="$2">
                <H2 fontSize="$8" color={colors.textPrimary} fontWeight="700">
                  {course.title}
                </H2>
                {course.description ? (
                  <Text color={colors.textSecondary} fontSize="$3">
                    {course.description}
                  </Text>
                ) : null}
              </YStack>

              {typeof effectiveProgress === "number" && (
                <YStack paddingTop="$2" space="$2">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text color={colors.textTertiary}>
                      {t("Course Progress")}
                    </Text>
                    <Text color={colors.primary} fontWeight="600">
                      {t("{{completed}}/{{total}} lessons", {
                        completed: effectiveProgress,
                        total: course.lessons,
                      })}
                    </Text>
                  </XStack>

                  <Progress
                    value={percent}
                    height={6}
                    borderRadius="$999"
                    backgroundColor="$gray3"
                    marginTop="$2"
                    marginBottom="$2"
                  >
                    <Progress.Indicator backgroundColor={colors.primary} />
                  </Progress>
                </YStack>
              )}
            </YStack>
          ),
        }}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100 + bottomInset,
        }}
      >
        <YStack gap="$3" marginTop="$2">
          <Text fontWeight="700" fontSize="$5" color={colors.textPrimary}>
            {t("Course Content")}
          </Text>

          {isSingleModule
            ? sortLessons(modules[0]?.lessons ?? []).map((lesson, idx) => {
                const isLessonCompleted = completionSet.has(lesson.id);
                const isCurrentLesson = lesson.id === nextLessonId;
                const isUnlocked = isLessonCompleted || isCurrentLesson;
                return (
                  <Card
                    key={lesson.id}
                    padding="$4"
                    borderRadius="$6"
                    backgroundColor={colors.cardBackground}
                    opacity={!isLessonCompleted && !isCurrentLesson ? 0.6 : 1}
                    pressStyle={
                      isUnlocked
                        ? {
                            scale: 0.99,
                            opacity: 0.96,
                          }
                        : undefined
                    }
                    onPress={
                      isUnlocked
                        ? () => {
                            router.push({
                              pathname: "/course/lesson/[id]",
                              params: {
                                id: lesson.id,
                                lessonNumber: String(
                                  lesson.serialNumber ?? idx + 1,
                                ),
                                ...(courseKey ? { courseKey } : {}),
                                ...(Number.isFinite(effectiveProgress)
                                  ? {
                                      currentProgress:
                                        String(effectiveProgress),
                                    }
                                  : {}),
                                ...(isLessonCompleted
                                  ? { skipFinish: "1" }
                                  : {}),
                              },
                            } as any);
                          }
                        : undefined
                    }
                  >
                    <XStack alignItems="center" gap="$3">
                      <YStack
                        width={44}
                        height={44}
                        borderRadius={999}
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={
                          isLessonCompleted
                            ? colors.stats.completed.background
                            : "$blue2"
                        }
                      >
                        {isLessonCompleted ? (
                          <Text
                            color={colors.stats.completed.icon as any}
                            fontWeight="700"
                            fontSize="$5"
                          >
                            ✓
                          </Text>
                        ) : (
                          <YStack
                            width={8}
                            height={8}
                            borderRadius={999}
                            backgroundColor="$blue5"
                          />
                        )}
                      </YStack>

                      <YStack flex={1}>
                        <XStack
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Text color={colors.textTertiary} fontSize="$2">
                            {t("Lesson {{number}}", {
                              number: lesson.serialNumber ?? idx + 1,
                            })}
                          </Text>

                          {isLessonCompleted && (
                            <XStack
                              paddingHorizontal="$3"
                              paddingVertical="$1"
                              borderRadius="$4"
                              backgroundColor={
                                colors.stats.completed.background
                              }
                              alignItems="center"
                              gap="$2"
                            >
                              <Text
                                color={colors.stats.completed.icon}
                                fontSize="$2"
                              >
                                {t("Completed")}
                              </Text>
                              <Play size={12} color={completedIconColor} />
                            </XStack>
                          )}
                        </XStack>

                        <Text
                          fontWeight="600"
                          color={colors.textPrimary}
                          fontSize="$4"
                          marginTop="$2"
                        >
                          {lesson.title}
                        </Text>

                        {isCurrentLesson && (
                          <Button
                            width="100%"
                            backgroundColor={colors.primary}
                            color="$white1"
                            borderRadius="$6"
                            fontWeight="600"
                            fontSize="$3"
                            icon={<Play size={16} color={whiteIconColor} />}
                            onPress={() => {
                              router.push({
                                pathname: "/course/lesson/[id]",
                                params: {
                                  id: lesson.id,
                                  lessonNumber: String(
                                    lesson.serialNumber ?? idx + 1,
                                  ),
                                  ...(courseKey ? { courseKey } : {}),
                                  ...(Number.isFinite(effectiveProgress)
                                    ? {
                                        currentProgress:
                                          String(effectiveProgress),
                                      }
                                    : {}),
                                },
                              } as any);
                            }}
                            marginTop="$3"
                          >
                            {t("Start Lesson")}
                          </Button>
                        )}
                      </YStack>
                    </XStack>
                  </Card>
                );
              })
            : modules.map((mod: CourseModule, idx) => {
                return (
                  <YStack key={mod.id} gap="$2">
                    <Text fontWeight="700" color={colors.textPrimary}>
                      {t("Module {{number}}", { number: idx + 1 })}
                    </Text>
                    {sortLessons(mod.lessons).map((lesson, lidx) => {
                      const isLessonCompleted = completionSet.has(lesson.id);
                      const isCurrentLesson = lesson.id === nextLessonId;
                      const isUnlocked = isLessonCompleted || isCurrentLesson;

                      return (
                        <Card
                          key={lesson.id}
                          padding="$4"
                          borderRadius="$6"
                          backgroundColor={colors.cardBackground}
                          opacity={
                            !isLessonCompleted && !isCurrentLesson ? 0.6 : 1
                          }
                          pressStyle={
                            isUnlocked
                              ? {
                                  scale: 0.99,
                                  opacity: 0.96,
                                }
                              : undefined
                          }
                          onPress={
                            isUnlocked
                              ? () => {
                                  router.push({
                                    pathname: "/course/lesson/[id]",
                                    params: {
                                      id: lesson.id,
                                      lessonNumber: String(
                                        lesson.serialNumber ?? lidx + 1,
                                      ),
                                      ...(courseKey ? { courseKey } : {}),
                                      ...(Number.isFinite(effectiveProgress)
                                        ? {
                                            currentProgress:
                                              String(effectiveProgress),
                                          }
                                        : {}),
                                      ...(isLessonCompleted
                                        ? { skipFinish: "1" }
                                        : {}),
                                    },
                                  } as any);
                                }
                              : undefined
                          }
                        >
                          <XStack alignItems="center" gap="$3">
                            <YStack
                              width={44}
                              height={44}
                              borderRadius={999}
                              alignItems="center"
                              justifyContent="center"
                              backgroundColor={
                                isLessonCompleted
                                  ? colors.stats.completed.background
                                  : "$blue2"
                              }
                            >
                              {isLessonCompleted ? (
                                <Text
                                  color={colors.stats.completed.icon as any}
                                  fontWeight="700"
                                  fontSize="$5"
                                >
                                  ✓
                                </Text>
                              ) : (
                                <YStack
                                  width={8}
                                  height={8}
                                  borderRadius={999}
                                  backgroundColor="$blue5"
                                />
                              )}
                            </YStack>

                            <YStack flex={1}>
                              <XStack
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Text color={colors.textTertiary} fontSize="$2">
                                  {t("Lesson {{number}}", {
                                    number: lesson.serialNumber ?? lidx + 1,
                                  })}
                                </Text>
                                {isLessonCompleted && (
                                  <XStack
                                    paddingHorizontal="$3"
                                    paddingVertical="$1"
                                    borderRadius="$4"
                                    backgroundColor={
                                      colors.stats.completed.background
                                    }
                                    alignItems="center"
                                    gap="$2"
                                  >
                                    <Text
                                      color={colors.stats.completed.icon}
                                      fontSize="$2"
                                    >
                                      {t("Completed")}
                                    </Text>
                                    <Play
                                      size={12}
                                      color={completedIconColor}
                                    />
                                  </XStack>
                                )}
                              </XStack>

                              <Text
                                fontWeight="600"
                                color={colors.textPrimary}
                                fontSize="$4"
                                marginTop="$2"
                              >
                                {lesson.title}
                              </Text>

                              {isCurrentLesson && (
                                <Button
                                  width="100%"
                                  backgroundColor={colors.primary}
                                  color="$white1"
                                  borderRadius="$6"
                                  fontWeight="600"
                                  fontSize="$3"
                                  icon={
                                    <Play size={16} color={whiteIconColor} />
                                  }
                                  onPress={() => {
                                    router.push({
                                      pathname: "/course/lesson/[id]",
                                      params: {
                                        id: lesson.id,
                                        lessonNumber: String(
                                          lesson.serialNumber ?? lidx + 1,
                                        ),
                                        ...(courseKey ? { courseKey } : {}),
                                        ...(Number.isFinite(effectiveProgress)
                                          ? {
                                              currentProgress:
                                                String(effectiveProgress),
                                            }
                                          : {}),
                                      },
                                    } as any);
                                  }}
                                  marginTop="$3"
                                >
                                  {t("Start Lesson")}
                                </Button>
                              )}
                            </YStack>
                          </XStack>
                        </Card>
                      );
                    })}
                  </YStack>
                );
              })}
        </YStack>
      </ScrollView>

      <AppSheetModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        snapPoints={[45]}
        title={t("Settings")}
        headerRight={
          <Button size="$3" chromeless onPress={() => setSettingsOpen(false)}>
            {t("Close")}
          </Button>
        }
      >
        <YStack gap="$3">
          {isMine && (
            <>
              <Button
                size="$5"
                backgroundColor={colors.primary}
                color={colors.primaryText}
                borderRadius="$6"
                fontWeight="700"
                disabled={!canPublish || publishing}
                opacity={!canPublish || publishing ? 0.7 : 1}
                icon={<Globe size={16} color={colors.primaryText} />}
                onPress={handlePublish}
              >
                {t("Publish course")}
              </Button>

              <Button
                size="$5"
                backgroundColor="$red9"
                color="white"
                borderRadius="$6"
                fontWeight="700"
                disabled={!canDelete || deleting}
                opacity={!canDelete || deleting ? 0.7 : 1}
                icon={<Trash2 size={16} color="white" />}
                onPress={() => {
                  if (!canDelete) return;
                  setSettingsOpen(false);
                  setDeleteConfirmOpen(true);
                }}
              >
                {t("Delete course")}
              </Button>
            </>
          )}

          {course.isPublic ? (
            <Button
              size="$5"
              borderRadius="$6"
              fontWeight="700"
              backgroundColor={colors.cardBackground}
              borderWidth={1}
              borderColor="$gray5"
              disabled={!canRate}
              opacity={!canRate ? 0.7 : 1}
              icon={<Star size={16} color={ratingStarColor} />}
              onPress={() => {
                if (!canRate) return;
                setSettingsOpen(false);
                setRateOpen(true);
              }}
            >
              {t("Rate course")}
            </Button>
          ) : null}
        </YStack>
      </AppSheetModal>

      <AppSheetModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        snapPoints={[30]}
        title={t("Delete course?")}
      >
        <YStack gap="$3">
          <Text color={colors.textSecondary} fontSize="$4">
            {t("This action can’t be undone.")}
          </Text>

          <Button
            size="$5"
            backgroundColor="$red9"
            color="white"
            borderRadius="$6"
            fontWeight="700"
            disabled={!canDelete || deleting}
            opacity={!canDelete || deleting ? 0.7 : 1}
            icon={<Trash2 size={16} color="white" />}
            onPress={() => {
              if (!canDelete) return;
              handleDelete();
              setDeleteConfirmOpen(false);
            }}
          >
            {t("Delete course")}
          </Button>

          <Button
            size="$5"
            backgroundColor={colors.cardBackground}
            borderRadius="$6"
            fontWeight="700"
            onPress={() => setDeleteConfirmOpen(false)}
          >
            {t("Cancel")}
          </Button>
        </YStack>
      </AppSheetModal>

      <AppSheetModal
        open={rateOpen}
        onOpenChange={setRateOpen}
        snapPoints={[40]}
        title={t("Rate this course")}
      >
        <YStack gap="$2">
          <Text color={colors.textSecondary} fontSize="$4">
            {t("Select a rating from 1 to 5.")}
          </Text>
        </YStack>

        <XStack gap="$2" justifyContent="space-between">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={`rating-${value}`}
              flex={1}
              size="$4"
              backgroundColor={colors.cardBackground}
              borderWidth={1}
              borderColor="$gray5"
              icon={<Star size={16} color={ratingStarColor} />}
              onPress={() => handleRate(value)}
            >
              <Text color={colors.textPrimary} fontWeight="700">
                {value}
              </Text>
            </Button>
          ))}
        </XStack>
      </AppSheetModal>

      {isCourseCompleted && (
        <YStack
          position="absolute"
          left={0}
          right={0}
          bottom={0}
          padding="$4"
          paddingBottom={footerPaddingBottom}
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
          backgroundColor={colors.cardBackground}
          elevation={4}
        >
          <Text color={colors.stats.completed.icon} fontWeight="700">
            {t("Completed")}
          </Text>
        </YStack>
      )}
    </>
  );
}
