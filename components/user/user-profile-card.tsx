import { useThemeColors } from "@/hooks/use-theme-colors";
import { ChevronRight } from "@tamagui/lucide-icons";
import { Avatar, Card, Text, XStack, YStack } from "tamagui"; // Added Avatar to import

interface UserProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string; // Added avatarUrl
  onPress: () => void; // Changed to required
}

export function UserProfileCard({
  name,
  email,
  avatarUrl, // Added avatarUrl
  onPress,
}: UserProfileCardProps) {
  const colors = useThemeColors();

  return (
    <Card
      padded
      pressStyle={{ scale: 0.98 }}
      animation="quick"
      onPress={onPress}
      backgroundColor={colors.cardBackground}
      borderRadius="$5"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <XStack gap="$3" alignItems="center" justifyContent="space-between">
        <XStack gap="$3" alignItems="center" flex={1}>
          <Avatar circular size="$5">
            <Avatar.Image src={avatarUrl} />
            <Avatar.Fallback
              backgroundColor="$blue9"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="$5" fontWeight="700" color="white">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </Avatar.Fallback>
          </Avatar>
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
