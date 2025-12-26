import { CreatingCourseModal } from "@/components/create-course/creating-course-modal";
import { AuthProvider } from "@/contexts/AuthContext";
import { CourseGenerationProvider } from "@/contexts/course-generation-context";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import config from "@/tamagui.config";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { PortalProvider } from "@tamagui/portal";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, Theme } from "tamagui";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { activeTheme } = useTheme();

  useEffect(() => {
    // Set system UI colors based on theme
    // Note: This works in production builds but has limitations in Expo Go
    // In Expo Go system UI is controlled by the Expo Go app itself

    const backgroundColor = activeTheme === "dark" ? "#000000" : "#FFFFFF";
    const navButtonStyle = activeTheme === "dark" ? "light" : "dark";

    SystemUI.setBackgroundColorAsync(backgroundColor).catch(() => {
      // Silently fail in Expo Go
    });

    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(backgroundColor).catch(() => {
        // Ignore on unsupported devices / edge-to-edge configs
      });
      NavigationBar.setBorderColorAsync(backgroundColor).catch(() => {
        // Ignore on unsupported devices / edge-to-edge configs
      });
      NavigationBar.setButtonStyleAsync(navButtonStyle).catch(() => {
        // Ignore on unsupported devices / edge-to-edge configs
      });
    }
  }, [activeTheme]);

  return (
    <TamaguiProvider config={config}>
      <PortalProvider shouldAddRootHost>
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
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>

            <CreatingCourseModal />
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
        <AuthProvider>
          <CourseGenerationProvider>
            <RootLayoutContent />
          </CourseGenerationProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
