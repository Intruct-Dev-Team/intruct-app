import { useTheme } from "@/contexts/theme-context";
import { Switch } from "tamagui";

export function ThemeToggle() {
  const { themeMode, setThemeMode, activeTheme } = useTheme();

  const isDark = activeTheme === "dark";

  const handleToggle = (checked: boolean) => {
    setThemeMode(checked ? "dark" : "light");
  };

  return (
    <Switch size="$4" checked={isDark} onCheckedChange={handleToggle}>
      <Switch.Thumb animation="quick" />
    </Switch>
  );
}
