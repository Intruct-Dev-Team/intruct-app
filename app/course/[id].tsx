import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { coursesApi } from "@/services/api";
import type { Course, Module as CourseModule } from "@/types";
import {
  ArrowLeft,
  Globe,
  MoreVertical,
  Play,
  Star,
  Trash2,
} from "@tamagui/lucide-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import {
  Button,
  Card,
  H2,
  Progress,
  Sheet,
  Text,
  XStack,
  YStack,
} from "tamagui";

export default function CourseDetailPage() {
  const colors = useThemeColors();
  const router = useRouter();
  const { notify } = useNotifications();
  const { session } = useAuth();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const loadCourse = useCallback(
    async (courseId: string) => {
      setLoading(true);
      try {
        const c = await coursesApi.getCourseById(
          courseId,
          session?.access_token,
        );
        setCourse(c);
      } catch (err) {
        console.error(err);
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

  const handlePublish = async () => {
    if (!course || publishing) return;

    const token = session?.access_token;
    const courseId = course.backendId;

    if (!token || !courseId) {
      notify({ type: "error", message: "Couldn’t publish course." });
      return;
    }

    setPublishing(true);
    try {
      await coursesApi.publishCourse(token, courseId);
      setCourse({ ...course, isPublic: true });
      notify({ type: "success", message: "Course published." });
      setSettingsOpen(false);
    } catch {
      notify({ type: "error", message: "Couldn’t publish course." });
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = () => {
    if (!canDelete) return;
    notify({
      type: "error",
      message: "Course deletion isn’t supported yet.",
    });
    setSettingsOpen(false);
  };

  if (loading || !course) {
    return (
      <YStack flex={1} padding="$4" justifyContent="center" alignItems="center">
        <Stack.Screen options={{ headerShown: false }} />
        <Text color={colors.textSecondary}>Loading course...</Text>
      </YStack>
    );
  }

  const isMine = !!course.isMine;
  const canRate = !!course.isPublic && !isMine;
  const canPublish = !course.isPublic && isMine;
  const canDelete = isMine;

  const handleRate = async (reviewGrade: number) => {
    if (!canRate) return;

    try {
      await coursesApi.leaveReview(course.id, reviewGrade);
      notify({ type: "success", message: "Thanks for your review." });
      setRateOpen(false);
    } catch {
      notify({ type: "error", message: "Couldn’t submit review." });
    }
  };

  const modules = course.modules || [];
  const isSingleModule = modules.length <= 1;

  const percent =
    typeof course.progress === "number" && course.lessons && course.lessons > 0
      ? Math.round((course.progress / course.lessons) * 100)
      : 0;

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

                <Button
                  marginLeft="auto"
                  size="$3"
                  chromeless
                  icon={<MoreVertical size={18} color={colors.textPrimary} />}
                  onPress={() => setSettingsOpen(true)}
                />
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

              {typeof course.progress === "number" && (
                <YStack paddingTop="$2" space="$2">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text color={colors.textTertiary}>Course Progress</Text>
                    <Text color={colors.primary} fontWeight="600">
                      {course.progress}/{course.lessons} lessons
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
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <YStack gap="$3" marginTop="$2">
          <Text fontWeight="700" fontSize="$5" color={colors.textPrimary}>
            Course Content
          </Text>

          {isSingleModule
            ? modules[0]?.lessons.map((lesson, idx) => {
                const isLessonCompleted = idx < (course.progress || 0);
                return (
                  <Card
                    key={lesson.id}
                    padding="$4"
                    borderRadius="$6"
                    backgroundColor={colors.cardBackground}
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
                            Lesson {idx + 1}
                          </Text>

                          {isLessonCompleted && (
                            <YStack
                              paddingHorizontal="$3"
                              paddingVertical="$1"
                              borderRadius="$4"
                              backgroundColor={
                                colors.stats.completed.background
                              }
                            >
                              <Text
                                color={colors.stats.completed.icon}
                                fontSize="$2"
                              >
                                Completed
                              </Text>
                            </YStack>
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

                        {idx === course.progress && (
                          <Button
                            width="100%"
                            backgroundColor={colors.primary}
                            color="$white1"
                            borderRadius="$6"
                            fontWeight="600"
                            fontSize="$3"
                            icon={<Play size={16} color="$white1" />}
                            onPress={() => {
                              router.push(`/course/lesson/${lesson.id}`);
                            }}
                            marginTop="$3"
                          >
                            Start Lesson
                          </Button>
                        )}
                      </YStack>
                    </XStack>
                  </Card>
                );
              })
            : modules.map((mod: CourseModule, idx) => {
                // Calculate how many lessons were in previous modules to get the global index offset
                const moduleStartIndex = modules
                  .slice(0, idx)
                  .reduce((acc, m) => acc + m.lessons.length, 0);

                return (
                  <YStack key={mod.id} gap="$2">
                    <Text fontWeight="700" color={colors.textPrimary}>
                      Module {idx + 1}
                    </Text>
                    {mod.lessons.map((lesson, lidx) => {
                      const globalIndex = moduleStartIndex + lidx;
                      const isLessonCompleted =
                        globalIndex < (course.progress || 0);
                      const isCurrentLesson =
                        globalIndex === (course.progress || 0);

                      return (
                        <Card
                          key={lesson.id}
                          padding="$4"
                          borderRadius="$6"
                          backgroundColor={colors.cardBackground}
                          opacity={
                            !isLessonCompleted && !isCurrentLesson ? 0.6 : 1
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
                                  Lesson {lidx + 1}
                                </Text>
                                {isLessonCompleted && (
                                  <YStack
                                    paddingHorizontal="$3"
                                    paddingVertical="$1"
                                    borderRadius="$4"
                                    backgroundColor={
                                      colors.stats.completed.background
                                    }
                                  >
                                    <Text
                                      color={colors.stats.completed.icon}
                                      fontSize="$2"
                                    >
                                      Completed
                                    </Text>
                                  </YStack>
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
                                  icon={<Play size={16} color="$white1" />}
                                  onPress={() => {
                                    router.push(`/course/lesson/${lesson.id}`);
                                  }}
                                  marginTop="$3"
                                >
                                  Start Lesson
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

      <Sheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        modal
        snapPoints={[45]}
        dismissOnSnapToBottom
        dismissOnOverlayPress
      >
        <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

        <Sheet.Frame
          backgroundColor={colors.background}
          padding="$4"
          paddingBottom="$6"
          gap="$4"
        >
          <Sheet.Handle />

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$7" fontWeight="700" color={colors.textPrimary}>
              Settings
            </Text>
            <Button size="$3" chromeless onPress={() => setSettingsOpen(false)}>
              Close
            </Button>
          </XStack>

          <YStack gap="$3">
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
              Publish course
            </Button>

            <Button
              size="$5"
              backgroundColor="$red9"
              color="white"
              borderRadius="$6"
              fontWeight="700"
              disabled={!canDelete}
              opacity={!canDelete ? 0.7 : 1}
              icon={<Trash2 size={16} color="white" />}
              onPress={handleDelete}
            >
              Delete course
            </Button>

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
                icon={<Star size={16} color={colors.textSecondary} />}
                onPress={() => {
                  if (!canRate) return;
                  setSettingsOpen(false);
                  setRateOpen(true);
                }}
              >
                Rate course
              </Button>
            ) : null}
          </YStack>
        </Sheet.Frame>
      </Sheet>

      <Sheet
        open={rateOpen}
        onOpenChange={setRateOpen}
        modal
        snapPoints={[40]}
        dismissOnSnapToBottom
        dismissOnOverlayPress
      >
        <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

        <Sheet.Frame
          backgroundColor={colors.background}
          padding="$4"
          paddingBottom="$6"
          gap="$4"
        >
          <Sheet.Handle />

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="800" color={colors.textPrimary}>
              Rate this course
            </Text>
            <Text color={colors.textSecondary} fontSize="$4">
              Select a rating from 1 to 5.
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
                icon={<Star size={16} color={colors.textSecondary} />}
                onPress={() => handleRate(value)}
              >
                <Text color={colors.textPrimary} fontWeight="700">
                  {value}
                </Text>
              </Button>
            ))}
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
