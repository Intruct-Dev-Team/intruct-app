import { useCourseGeneration } from "@/contexts/course-generation-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Check } from "@tamagui/lucide-icons";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Button, Progress, Spinner, Text, XStack, YStack } from "tamagui";

export function CreatingCourseModal() {
  const colors = useThemeColors();
  const {
    creatingModalOpen,
    activeGeneratingCourseId,
    creationSteps,
    closeCreatingModal,
    getGeneratingCourseById,
  } = useCourseGeneration();

  const generatingCourse = activeGeneratingCourseId
    ? getGeneratingCourseById(activeGeneratingCourseId)
    : undefined;

  if (!creatingModalOpen) return null;

  const isComplete = generatingCourse?.isComplete ?? false;
  const progress = generatingCourse?.progress ?? 0;
  const currentStepIndex = generatingCourse?.currentStepIndex ?? 0;

  return (
    <Modal visible={creatingModalOpen} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={closeCreatingModal}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <YStack
            backgroundColor={colors.cardBackground}
            borderRadius="$6"
            padding="$6"
            gap="$5"
            margin="$4"
            alignItems="center"
            maxWidth={400}
          >
            <XStack width="100%" justifyContent="flex-end">
              <Button size="$3" chromeless onPress={closeCreatingModal}>
                Close
              </Button>
            </XStack>

            <YStack
              width={80}
              height={80}
              alignItems="center"
              justifyContent="center"
              backgroundColor={isComplete ? "$green2" : "$blue2"}
              borderRadius="$10"
            >
              {isComplete ? (
                <Check size={40} color="$green10" />
              ) : (
                <Spinner size="large" color="$blue10" />
              )}
            </YStack>

            <YStack gap="$2" alignItems="center">
              <Text fontSize="$7" fontWeight="700" color={colors.textPrimary}>
                {isComplete ? "Course Created!" : "Creating Your Course"}
              </Text>
              <Text
                fontSize="$4"
                color={colors.textSecondary}
                textAlign="center"
              >
                {isComplete
                  ? "Your personalized course is ready"
                  : "Our AI is analyzing your materials and generating personalized content"}
              </Text>
            </YStack>

            <YStack width="100%" gap="$3">
              <Progress
                value={progress}
                backgroundColor="$gray5"
                height={8}
                borderRadius="$2"
              >
                <Progress.Indicator
                  animation="bouncy"
                  backgroundColor={colors.primary}
                />
              </Progress>

              <YStack gap="$2">
                {creationSteps.map((step, index) => (
                  <XStack key={index} gap="$2" alignItems="center">
                    <YStack
                      width={20}
                      height={20}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor={
                        index < currentStepIndex
                          ? "$green10"
                          : index === currentStepIndex
                          ? colors.primary
                          : "$gray5"
                      }
                      borderRadius="$10"
                    >
                      {index < currentStepIndex && (
                        <Check size={12} color="white" />
                      )}
                      {index === currentStepIndex && (
                        <Spinner size="small" color="white" />
                      )}
                    </YStack>
                    <Text
                      fontSize="$3"
                      color={
                        index <= currentStepIndex
                          ? colors.textPrimary
                          : colors.textTertiary
                      }
                      fontWeight={index === currentStepIndex ? "600" : "400"}
                    >
                      {step}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </YStack>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
