import { View, type ViewProps } from "react-native";

import { useTheme } from "@/contexts/theme-context";
import {
  useResolvedThemeColor,
  useThemeColors,
} from "@/hooks/use-theme-colors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { activeTheme } = useTheme();
  const colors = useThemeColors();
  const override = activeTheme === "dark" ? darkColor : lightColor;
  const finalBackgroundColor = useResolvedThemeColor(
    override ?? colors.background,
  );

  return (
    <View
      style={[
        finalBackgroundColor ? { backgroundColor: finalBackgroundColor } : null,
        style,
      ]}
      {...otherProps}
    />
  );
}
