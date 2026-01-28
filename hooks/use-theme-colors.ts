import type { ThemeColors } from "@/constants/colors";
import { darkColors, lightColors } from "@/constants/colors";
import { useTheme } from "@/contexts/theme-context";
import { useMemo } from "react";
import { getTokenValue, useTheme as useTamaguiTheme } from "tamagui";

export function resolveThemeColor(color: string): string {
  if (typeof color !== "string") return String(color);
  if (!color.startsWith("$")) return color;
  const tokenValue = getTokenValue(color as never);
  if (tokenValue == null) return color;
  return String(tokenValue);
}

export function useResolvedThemeColor(color?: string): string | undefined {
  const theme = useTamaguiTheme();

  return useMemo(() => {
    if (color == null) return color;
    if (typeof color !== "string") return String(color);
    if (!color.startsWith("$")) return color;

    // Prefer resolving from the active theme (handles "$background", "$backgroundStrong", etc.)
    const themeKey = color.slice(1);
    const themeValue = (theme as any)?.[themeKey];
    const fromTheme = themeValue?.get ? themeValue.get() : themeValue?.val;
    if (fromTheme != null && fromTheme !== "undefined")
      return String(fromTheme);

    // Fallback to resolving static tokens (e.g., "$blue9")
    const tokenValue = getTokenValue(color as never);
    if (tokenValue != null && tokenValue !== "undefined")
      return String(tokenValue);

    // Returning undefined is safer than passing an invalid color string to RN/SVG.
    return undefined;
  }, [color, theme]);
}

export function useThemeColors(): ThemeColors {
  const { activeTheme } = useTheme();
  return activeTheme === "dark" ? darkColors : lightColors;
}
