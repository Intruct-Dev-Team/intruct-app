import { useThemeColors } from "@/hooks/use-theme-colors";
import { ChevronRight } from "@tamagui/lucide-icons";
import { Card, Text, XStack, YStack } from "tamagui";

interface UserProfileCardProps {
  name: string;
  email: string;
  onPress?: () => void;
}

export function UserProfileCard({
  name,
  email,
  onPress,
}: UserProfileCardProps) {
  const colors = useThemeColors();

  return (
    <Card
      backgroundColor={colors.cardBackground}
      borderRadius="$5"
      borderWidth={0}
      padding="$4"
      pressStyle={{
        opacity: 0.7,
      }}
      onPress={onPress}
    >
      <XStack gap="$3" alignItems="center" justifyContent="space-between">
        <XStack gap="$3" alignItems="center" flex={1}>
          <YStack
            width={64}
            height={64}
            alignItems="center"
            justifyContent="center"
            backgroundColor="$blue9"
            borderRadius="$10"
          >
            <Text fontSize="$8" fontWeight="700" color="white">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Text>
          </YStack>
          <YStack flex={1} gap="$1">
            <Text fontSize="$5" fontWeight="600" color={colors.textPrimary}>
              {name}
            </Text>
            <Text fontSize="$3" color={colors.textSecondary}>
              {email}
            </Text>
          </YStack>
        </XStack>
        <ChevronRight size={20} color={colors.textTertiary} />
      </XStack>
    </Card>
  );
}
