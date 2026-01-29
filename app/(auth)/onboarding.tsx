/**
 * WhatsSound — Onboarding (3 slides)
 * Presentación de la app para nuevos usuarios
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'headset' as const,
    title: 'Únete a sesiones en vivo',
    description:
      'Escucha música con amigos en tiempo real. El DJ pone la música, tú votas tus favoritas.',
  },
  {
    id: '2',
    icon: 'musical-notes' as const,
    title: 'Pide tus canciones',
    description:
      'Busca cualquier canción y pídela al DJ. Vota las peticiones de otros y sube tu favorita en la cola.',
  },
  {
    id: '3',
    icon: 'chatbubbles' as const,
    title: 'Chatea y reacciona',
    description:
      'Comenta en vivo, envía reacciones y propinas a tu DJ favorito. La fiesta es de todos.',
  },
];

const Slide = ({ item }: { item: typeof slides[0] }) => (
  <View style={[styles.slide, { width }]}>
    <View style={styles.iconContainer}>
      <Ionicons name={item.icon} size={80} color={colors.primary} />
    </View>
    <Text style={styles.slideTitle}>{item.title}</Text>
    <Text style={styles.slideDescription}>{item.description}</Text>
  </View>
);

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => <Slide item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <Button
          title={currentIndex === slides.length - 1 ? 'Empezar' : 'Siguiente'}
          onPress={handleNext}
          fullWidth
          size="lg"
        />
        {currentIndex < slides.length - 1 && (
          <Button
            title="Saltar"
            onPress={handleSkip}
            variant="ghost"
            fullWidth
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  slideTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  slideDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceLight,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  buttonsContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
    gap: spacing.sm,
  },
});
