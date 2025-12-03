import { useThemeColors } from "@/hooks/use-theme-colors";
import { Check, X } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { ScrollView, Text, XStack, YStack } from "tamagui";

type LanguageOption = {
  code: string;
  label: string;
  flag: string;
};

const languageOptions: LanguageOption[] = [
  { code: "en", label: "English (US)", flag: "🇺🇸" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

interface LanguageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LanguageModal({ open, onOpenChange }: LanguageModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const colors = useThemeColors();

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable style={styles.backdrop} onPress={() => onOpenChange(false)}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <YStack
            backgroundColor={colors.background}
            borderTopLeftRadius="$6"
            borderTopRightRadius="$6"
            padding="$4"
            paddingBottom="$6"
            gap="$4"
            maxHeight="80%"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$7" fontWeight="700" color={colors.textPrimary}>
                Select Language
              </Text>
              <Pressable onPress={() => onOpenChange(false)}>
                <YStack
                  width={32}
                  height={32}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="$gray4"
                  borderRadius="$3"
                >
                  <X size={20} color={colors.textSecondary} />
                </YStack>
              </Pressable>
            </XStack>

            <ScrollView>
              <YStack gap="$2">
                {languageOptions.map((option) => {
                  const isSelected = selectedLanguage === option.code;

                  return (
                    <Pressable
                      key={option.code}
                      onPress={() => {
                        setSelectedLanguage(option.code);
                        setTimeout(() => onOpenChange(false), 300);
                      }}
                    >
                      <XStack
                        padding="$4"
                        gap="$3"
                        alignItems="center"
                        backgroundColor={colors.cardBackground}
                        borderRadius="$4"
                        borderWidth={2}
                        borderColor={
                          isSelected ? colors.primary : "transparent"
                        }
                      >
                        <Text fontSize="$6">{option.flag}</Text>
                        <Text
                          fontSize="$4"
                          fontWeight={isSelected ? "600" : "400"}
                          color={colors.textPrimary}
                          flex={1}
                        >
                          {option.label}
                        </Text>
                        {isSelected && (
                          <Check size={20} color={colors.primary} />
                        )}
                      </XStack>
                    </Pressable>
                  );
                })}
              </YStack>
            </ScrollView>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
});
