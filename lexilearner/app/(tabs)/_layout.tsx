import { Tabs, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { BackHandler } from "react-native";

// import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUserContext } from "@/context/UserProvider";

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
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
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
          // tabBarIcon: ({ color }) => (
          // <IconSymbol size={28} name="house.fill" color={color} />
          // ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          // tabBarIcon: ({ color }) => (
          //   <IconSymbol size={28} name="library-books" color={color} />
          // ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          // tabBarIcon: ({ color }) => (
          //   <IconSymbol size={28} name="profile" color={color} />
          // ),
        }}
      />
    </Tabs>
  );
}
