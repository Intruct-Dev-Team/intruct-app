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
  activeCourseSnapshot: Course | null;
  localCourses: Course[];
  startCourseGeneration: (input: StartCourseGenerationInput) => string;
  openCreatingModal: (courseId: string, snapshot?: Course) => void;
  closeCreatingModal: () => void;
  getCourseById: (id: string) => Course | undefined;
  removeLocalCourseByBackendId: (backendId: number) => void;
  deletedBackendIds: number[];
  deleteCourseByBackendId: (backendId: number) => Promise<void>;
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
  const [activeCourseSnapshot, setActiveCourseSnapshot] =
    useState<Course | null>(null);
  const [deletedBackendIds, setDeletedBackendIds] = useState<number[]>([]);

  const isMountedRef = useRef(true);
  const pollInFlightRef = useRef(false);
  const localCoursesRef = useRef<Course[]>([]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    localCoursesRef.current = localCourses;
  }, [localCourses]);

  const generatingBackendIdsKey = useMemo(() => {
    const ids = localCourses
      .map((c) =>
        c.status === "generating" || c.state === "creation"
          ? c.backendId
          : undefined,
      )
      .filter((id): id is number => typeof id === "number")
      .sort((a, b) => a - b);
    return ids.length ? ids.join(",") : "";
  }, [localCourses]);

  useEffect(() => {
    const token = session?.access_token;
    if (!token) return;
    if (!generatingBackendIdsKey) return;

    let cancelled = false;

    const tick = async () => {
      if (pollInFlightRef.current) return;
      pollInFlightRef.current = true;

      try {
        const backendIds = generatingBackendIdsKey
          .split(",")
          .map((v) => Number(v))
          .filter((v) => Number.isFinite(v) && v > 0);

        for (const backendId of backendIds) {
          if (cancelled) return;

          try {
            const stateRes = await coursesApi.getCourseState(token, backendId);
            const state = stateRes.state;

            if (state === "creation") {
              const local = localCoursesRef.current.find(
                (c) => c.backendId === backendId,
              );
              const createdAtMs = local?.createdAt
                ? Date.parse(local.createdAt)
                : NaN;
              const isCreatedAtValid = Number.isFinite(createdAtMs);
              const ageMs = isCreatedAtValid ? Date.now() - createdAtMs : 0;
              const maxAgeMs = 24 * 60 * 60 * 1000;

              if (isCreatedAtValid && ageMs >= maxAgeMs) {
                setLocalCourses((prev) =>
                  prev.map((c) =>
                    c.backendId === backendId
                      ? {
                          ...c,
                          state: "failed",
                          status: "failed",
                          updatedAt: new Date().toISOString(),
                        }
                      : c,
                  ),
                );
                continue;
              }

              // Keep local state in sync while still generating
              setLocalCourses((prev) =>
                prev.map((c) =>
                  c.backendId === backendId && c.status !== "failed"
                    ? {
                        ...c,
                        state: "creation",
                        status: "generating",
                        updatedAt: new Date().toISOString(),
                      }
                    : c,
                ),
              );
              continue;
            }

            if (state === "failed") {
              setLocalCourses((prev) =>
                prev.map((c) =>
                  c.backendId === backendId
                    ? {
                        ...c,
                        state,
                        status: "failed",
                        updatedAt: new Date().toISOString(),
                      }
                    : c,
                ),
              );
              continue;
            }

            if (state === "created" || state === "published") {
              const full = await coursesApi.getCourseById(
                String(backendId),
                token,
              );
              if (!full) continue;

              setLocalCourses((prev) =>
                prev.map((c) => {
                  if (c.backendId !== backendId) return c;

                  return {
                    ...c,
                    ...full,
                    // Keep the local placeholder id stable (modal uses it)
                    id: c.id,
                    backendId,
                    state,
                    status: "ready",
                  };
                }),
              );
            }
          } catch (err) {
            console.error("[CourseGeneration] state poll failed", err);
          }
        }
      } finally {
        pollInFlightRef.current = false;
      }
    };

    void tick();
    const interval = setInterval(() => {
      void tick();
    }, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [generatingBackendIdsKey, session?.access_token]);

  const closeCreatingModal = useCallback(() => {
    setCreatingModalOpen(false);
    setActiveCourseId(null);
    setActiveCourseSnapshot(null);
  }, []);

  const openCreatingModal = useCallback(
    (courseId: string, snapshot?: Course) => {
      setActiveCourseId(courseId);
      setActiveCourseSnapshot(snapshot ?? null);
      setCreatingModalOpen(true);
    },
    [],
  );

  const getCourseById = useCallback(
    (id: string) => localCourses.find((c) => c.id === id),
    [localCourses],
  );

  const removeLocalCourseByBackendId = useCallback((backendId: number) => {
    if (!backendId) return;
    setLocalCourses((prev) => prev.filter((c) => c.backendId !== backendId));
  }, []);

  const deleteCourseByBackendId = useCallback(
    async (backendId: number) => {
      const token = session?.access_token;
      if (!token || !backendId) {
        notify({ type: "error", message: "Couldn’t delete course." });
        return;
      }

      try {
        await coursesApi.deleteCourse(token, backendId);

        setDeletedBackendIds((prev) =>
          prev.includes(backendId) ? prev : [...prev, backendId],
        );
        removeLocalCourseByBackendId(backendId);
        closeCreatingModal();

        notify({ type: "success", message: "Course deleted." });
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Couldn’t delete course.";
        notify({ type: "error", message });
      }
    },
    [
      closeCreatingModal,
      notify,
      removeLocalCourseByBackendId,
      session?.access_token,
    ],
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
        state: "creation",
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
      activeCourseSnapshot,
      localCourses,
      startCourseGeneration,
      openCreatingModal,
      closeCreatingModal,
      getCourseById,
      removeLocalCourseByBackendId,
      deletedBackendIds,
      deleteCourseByBackendId,
    }),
    [
      creatingModalOpen,
      activeCourseId,
      activeCourseSnapshot,
      localCourses,
      startCourseGeneration,
      openCreatingModal,
      closeCreatingModal,
      getCourseById,
      removeLocalCourseByBackendId,
      deletedBackendIds,
      deleteCourseByBackendId,
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
