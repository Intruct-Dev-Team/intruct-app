import { ScreenContainer } from "@/components/layout";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ChevronLeft, Mail, MessageCircle } from "@tamagui/lucide-icons";
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
          Contact Support
        </Text>
      </XStack>

      <YStack gap="$3" marginTop="$4">
        <Text color={colors.textSecondary} fontSize="$4">
          Choose a way to reach us.
        </Text>

        <Card
          padding="$4"
          backgroundColor={colors.cardBackground}
          borderRadius="$6"
          borderWidth={1}
          borderColor="$gray5"
        >
          <XStack gap="$3" alignItems="center">
            <MessageCircle size={18} color={colors.textSecondary} />
            <YStack flex={1} gap="$1">
              <Text fontSize="$4" fontWeight="700" color={colors.textPrimary}>
                In-app support
              </Text>
              <Text fontSize="$4" color={colors.textSecondary}>
                Coming soon.
              </Text>
            </YStack>
          </XStack>
        </Card>

        <Card
          padding="$4"
          backgroundColor={colors.cardBackground}
          borderRadius="$6"
          borderWidth={1}
          borderColor="$gray5"
        >
          <XStack gap="$3" alignItems="center">
            <Mail size={18} color={colors.textSecondary} />
            <YStack flex={1} gap="$1">
              <Text fontSize="$4" fontWeight="700" color={colors.textPrimary}>
                Email
              </Text>
              <Text fontSize="$4" color={colors.textSecondary}>
                Coming soon.
              </Text>
            </YStack>
          </XStack>
        </Card>
      </YStack>
    </ScreenContainer>
  );
}
