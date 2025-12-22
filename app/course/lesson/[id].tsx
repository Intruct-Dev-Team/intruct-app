import FlashcardView from "@/components/lesson/FlashcardView";
import LessonMaterialView from "@/components/lesson/LessonMaterialView";
import TestView from "@/components/lesson/TestView";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { mockCourses } from "@/mockdata/courses";
import { Course, Lesson } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
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

    // Animation state
    const progressWidth = useSharedValue(5); // Start at 5%
    const progress = useSharedValue(5);

    const animatedProgressStyle = useAnimatedStyle(() => {
        return {
            width: `${progressWidth.value}%`,
        };
    });

    const getProgress = () => {
        if (!lesson) return 5;

        // Calculate total granular steps
        // 1 for Material
        // N for Flashcards
        // M for Questions
        const totalSteps = 1 + (lesson.flashcards?.length || 0) + (lesson.questions?.length || 0);

        let completedSteps = 0;

        if (completedPhases.includes("material")) {
            completedSteps += 1;
        }

        if (completedPhases.includes("flashcards")) {
            completedSteps += (lesson.flashcards?.length || 0);
        }

        if (completedPhases.includes("test")) {
            completedSteps += (lesson.questions?.length || 0);
        } else {
            if (phase === "flashcards") {
                completedSteps += currentPhaseProgress;
            } else if (phase === "test") {
                completedSteps += currentPhaseProgress;
            }
        }

        return Math.max(5, (completedSteps / totalSteps) * 100);
    };

    const currentProgressValue = getProgress();

    useEffect(() => {
        progressWidth.value = withTiming(currentProgressValue, {
            duration: 500,
            easing: Easing.out(Easing.quad),
        });
    }, [currentProgressValue]);

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

            {/* Animated Progress Bar */}
            <YStack height={4} backgroundColor="$gray5" width="100%" overflow="hidden">
                <Animated.View
                    style={[
                        {
                            height: "100%",
                            width: "100%", // Full width, we reveal it via translate
                            backgroundColor: resolveThemeColor(colors.primary) || "#2491FF",
                            // Glow effect
                            shadowColor: resolveThemeColor(colors.primary) || "#2491FF",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.8,
                            shadowRadius: 10,
                            elevation: 5, // Android glow
                        },
                        animatedProgressStyle,
                    ]}
                />
            </YStack>

            {renderContent()}
        </SafeAreaView>
    );
}
