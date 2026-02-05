/**
 * WhatsSound — Debug Toast System
 * Muestra errores visibles en pantalla durante pruebas
 */

import { Platform } from 'react-native';

// Cola de mensajes para mostrar
let toastQueue: string[] = [];
let listeners: ((msg: string) => void)[] = [];

export const debugLog = {
  // Loguear info
  info: (context: string, message: string, data?: any) => {
    const msg = `ℹ️ [${context}] ${message}`;
    console.log(msg, data || '');
    notify(msg);
  },

  // Loguear éxito
  success: (context: string, message: string, data?: any) => {
    const msg = `✅ [${context}] ${message}`;
    console.log(msg, data || '');
    notify(msg);
  },

  // Loguear error (SIEMPRE visible)
  error: (context: string, message: string, error?: any) => {
    const errorMsg = error?.message || error || '';
    const msg = `❌ [${context}] ${message}${errorMsg ? ': ' + errorMsg : ''}`;
    console.error(msg, error || '');
    notify(msg);
  },

  // Loguear warning
  warn: (context: string, message: string, data?: any) => {
    const msg = `⚠️ [${context}] ${message}`;
    console.warn(msg, data || '');
    notify(msg);
  },

  // Suscribirse a mensajes
  subscribe: (callback: (msg: string) => void) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  },

  // Obtener últimos mensajes
  getQueue: () => [...toastQueue],
  
  // Limpiar cola
  clear: () => {
    toastQueue = [];
  },
};

function notify(msg: string) {
  // Guardar en cola (máx 10)
  toastQueue.push(msg);
  if (toastQueue.length > 10) toastQueue.shift();
  
  // Notificar listeners
  listeners.forEach(l => l(msg));
  
  // En web, mostrar alert solo para errores críticos
  if (Platform.OS === 'web' && msg.startsWith('❌')) {
    // No usar alert, solo console
  }
}

export default debugLog;
