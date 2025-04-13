import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { BackHandler } from "react-native";

import { Compass, House, Library, School, User } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const onBackPress = () => {
      BackHandler.exitApp();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <House color={focused ? "#f97316" : "#9ca3af"} /> // Orange if active, Gray if not
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Compass color={focused ? "#f97316" : "#9ca3af"} /> // Orange if active, Gray if not
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          tabBarLabel: "Library",
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
        name="classrooms"
        options={{
          tabBarLabel: "Classrooms",
          tabBarIcon: ({ color, focused }) => (
            <School color={focused ? "#f97316" : "#9ca3af"} />
          ),
        }}
      />
    </Tabs>
  );
}
