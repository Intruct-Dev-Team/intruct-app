import { useTheme } from "@/contexts/theme-context";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const { activeTheme } = useTheme();
  return activeTheme;
}
