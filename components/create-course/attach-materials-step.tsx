import { useNotifications } from "@/contexts/NotificationsContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { t } from "@/localization/i18n";
import { Paperclip, X } from "@tamagui/lucide-icons";
import * as DocumentPicker from "expo-document-picker";
import { Pressable } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";

export type PickedFile = {
  uri: string;
  name: string;
  mimeType?: string;
};

interface AttachMaterialsStepProps {
  files: PickedFile[];
  onFilesChange: (files: PickedFile[]) => void;
}

export function AttachMaterialsStep({
  files,
  onFilesChange,
}: AttachMaterialsStepProps) {
  const colors = useThemeColors();
  const { notify } = useNotifications();

  const isAllowedAsset = (asset: DocumentPicker.DocumentPickerAsset) => {
    const name = (asset.name || "").toLowerCase();
    const mimeType = (asset.mimeType || "").toLowerCase();

    if (mimeType === "application/pdf" || mimeType === "text/plain")
      return true;
    if (name.endsWith(".pdf") || name.endsWith(".txt")) return true;
    return false;
  };

  const handleAttachFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: ["application/pdf", "text/plain"],
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset?.uri) return;

      if (!isAllowedAsset(asset)) {
        notify({
          type: "error",
          message: t("Please choose a PDF or TXT file."),
        });
        return;
      }

      const picked: PickedFile = {
        uri: asset.uri,
        name: asset.name || asset.uri,
        mimeType: asset.mimeType,
      };

      onFilesChange([picked]);
    } catch {
      notify({
        type: "error",
        message: t("Couldn’t open file picker."),
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
          {t("Attach Materials")}
        </Text>
        <Text fontSize="$4" color={colors.textSecondary}>
          {t("Upload files to create your course content")}
        </Text>
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
          {t("Files")}
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
                {t("Tap to attach files")}
              </Text>
              <Text fontSize="$3" color={colors.textSecondary}>
                {t("PDF or TXT")}
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
                      {file.name}
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
