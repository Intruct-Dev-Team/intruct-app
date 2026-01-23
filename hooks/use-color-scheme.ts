import { useTheme } from "@/contexts/theme-context";

export function useColorScheme() {
  const { activeTheme } = useTheme();
  return activeTheme;
}
