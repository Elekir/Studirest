import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const activeColor = Colors.dark.primary;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.primary,
        headerShown: false, // This hides  title at the very top
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: "rgba(0,0,0,0.8)",
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
          height: 60,
          paddingBottom: 10,
          
        },
        tabBarInactiveTintColor: "#666", // A lighter gray for inactive icons
      }}
    >
      <Tabs.Screen //  home screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen //  timer screen
        name="index"
        options={{
          title: "Timer",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen //  module screen
        name="modules"
        options={{
          title: "Modules",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen //  profile screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
