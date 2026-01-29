/**
 * WhatsSound Design System — Colores
 * Basado en WhatsApp dark mode con identidad propia
 * Firmado por: Arquitecto Frontend
 */

export const colors = {
  // Primarios
  primary: '#25D366',        // Verde WhatsSound (identidad principal)
  primaryDark: '#1DA851',    // Verde oscuro (pressed states)
  primaryLight: '#34E076',   // Verde claro (hover, highlights)

  // Fondos
  background: '#0B141A',     // Fondo principal (negro azulado)
  surface: '#1F2C34',        // Tarjetas, modales, inputs
  surfaceLight: '#2A3942',   // Elementos elevados, hover
  surfaceDark: '#0A1014',    // Fondos más profundos

  // Texto
  textPrimary: '#FFFFFF',    // Texto principal
  textSecondary: '#8696A0',  // Texto secundario, placeholders
  textMuted: '#667781',      // Texto deshabilitado, timestamps
  textOnPrimary: '#FFFFFF',  // Texto sobre fondo verde

  // Acentos
  accent: '#53BDEB',         // Azul (links, info)
  warning: '#FFA726',        // Naranja (avisos)
  error: '#EF5350',          // Rojo (errores, eliminar)
  success: '#25D366',        // Verde (confirmaciones)

  // Bordes
  border: '#2A3942',         // Bordes sutiles
  borderLight: '#3B4A54',    // Bordes más visibles
  divider: '#1F2C34',        // Separadores de lista

  // Especiales
  online: '#25D366',         // Indicador online
  offline: '#667781',        // Indicador offline
  badge: '#25D366',          // Badge de notificación
  overlay: 'rgba(0, 0, 0, 0.6)', // Overlay modales

  // Chat
  bubbleOwn: '#005C4B',      // Burbuja mensaje propio
  bubbleOther: '#1F2C34',    // Burbuja mensaje ajeno
  bubbleSystem: '#1A2730',   // Mensaje de sistema

  // Player
  playerBg: '#0B141A',       // Fondo del player
  progressBar: '#25D366',    // Barra de progreso
  progressTrack: '#2A3942',  // Track de la barra
} as const;

export type ColorKey = keyof typeof colors;
