import { useThemeColors } from "@/hooks/use-theme-colors";
import { Text } from "tamagui";

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  const colors = useThemeColors();

  return (
    <Text
      fontSize="$5"
      fontWeight="600"
      color={colors.textPrimary}
      marginTop="$4"
      marginBottom="$3"
    >
      {title}
    </Text>
  );
}
