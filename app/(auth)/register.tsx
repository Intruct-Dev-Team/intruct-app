import { AuthButton } from "@/components/auth/AuthButton";
import { AuthInput } from "@/components/auth/AuthInput";
import { SocialButton } from "@/components/auth/SocialButton";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { t } from "@/localization/i18n";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";

export default function RegisterScreen() {
  const colors = useThemeColors();
  const { notify } = useNotifications();
  const { signUp, signInWithGoogle, isLoading: loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !name) {
      notify({
        type: "error",
        title: t("Missing information"),
        message: t("Please fill in all fields."),
      });
      return;
    }

    try {
      await signUp(email, password, name);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: unknown }).message
          : undefined;

      notify({
        type: "error",
        title: t("Registration failed"),
        message:
          typeof message === "string" && message.trim().length > 0
            ? message
            : t("Something went wrong. Please try again."),
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <YStack flex={1} paddingHorizontal="$5" paddingVertical="$6" gap="$6">
            {/* Logo/Icon Section */}
            <YStack alignItems="center" marginTop="$8" marginBottom="$4">
              <YStack
                width={100}
                height={100}
                borderColor="$gray5"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  source={require("../../assets/images/icons/splash-icon.png")}
                  style={{ width: 84, height: 84 }}
                  resizeMode="contain"
                  accessibilityLabel={t("Intruct")}
                />
              </YStack>

              <YStack alignItems="center" marginTop="$4" gap="$2">
                <Text
                  fontSize="$8"
                  fontWeight="700"
                  color={colors.textPrimary}
                  textAlign="center"
                >
                  {t("Create Account")}
                </Text>
                <Text
                  fontSize="$5"
                  color={colors.textSecondary}
                  textAlign="center"
                >
                  {t("Sign up to start learning")}
                </Text>
              </YStack>
            </YStack>

            {/* Form Section */}
            <YStack gap="$4">
              <AuthInput
                label={t("Name")}
                placeholder={t("Enter your full name")}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <AuthInput
                label={t("Email")}
                placeholder={t("Enter your email")}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <AuthInput
                label={t("Password")}
                placeholder={t("Enter your password")}
                value={password}
                onChangeText={setPassword}
                isPassword
              />
            </YStack>

            {/* Actions Section */}
            <YStack gap="$5">
              <AuthButton
                title={t("Sign Up")}
                onPress={handleRegister}
                loading={loading}
              />

              <XStack alignItems="center" gap="$3">
                <View height={1} flex={1} backgroundColor="$gray5" />
                <Text color="$gray9" fontSize="$3">
                  {t("OR")}
                </Text>
                <View height={1} flex={1} backgroundColor="$gray5" />
              </XStack>

              <SocialButton
                title={t("Continue with Google")}
                onPress={() => signInWithGoogle()}
              />

              <XStack justifyContent="center" gap="$2" marginTop="$2">
                <Text color={colors.textSecondary} fontSize="$4">
                  {t("Already have an account?")}
                </Text>
                <Link href="/(auth)/login" asChild>
                  <Text color="$blue9" fontSize="$4" fontWeight="600">
                    {t("Sign In")}
                  </Text>
                </Link>
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
