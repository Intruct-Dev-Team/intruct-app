import FlashcardView from "@/components/lesson/FlashcardView";
import TestView from "@/components/lesson/TestView";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { mockCourses } from "@/mockdata/courses";
import { Course, Lesson } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import { Button, H2, Text, YStack, getTokenValue } from "tamagui";

type LessonPhase = "material" | "flashcards" | "test" | "complete";

export default function LessonScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colors = useThemeColors();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [courseTitle, setCourseTitle] = useState("");
    const [phase, setPhase] = useState<LessonPhase>("material");
    const [completedPhases, setCompletedPhases] = useState<string[]>([]);

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
            <YStack flex={1} backgroundColor={colors.background} justifyContent="center" alignItems="center">
                <Text color={colors.textSecondary}>Loading lesson...</Text>
            </YStack>
        );
    }

    const handleMaterialComplete = () => {
        setCompletedPhases((prev) => [...prev, "material"]);
        if (lesson.flashcards && lesson.flashcards.length > 0) {
            setPhase("flashcards");
        } else if (lesson.questions && lesson.questions.length > 0) {
            setPhase("test");
        } else {
            setPhase("complete");
        }
    };

    const handleFlashcardsComplete = () => {
        setCompletedPhases((prev) => [...prev, "flashcards"]);
        if (lesson.questions && lesson.questions.length > 0) {
            setPhase("test");
        } else {
            setPhase("complete");
        }
    };

    const handleTestComplete = (score: number) => {
        setCompletedPhases((prev) => [...prev, "test"]);
        setPhase("complete");
        console.log("Test completed with score:", score);
    };

    const markdownStyles = {
        body: {
            fontSize: 16,
            lineHeight: 24,
            color: resolveThemeColor(colors.textPrimary),
        },
        text: {
            color: resolveThemeColor(colors.textPrimary),
        },
        heading1: {
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 16,
            marginBottom: 8,
            color: resolveThemeColor(colors.textPrimary),
        },
        heading2: {
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 14,
            marginBottom: 6,
            color: resolveThemeColor(colors.textPrimary),
        },
        code_block: {
            backgroundColor: resolveThemeColor(colors.cardBackground === "white" ? "$gray4" : "$gray5"),
            padding: 12,
            borderRadius: 8,
            fontFamily: "Menlo",
            fontSize: 14,
            color: resolveThemeColor(colors.textPrimary),
        },
    };

    const renderContent = () => {
        switch (phase) {
            case "material":
                return (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                    >
                        <YStack marginBottom="$4">
                            <H2 fontSize="$8" fontWeight="bold" color={colors.textPrimary} marginBottom="$2">
                                {lesson.title}
                            </H2>
                            <Text fontSize="$4" color={colors.textSecondary}>
                                {courseTitle}
                            </Text>
                        </YStack>

                        {lesson.materials?.map((material) => (
                            <YStack key={material.id} marginBottom="$4">
                                <Markdown style={markdownStyles}>{material.content}</Markdown>
                            </YStack>
                        ))}

                        <Button
                            backgroundColor={colors.primary}
                            color={colors.primaryText}
                            onPress={handleMaterialComplete}
                            marginTop="$4"
                            size="$4"
                            borderRadius="$4"
                            fontWeight="600"
                        >
                            {lesson.flashcards?.length ? "Start Flashcards" : "Next"}
                        </Button>
                    </ScrollView>
                );
            case "flashcards":
                return (
                    <FlashcardView
                        cards={lesson.flashcards || []}
                        onComplete={handleFlashcardsComplete}
                    />
                );
            case "test":
                return (
                    <TestView
                        questions={lesson.questions || []}
                        onComplete={handleTestComplete}
                    />
                );
            case "complete":
                return (
                    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
                        <H2 color={colors.textPrimary} marginBottom="$4">
                            Lesson Completed!
                        </H2>
                        <Button
                            backgroundColor={colors.primary}
                            color={colors.primaryText}
                            onPress={() => router.back()}
                            size="$4"
                            borderRadius="$4"
                        >
                            Return to Course
                        </Button>
                    </YStack>
                );
        }
    };

    const getProgress = () => {
        let totalSteps = 1; // Material
        if (lesson.flashcards?.length) totalSteps++;
        if (lesson.questions?.length) totalSteps++;

        let completedSteps = completedPhases.length;
        if (phase === "complete") completedSteps = totalSteps;

        return (completedSteps / totalSteps) * 100;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: resolveThemeColor(colors.background) }}>
            <Stack.Screen
                options={{
                    title:
                        phase === "material"
                            ? "Lesson"
                            : phase === "flashcards"
                                ? "Flashcards"
                                : phase === "test"
                                    ? "Test"
                                    : "Complete",
                    headerBackTitle: "Back",
                    headerStyle: {
                        backgroundColor: resolveThemeColor(colors.background),
                    },
                    headerTitleStyle: {
                        color: resolveThemeColor(colors.textPrimary),
                    },
                    headerTintColor: resolveThemeColor(colors.primary),
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
