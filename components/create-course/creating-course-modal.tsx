import { useCourseGeneration } from "@/contexts/course-generation-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { AlertTriangle, Check } from "@tamagui/lucide-icons";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Button, Spinner, Text, XStack, YStack } from "tamagui";

export function CreatingCourseModal() {
  const colors = useThemeColors();
  const {
    creatingModalOpen,
    activeCourseId,
    closeCreatingModal,
    getCourseById,
  } = useCourseGeneration();

  const course = activeCourseId ? getCourseById(activeCourseId) : undefined;
  const status = course?.status ?? "generating";
  const isGenerating = status === "generating";
  const isFailed = status === "failed";

  if (!creatingModalOpen) return null;

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
              backgroundColor={
                isGenerating ? "$blue2" : isFailed ? "$red2" : "$green2"
              }
              borderRadius="$10"
            >
              {isGenerating ? (
                <Spinner size="large" color="$blue10" />
              ) : isFailed ? (
                <AlertTriangle size={40} color="$red10" />
              ) : (
                <Check size={40} color="$green10" />
              )}
            </YStack>

            <YStack gap="$2" alignItems="center">
              <Text fontSize="$7" fontWeight="700" color={colors.textPrimary}>
                {isGenerating
                  ? "Creating course"
                  : isFailed
                    ? "Creation failed"
                    : "Course is ready"}
              </Text>
              <Text
                fontSize="$4"
                color={colors.textSecondary}
                textAlign="center"
              >
                {isGenerating
                  ? "Generation is running on the server. The status will update when the course is ready."
                  : isFailed
                    ? "Couldn’t create the course. Check your file (PDF/TXT) and try again."
                    : "You can close this window and open the course from the list."}
              </Text>
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
