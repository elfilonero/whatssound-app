/**
 * WhatsSound — Sound Effects (Web Mock)
 * Versión web que no usa expo-av
 */

import { Platform } from 'react-native';

/**
 * Reproduce el sonido épico de Golden Boost usando Web Audio API
 */
export async function playGoldenBoostSound(): Promise<void> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Sonido épico de achievement
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // console.log('[Sounds] Web Audio not available');
  }
}

// Mock functions
export async function playReactionSound(): Promise<void> {}
export async function playNotificationSound(): Promise<void> {}
export async function playSuccessSound(): Promise<void> {}
export async function playErrorSound(): Promise<void> {}
export async function playSoundFile(): Promise<void> {}
