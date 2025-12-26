import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Course } from "@/types";

const CREATION_STEPS = [
  "Processing materials",
  "Creating course plan",
  "Writing lessons",
] as const;

type StartCourseGenerationInput = {
  title: string;
  description: string;
  files: string[];
  links: string[];
  contentLanguage: string;
};

export type GeneratingCourse = {
  id: string;
  title: string;
  description: string;
  contentLanguage: string;
  progress: number; // 0..100
  currentStepIndex: number;
  isComplete: boolean;
};

type CourseGenerationContextValue = {
  creatingModalOpen: boolean;
  activeGeneratingCourseId: string | null;
  generatingCourses: GeneratingCourse[];
  createdCourses: Course[];
  creationSteps: readonly string[];
  startCourseGeneration: (input: StartCourseGenerationInput) => string;
  openCreatingModal: (generatingCourseId: string) => void;
  closeCreatingModal: () => void;
  getGeneratingCourseById: (id: string) => GeneratingCourse | undefined;
};

const CourseGenerationContext =
  createContext<CourseGenerationContextValue | null>(null);

export function CourseGenerationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [generatingCourses, setGeneratingCourses] = useState<
    GeneratingCourse[]
  >([]);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [creatingModalOpen, setCreatingModalOpen] = useState(false);
  const [activeGeneratingCourseId, setActiveGeneratingCourseId] = useState<
    string | null
  >(null);

  const timersRef = useRef<
    Record<
      string,
      {
        progress?: ReturnType<typeof setInterval>;
        step?: ReturnType<typeof setInterval>;
      }
    >
  >({});
  const convertedRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    return () => {
      // Cleanup all intervals on unmount
      const entries = Object.values(timersRef.current);
      entries.forEach((t) => {
        if (t.progress) clearInterval(t.progress);
        if (t.step) clearInterval(t.step);
      });
      timersRef.current = {};
    };
  }, []);

  const getGeneratingCourseById = useCallback(
    (id: string) => generatingCourses.find((c) => c.id === id),
    [generatingCourses]
  );

  const closeCreatingModal = useCallback(() => setCreatingModalOpen(false), []);

  const openCreatingModal = useCallback((generatingCourseId: string) => {
    setActiveGeneratingCourseId(generatingCourseId);
    setCreatingModalOpen(true);
  }, []);

  useEffect(() => {
    // Convert completed generations into real courses.
    const completed = generatingCourses.filter((c) => c.isComplete);
    completed.forEach((course) => {
      if (convertedRef.current[course.id]) return;
      convertedRef.current[course.id] = true;

      const timers = timersRef.current[course.id];
      if (timers?.progress) clearInterval(timers.progress);
      if (timers?.step) clearInterval(timers.step);
      delete timersRef.current[course.id];

      const now = new Date().toISOString();
      const lessons = Math.floor(Math.random() * 10) + 5;

      const createdCourse: Course = {
        id: Date.now().toString(),
        title: course.title,
        description: course.description,
        lessons,
        progress: 0,
        createdAt: now,
        updatedAt: now,
      };

      setCreatedCourses((prev) => [createdCourse, ...prev]);

      // Keep the completed state visible briefly if the modal is currently open
      // for this generating item, then close and remove it.
      const isActive = activeGeneratingCourseId === course.id;

      const finalize = () => {
        setGeneratingCourses((prev) => prev.filter((c) => c.id !== course.id));
        setActiveGeneratingCourseId((current) =>
          current === course.id ? null : current
        );
        setCreatingModalOpen((open) => (isActive ? false : open));
      };

      if (isActive) {
        setTimeout(finalize, 1500);
      } else {
        finalize();
      }
    });
  }, [generatingCourses, activeGeneratingCourseId]);

  const startCourseGeneration = useCallback(
    (input: StartCourseGenerationInput) => {
      const id = `gen_${Date.now()}`;

      const title = input.title.trim() || "Untitled Course";
      const description = input.description.trim() || "Generating course...";

      const newGeneratingCourse: GeneratingCourse = {
        id,
        title,
        description,
        contentLanguage: input.contentLanguage,
        progress: 0,
        currentStepIndex: 0,
        isComplete: false,
      };

      setGeneratingCourses((prev) => [newGeneratingCourse, ...prev]);
      openCreatingModal(id);

      const stepDurationMs = 2500;
      const progressIntervalMs = 75;
      const totalDurationMs = stepDurationMs * CREATION_STEPS.length;
      const increment = (progressIntervalMs / totalDurationMs) * 100;

      const progressTimer = setInterval(() => {
        setGeneratingCourses((prev) =>
          prev.map((course) => {
            if (course.id !== id) return course;
            if (course.isComplete) return course;

            const nextProgress = Math.min(100, course.progress + increment);
            const isComplete = nextProgress >= 100;
            return {
              ...course,
              progress: nextProgress,
              isComplete,
            };
          })
        );
      }, progressIntervalMs);

      const stepTimer = setInterval(() => {
        setGeneratingCourses((prev) =>
          prev.map((course) => {
            if (course.id !== id) return course;
            if (course.currentStepIndex >= CREATION_STEPS.length - 1)
              return course;
            return { ...course, currentStepIndex: course.currentStepIndex + 1 };
          })
        );
      }, stepDurationMs);

      timersRef.current[id] = { progress: progressTimer, step: stepTimer };

      return id;
    },
    [openCreatingModal]
  );

  const value = useMemo<CourseGenerationContextValue>(
    () => ({
      creatingModalOpen,
      activeGeneratingCourseId,
      generatingCourses,
      createdCourses,
      creationSteps: CREATION_STEPS,
      startCourseGeneration,
      openCreatingModal,
      closeCreatingModal,
      getGeneratingCourseById,
    }),
    [
      creatingModalOpen,
      activeGeneratingCourseId,
      generatingCourses,
      createdCourses,
      startCourseGeneration,
      openCreatingModal,
      closeCreatingModal,
      getGeneratingCourseById,
    ]
  );

  return (
    <CourseGenerationContext.Provider value={value}>
      {children}
    </CourseGenerationContext.Provider>
  );
}

export function useCourseGeneration() {
  const ctx = useContext(CourseGenerationContext);
  if (!ctx) {
    throw new Error(
      "useCourseGeneration must be used within CourseGenerationProvider"
    );
  }
  return ctx;
}
