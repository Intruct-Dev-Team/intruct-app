import type { ThemeColors } from "@/constants/colors";
import { darkColors, lightColors } from "@/constants/colors";
import { useTheme } from "@/contexts/theme-context";
import { getTokenValue } from "tamagui";

export function resolveThemeColor(color: string): string {
  if (typeof color !== "string") return String(color);
  if (!color.startsWith("$")) return color;
  return String(getTokenValue(color as never));
}

export function useThemeColors(): ThemeColors {
  const { activeTheme } = useTheme();
  return activeTheme === "dark" ? darkColors : lightColors;
}
