import { useThemeColors } from "@/hooks/use-theme-colors";
import { t } from "@/localization/i18n";
import { Check } from "@tamagui/lucide-icons";
import { ScrollView, Text, YStack } from "tamagui";
import { languageOptions } from "../../mockdata/settings";
import type { LanguageOption } from "../../types";
import { AppSheetModal } from "./app-sheet-modal";

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
  title = t("Select Language"),
}: LanguageModalProps) {
  const colors = useThemeColors();

  return (
    <AppSheetModal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[80]}
      title={title}
    >
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
    </AppSheetModal>
  );
}
