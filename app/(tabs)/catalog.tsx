import {
  CatalogCourseCard,
  CatalogCourseCardSkeleton,
} from "@/components/cards";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { courseCategories } from "@/mockdata/courses";
import { catalogApi } from "@/services/api";
import type { Course, SortOption } from "@/types";
import { ChevronDown, Filter, Search } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { H1, Input, ScrollView, Text, XStack, YStack } from "tamagui";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "students", label: "Most Students" },
];

export default function CatalogScreen() {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, sortBy]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const results = await catalogApi.searchCourses({
        query: searchQuery,
        category: selectedCategory,
        sortBy,
      });
      setCourses(results);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSortLabel = () => {
    return sortOptions.find((opt) => opt.value === sortBy)?.label || "Popular";
  };

  return (
    <YStack flex={1} backgroundColor={colors.background}>
      {/* Header with white background */}
      <YStack backgroundColor={colors.cardBackground}>
        <YStack padding="$4" paddingTop="$6" gap="$0">
          {/* Title */}
          <H1 fontSize="$9" fontWeight="700" color={colors.textPrimary}>
            Catalog
          </H1>

          {/* Search Bar */}
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

          {/* Expandable Filters */}
          {filtersExpanded && (
            <YStack gap="$4" animation="quick">
              {/* Category Filter */}
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

              {/* Sort By */}
              <YStack gap="$2">
                <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
                  Sort by
                </Text>
                <Pressable
                  onPress={() => {
                    const currentIndex = sortOptions.findIndex(
                      (opt) => opt.value === sortBy
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

      {/* Content */}
      <ScrollView>
        <YStack padding="$4" gap="$4" paddingBottom="$8">
          {/* Results Count */}
          <Text fontSize="$3" color={colors.textSecondary}>
            {courses.length} courses found
          </Text>

          {/* Course List */}
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
              courses.map((course) => (
                <CatalogCourseCard
                  key={course.id}
                  course={course}
                  onEnroll={() => console.log("Enroll in:", course.title)}
                />
              ))
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
