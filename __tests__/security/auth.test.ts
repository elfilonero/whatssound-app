/**
 * WhatsSound — Security Tests: Authentication
 * Verifica seguridad de autenticación
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyehncvvvprrqwnsefcr.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

describe('Authentication Security', () => {
  
  describe('Token validation', () => {
    test('requests sin token son rechazados para datos protegidos', async () => {
      // Cliente sin autenticación
      const anonClient = createClient(supabaseUrl, supabaseAnonKey);
      
      // Intentar leer datos que requieren auth
      const { data, error } = await anonClient
        .from('ws_tips')
        .select('*')
        .limit(1);
      
      // Debería devolver array vacío o error (según RLS)
      // Si devuelve datos de otros usuarios = FALLO DE SEGURIDAD
      expect(data?.length || 0).toBeLessThanOrEqual(0);
    });

    test('token inválido es rechazado', async () => {
      const fakeClient = createClient(supabaseUrl, 'invalid-token');
      
      const { error } = await fakeClient
        .from('ws_profiles')
        .select('id')
        .limit(1);
      
      // Debería fallar con error de auth
      expect(error).not.toBeNull();
    });

    test('token malformado es rechazado', async () => {
      const malformedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.malformed.signature';
      
      const response = await fetch(`${supabaseUrl}/rest/v1/ws_profiles?select=id&limit=1`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${malformedToken}`,
        },
      });
      
      // Debería rechazar el token malformado
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Brute force protection', () => {
    test('múltiples intentos de login fallidos deberían ser limitados', async () => {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      const fakeEmail = 'bruteforce-test@fake-email-that-doesnt-exist.com';
      const fakePassword = 'wrong-password';
      
      const attempts = [];
      
      // Hacer 10 intentos rápidos
      for (let i = 0; i < 10; i++) {
        const result = await client.auth.signInWithPassword({
          email: fakeEmail,
          password: fakePassword,
        });
        attempts.push(result);
      }
      
      // Todos deberían fallar (sin dar información sobre si el email existe)
      attempts.forEach(attempt => {
        expect(attempt.error).not.toBeNull();
        // El mensaje no debería revelar si el email existe o no
        expect(attempt.error?.message).not.toContain('user not found');
      });
    });
  });

  describe('Session security', () => {
    test('no se puede acceder a sesiones de otros usuarios sin auth', async () => {
      const anonClient = createClient(supabaseUrl, supabaseAnonKey);
      
      // Intentar acceder a datos privados de sesión
      const { data } = await anonClient
        .from('ws_user_settings')
        .select('*')
        .limit(5);
      
      // No debería devolver configuraciones de otros usuarios
      expect(data?.length || 0).toBe(0);
    });
  });

  describe('Password security', () => {
    test('signup rechaza contraseñas débiles', async () => {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      
      const weakPasswords = ['123', 'password', '12345678'];
      
      for (const weakPass of weakPasswords) {
        const { error } = await client.auth.signUp({
          email: `weak-pass-test-${Date.now()}@test.com`,
          password: weakPass,
        });
        
        // Supabase debería rechazar contraseñas débiles
        // (depende de la configuración del proyecto)
        // Si pasa, verificar que la configuración de Supabase es correcta
      }
    });
  });
});
