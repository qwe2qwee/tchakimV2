import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { icons } from "@/constants";

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Image
              source={icons.callH}
              style={{ width: 28, height: 28 }}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Image
              source={icons.search}
              style={{ width: 28, height: 28 }}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
