import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";

import { Compass, House, Library, School, User } from "lucide-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

import CompassAnimation from "~/assets/animations/Animation - 1744671952675.json";

const CompassIcon = ({ compassFocused, setCompassFocused }) => {
  const animationRef = useRef(null);

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
  const animationRef = useRef<LottieView>(null);
  const colorScheme = useColorScheme();
  const [compassFocused, setCompassFocused] = useState<boolean>(false);

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

      {/* <Tabs.Screen */}
      {/*   name="explore" */}
      {/*   options={{ */}
      {/*     tabBarLabel: () => null, */}
      {/*     tabBarIcon: ({ focused }) => ( */}
      {/*       <CompassIcon */}
      {/*         compassFocused={compassFocused} */}
      {/*         setCompassFocused={setCompassFocused} */}
      {/*       /> */}
      {/*     ), */}
      {/*     tabBarButton: (props) => ( */}
      {/*       <TouchableOpacity */}
      {/*         {...props} */}
      {/*         onPress={() => { */}
      {/*           props.onPress(); // don't forget this to navigate! */}
      {/*           setCompassFocused(true); */}
      {/*         }} */}
      {/*       /> */}
      {/*     ), */}
      {/*   }} */}
      {/* /> */}

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
