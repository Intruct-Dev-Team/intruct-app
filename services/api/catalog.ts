import type { Course, SortOption } from "@/types";

import { DELAYS, delay } from "./core";
import { coursesApi } from "./courses";
import { profileApi } from "./profile";

export const catalogApi = {
  async searchCourses(
    token: string,
    params: {
      query?: string;
      category?: string;
      sortBy?: SortOption;
    },
  ): Promise<Course[]> {
    await delay(DELAYS.catalog);

    let results = await coursesApi.getFeaturedCourses(token);

    const authorIds = Array.from(
      new Set(
        results
          .map((c) => c.authorId)
          .filter((id): id is number => typeof id === "number"),
      ),
    );

    if (authorIds.length > 0) {
      const pairs = await Promise.all(
        authorIds.map(async (authorId) => {
          try {
            const profile = await profileApi.getUserById(authorId);
            const fullName = `${profile.name} ${profile.surname}`.trim();
            return [
              authorId,
              { name: fullName, avatar: profile.avatar },
            ] as const;
          } catch (err) {
            console.warn("Failed to resolve author profile", authorId, err);
            return [authorId, { name: "", avatar: "" }] as const;
          }
        }),
      );

      const authorMap = new Map<number, { name: string; avatar: string }>(
        pairs,
      );
      results = results.map((course) => {
        if (typeof course.authorId !== "number") return course;
        const authorInfo = authorMap.get(course.authorId);
        if (!authorInfo) return course;

        const name = authorInfo.name?.trim();
        const avatar = authorInfo.avatar?.trim();

        return {
          ...course,
          author: name || undefined,
          authorAvatarUrl: avatar || undefined,
        };
      });
    }

    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.author?.toLowerCase().includes(query),
      );
    }

    if (params.category && params.category !== "all") {
      results = results.filter((course) => course.category === params.category);
    }

    if (params.sortBy) {
      const sortFn = (a: Course, b: Course): number => {
        switch (params.sortBy) {
          case "popular":
          case "students":
            return (b.students || 0) - (a.students || 0);
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      };
      results.sort(sortFn);
    }

    return results;
  },
};
