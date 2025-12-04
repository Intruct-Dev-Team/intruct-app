import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import config from "@/tamagui.config";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalProvider, TamaguiProvider, Theme } from "tamagui";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { activeTheme } = useTheme();

  useEffect(() => {
    // Set system UI colors based on theme
    // Note: This works in production builds but has limitations in Expo Go
    // In Expo Go, system UI is controlled by the Expo Go app itself
    if (activeTheme === "dark") {
      SystemUI.setBackgroundColorAsync("#000000").catch(() => {
        // Silently fail in Expo Go
      });
    } else {
      SystemUI.setBackgroundColorAsync("#FFFFFF").catch(() => {
        // Silently fail in Expo Go
      });
    }
  }, [activeTheme]);

  return (
    <TamaguiProvider config={config}>
      <PortalProvider>
        <Theme name={activeTheme}>
          <NavigationThemeProvider
            value={activeTheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
              <Stack.Screen
                name="create-course"
                options={{ headerShown: false }}
              />
            </Stack>
            <StatusBar style={activeTheme === "dark" ? "light" : "dark"} />
          </NavigationThemeProvider>
        </Theme>
      </PortalProvider>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <RootLayoutContent />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
