import { ScreenContainer } from "@/components/layout";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ChevronDown, ChevronLeft } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Button, Card, Text, XStack, YStack } from "tamagui";

export default function HelpCenterScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const faqs = useMemo(
    () => [
      {
        id: "create-course",
        question: "How do I create a course?",
        answer:
          "Go to Create Course, attach materials, add details, then tap Create Course.",
      },
      {
        id: "content-language",
        question: "What does Content Language mean?",
        answer:
          "It is the default language used for generated course content. You can set it in Settings → AI Settings → Content Language.",
      },
      {
        id: "app-language",
        question: "What does Language in App Settings change?",
        answer:
          "It saves your preferred UI language. Full app translation switching may be added later.",
      },
      {
        id: "file-picker",
        question: "Why can’t I attach a file?",
        answer:
          "If the file picker fails to open, try again. On iOS, also check Files permissions and make sure the file is accessible.",
      },
    ],
    []
  );

  const [openById, setOpenById] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpenById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />

      <XStack alignItems="center" gap="$2">
        <Button
          icon={<ChevronLeft size={24} color={colors.textPrimary} />}
          chromeless
          onPress={() => router.back()}
        />
        <Text fontSize="$6" fontWeight="700" color={colors.textPrimary}>
          Help Center
        </Text>
      </XStack>

      <YStack gap="$3" marginTop="$4">
        <Text color={colors.textSecondary} fontSize="$4">
          Quick answers to common questions.
        </Text>

        {faqs.map((item) => {
          const isOpen = openById[item.id] ?? false;

          return (
            <Card
              key={item.id}
              padding="$4"
              backgroundColor={colors.cardBackground}
              borderRadius="$6"
              borderWidth={1}
              borderColor={isOpen ? colors.primary : "$gray5"}
              pressStyle={{ opacity: 0.95, scale: 0.99 }}
              onPress={() => toggle(item.id)}
              accessibilityRole="button"
              accessibilityLabel={item.question}
            >
              <XStack
                gap="$3"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text
                  fontSize="$4"
                  fontWeight="700"
                  color={colors.textPrimary}
                  flex={1}
                >
                  {item.question}
                </Text>
                <ChevronDown
                  size={18}
                  color={colors.textSecondary}
                  style={{
                    transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                  }}
                />
              </XStack>

              {isOpen ? (
                <YStack marginTop="$3">
                  <Text color={colors.textSecondary} fontSize="$4">
                    {item.answer}
                  </Text>
                </YStack>
              ) : null}
            </Card>
          );
        })}
      </YStack>
    </ScreenContainer>
  );
}
