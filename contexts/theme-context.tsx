import { darkColors, lightColors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModulesProxy } from "expo-modules-core";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform, useColorScheme as useSystemColorScheme } from "react-native";
import { getTokenValue } from "tamagui";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  themeMode: ThemeMode;
  activeTheme: "light" | "dark";
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@intruct/theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    void loadTheme();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const activeTheme = useMemo<"light" | "dark">(() => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const resolveThemeColor = (color: string): string => {
    if (color.startsWith("$")) {
      return String(getTokenValue(color as never));
    }
    return color;
  };

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const hasExpoNavigationBarNativeModule = Boolean(
      (NativeModulesProxy as any).ExpoNavigationBar
    );
    if (!hasExpoNavigationBarNativeModule) return;

    let NavigationBar: typeof import("expo-navigation-bar") | undefined;
    try {
      NavigationBar = require("expo-navigation-bar");
    } catch {
      return;
    }
    if (
      !NavigationBar ||
      typeof (NavigationBar as any).setBackgroundColorAsync !== "function" ||
      typeof (NavigationBar as any).setButtonStyleAsync !== "function"
    ) {
      return;
    }

    const themeColors = activeTheme === "dark" ? darkColors : lightColors;
    const backgroundColor = resolveThemeColor(themeColors.cardBackground);
    const buttonStyle = activeTheme === "dark" ? "light" : "dark";

    try {
      void NavigationBar.setBackgroundColorAsync(backgroundColor);
      void NavigationBar.setButtonStyleAsync(buttonStyle);
    } catch {
      // no-op
    }
  }, [activeTheme]);

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeMode, activeTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
