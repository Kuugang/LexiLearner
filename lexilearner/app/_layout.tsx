import "@/global.css";
import { ReactNode } from "react";
import { SplashScreen, Stack, router, useSegments } from "expo-router";
import GlobalProvider from "../context/GlobalProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { UserProvider, useUserContext } from "@/context/UserProvider";

import React, { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

SplashScreen.hideAsync();

function ProtectedRouteGuard({ children }: { children: ReactNode }) {
  const { user } = useUserContext();

  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(tabs)";

    // If no user is signed in and the route isn't in the auth group, redirect to login
    if (!user && !inAuthGroup) {
      router.replace("/");
    }
    // If user is signed in and they're in the auth group, redirect to main content
    else if (user && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
  }, [user, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GlobalProvider>
      <UserProvider>
        <AuthProvider>
          <GluestackUIProvider mode="dark">
            <ProtectedRouteGuard>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
              </Stack>
            </ProtectedRouteGuard>
          </GluestackUIProvider>
        </AuthProvider>
      </UserProvider>
    </GlobalProvider>
  );
}
