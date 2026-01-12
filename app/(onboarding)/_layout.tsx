import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="complete-registration"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
