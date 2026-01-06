import { StepIndicator } from "@/components/common";
import { AttachMaterialsStep } from "@/components/create-course/attach-materials-step";
import { CourseDetailsStep } from "@/components/create-course/course-details-step";
import { ReviewStep } from "@/components/create-course/review-step";
import { LanguageModal } from "@/components/modals";
import { useCourseGeneration } from "@/contexts/course-generation-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { settingsApi } from "@/services/api";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, ScrollView, XStack, YStack } from "tamagui";

export default function CreateCourseScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { startCourseGeneration } = useCourseGeneration();

  const [currentStep, setCurrentStep] = useState(1);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    files: [] as string[],
    title: "",
    description: "",
    contentLanguage: "en",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const settings = await settingsApi.getSettings();
      if (cancelled) return;

      setFormData((prev) => {
        if (prev.contentLanguage !== "en") return prev;
        return { ...prev, contentLanguage: settings.defaultCourseLanguage };
      });
    })().catch(() => {
      // Non-blocking: keep default
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      startCourseGeneration({
        title: formData.title,
        description: formData.description,
        files: formData.files,
        links: [],
        contentLanguage: formData.contentLanguage,
      });
      router.replace("/(tabs)/courses" as never);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Create Course",
          headerLeft: () => (
            <Button
              size="$3"
              chromeless
              icon={<ArrowLeft size={24} color={colors.textPrimary} />}
              onPress={handleBack}
            />
          ),
          headerStyle: {
            backgroundColor: colors.cardBackground,
          },
          headerTitleStyle: {
            color: colors.textPrimary,
          },
        }}
      />

      <YStack flex={1} backgroundColor={colors.background}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <ScrollView
            flex={1}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 + 120 }}
          >
            <YStack padding="$4" gap="$4">
              <StepIndicator currentStep={currentStep} totalSteps={3} />

              {currentStep === 1 && (
                <AttachMaterialsStep
                  files={formData.files}
                  onFilesChange={(files) => setFormData({ ...formData, files })}
                />
              )}

              {currentStep === 2 && (
                <CourseDetailsStep
                  title={formData.title}
                  description={formData.description}
                  contentLanguage={formData.contentLanguage}
                  onLanguagePress={() => setLanguageModalOpen(true)}
                  onTitleChange={(title) => setFormData({ ...formData, title })}
                  onDescriptionChange={(description) =>
                    setFormData({ ...formData, description })
                  }
                />
              )}

              {currentStep === 3 && (
                <ReviewStep
                  title={formData.title}
                  description={formData.description}
                  filesCount={formData.files.length}
                  contentLanguage={formData.contentLanguage}
                />
              )}
            </YStack>
          </ScrollView>
        </KeyboardAvoidingView>

        <XStack
          padding="$4"
          paddingBottom={insets.bottom + 16}
          gap="$3"
          backgroundColor={colors.cardBackground}
          borderTopWidth={1}
          borderTopColor="$gray5"
        >
          <Button
            flex={1}
            size="$5"
            backgroundColor="transparent"
            borderWidth={1}
            borderColor="$gray7"
            color={colors.textPrimary}
            onPress={handleBack}
          >
            Back
          </Button>
          <Button
            flex={1}
            size="$5"
            backgroundColor={colors.primary}
            color="white"
            onPress={handleNext}
          >
            {currentStep === 3 ? "Create Course" : "Next"}
          </Button>
        </XStack>
      </YStack>

      <LanguageModal
        open={languageModalOpen}
        onOpenChange={setLanguageModalOpen}
        value={formData.contentLanguage}
        onValueChange={(contentLanguage) =>
          setFormData({ ...formData, contentLanguage })
        }
        title="Content Language"
      />
    </>
  );
}
