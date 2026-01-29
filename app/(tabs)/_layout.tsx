/**
 * WhatsSound — Tab Layout
 * 4 tabs: Chats, En Vivo, Descubrir, Ajustes
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.divider,
          borderTopWidth: 0.5,
          height: 56,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          ...typography.caption,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: 'En Vivo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="radio" size={size} color={color} />
          ),
          tabBarBadge: 3,
          tabBarBadgeStyle: { backgroundColor: colors.error, fontSize: 10 },
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Descubrir',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden tabs */}
      <Tabs.Screen name="groups" options={{ href: null }} />
      <Tabs.Screen name="history" options={{ href: null }} />
    </Tabs>
  );
}
