/**
 * Configuración centralizada de Supabase
 * NUNCA hardcodear URLs o keys en otros archivos
 */

// URLs y configuración desde variables de entorno
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyehncvvvprrqwnsefcr.supabase.co';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
export const SUPABASE_REST_URL = `${SUPABASE_URL}/rest/v1`;

// Storage key para auth (derivada del project ref)
const PROJECT_REF = SUPABASE_URL.split('//')[1]?.split('.')[0] || 'xyehncvvvprrqwnsefcr';
export const AUTH_STORAGE_KEY = `sb-${PROJECT_REF}-auth-token`;

/**
 * Obtiene el token de acceso actual
 */
export const getAccessToken = (): string => {
  if (typeof localStorage === 'undefined') return '';
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return JSON.parse(stored || '{}').access_token || '';
  } catch {
    return '';
  }
};

/**
 * Obtiene el ID del usuario actual
 */
export const getCurrentUserId = (): string => {
  if (typeof localStorage === 'undefined') return '';
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return JSON.parse(stored || '{}').user?.id || '';
  } catch {
    return '';
  }
};

/**
 * Obtiene el nombre del usuario actual
 */
export const getCurrentUserName = (): string => {
  if (typeof localStorage === 'undefined') return 'Usuario';
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return JSON.parse(stored || '{}').user?.user_metadata?.display_name || 'Usuario';
  } catch {
    return 'Usuario';
  }
};

/**
 * Obtiene los datos de auth completos
 */
export const getAuthData = () => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return JSON.parse(stored || '{}');
  } catch {
    return null;
  }
};

/**
 * Headers estándar para peticiones a Supabase REST
 */
export const getSupabaseHeaders = () => ({
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${getAccessToken()}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
});
