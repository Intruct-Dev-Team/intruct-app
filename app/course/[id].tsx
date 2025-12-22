import { useThemeColors } from "@/hooks/use-theme-colors";
import { coursesApi } from "@/services/api";
import type { Course, Module as CourseModule } from "@/types";
import { ArrowLeft, Play } from "@tamagui/lucide-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Button, Card, H2, Progress, Text, XStack, YStack } from "tamagui";

export default function CourseDetailPage() {
  const colors = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadCourse(id);
  }, [id]);

  const loadCourse = async (courseId: string) => {
    setLoading(true);
    try {
      const c = await coursesApi.getCourseById(courseId);
      setCourse(c);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !course) {
    return (
      <YStack flex={1} padding="$4" justifyContent="center" alignItems="center">
        <Stack.Screen options={{ headerShown: false }} />
        <Text color={colors.textSecondary}>Loading course...</Text>
      </YStack>
    );
  }

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
    </>
  );
}
