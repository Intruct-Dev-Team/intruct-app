import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { Button, ButtonProps, Text, XStack } from "tamagui";

interface SocialButtonProps extends ButtonProps {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  // In a real app with SVG requirement, we'd pass an SVG component.
  // For now using Ionicons 'logo-google' as a proxy if available or just text/image.
}

export function SocialButton({
  title,
  iconName,
  onPress,
  ...props
}: SocialButtonProps) {
  return (
    <Button
      backgroundColor="white"
      borderColor="$gray5"
      borderWidth={1}
      size="$5"
      borderRadius="$4"
      pressStyle={{ backgroundColor: "$gray2" }}
      onPress={onPress}
      {...props}
    >
      <XStack alignItems="center" gap="$2">
        <Image
          source={require("@/assets/images/google-logo.png")}
          style={{ width: 24, height: 24, resizeMode: "contain" }}
        />
        <Text color="black" fontSize="$4" fontWeight="600">
          {title}
        </Text>
      </XStack>
    </Button>
  );
}
