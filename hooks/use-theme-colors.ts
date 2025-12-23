import { darkColors, lightColors, type ThemeColors } from "@/constants/colors";
import { useTheme } from "@/contexts/theme-context";

export function useThemeColors(): ThemeColors {
  const { activeTheme } = useTheme();
  return activeTheme === "dark" ? darkColors : lightColors;
}
