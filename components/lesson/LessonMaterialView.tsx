import { useTheme } from "@/contexts/theme-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { LessonMaterial } from "@/types";
import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import { Button, H2, Text, YStack } from "tamagui";

interface LessonMaterialViewProps {
    title: string;
    courseTitle: string;
    materials: LessonMaterial[];
    onComplete: () => void;
    nextLabel?: string;
}

export default function LessonMaterialView({
    title,
    courseTitle,
    materials,
    onComplete,
    nextLabel = "Next",
}: LessonMaterialViewProps) {
    const colors = useThemeColors();
    const { activeTheme } = useTheme();

    // Robust markdown styles generation based on active theme
    const markdownStyles = useMemo(() => {
        const isDark = activeTheme === "dark";

        // Define explicit colors for markdown elements
        const textColor = isDark ? "#FFFFFF" : "#11181C"; // white vs gray12
        const codeBg = isDark ? "#282828" : "#F2F2F2"; // dark gray vs light gray

        return {
            body: {
                fontSize: 16,
                lineHeight: 24,
                color: textColor,
            },
            paragraph: {
                color: textColor,
                marginBottom: 10,
            },
            heading1: {
                fontSize: 22,
                fontWeight: "bold",
                marginTop: 16,
                marginBottom: 8,
                color: textColor,
            },
            heading2: {
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 14,
                marginBottom: 6,
                color: textColor,
            },
            list_item: {
                color: textColor,
                marginBottom: 5,
            },
            bullet_list: {
                color: textColor,
            },
            ordered_list: {
                color: textColor,
            },
            code_block: {
                backgroundColor: codeBg,
                padding: 12,
                borderRadius: 8,
                fontFamily: "Menlo",
                fontSize: 14,
                color: textColor,
            },
            fence: {
                backgroundColor: codeBg,
                padding: 12,
                borderRadius: 8,
                fontFamily: "Menlo",
                fontSize: 14,
                color: textColor,
            },
            text: {
                color: textColor,
            },
            strong: {
                color: textColor,
                fontWeight: "bold",
            },
            em: {
                color: textColor,
                fontStyle: "italic",
            },
        };
    }, [activeTheme]);

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
            <YStack marginBottom="$4">
                <H2
                    fontSize="$8"
                    fontWeight="700"
                    color={colors.textPrimary}
                    marginBottom="$2"
                >
                    {title}
                </H2>
                <Text fontSize="$4" color={colors.textSecondary}>
                    {courseTitle}
                </Text>
            </YStack>

            {materials.map((material) => (
                <YStack key={material.id} marginBottom="$4">
                    <Markdown style={markdownStyles as any}>{material.content}</Markdown>
                </YStack>
            ))}

            <Button
                backgroundColor={colors.primary}
                color={colors.primaryText}
                onPress={onComplete}
                marginTop="$4"
                size="$4"
                borderRadius="$4"
                fontWeight="600"
            >
                {nextLabel}
            </Button>
        </ScrollView>
    );
}
