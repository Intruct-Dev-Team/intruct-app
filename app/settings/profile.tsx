import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { t } from "@/localization/i18n";
import { normalizeAvatarUri } from "@/utils/avatar";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Button, Card, Separator, Text, XStack, YStack } from "tamagui";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, signOut } = useAuth();

  const fullName =
    (profile?.name && profile?.surname
      ? `${profile.name} ${profile.surname}`.trim()
      : profile?.name || profile?.surname) || t("User");

  const email = profile?.email || "";

  const birthdate = profile?.birthdate || "";

  const avatarSrc = normalizeAvatarUri(profile?.avatar);

  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const fallbackInitial = t("User").slice(0, 1).toUpperCase();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <YStack flex={1} backgroundColor={colors.background}>
        <YStack flex={1} padding="$4" paddingTop="$6" gap="$4">
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <Button
                icon={<ChevronLeft size={24} color={colors.textPrimary} />}
                chromeless
                onPress={() => router.back()}
              />
              <Text fontSize="$6" fontWeight="700" color={colors.textPrimary}>
                {t("Personal Information")}
              </Text>
            </XStack>
            <Text color={colors.textSecondary} fontSize="$4">
              {t("Manage your account details")}
            </Text>
          </YStack>

          <Card
            padded
            backgroundColor={colors.cardBackground}
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$5"
          >
            <XStack alignItems="center" gap="$3">
              <Avatar circular size="$6">
                <Avatar.Image
                  src={avatarSrc}
                  source={avatarSrc ? { uri: avatarSrc } : undefined}
                />
                <Avatar.Fallback
                  backgroundColor="$blue9"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="$6" fontWeight="700" color="white">
                    {initials || fallbackInitial}
                  </Text>
                </Avatar.Fallback>
              </Avatar>
              <YStack flex={1} gap="$1">
                <Text fontSize="$6" fontWeight="700" color={colors.textPrimary}>
                  {fullName}
                </Text>
                <Text fontSize="$4" color={colors.textSecondary}>
                  {email}
                </Text>
              </YStack>
            </XStack>
          </Card>

          <Card
            padded
            backgroundColor={colors.cardBackground}
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$5"
          >
            <YStack gap="$3">
              <YStack gap="$1">
                <Text fontSize="$3" color={colors.textSecondary}>
                  {t("Full Name")}
                </Text>
                <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
                  {fullName}
                </Text>
              </YStack>

              <Separator borderColor="$borderColor" />

              <YStack gap="$1">
                <Text fontSize="$3" color={colors.textSecondary}>
                  {t("Email")}
                </Text>
                <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
                  {email}
                </Text>
              </YStack>

              {birthdate && (
                <>
                  <Separator borderColor="$borderColor" />

                  <YStack gap="$1">
                    <Text fontSize="$3" color={colors.textSecondary}>
                      {t("Date of Birth")}
                    </Text>
                    <Text
                      fontSize="$5"
                      fontWeight="600"
                      color={colors.textPrimary}
                    >
                      {new Date(birthdate).toLocaleDateString()}
                    </Text>
                  </YStack>
                </>
              )}
            </YStack>
          </Card>
        </YStack>

        <XStack
          padding="$4"
          paddingBottom={insets.bottom + 16}
          backgroundColor={colors.cardBackground}
          borderTopWidth={1}
          borderTopColor="$gray5"
        >
          <Button
            flex={1}
            size="$5"
            backgroundColor="$red3"
            color="$red11"
            onPress={signOut}
            pressStyle={{ opacity: 0.85 }}
          >
            {t("Sign Out")}
          </Button>
        </XStack>
      </YStack>
    </>
  );
}
