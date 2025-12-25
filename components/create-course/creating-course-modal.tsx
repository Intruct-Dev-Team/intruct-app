import { useThemeColors } from "@/hooks/use-theme-colors";
import { Check } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Progress, Spinner, Text, XStack, YStack } from "tamagui";

interface CreatingCourseModalProps {
  open: boolean;
  onClose: () => void;
}

const CREATION_STEPS = [
  "Processing materials",
  "Creating course plan",
  "Writing lessons",
];

export function CreatingCourseModal({
  open,
  onClose,
}: CreatingCourseModalProps) {
  const colors = useThemeColors();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!open) {
      setCurrentStepIndex(0);
      setProgress(0);
      setIsComplete(false);
      return;
    }

    const stepDuration = 2000;
    const progressInterval = 50;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const increment =
          (progressInterval / (stepDuration * CREATION_STEPS.length)) * 100;
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          setIsComplete(true);
          setTimeout(() => {
            onClose();
          }, 1500);
          return 100;
        }
        return newProgress;
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < CREATION_STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(stepTimer);
        return prev;
      });
    }, stepDuration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Modal visible={open} transparent animationType="fade">
      <Pressable style={styles.backdrop}>
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
                {CREATION_STEPS.map((step, index) => (
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
