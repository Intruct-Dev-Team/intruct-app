import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { PickedFile } from "@/components/create-course/attach-materials-step";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { ApiError, coursesApi } from "@/services/api";
import type { Course } from "@/types";

type StartCourseGenerationInput = {
  title: string;
  description: string;
  files: PickedFile[];
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
  const { session } = useAuth();

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
    [localCourses],
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
          const accessToken = session?.access_token;
          if (!accessToken) throw new Error("Authentication token is required");

          const firstFile = input.files[0];
          if (!firstFile) throw new Error("At least one file is required");

          const nameLower = (firstFile.name || "").toLowerCase();
          const inferredType = nameLower.endsWith(".pdf")
            ? "application/pdf"
            : nameLower.endsWith(".txt")
              ? "text/plain"
              : undefined;

          const backendCourseId = await coursesApi.createCourse(accessToken, {
            title,
            description,
            file: {
              uri: firstFile.uri,
              name: firstFile.name,
              type: firstFile.mimeType || inferredType,
            },
            language: input.contentLanguage,
          });

          if (!isMountedRef.current) return;

          setLocalCourses((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...c,
                    backendId: backendCourseId,
                    status: "generating",
                    updatedAt: new Date().toISOString(),
                  }
                : c,
            ),
          );
        } catch (err) {
          console.error("[CourseGeneration Error]", err);
          if (!isMountedRef.current) return;

          const errorMessage =
            err instanceof ApiError
              ? err.message
              : "Something went wrong. Please try again.";

          setLocalCourses((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...c,
                    status: "failed",
                    updatedAt: new Date().toISOString(),
                  }
                : c,
            ),
          );

          notify({
            type: "error",
            title: "Course creation failed",
            message: errorMessage,
          });
        }
      })();

      return id;
    },
    [notify, openCreatingModal, session?.access_token],
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
    ],
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
      "useCourseGeneration must be used within CourseGenerationProvider",
    );
  }
  return ctx;
}
