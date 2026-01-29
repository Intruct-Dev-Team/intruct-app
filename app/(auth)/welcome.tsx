import { AuthButton } from "@/components/auth/AuthButton";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, YStack } from "tamagui";

export default function WelcomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const logoScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.4,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1.3,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoScale]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <YStack
        flex={1}
        padding="$5"
        justifyContent="space-between"
        paddingVertical="$8"
      >
        <YStack alignItems="center" marginTop="$10" gap="$4">
          <Animated.View style={{ transform: [{ scale: logoScale }] }}>
            <YStack
              width={140}
              height={140}
              borderColor="$gray5"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                source={require("../../assets/images/icons/splash-icon.png")}
                style={{ width: 124, height: 124 }}
                resizeMode="contain"
                accessibilityLabel="Intruct"
              />
            </YStack>
          </Animated.View>
          <Text
            fontSize="$5"
            color={colors.textSecondary}
            textAlign="center"
            maxWidth={300}
            marginTop="$5"
          >
            Master new skills with our interactive learning platform.
          </Text>
        </YStack>

        <YStack gap="$4">
          <Text
            fontSize="$6"
            fontWeight="600"
            color={colors.textPrimary}
            textAlign="center"
            marginBottom="$2"
          >
            Do you have an account?
          </Text>

          <AuthButton
            title="Yes, sign in"
            onPress={() => router.push("/(auth)/login")}
          />

          <Button
            size="$5"
            borderRadius="$6"
            backgroundColor="transparent"
            borderWidth={1}
            borderColor="$gray8"
            pressStyle={{ opacity: 0.8 }}
            onPress={() => router.push("/(auth)/register")}
            color={colors.textPrimary}
          >
            <Text color={colors.textPrimary} fontWeight="600" fontSize="$4">
              No, create account
            </Text>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
