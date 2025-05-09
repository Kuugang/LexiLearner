import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";

import { Compass, House, Library, School, User } from "lucide-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

import CompassAnimation from "~/assets/animations/Animation - 1744671952675.json";

// Fix type errors for the CompassIcon props
const CompassIcon = ({
  compassFocused,
  setCompassFocused,
}: {
  compassFocused: boolean;
  setCompassFocused: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Fix the ref type to properly access LottieView methods
  const animationRef = useRef<LottieView | null>(null);

  useEffect(() => {
    if (compassFocused) {
      animationRef.current?.play();
      setCompassFocused(false);
    } else {
      animationRef.current?.reset();
    }
  }, [compassFocused]);

  return (
    <LottieView
      ref={animationRef}
      source={CompassAnimation}
      loop={false}
      style={{
        width: 30,
        height: 30,
      }}
    />
  );
};

export default function TabLayout() {
  const animationRef = useRef<LottieView | null>(null);
  const colorScheme = useColorScheme();
  const [compassFocused, setCompassFocused] = useState<boolean>(false);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            bottom: 0,
          },
          default: {
            backgroundColor: "white",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <House color={focused ? "#f97316" : "#9ca3af"} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <Compass color={focused ? "#f97316" : "#9ca3af"} />
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
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <User color={focused ? "#f97316" : "#9ca3af"} />
          ),
          // Fix for href type error - use a different approach
          href: "../profile",
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
