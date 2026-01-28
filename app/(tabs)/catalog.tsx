import {
  CatalogCourseCard,
  CatalogCourseCardSkeleton,
} from "@/components/cards";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { courseCategories } from "@/mockdata/courses";
import { ApiError, catalogApi } from "@/services/api";
import type { Course, SortOption } from "@/types";
import { ChevronDown, Filter, Search } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Button, H1, Input, ScrollView, Text, XStack, YStack } from "tamagui";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "students", label: "Most Students" },
];

export default function CatalogScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { session } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    void loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, sortBy, session?.access_token]);

  const loadCourses = async () => {
    setLoading(true);
    setCoursesError(null);
    try {
      const token = session?.access_token;
      if (!token) {
        setCourses([]);
        setCoursesError("Sign in to browse the catalog.");
        return;
      }

      const results = await catalogApi.searchCourses(token, {
        query: searchQuery,
        category: selectedCategory,
        sortBy,
      });
      setCourses(results);
    } catch (error) {
      console.error("Failed to load courses:", error);
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to load courses.";
      setCoursesError(message);
    } finally {
      setLoading(false);
    }
  };

  const getSortLabel = () => {
    return sortOptions.find((opt) => opt.value === sortBy)?.label || "Popular";
  };

  return (
    <YStack flex={1} backgroundColor={colors.background}>
      <YStack backgroundColor={colors.cardBackground}>
        <YStack padding="$4" paddingTop="$6" gap="$0">
          <H1 fontSize="$9" fontWeight="700" color={colors.textPrimary}>
            Catalog
          </H1>

          <XStack gap="$2" alignItems="center">
            <YStack flex={1} position="relative">
              <Input
                flex={1}
                size="$4"
                placeholder="Search courses..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                backgroundColor={colors.background}
                paddingLeft="$10"
                borderRadius="$4"
                borderWidth={0}
              />
              <YStack
                position="absolute"
                left="$3"
                top={0}
                bottom={0}
                justifyContent="center"
              >
                <Search size={20} color={colors.textTertiary} />
              </YStack>
            </YStack>
            <Pressable onPress={() => setFiltersExpanded(!filtersExpanded)}>
              <YStack
                width={48}
                height={48}
                alignItems="center"
                justifyContent="center"
                backgroundColor={filtersExpanded ? "$blue9" : colors.background}
                borderRadius="$4"
              >
                <Filter
                  size={20}
                  color={filtersExpanded ? "white" : colors.textTertiary}
                />
              </YStack>
            </Pressable>
          </XStack>

          {filtersExpanded && (
            <YStack gap="$4" animation="quick">
              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
                  Category
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap="$2">
                    {courseCategories.map((category) => (
                      <Pressable
                        key={category.id}
                        onPress={() => setSelectedCategory(category.slug)}
                      >
                        <YStack
                          paddingHorizontal="$4"
                          paddingVertical="$2.5"
                          backgroundColor={
                            selectedCategory === category.slug
                              ? colors.primary
                              : colors.background
                          }
                          borderRadius="$10"
                        >
                          <Text
                            fontSize="$4"
                            fontWeight={
                              selectedCategory === category.slug ? "600" : "400"
                            }
                            color={
                              selectedCategory === category.slug
                                ? "white"
                                : colors.textPrimary
                            }
                          >
                            {category.name}
                          </Text>
                        </YStack>
                      </Pressable>
                    ))}
                  </XStack>
                </ScrollView>
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
                  Sort by
                </Text>
                <Pressable
                  onPress={() => {
                    const currentIndex = sortOptions.findIndex(
                      (opt) => opt.value === sortBy,
                    );
                    const nextIndex = (currentIndex + 1) % sortOptions.length;
                    setSortBy(sortOptions[nextIndex].value);
                  }}
                >
                  <XStack
                    padding="$4"
                    backgroundColor={colors.background}
                    borderRadius="$4"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text fontSize="$4" color={colors.textPrimary}>
                      {getSortLabel()}
                    </Text>
                    <ChevronDown size={20} color={colors.textTertiary} />
                  </XStack>
                </Pressable>
              </YStack>
            </YStack>
          )}
        </YStack>
      </YStack>

      <ScrollView>
        <YStack padding="$4" gap="$4" paddingBottom="$8">
          <Text fontSize="$3" color={colors.textSecondary}>
            {courses.length} courses found
          </Text>

          {coursesError ? (
            <YStack
              padding="$4"
              borderRadius="$4"
              backgroundColor={colors.cardBackground}
              gap="$3"
            >
              <Text color={colors.textPrimary} fontSize="$5" fontWeight="600">
                Couldn’t load catalog
              </Text>
              <Text color={colors.textSecondary}>{coursesError}</Text>
              <Button onPress={loadCourses}>Retry</Button>
            </YStack>
          ) : null}

          <YStack gap="$3">
            {loading ? (
              <>
                <CatalogCourseCardSkeleton />
                <CatalogCourseCardSkeleton />
                <CatalogCourseCardSkeleton />
              </>
            ) : courses.length === 0 ? (
              <YStack padding="$8" alignItems="center">
                <Text color={colors.textSecondary}>No courses found</Text>
              </YStack>
            ) : (
              courses.map((course) => {
                const courseId =
                  typeof course.backendId === "number"
                    ? String(course.backendId)
                    : course.id;
                return (
                  <CatalogCourseCard
                    key={course.id}
                    course={course}
                    onEnroll={() => router.push(`/course/${courseId}` as any)}
                  />
                );
              })
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
