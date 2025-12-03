import { H2, ScrollView, Text, YStack } from "tamagui";

export default function CatalogScreen() {
  return (
    <ScrollView backgroundColor="#F5F5F5" flex={1}>
      <YStack padding="$4" paddingTop="$6" gap="$4">
        <H2 fontWeight="bold" color="$gray12">
          Catalog
        </H2>
        <Text color="$gray11">Browse all available courses</Text>
      </YStack>
    </ScrollView>
  );
}
