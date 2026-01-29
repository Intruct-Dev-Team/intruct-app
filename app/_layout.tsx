import { CreatingCourseModal } from "@/components/create-course/creating-course-modal";
import { NotificationsHost } from "@/components/notifications/NotificationsHost";
import { AuthProvider } from "@/contexts/AuthContext";
import { CourseGenerationProvider } from "@/contexts/course-generation-context";
import { LanguageProvider } from "@/contexts/language-context";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import { t } from "@/localization/i18n";
import { setServerUnavailableHandler } from "@/services/api";
import config from "@/tamagui.config";
import NetInfo from "@react-native-community/netinfo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { PortalProvider } from "@tamagui/portal";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, Theme } from "tamagui";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { activeTheme } = useTheme();

  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const isConnectedRef = useRef<boolean | null>(null);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOffline = state.isConnected === false;
      const currentPath = pathnameRef.current;

      isConnectedRef.current = state.isConnected ?? null;

      if (isOffline) {
        if (currentPath !== "/no-internet") {
          router.replace("/no-internet");
        }
        return;
      }

      if (currentPath === "/no-internet") {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/");
        }
      }
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    setServerUnavailableHandler(() => {
      const currentPath = pathnameRef.current;
      const isOffline = isConnectedRef.current === false;

      if (isOffline) return;
      if (currentPath === "/no-internet") return;
      if (currentPath === "/server-unavailable") return;

      router.replace("/server-unavailable");
    });

    return () => {
      setServerUnavailableHandler(null);
    };
  }, [router]);

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
      <Theme name={activeTheme}>
        <PortalProvider shouldAddRootHost>
          <NavigationThemeProvider
            value={activeTheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(onboarding)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: t("Modal") }}
              />
              <Stack.Screen
                name="create-course"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="no-internet"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="server-unavailable"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>

            <NotificationsHost />
            <CreatingCourseModal />
            <StatusBar style={activeTheme === "dark" ? "light" : "dark"} />
          </NavigationThemeProvider>
        </PortalProvider>
      </Theme>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <LanguageProvider>
          <SafeAreaProvider>
            <NotificationsProvider>
              <AuthProvider>
                <CourseGenerationProvider>
                  <RootLayoutContent />
                </CourseGenerationProvider>
              </AuthProvider>
            </NotificationsProvider>
          </SafeAreaProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
