import { AuthInput } from "@/components/auth/AuthInput";
import { ScreenContainer } from "@/components/layout";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import { Button, Text, XStack, YStack } from "tamagui";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";

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
          Personal Information
        </Text>
      </XStack>

      <YStack gap="$4" marginTop="$4">
        <AuthInput label="Full Name" value={name} editable={false} />
        <AuthInput
          label="Email"
          value={email}
          editable={false}
          autoCapitalize="none"
        />

        <Button
          size="$5"
          backgroundColor="$red2"
          color="$red10"
          onPress={signOut}
          chromeless
        >
          Sign Out
        </Button>
      </YStack>
    </ScreenContainer>
  );
}
