import { AuthButton } from "@/components/auth/AuthButton";
import { AuthInput } from "@/components/auth/AuthInput";
import { SocialButton } from "@/components/auth/SocialButton";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export default function RegisterScreen() {
  const colors = useThemeColors();
  const { signUp, signInWithGoogle, isLoading: loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await signUp(email, password, name);
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
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
                colors={["#4c669f", "#3b5998", "#192f6a"]}
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
                  Create Account
                </Text>
                <Text
                  fontSize="$5"
                  color={colors.textSecondary}
                  textAlign="center"
                >
                  Sign up to start learning
                </Text>
              </YStack>
            </YStack>

            {/* Form Section */}
            <YStack gap="$4">
              <AuthInput
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
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
            </YStack>

            {/* Actions Section */}
            <YStack gap="$5">
              <AuthButton
                title="Sign Up"
                onPress={handleRegister}
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
                  Already have an account?
                </Text>
                <Link href="/(auth)/login" asChild>
                  <Text color="$blue9" fontSize="$4" fontWeight="600">
                    Sign In
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
