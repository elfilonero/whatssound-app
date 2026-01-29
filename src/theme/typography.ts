/**
 * WhatsSound Design System — Tipografía
 * Sistema tipográfico escalable
 * Firmado por: Arquitecto Frontend
 */

import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Headings
  h1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.2,
  },

  // Body
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },

  // UI
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  captionBold: {
    fontFamily,
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
  button: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  tab: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
  },
} as const;

export type TypographyKey = keyof typeof typography;
