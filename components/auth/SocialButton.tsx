import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
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
    const colors = useThemeColors();

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
                {/* Using a colored G icon would be better, but Ionicons is available */}
                <Ionicons name={iconName || "logo-google"} size={20} color="black" />
                <Text color="black" fontSize="$4" fontWeight="600">
                    {title}
                </Text>
            </XStack>
        </Button>
    );
}
