import { useTheme } from "@/contexts/theme-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import type { LessonMaterial } from "@/types";
import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import { Button, H2, Text, YStack, useStyle } from "tamagui";

interface LessonMaterialViewProps {
  title: string;
  courseTitle: string;
  materials: LessonMaterial[];
  onComplete: () => void;
  nextLabel?: string;
}

export default function LessonMaterialView(props: LessonMaterialViewProps) {
  const { title, courseTitle, materials, onComplete, nextLabel = "Next" } = props;
  const colors = useThemeColors();
  const { activeTheme } = useTheme();

  const isDark = activeTheme === "dark";

  const resolvedText = useStyle({ color: colors.textPrimary }, { resolveValues: "auto" });
  const resolvedInlineCode = useStyle(
    { backgroundColor: isDark ? "$gray4" : "$gray3" },
    { resolveValues: "auto" }
  );
  const resolvedCodeBlock = useStyle(
    { backgroundColor: isDark ? "$gray4" : "$gray2" },
    { resolveValues: "auto" }
  );

  const textColor = typeof resolvedText.color === "string" ? resolvedText.color : "";
  const inlineCodeBackground =
    typeof resolvedInlineCode.backgroundColor === "string"
      ? resolvedInlineCode.backgroundColor
      : "";
  const codeBlockBackground =
    typeof resolvedCodeBlock.backgroundColor === "string" ? resolvedCodeBlock.backgroundColor : "";

  const markdownStyles = useMemo(() => {
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
        fontWeight: "700" as const,
        marginTop: 8,
        marginBottom: 8,
        color: textColor,
      },
      heading2: {
        fontSize: 20,
        fontWeight: "700" as const,
        marginTop: 6,
        marginBottom: 6,
        color: textColor,
      },
      list_item: {
        color: textColor,
        marginBottom: 6,
      },
      code_inline: {
        backgroundColor: inlineCodeBackground,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        fontFamily: "Menlo",
        fontSize: 14,
        fontWeight: "700" as const,
        color: textColor,
      },
      code_block: {
        backgroundColor: codeBlockBackground,
        padding: 12,
        borderRadius: 8,
        fontFamily: "Menlo",
        fontSize: 14,
        color: textColor,
      },
      fence: {
        backgroundColor: codeBlockBackground,
        padding: 12,
        borderRadius: 8,
        fontFamily: "Menlo",
        fontSize: 14,
        color: textColor,
      },
      strong: {
        color: textColor,
        fontWeight: "700" as const,
      },
      em: {
        color: textColor,
        fontStyle: "italic" as const,
      },
      text: {
        color: textColor,
      },
    };
  }, [codeBlockBackground, inlineCodeBackground, textColor]);

  const visibleMaterials = materials.filter((m) => m.content?.trim());

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <YStack marginBottom="$4">
        <H2 fontWeight="700" color={colors.textPrimary}>
          {title}
        </H2>
        <Text color={colors.textSecondary}>{courseTitle}</Text>
      </YStack>

      {visibleMaterials.map((material) => (
        <YStack
          key={material.id}
          marginBottom="$4"
          backgroundColor={colors.cardBackground}
          padding="$4"
          borderRadius="$6"
          borderWidth={1}
          borderColor="$gray4"
        >
          <Markdown style={markdownStyles}>{material.content}</Markdown>
        </YStack>
      ))}

      <Button
        backgroundColor={colors.primary}
        color={colors.primaryText}
        onPress={onComplete}
        marginTop="$2"
        size="$4"
        borderRadius="$4"
      >
        {nextLabel}
      </Button>
    </ScrollView>
  );
}
