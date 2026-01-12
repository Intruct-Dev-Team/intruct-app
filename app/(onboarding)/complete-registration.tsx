import { AuthButton } from "@/components/auth/AuthButton";
import { AuthInput } from "@/components/auth/AuthInput";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, XStack, YStack } from "tamagui";

const pad2 = (value: number) => String(value).padStart(2, "0");

const formatBirthdate = (year: number, month: number, day: number) => {
  return `${year}-${pad2(month)}-${pad2(day)}`;
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

const isValidBirthdate = (value: string): boolean => {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return false;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return false;

  const [yyyy, mm, dd] = trimmed.split("-").map((x) => Number(x));
  if (!yyyy || !mm || !dd) return false;

  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;

  return true;
};

export default function CompleteRegistrationScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { notify } = useNotifications();
  const { user, session, signOut, setNeedsCompleteRegistration } = useAuth();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthYear, setBirthYear] = useState(2000);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [birthdate, setBirthdate] = useState(() => formatBirthdate(2000, 1, 1));
  const [avatar, setAvatar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [didEditName, setDidEditName] = useState(false);
  const [didEditSurname, setDidEditSurname] = useState(false);
  const [didEditAvatar, setDidEditAvatar] = useState(false);

  const handlePickAvatar = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset?.uri) {
        notify({
          type: "error",
          title: "Avatar",
          message: "Couldn’t read selected image.",
        });
        return;
      }

      setDidEditAvatar(true);
      setAvatar(asset.uri);
    } catch {
      notify({
        type: "error",
        title: "Avatar",
        message: "Couldn’t open image picker.",
      });
    }
  };

  useEffect(() => {
    const metadata = user?.user_metadata as Record<string, unknown> | undefined;
    if (!metadata) return;

    const fullName = metadata["full_name"];
    if (!didEditName && !didEditSurname && (!name.trim() || !surname.trim())) {
      if (typeof fullName === "string" && fullName.trim().length > 0) {
        const parts = fullName.trim().split(/\s+/);
        const nextName = parts[0] ?? "";
        const nextSurname = parts.slice(1).join(" ");

        if (!name.trim() && nextName) setName(nextName);
        if (!surname.trim() && nextSurname) setSurname(nextSurname);
      }
    }

    const avatarUrl = metadata["avatar_url"];
    if (!didEditAvatar && !avatar.trim()) {
      if (typeof avatarUrl === "string" && avatarUrl.trim().length > 0) {
        setAvatar(avatarUrl);
      }
    }
  }, [avatar, didEditAvatar, didEditName, didEditSurname, name, surname, user]);

  const currentYear = new Date().getFullYear();
  const maxDay = useMemo(() => {
    return getDaysInMonth(birthYear, birthMonth);
  }, [birthMonth, birthYear]);

  useEffect(() => {
    if (birthDay > maxDay) setBirthDay(maxDay);
  }, [birthDay, maxDay]);

  useEffect(() => {
    setBirthdate(formatBirthdate(birthYear, birthMonth, birthDay));
  }, [birthDay, birthMonth, birthYear]);

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (!name.trim()) return false;
    if (!surname.trim()) return false;
    if (!isValidBirthdate(birthdate)) return false;
    return true;
  }, [birthdate, isSubmitting, name, surname]);

  const handleConfirm = async () => {
    if (!canSubmit) return;

    const token = session?.access_token;
    if (!token) {
      notify({
        type: "error",
        title: "Session expired",
        message: "Please sign in again.",
      });
      await signOut();
      router.replace("/(auth)/welcome");
      return;
    }

    setIsSubmitting(true);
    try {
      setNeedsCompleteRegistration(false);

      notify({
        type: "success",
        title: "All set",
        message: "Registration completed.",
      });

      const returnToPath = typeof returnTo === "string" ? returnTo : "";
      const nextPath =
        returnToPath.trim().length > 0 &&
        !returnToPath.startsWith("/(onboarding)")
          ? returnToPath
          : "/(tabs)";

      router.replace(nextPath as Href);
    } finally {
      setIsSubmitting(false);
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
            <YStack
              alignItems="center"
              marginTop="$8"
              marginBottom="$4"
              gap="$2"
            >
              <Text
                fontSize="$8"
                fontWeight="700"
                color={colors.textPrimary}
                textAlign="center"
              >
                Complete registration
              </Text>
              <Text
                fontSize="$5"
                color={colors.textSecondary}
                textAlign="center"
              >
                Tell us a bit about you
              </Text>
            </YStack>

            <YStack gap="$4">
              <YStack alignItems="center" gap="$2">
                {avatar.trim().length > 0 ? (
                  <Image
                    source={{ uri: avatar }}
                    style={{ width: 140, height: 140, borderRadius: 70 }}
                  />
                ) : (
                  <YStack
                    width={140}
                    height={140}
                    borderRadius={70}
                    backgroundColor="$gray3"
                  />
                )}

                <Text
                  onPress={handlePickAvatar}
                  pressStyle={{ opacity: 0.7 }}
                  color="$blue9"
                  fontSize="$4"
                  fontWeight="600"
                >
                  Choose image
                </Text>
              </YStack>

              <AuthInput
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={(value) => {
                  setDidEditName(true);
                  setName(value);
                }}
                autoCapitalize="words"
              />
              <AuthInput
                label="Surname"
                placeholder="Enter your surname"
                value={surname}
                onChangeText={(value) => {
                  setDidEditSurname(true);
                  setSurname(value);
                }}
                autoCapitalize="words"
              />
              <YStack gap="$3">
                <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
                  Birthdate
                </Text>

                <XStack gap="$2">
                  <YStack
                    flex={1.6}
                    borderWidth={1}
                    borderColor="$gray4"
                    borderRadius="$4"
                    backgroundColor="$gray2"
                    overflow="hidden"
                  >
                    <Text
                      fontSize="$4"
                      color={colors.textSecondary}
                      paddingHorizontal="$2"
                      paddingTop="$2"
                      paddingBottom={0}
                    >
                      Year
                    </Text>
                    <YStack padding="$1" paddingTop={0}>
                      <Picker
                        enabled={!isSubmitting}
                        selectedValue={birthYear}
                        onValueChange={(value) => setBirthYear(Number(value))}
                        style={{ color: colors.textPrimary }}
                      >
                        {Array.from(
                          { length: currentYear - 1900 + 1 },
                          (_, i) => currentYear - i
                        ).map((year) => (
                          <Picker.Item
                            key={year}
                            label={String(year)}
                            value={year}
                          />
                        ))}
                      </Picker>
                    </YStack>
                  </YStack>

                  <YStack
                    flex={1}
                    borderWidth={1}
                    borderColor="$gray4"
                    borderRadius="$4"
                    backgroundColor="$gray2"
                    overflow="hidden"
                  >
                    <Text
                      fontSize="$4"
                      color={colors.textSecondary}
                      paddingHorizontal="$2"
                      paddingTop="$2"
                      paddingBottom={0}
                    >
                      Month
                    </Text>
                    <YStack padding="$1" paddingTop={0}>
                      <Picker
                        enabled={!isSubmitting}
                        selectedValue={birthMonth}
                        onValueChange={(value) => setBirthMonth(Number(value))}
                        style={{ color: colors.textPrimary }}
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <Picker.Item
                              key={month}
                              label={pad2(month)}
                              value={month}
                            />
                          )
                        )}
                      </Picker>
                    </YStack>
                  </YStack>

                  <YStack
                    flex={1}
                    borderWidth={1}
                    borderColor="$gray4"
                    borderRadius="$4"
                    backgroundColor="$gray2"
                    overflow="hidden"
                  >
                    <Text
                      fontSize="$4"
                      color={colors.textSecondary}
                      paddingHorizontal="$2"
                      paddingTop="$2"
                      paddingBottom={0}
                    >
                      Day
                    </Text>
                    <YStack padding="$1" paddingTop={0}>
                      <Picker
                        enabled={!isSubmitting}
                        selectedValue={birthDay}
                        onValueChange={(value) => setBirthDay(Number(value))}
                        style={{ color: colors.textPrimary }}
                      >
                        {Array.from({ length: maxDay }, (_, i) => i + 1).map(
                          (day) => (
                            <Picker.Item
                              key={day}
                              label={pad2(day)}
                              value={day}
                            />
                          )
                        )}
                      </Picker>
                    </YStack>
                  </YStack>
                </XStack>
              </YStack>
            </YStack>

            <AuthButton
              title="Confirm"
              onPress={handleConfirm}
              loading={isSubmitting}
              disabled={!canSubmit}
            />
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
