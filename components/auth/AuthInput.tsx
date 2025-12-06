import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Input, InputProps, Stack, Text, XStack, YStack } from "tamagui";

interface AuthInputProps extends InputProps {
    label: string;
    isPassword?: boolean;
}

export function AuthInput({ label, isPassword, ...props }: AuthInputProps) {
    const colors = useThemeColors();
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    return (
        <YStack gap="$2" width="100%">
            <Text
                color={colors.textPrimary}
                fontSize="$4"
                fontWeight="600"
                opacity={0.8}
            >
                {label}
            </Text>
            <XStack alignItems="center" width="100%">
                <Input
                    width="100%"
                    size="$4"
                    backgroundColor="$gray3"
                    borderWidth={0}
                    borderRadius="$4"
                    paddingRight={isPassword ? "$8" : "$3"}
                    secureTextEntry={isPassword && !showPassword}
                    placeholderTextColor="$gray9" // Adjust based on theme if needed, usually managed by Tamagui theme
                    {...props}
                />
                {isPassword && (
                    <Stack
                        position="absolute"
                        right="$3"
                        onPress={togglePassword}
                        hitSlop={10}
                        pressStyle={{ opacity: 0.7 }}
                    >
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </Stack>
                )}
            </XStack>
        </YStack>
    );
}
