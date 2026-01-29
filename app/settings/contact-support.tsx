import { ExternalLink } from "@/components/common/external-link";
import { ScreenContainer } from "@/components/layout";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { t } from "@/localization/i18n";
import { ChevronLeft, Linkedin, Mail, Send } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { Button, Card, Text, XStack, YStack } from "tamagui";

export default function ContactSupportScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />

      <XStack alignItems="center" gap="$2">
        <Button
          icon={<ChevronLeft size={24} color={colors.textPrimary} />}
          chromeless
          onPress={() => router.back()}
        />
        <Text fontSize="$6" fontWeight="700" color={colors.textPrimary}>
          {t("Contact Support")}
        </Text>
      </XStack>

      <YStack gap="$3" marginTop="$4">
        <Text color={colors.textSecondary} fontSize="$4">
          {t("Choose a way to reach us.")}
        </Text>

        <ExternalLink href="mailto:ijusseen@gmail.com" asChild>
          <Card
            padding="$4"
            backgroundColor={colors.cardBackground}
            borderRadius="$6"
            borderWidth={1}
            borderColor="$gray5"
            pressStyle={{ opacity: 0.85 }}
            hoverStyle={{ opacity: 0.9 }}
            cursor="pointer"
            accessibilityRole="link"
          >
            <XStack gap="$3" alignItems="center">
              <Mail size={18} color={colors.textSecondary} />
              <YStack flex={1} gap="$1">
                <Text fontSize="$4" fontWeight="700" color={colors.textPrimary}>
                  {t("Email")}
                </Text>
                <Text fontSize="$4" color={colors.textSecondary}>
                  ijusseen@gmail.com
                </Text>
              </YStack>
            </XStack>
          </Card>
        </ExternalLink>

        <ExternalLink href="https://www.linkedin.com/company/intruct/" asChild>
          <Card
            padding="$4"
            backgroundColor={colors.cardBackground}
            borderRadius="$6"
            borderWidth={1}
            borderColor="$gray5"
            pressStyle={{ opacity: 0.85 }}
            hoverStyle={{ opacity: 0.9 }}
            cursor="pointer"
            accessibilityRole="link"
          >
            <XStack gap="$3" alignItems="center">
              <Linkedin size={18} color={colors.textSecondary} />
              <YStack flex={1} gap="$1">
                <Text fontSize="$4" fontWeight="700" color={colors.textPrimary}>
                  {t("LinkedIn")}
                </Text>
                <Text fontSize="$4" color={colors.textSecondary}>
                  https://www.linkedin.com/company/intruct/
                </Text>
              </YStack>
            </XStack>
          </Card>
        </ExternalLink>

        <ExternalLink href="https://t.me/andr_ewtf" asChild>
          <Card
            padding="$4"
            backgroundColor={colors.cardBackground}
            borderRadius="$6"
            borderWidth={1}
            borderColor="$gray5"
            pressStyle={{ opacity: 0.85 }}
            hoverStyle={{ opacity: 0.9 }}
            cursor="pointer"
            accessibilityRole="link"
          >
            <XStack gap="$3" alignItems="center">
              <Send size={18} color={colors.textSecondary} />
              <YStack flex={1} gap="$1">
                <Text fontSize="$4" fontWeight="700" color={colors.textPrimary}>
                  {t("Telegram")}
                </Text>
                <Text fontSize="$4" color={colors.textSecondary}>
                  @andr_ewtf
                </Text>
              </YStack>
            </XStack>
          </Card>
        </ExternalLink>
      </YStack>
    </ScreenContainer>
  );
}
