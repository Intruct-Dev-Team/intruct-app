import { useNotifications } from "@/contexts/NotificationsContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Paperclip, X } from "@tamagui/lucide-icons";
import * as DocumentPicker from "expo-document-picker";
import { Pressable } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";

interface AttachMaterialsStepProps {
  files: string[];
  onFilesChange: (files: string[]) => void;
}

export function AttachMaterialsStep({
  files,
  onFilesChange,
}: AttachMaterialsStepProps) {
  const colors = useThemeColors();
  const { notify } = useNotifications();

  const handleAttachFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled) return;

      const picked = result.assets
        .map((asset) => asset.name || asset.uri)
        .filter(Boolean);

      if (picked.length === 0) return;
      onFilesChange([...files, ...picked]);
    } catch {
      notify({
        type: "error",
        message: "Couldn’t open file picker.",
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <YStack gap="$4" flex={1}>
      <YStack gap="$2">
        <Text fontSize="$7" fontWeight="700" color={colors.textPrimary}>
          Attach Materials
        </Text>
        <Text fontSize="$4" color={colors.textSecondary}>
          Upload files to create your course content
        </Text>
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
          Files
        </Text>
        <Pressable onPress={handleAttachFiles}>
          <Card
            padding="$6"
            backgroundColor={colors.cardBackground}
            borderRadius="$4"
            borderWidth={2}
            borderColor="$gray5"
            borderStyle="dashed"
          >
            <YStack gap="$3" alignItems="center">
              <YStack
                width={56}
                height={56}
                alignItems="center"
                justifyContent="center"
                backgroundColor="$gray4"
                borderRadius="$4"
              >
                <Paperclip size={28} color={colors.textSecondary} />
              </YStack>
              <Text fontSize="$4" fontWeight="500" color={colors.textPrimary}>
                Tap to attach files
              </Text>
              <Text fontSize="$3" color={colors.textSecondary}>
                PDF, DOC, TXT, Images
              </Text>
            </YStack>
          </Card>
        </Pressable>

        {files.length > 0 && (
          <YStack gap="$2">
            {files.map((file, index) => (
              <Card
                key={index}
                padding="$3"
                backgroundColor={colors.cardBackground}
                borderRadius="$3"
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack gap="$2" alignItems="center" flex={1}>
                    <Paperclip size={16} color={colors.textSecondary} />
                    <Text fontSize="$3" color={colors.textPrimary} flex={1}>
                      {file}
                    </Text>
                  </XStack>
                  <Pressable onPress={() => handleRemoveFile(index)}>
                    <YStack
                      width={24}
                      height={24}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="$gray4"
                      borderRadius="$2"
                    >
                      <X size={14} color={colors.textSecondary} />
                    </YStack>
                  </Pressable>
                </XStack>
              </Card>
            ))}
          </YStack>
        )}
      </YStack>

      <YStack gap="$3">{/* Links removed as per request */}</YStack>
    </YStack>
  );
}
