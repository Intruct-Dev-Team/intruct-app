import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import config from "@/tamagui.config";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { PortalProvider, TamaguiProvider, Theme } from "tamagui";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { activeTheme } = useTheme();

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
      <RootLayoutContent />
    </ThemeProvider>
  );
}
