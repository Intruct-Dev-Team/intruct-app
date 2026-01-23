/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useTheme } from "tamagui";

import { useColorScheme } from "@/hooks/use-color-scheme";

export type ThemeColorName =
  | "text"
  | "background"
  | "tint"
  | "icon"
  | "tabIconDefault"
  | "tabIconSelected";

type ThemeVar = { get: () => string; val: string };

function isThemeVar(value: unknown): value is ThemeVar {
  if (typeof value !== "object" || value === null) return false;
  if (!("get" in value)) return false;
  const maybeGet = (value as { get?: unknown }).get;
  return typeof maybeGet === "function";
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName,
) {
  const theme = useTheme();

  const scheme = useColorScheme() ?? "light";
  const colorFromProps = scheme === "dark" ? props.dark : props.light;
  if (colorFromProps) return colorFromProps;

  switch (colorName) {
    case "background":
      return theme.background.get();
    case "text":
      return theme.color.get();
    case "tint": {
      const candidate = (theme as Record<string, unknown>).color1;
      return isThemeVar(candidate) ? candidate.get() : theme.color.get();
    }
    case "icon": {
      const candidate = (theme as Record<string, unknown>).color2;
      return isThemeVar(candidate) ? candidate.get() : theme.color.get();
    }
    case "tabIconDefault": {
      const candidate = (theme as Record<string, unknown>).color2;
      return isThemeVar(candidate) ? candidate.get() : theme.color.get();
    }
    case "tabIconSelected": {
      const candidate = (theme as Record<string, unknown>).color1;
      return isThemeVar(candidate) ? candidate.get() : theme.color.get();
    }
    default:
      return theme.color.get();
  }
}
