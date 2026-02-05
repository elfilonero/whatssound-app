/**
 * WhatsSound — Rate Limiting
 * Protección contra abuso de API
 */

interface RateLimitEntry {
  timestamps: number[];
  blocked: boolean;
  blockedUntil?: number;
}

// In-memory store (se resetea al recargar, pero protege durante la sesión)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuración por defecto
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minuto
const DEFAULT_MAX_REQUESTS = 100; // 100 requests por minuto
const BLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutos de bloqueo

/**
 * Verifica si una acción está permitida bajo rate limiting
 * @param key - Identificador único (userId, IP, etc.)
 * @param maxRequests - Máximo de requests permitidos
 * @param windowMs - Ventana de tiempo en ms
 * @returns true si está permitido, false si está bloqueado
 */
export function checkRateLimit(
  key: string,
  maxRequests = DEFAULT_MAX_REQUESTS,
  windowMs = DEFAULT_WINDOW_MS
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  let entry = rateLimitStore.get(key);

  // Si no existe, crear entrada
  if (!entry) {
    entry = { timestamps: [], blocked: false };
    rateLimitStore.set(key, entry);
  }

  // Si está bloqueado, verificar si ya pasó el tiempo
  if (entry.blocked && entry.blockedUntil) {
    if (now < entry.blockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: entry.blockedUntil - now,
      };
    }
    // Desbloquear
    entry.blocked = false;
    entry.blockedUntil = undefined;
    entry.timestamps = [];
  }

  // Limpiar timestamps antiguos (fuera de la ventana)
  const windowStart = now - windowMs;
  entry.timestamps = entry.timestamps.filter(ts => ts > windowStart);

  // Verificar si excede el límite
  if (entry.timestamps.length >= maxRequests) {
    // Bloquear
    entry.blocked = true;
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    return {
      allowed: false,
      remaining: 0,
      resetIn: BLOCK_DURATION_MS,
    };
  }

  // Añadir timestamp actual
  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    resetIn: windowMs,
  };
}

/**
 * Rate limiter para acciones específicas con límites diferentes
 */
export const rateLimits = {
  // Acciones sensibles - límites bajos
  login: (userId: string) => checkRateLimit(`login:${userId}`, 5, 60 * 1000), // 5/min
  signup: (ip: string) => checkRateLimit(`signup:${ip}`, 3, 60 * 1000), // 3/min
  passwordReset: (email: string) => checkRateLimit(`reset:${email}`, 2, 60 * 1000), // 2/min
  
  // Acciones frecuentes - límites altos
  vote: (userId: string) => checkRateLimit(`vote:${userId}`, 30, 60 * 1000), // 30/min
  requestSong: (userId: string) => checkRateLimit(`song:${userId}`, 10, 60 * 1000), // 10/min
  sendMessage: (userId: string) => checkRateLimit(`msg:${userId}`, 60, 60 * 1000), // 60/min
  
  // API general
  api: (userId: string) => checkRateLimit(`api:${userId}`, 100, 60 * 1000), // 100/min
};

/**
 * Middleware wrapper para funciones async
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  limitType: keyof typeof rateLimits,
  getKey: (...args: Parameters<T>) => string
): T {
  return (async (...args: Parameters<T>) => {
    const key = getKey(...args);
    const limit = rateLimits[limitType](key);
    
    if (!limit.allowed) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(limit.resetIn / 1000)} seconds.`);
    }
    
    return fn(...args);
  }) as T;
}

/**
 * Hook para React - obtener estado de rate limit
 */
export function getRateLimitStatus(key: string): {
  isBlocked: boolean;
  requestsRemaining: number;
  resetIn: number;
} {
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
    return { isBlocked: false, requestsRemaining: DEFAULT_MAX_REQUESTS, resetIn: 0 };
  }
  
  if (entry.blocked && entry.blockedUntil) {
    const now = Date.now();
    if (now < entry.blockedUntil) {
      return {
        isBlocked: true,
        requestsRemaining: 0,
        resetIn: entry.blockedUntil - now,
      };
    }
  }
  
  const now = Date.now();
  const windowStart = now - DEFAULT_WINDOW_MS;
  const recentRequests = entry.timestamps.filter(ts => ts > windowStart).length;
  
  return {
    isBlocked: false,
    requestsRemaining: DEFAULT_MAX_REQUESTS - recentRequests,
    resetIn: DEFAULT_WINDOW_MS,
  };
}

/**
 * Limpiar el store (para tests)
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}
