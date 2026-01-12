import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNotifications } from "@/contexts/NotificationsContext";
import { coursesApi } from "@/services/api";
import type { Course } from "@/types";

type StartCourseGenerationInput = {
  title: string;
  description: string;
  files: string[];
  links: string[];
  contentLanguage: string;
};

type CourseGenerationContextValue = {
  creatingModalOpen: boolean;
  activeCourseId: string | null;
  localCourses: Course[];
  startCourseGeneration: (input: StartCourseGenerationInput) => string;
  openCreatingModal: (courseId: string) => void;
  closeCreatingModal: () => void;
  getCourseById: (id: string) => Course | undefined;
};

const CourseGenerationContext =
  createContext<CourseGenerationContextValue | null>(null);

export function CourseGenerationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { notify } = useNotifications();

  const [localCourses, setLocalCourses] = useState<Course[]>([]);
  const [creatingModalOpen, setCreatingModalOpen] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const closeCreatingModal = useCallback(() => {
    setCreatingModalOpen(false);
  }, []);

  const openCreatingModal = useCallback((courseId: string) => {
    setActiveCourseId(courseId);
    setCreatingModalOpen(true);
  }, []);

  const getCourseById = useCallback(
    (id: string) => localCourses.find((c) => c.id === id),
    [localCourses]
  );

  const startCourseGeneration = useCallback(
    (input: StartCourseGenerationInput) => {
      notify({
        type: "info",
        title: "Creating course",
        message: "Course generation started.",
      });

      const now = new Date().toISOString();
      const id = `course_${Date.now()}`;

      const title = input.title.trim() || "Untitled Course";
      const description = input.description.trim() || "";

      const generatingCourse: Course = {
        id,
        title,
        description,
        lessons: 0,
        createdAt: now,
        updatedAt: now,
        status: "generating",
      };

      setLocalCourses((prev) => [generatingCourse, ...prev]);
      openCreatingModal(id);

      void (async () => {
        try {
          const created = await coursesApi.createCourse({
            title,
            description,
            files: input.files,
            links: input.links,
          });

          if (!isMountedRef.current) return;

          setLocalCourses((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...created,
                    id,
                    status: "ready",
                  }
                : c
            )
          );
        } catch (err) {
          console.error(err);
          if (!isMountedRef.current) return;

          notify({
            type: "error",
            title: "Course creation failed",
            message: "Something went wrong. Please try again.",
          });
        }
      })();

      return id;
    },
    [notify, openCreatingModal]
  );

  const value = useMemo<CourseGenerationContextValue>(
    () => ({
      creatingModalOpen,
      activeCourseId,
      localCourses,
      startCourseGeneration,
      openCreatingModal,
      closeCreatingModal,
      getCourseById,
    }),
    [
      creatingModalOpen,
      activeCourseId,
      localCourses,
      startCourseGeneration,
      openCreatingModal,
      closeCreatingModal,
      getCourseById,
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
