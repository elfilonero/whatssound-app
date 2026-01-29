/**
 * WhatsSound — Splash Screen
 * Logo animado con el nombre WhatsSound
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate after 2.5s
    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo placeholder — burbuja con auriculares */}
        <View style={styles.logoBubble}>
          <Ionicons name="headset" size={48} color={colors.textOnPrimary} />
        </View>
        <Text style={styles.appName}>
          <Text style={styles.whats}>Whats</Text>
          <Text style={styles.sound}>Sound</Text>
        </Text>
      </Animated.View>
      <Text style={styles.tagline}>Tu música, tu sesión</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  logoBubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // Punta de burbuja simulada
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
  },
  whats: {
    color: colors.textPrimary,
  },
  sound: {
    color: colors.primary,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 12,
  },
});
