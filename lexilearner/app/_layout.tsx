import "@/global.css";
import { SplashScreen, Stack } from "expo-router";
import GlobalProvider from "../context/GlobalProvider";
import { AuthProvider } from "@/context/AuthProvider";

import React from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

SplashScreen.hideAsync();
export default function RootLayout() {
  return (
    <GlobalProvider>
      <AuthProvider>
        <GluestackUIProvider mode="dark" mode="light">
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </GluestackUIProvider>
      </AuthProvider>
    </GlobalProvider>
  );
}
