// LessonMaterialView

import { useTheme } from "@/contexts/theme-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import type { LessonMaterial } from "@/types";
import React from "react";
import { ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import { Button, H2, Text, YStack } from "tamagui";

interface LessonMaterialViewProps {
  title: string;
  courseTitle: string;
  materials: LessonMaterial[];
  onComplete: () => void;
  nextLabel?: string;
  showHeader?: boolean;
}

export default function LessonMaterialView(props: LessonMaterialViewProps) {
  const colors = useThemeColors();
  const { activeTheme } = useTheme();
  const materialTextColor =
    activeTheme === "dark" ? "white" : colors.textPrimary;

  const title = props.title;
  const courseTitle = props.courseTitle;
  const materials = props.materials;
  const onComplete = props.onComplete;
  const nextLabel = props.nextLabel ?? "Next";
  const showHeader = props.showHeader ?? true;

  const visibleMaterials = materials.filter(
    (m) => (m.content ?? "").trim().length > 0
  );

  const markdownStyles: any = {};

  const body: any = {};
  body.fontSize = 16;
  body.lineHeight = 24;
  body.color = materialTextColor;
  markdownStyles.body = body;

  const paragraph: any = {};
  paragraph.color = materialTextColor;
  paragraph.marginBottom = 10;
  markdownStyles.paragraph = paragraph;

  const heading1: any = {};
  heading1.fontSize = 22;
  heading1.fontWeight = "700";
  heading1.marginTop = 8;
  heading1.marginBottom = 8;
  heading1.color = materialTextColor;
  markdownStyles.heading1 = heading1;

  const heading2: any = {};
  heading2.fontSize = 20;
  heading2.fontWeight = "700";
  heading2.marginTop = 6;
  heading2.marginBottom = 6;
  heading2.color = materialTextColor;
  markdownStyles.heading2 = heading2;

  const listItem: any = {};
  listItem.color = materialTextColor;
  listItem.marginBottom = 6;
  markdownStyles.list_item = listItem;

  const codeInline: any = {};
  codeInline.backgroundColor = colors.background;
  codeInline.paddingHorizontal = 8;
  codeInline.paddingVertical = 2;
  codeInline.borderRadius = 6;
  codeInline.fontFamily = "Menlo";
  codeInline.fontSize = 14;
  codeInline.fontWeight = "700";
  codeInline.color = materialTextColor;
  markdownStyles.code_inline = codeInline;

  const codeBlock: any = {};
  codeBlock.backgroundColor = colors.background;
  codeBlock.padding = 12;
  codeBlock.borderRadius = 8;
  codeBlock.fontFamily = "Menlo";
  codeBlock.fontSize = 14;
  codeBlock.color = materialTextColor;
  markdownStyles.code_block = codeBlock;

  const fence: any = {};
  fence.backgroundColor = colors.background;
  fence.padding = 12;
  fence.borderRadius = 8;
  fence.fontFamily = "Menlo";
  fence.fontSize = 14;
  fence.color = materialTextColor;
  markdownStyles.fence = fence;

  const strong: any = {};
  strong.color = materialTextColor;
  strong.fontWeight = "700";
  markdownStyles.strong = strong;

  const em: any = {};
  em.color = materialTextColor;
  em.fontStyle = "italic";
  markdownStyles.em = em;

  const text: any = {};
  text.color = materialTextColor;
  markdownStyles.text = text;

  const scrollStyle: any = {};
  scrollStyle.flex = 1;
  scrollStyle.backgroundColor = colors.background;

  const contentContainerStyle: any = {};
  contentContainerStyle.padding = 20;
  contentContainerStyle.paddingBottom = 20;
  contentContainerStyle.flexGrow = 1;

  const materialNodes: any[] = [];
  for (let index = 0; index < visibleMaterials.length; index += 1) {
    const material = visibleMaterials[index];
    const key = (material as any).id ?? String(index);
    materialNodes.push(
      <YStack
        key={key}
        marginBottom="$4"
        backgroundColor={colors.cardBackground}
        padding="$4"
        borderRadius="$6"
      >
        <Markdown style={markdownStyles}>{material.content}</Markdown>
      </YStack>
    );
  }

  return (
    <ScrollView
      style={scrollStyle}
      contentContainerStyle={contentContainerStyle}
    >
      <YStack flex={1} justifyContent="space-between">
        <YStack>
          {showHeader ? (
            <YStack marginBottom="$4">
              <H2 fontWeight="700" color={colors.textPrimary}>
                {title}
              </H2>
              <Text color={colors.textSecondary}>{courseTitle}</Text>
            </YStack>
          ) : null}

          {materialNodes}
        </YStack>

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
      </YStack>
    </ScrollView>
  );
}
