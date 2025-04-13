import "@/global.css";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack, router, useSegments } from "expo-router";
import GlobalProvider, { useGlobalContext } from "../context/GlobalProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { UserProvider, useUserContext } from "@/context/UserProvider";
import { ReadingContentProvider } from "@/context/ReadingContentProvider";

import React, { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

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
      //router.replace("/(tabs)/home");
      router.replace("/(tabs)/explore");
    }
  }, [user, segments]);

  // useEffect(() => {
  //   router.push("/profile/profileSettings");
  // }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GlobalProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <AuthProvider>
            <ProtectedRouteGuard>
              <ReadingContentProvider>
                <GluestackUIProvider mode="light">
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="content" />
                  </Stack>
                </GluestackUIProvider>
              </ReadingContentProvider>
            </ProtectedRouteGuard>
          </AuthProvider>
        </UserProvider>
      </QueryClientProvider>
    </GlobalProvider>
  );
}
