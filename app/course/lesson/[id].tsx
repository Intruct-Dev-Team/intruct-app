import FlashcardView from "@/components/lesson/FlashcardView";
import LessonMaterialView from "@/components/lesson/LessonMaterialView";
import TestView from "@/components/lesson/TestView";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { mockCourses } from "@/mockdata/courses";
import { Course, Lesson } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack, getTokenValue } from "tamagui";

type LessonPhase = "material" | "flashcards" | "test";

export default function LessonScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colors = useThemeColors();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [courseTitle, setCourseTitle] = useState("");
    const [phase, setPhase] = useState<LessonPhase>("material");
    const [completedPhases, setCompletedPhases] = useState<string[]>([]);
    const [currentPhaseProgress, setCurrentPhaseProgress] = useState(0);

    const resolveThemeColor = (color: string) => {
        return color.startsWith("$") ? getTokenValue(color as any) : color;
    };

    // Find lesson data
    useEffect(() => {
        if (typeof id !== "string") return;

        // Naive search in mock data
        let foundLesson: Lesson | undefined;
        let foundCourse: Course | undefined;

        for (const course of mockCourses) {
            for (const module of course.modules || []) {
                const l = module.lessons.find((l) => l.id === id);
                if (l) {
                    foundLesson = l;
                    foundCourse = course;
                    break;
                }
            }
            if (foundLesson) break;
        }

        if (foundLesson) {
            setLesson(foundLesson);
            setCourseTitle(foundCourse?.title || "");
        }
    }, [id]);

    if (!lesson) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: resolveThemeColor(colors.background) }} edges={['bottom']}>
                <Stack.Screen options={{ title: "Loading..." }} />
                <YStack flex={1} justifyContent="center" alignItems="center">
                    <Text color={colors.textSecondary}>Loading lesson...</Text>
                </YStack>
            </SafeAreaView>
        );
    }

    const handleMaterialComplete = () => {
        setCompletedPhases((prev) => [...prev, "material"]);
        if (lesson.flashcards && lesson.flashcards.length > 0) {
            setPhase("flashcards");
        } else if (lesson.questions && lesson.questions.length > 0) {
            setPhase("test");
        } else {
            router.back();
        }
    };

    const handleFlashcardsComplete = () => {
        setCompletedPhases((prev) => [...prev, "flashcards"]);
        if (lesson.questions && lesson.questions.length > 0) {
            setPhase("test");
        } else {
            router.back();
        }
    };

    const handleTestComplete = (score: number) => {
        setCompletedPhases((prev) => [...prev, "test"]);
        console.log("Test completed with score:", score);
        router.back();
    };



    const renderContent = () => {
        switch (phase) {
            case "material":
                return (
                    <LessonMaterialView
                        title={lesson.title}
                        courseTitle={courseTitle}
                        materials={lesson.materials || []}
                        onComplete={handleMaterialComplete}
                        nextLabel={lesson.flashcards?.length ? "Start Flashcards" : "Next"}
                    />
                );
            case "flashcards":
                return (
                    <FlashcardView
                        cards={lesson.flashcards || []}
                        onComplete={handleFlashcardsComplete}
                        onProgress={(index) => setCurrentPhaseProgress(index)}
                    />
                );
            case "test":
                return (
                    <TestView
                        questions={lesson.questions || []}
                        onComplete={handleTestComplete}
                        onProgress={(index) => setCurrentPhaseProgress(index)}
                    />
                );
        }
    };

    const getProgress = () => {
        // Calculate total granular steps
        // 1 for Material
        // N for Flashcards
        // M for Questions
        const totalSteps = 1 + (lesson.flashcards?.length || 0) + (lesson.questions?.length || 0);

        let completedSteps = 0;

        // Add 1 if Material is done logic needs to be robust. 
        // Logic: if phase is "flashcards", material is done. If phase is "test", flashcards done.
        // Actually simpler:

        if (completedPhases.includes("material")) {
            completedSteps += 1;
        }

        if (completedPhases.includes("flashcards")) {
            completedSteps += (lesson.flashcards?.length || 0);
        }

        if (completedPhases.includes("test")) {
            // If test is fully complete
            completedSteps += (lesson.questions?.length || 0);
        } else {
            // If we are IN a phase, add the granular progress
            // Note: currentPhaseProgress is 0-indexed index of CURRENT item.
            // So if index is 0, we have completed 0 items of this phase? 
            // Usually UI shows "Question 1 of N", which means we are working on 1.
            // Let's say progress means "Completed".
            // If I am on Card 1 (index 0), I have completed 0 cards.
            // If I am on Card 2 (index 1), I have completed 1 card.
            // So adding `currentPhaseProgress` is correct for "completed items count".
            if (phase === "flashcards") {
                completedSteps += currentPhaseProgress;
            } else if (phase === "test") {
                completedSteps += currentPhaseProgress;
            }
        }

        // Special case: If we are in Material phase (not yet complete), we want to show SOME progress (e.g. 5%)
        // The previous logic `Math.max(5, ...)` handles the visual "not empty" state.
        // Let's refine:
        // If material is active, we treat "completedSteps" as effectively 0 (or small baseline).

        // Ensure at least a little bit of progress is visible (e.g. 5%) so it doesn't look broken
        return Math.max(5, (completedSteps / totalSteps) * 100);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: resolveThemeColor(colors.background) }} edges={['bottom']}>
            <Stack.Screen
                options={{
                    title:
                        phase === "material"
                            ? "Lesson"
                            : phase === "flashcards"
                                ? "Flashcards"
                                : "Test",
                    headerBackTitle: "Back",
                    headerStyle: {
                        backgroundColor: resolveThemeColor(colors.background),
                    },
                    headerTitleStyle: {
                        color: resolveThemeColor(colors.textPrimary),
                    },
                    headerTintColor: resolveThemeColor(colors.primary),
                    headerShadowVisible: false,
                }}
            />

            {/* Progress Bar */}
            <YStack height={4} backgroundColor="$gray5" width="100%">
                <YStack
                    height="100%"
                    backgroundColor={colors.primary}
                    width={`${getProgress()}%`}
                />
            </YStack>

            {renderContent()}
        </SafeAreaView>
    );
}
