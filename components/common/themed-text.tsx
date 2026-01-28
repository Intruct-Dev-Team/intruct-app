import { StyleSheet, Text, type TextProps } from "react-native";

import { useTheme } from "@/contexts/theme-context";
import {
  useResolvedThemeColor,
  useThemeColors,
} from "@/hooks/use-theme-colors";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { activeTheme } = useTheme();
  const colors = useThemeColors();

  const override = activeTheme === "dark" ? darkColor : lightColor;
  const base = type === "link" ? colors.primary : colors.textPrimary;
  const resolvedColor = useResolvedThemeColor(override ?? base);

  return (
    <Text
      style={[
        resolvedColor ? { color: resolvedColor } : null,
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
});
