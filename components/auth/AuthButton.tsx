import { useThemeColors } from "@/hooks/use-theme-colors";
import { Button, ButtonProps, Spinner, Text } from "tamagui";

interface AuthButtonProps extends ButtonProps {
    title: string;
    loading?: boolean;
    onPress?: () => void;
}

export function AuthButton({
    title,
    loading,
    onPress,
    ...props
}: AuthButtonProps) {
    const colors = useThemeColors();

    return (
        <Button
            backgroundColor="$blue9" // Using the accent color mentioned in project summary
            color="white"
            size="$5"
            borderRadius="$4"
            pressStyle={{ opacity: 0.8, backgroundColor: "$blue10" }}
            onPress={onPress}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <Spinner color="white" />
            ) : (
                <Text color="white" fontSize="$5" fontWeight="600">
                    {title}
                </Text>
            )}
        </Button>
    );
}
