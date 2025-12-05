import { StepIndicator } from "@/components/common";
import { AttachMaterialsStep } from "@/components/create-course/attach-materials-step";
import { CourseDetailsStep } from "@/components/create-course/course-details-step";
import { CreatingCourseModal } from "@/components/create-course/creating-course-modal";
import { ReviewStep } from "@/components/create-course/review-step";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, ScrollView, XStack, YStack } from "tamagui";

export default function CreateCourseScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    files: [] as string[],
    links: [] as string[],
    title: "",
    description: "",
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCreating(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleCreatingClose = () => {
    setIsCreating(false);
    router.back();
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
          <ScrollView flex={1}>
            <YStack padding="$4" gap="$4" paddingBottom="$6">
              <StepIndicator currentStep={currentStep} totalSteps={3} />

              {currentStep === 1 && (
                <AttachMaterialsStep
                  files={formData.files}
                  links={formData.links}
                  onFilesChange={(files) => setFormData({ ...formData, files })}
                  onLinksChange={(links) => setFormData({ ...formData, links })}
                />
              )}

              {currentStep === 2 && (
                <CourseDetailsStep
                  title={formData.title}
                  description={formData.description}
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
                  linksCount={formData.links.length}
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

      <CreatingCourseModal open={isCreating} onClose={handleCreatingClose} />
    </>
  );
}
