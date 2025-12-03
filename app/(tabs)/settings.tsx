import { H2, ScrollView, Text, YStack } from "tamagui";

export default function SettingsScreen() {
  return (
    <ScrollView backgroundColor="#F5F5F5" flex={1}>
      <YStack padding="$4" paddingTop="$6" gap="$4">
        <H2 fontWeight="bold" color="$gray12">
          Settings
        </H2>
        <Text color="$gray11">App settings and preferences</Text>
      </YStack>
    </ScrollView>
  );
}
