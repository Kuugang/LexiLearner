import "~/global.css";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack, router, useSegments } from "expo-router";
import GlobalProvider, { useGlobalContext } from "../context/GlobalProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { UserProvider, useUserContext } from "@/context/UserProvider";
import { ReadingContentProvider } from "@/context/ReadingContentProvider";

import React, { useEffect } from "react";
import { PortalHost } from "@rn-primitives/portal";

import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

SplashScreen.hideAsync();

const queryClient = new QueryClient();

function ProtectedRouteGuard({ children }: { children: ReactNode }) {
  const { user } = useUserContext();

  const segments = useSegments();
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      // Only redirect to index if not already there
      router.replace("/");
    } else if (user && (inAuthGroup || segments.length === 0)) {
      // router.replace("/(tabs)/home");
      // router.replace("/(tabs)/explore");
      router.replace("/minigames/WordHunt");
    }
  }, [user, segments]);

  // useEffect(() => {
  //   router.push("/profile");
  // }, []);

  return <>{children}</>;
}

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <AuthProvider>
              <ProtectedRouteGuard>
                <ReadingContentProvider>
                  <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="profile" />
                    <Stack.Screen name="content" />
                  </Stack>
                  <PortalHost />
                </ReadingContentProvider>
              </ProtectedRouteGuard>
            </AuthProvider>
          </UserProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GlobalProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
