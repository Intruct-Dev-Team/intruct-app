import AsyncStorage from "@react-native-async-storage/async-storage";

import { isRecord } from "./core";

const LESSON_COMPLETION_STORAGE_KEY = "intruct.lessonCompletion.v1";

type LessonCompletionStorage = {
  version: 1;
  completedByCourse: Record<string, string[]>;
};

let didLoadLessonCompletionFromStorage = false;
let inMemoryLessonCompletion: LessonCompletionStorage = {
  version: 1,
  completedByCourse: {},
};

export const loadLessonCompletionFromStorage = async (): Promise<void> => {
  if (didLoadLessonCompletionFromStorage) return;

  try {
    const raw = await AsyncStorage.getItem(LESSON_COMPLETION_STORAGE_KEY);
    didLoadLessonCompletionFromStorage = true;
    if (!raw) return;

    const parsed = JSON.parse(raw) as Partial<LessonCompletionStorage> | null;
    if (
      parsed &&
      isRecord(parsed) &&
      parsed.version === 1 &&
      isRecord(parsed.completedByCourse)
    ) {
      inMemoryLessonCompletion = {
        version: 1,
        completedByCourse: parsed.completedByCourse as Record<string, string[]>,
      };
    }
  } catch {
    // Silent, but allow retry next time (avoid overwriting existing data)
    didLoadLessonCompletionFromStorage = false;
  }
};

const saveLessonCompletionToStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      LESSON_COMPLETION_STORAGE_KEY,
      JSON.stringify(inMemoryLessonCompletion),
    );
  } catch {
    // Silent
  }
};

const normalizeCourseKey = (courseKey: string): string => {
  return courseKey.trim();
};

const getCompletedLessonIdsForCourse = (courseKey: string): Set<string> => {
  const key = normalizeCourseKey(courseKey);
  const raw = inMemoryLessonCompletion.completedByCourse[key] ?? [];
  return new Set(raw.filter((id) => typeof id === "string" && id.length > 0));
};

export const getCompletedCountForCourse = (courseKey: string): number => {
  return getCompletedLessonIdsForCourse(courseKey).size;
};

export const lessonProgressApi = {
  async markLessonCompleted(
    courseKey: string,
    lessonId: string,
  ): Promise<void> {
    await loadLessonCompletionFromStorage();

    const key = normalizeCourseKey(courseKey);
    if (!key || typeof lessonId !== "string" || lessonId.length === 0) return;

    const set = getCompletedLessonIdsForCourse(key);
    if (set.has(lessonId)) return;

    set.add(lessonId);
    inMemoryLessonCompletion.completedByCourse[key] = Array.from(set);
    await saveLessonCompletionToStorage();
  },

  async getCompletedLessonIds(courseKey: string): Promise<Set<string>> {
    await loadLessonCompletionFromStorage();
    return getCompletedLessonIdsForCourse(courseKey);
  },

  async getCompletedCount(courseKey: string): Promise<number> {
    await loadLessonCompletionFromStorage();
    return getCompletedCountForCourse(courseKey);
  },

  // Reset in-memory cache (called on sign out)
  resetCache(): void {
    didLoadLessonCompletionFromStorage = false;
    inMemoryLessonCompletion = {
      version: 1,
      completedByCourse: {},
    };
  },
};
