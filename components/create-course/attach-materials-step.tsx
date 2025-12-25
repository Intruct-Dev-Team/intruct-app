import { useThemeColors } from "@/hooks/use-theme-colors";
import { Paperclip, X } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Alert, Pressable } from "react-native";
import { Button, Card, Input, Text, XStack, YStack } from "tamagui";

interface AttachMaterialsStepProps {
  files: string[];
  links: string[];
  onFilesChange: (files: string[]) => void;
  onLinksChange: (links: string[]) => void;
}

export function AttachMaterialsStep({
  files,
  links,
  onFilesChange,
  onLinksChange,
}: AttachMaterialsStepProps) {
  const colors = useThemeColors();
  const [linkInput, setLinkInput] = useState("");

  const handleAddLink = () => {
    if (!linkInput.trim()) return;

    try {
      new URL(linkInput.trim());
      onLinksChange([...links, linkInput.trim()]);
      setLinkInput("");
    } catch {
      Alert.alert("Invalid URL", "Please enter a valid URL");
    }
  };

  const handleRemoveLink = (index: number) => {
    onLinksChange(links.filter((_, i) => i !== index));
  };

  const handleAttachFiles = () => {
    Alert.alert(
      "File Picker",
      "File picker will be implemented here. For now adding a demo file.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Add Demo File",
          onPress: () => {
            onFilesChange([...files, `demo-file-${files.length + 1}.pdf`]);
          },
        },
      ]
    );
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
          Upload files or add links to create your course content
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

      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
          Links
        </Text>
        <XStack gap="$2">
          <Input
            flex={1}
            size="$4"
            placeholder="https://example.com"
            value={linkInput}
            onChangeText={setLinkInput}
            backgroundColor={colors.cardBackground}
            onSubmitEditing={handleAddLink}
          />
          <Button
            size="$4"
            backgroundColor={colors.primary}
            color="white"
            onPress={handleAddLink}
          >
            Add
          </Button>
        </XStack>

        {links.length > 0 && (
          <YStack gap="$2">
            {links.map((link, index) => (
              <Card
                key={index}
                padding="$3"
                backgroundColor={colors.cardBackground}
                borderRadius="$3"
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text
                    fontSize="$3"
                    color="$blue10"
                    flex={1}
                    numberOfLines={1}
                  >
                    {link}
                  </Text>
                  <Pressable onPress={() => handleRemoveLink(index)}>
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
    </YStack>
  );
}
