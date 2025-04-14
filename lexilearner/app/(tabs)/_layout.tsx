import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { BackHandler } from "react-native";

import { Compass, House, Library, School, User } from "lucide-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // useEffect(() => {
  //   const onBackPress = () => {
  //     BackHandler.exitApp();
  //     return true;
  //   };
  //
  //   BackHandler.addEventListener("hardwareBackPress", onBackPress);
  //   return () =>
  //     BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  // }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Transparent background for iOS with a blur effect
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Set the background color here
            position: "absolute",
            bottom: 0, // Optionally adjust the position
          },
          default: {
            backgroundColor: "white", // Set background color for Android or other platforms
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <House color={focused ? "#f97316" : "#9ca3af"} /> // Orange if active, Gray if not
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <Compass color={focused ? "#f97316" : "#9ca3af"} /> // Orange if active, Gray if not
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <Library color={focused ? "#f97316" : "#9ca3af"} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="classroom"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <School color={focused ? "#f97316" : "#9ca3af"} />
          ),
        }}
      />
    </Tabs>
  );
}
