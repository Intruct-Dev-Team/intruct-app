import { View, type ViewProps } from "react-native";

import { useTheme } from "@/contexts/theme-context";
import { resolveThemeColor, useThemeColors } from "@/hooks/use-theme-colors";

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
  const finalBackgroundColor = resolveThemeColor(override ?? colors.background);

  return (
    <View
      style={[{ backgroundColor: finalBackgroundColor }, style]}
      {...otherProps}
    />
  );
}
