import { AuthButton } from "@/components/auth/AuthButton";
import { AuthInput } from "@/components/auth/AuthInput";
import { SocialButton } from "@/components/auth/SocialButton";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient"; // Check complexity

export default function LoginScreen() {
  const colors = useThemeColors();
  const { signIn, signInWithGoogle, isLoading: loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch {
      // Error handling is done in AuthContext via Alert
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
              <LinearGradient
                width={100}
                height={100}
                borderRadius="$4"
                colors={["#4c669f", "#3b5998", "#192f6a"]} // Replace with actual purple gradient from design if possible, standard purple: ["#8b5cf6", "#d946ef"]
                start={[0, 0]}
                end={[1, 1]}
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize={60} color="white" fontWeight="bold">
                  I
                </Text>
              </LinearGradient>

              <YStack alignItems="center" marginTop="$4" gap="$2">
                <Text
                  fontSize="$8"
                  fontWeight="700"
                  color={colors.textPrimary}
                  textAlign="center"
                >
                  Welcome Back
                </Text>
                <Text
                  fontSize="$5"
                  color={colors.textSecondary}
                  textAlign="center"
                >
                  Sign in to continue learning
                </Text>
              </YStack>
            </YStack>

            {/* Form Section */}
            <YStack gap="$4">
              <AuthInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <AuthInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                isPassword
              />

              <XStack justifyContent="flex-end">
                <Link href="/(auth)/forgot-password" asChild>
                  <Text color="$blue9" fontSize="$3" fontWeight="600">
                    Forgot Password?
                  </Text>
                </Link>
              </XStack>
            </YStack>

            {/* Actions Section */}
            <YStack gap="$5">
              <AuthButton
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
              />

              <XStack alignItems="center" gap="$3">
                <View height={1} flex={1} backgroundColor="$gray5" />
                <Text color="$gray9" fontSize="$3">
                  OR
                </Text>
                <View height={1} flex={1} backgroundColor="$gray5" />
              </XStack>

              <SocialButton
                title="Continue with Google"
                onPress={() => signInWithGoogle()}
              />

              <XStack justifyContent="center" gap="$2" marginTop="$2">
                <Text color={colors.textSecondary} fontSize="$4">
                  Don&apos;t have an account?
                </Text>
                <Link href="/(auth)/register" asChild>
                  <Text color="$blue9" fontSize="$4" fontWeight="600">
                    Sign Up
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
