import {
  CatalogCourseCard,
  CatalogCourseCardSkeleton,
} from "@/components/cards";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ApiError, catalogApi } from "@/services/api";
import type { Course, SortOption } from "@/types";
import { ArrowDown, ArrowUp, Filter, Search } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { Button, H1, Input, ScrollView, Text, XStack, YStack } from "tamagui";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
];

type SortDirection = "asc" | "desc";

export default function CatalogScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { session } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const sortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Popular";

  useEffect(() => {
    void loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy, sortDirection, session?.access_token]);

  const loadCourses = async (opts?: { showLoading?: boolean }) => {
    const showLoading = opts?.showLoading ?? true;
    if (showLoading) setLoading(true);

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
        sortBy,
        sortDirection,
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
      if (showLoading) setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadCourses({ showLoading: false });
    } finally {
      setRefreshing(false);
    }
  };

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
  );

  return (
    <YStack flex={1} backgroundColor={colors.background}>
      <YStack backgroundColor={colors.cardBackground}>
        <YStack padding="$4" paddingTop="$5" gap="$0">
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

            <Button
              width={48}
              height={48}
              padding={0}
              backgroundColor={
                filtersExpanded ? colors.primary : colors.background
              }
              borderRadius="$4"
              icon={
                <Filter
                  size={20}
                  color={
                    filtersExpanded ? colors.primaryText : colors.textTertiary
                  }
                />
              }
              onPress={() => setFiltersExpanded(!filtersExpanded)}
            />
          </XStack>

          {filtersExpanded && (
            <YStack gap="$4" animation="quick">
              <YStack gap="$2" marginTop="$2">
                <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
                  Sort by
                </Text>

                <XStack gap="$2" alignItems="stretch">
                  <Button
                    width={120}
                    height={40}
                    backgroundColor={colors.cardBackground}
                    borderRadius="$4"
                    borderWidth={1}
                    borderColor="$gray5"
                    color={colors.textPrimary}
                    fontSize="$3"
                    fontWeight="700"
                    justifyContent="flex-start"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={() => {
                      const currentIndex = sortOptions.findIndex(
                        (opt) => opt.value === sortBy,
                      );
                      const nextIndex = (currentIndex + 1) % sortOptions.length;
                      setSortBy(sortOptions[nextIndex].value);
                    }}
                  >
                    {sortLabel}
                  </Button>

                  <Button
                    width={48}
                    height={40}
                    padding={0}
                    backgroundColor={colors.cardBackground}
                    borderRadius="$4"
                    borderWidth={1}
                    borderColor="$gray5"
                    pressStyle={{ opacity: 0.8 }}
                    icon={
                      sortDirection === "desc" ? (
                        <ArrowDown size={18} color={colors.textPrimary} />
                      ) : (
                        <ArrowUp size={18} color={colors.textPrimary} />
                      )
                    }
                    onPress={() =>
                      setSortDirection((prev) =>
                        prev === "desc" ? "asc" : "desc",
                      )
                    }
                  />
                </XStack>
              </YStack>
            </YStack>
          )}
        </YStack>
      </YStack>

      <ScrollView refreshControl={refreshControl}>
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
              <Button onPress={() => void loadCourses({ showLoading: true })}>
                Retry
              </Button>
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
