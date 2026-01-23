import { useThemeColors } from "@/hooks/use-theme-colors";
import { Check, X } from "@tamagui/lucide-icons";
import { ScrollView, Sheet, Text, XStack, YStack } from "tamagui";
import { languageOptions } from "../../mockdata/settings";
import type { LanguageOption } from "../../types";

interface LanguageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (languageCode: string) => void;
  title?: string;
}

export function LanguageModal({
  open,
  onOpenChange,
  value,
  onValueChange,
  title = "Select Language",
}: LanguageModalProps) {
  const colors = useThemeColors();

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      modal
      snapPoints={[80]}
      dismissOnSnapToBottom
      dismissOnOverlayPress
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

      <Sheet.Frame
        backgroundColor={colors.background}
        padding="$4"
        paddingBottom="$6"
        gap="$4"
      >
        <Sheet.Handle />

        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$7" fontWeight="700" color={colors.textPrimary}>
            {title}
          </Text>
          <YStack
            width={32}
            height={32}
            alignItems="center"
            justifyContent="center"
            backgroundColor="$gray4"
            borderRadius="$3"
            pressStyle={{ opacity: 0.7 }}
            onPress={() => onOpenChange(false)}
          >
            <X size={20} color={colors.textSecondary} />
          </YStack>
        </XStack>

        <ScrollView>
          <YStack gap="$2">
            {languageOptions.map((option: LanguageOption) => {
              const isSelected = value === option.code;

              return (
                <YStack
                  key={option.code}
                  onPress={() => {
                    onValueChange(option.code);
                    onOpenChange(false);
                  }}
                  padding="$4"
                  gap="$3"
                  flexDirection="row"
                  alignItems="center"
                  backgroundColor={colors.cardBackground}
                  borderRadius="$4"
                  borderWidth={2}
                  borderColor={isSelected ? colors.primary : "transparent"}
                  pressStyle={{ opacity: 0.85 }}
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
                  {isSelected && <Check size={20} color={colors.primary} />}
                </YStack>
              );
            })}
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
