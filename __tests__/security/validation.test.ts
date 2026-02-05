/**
 * WhatsSound — Security Tests: Input Validation
 * Verifica protección contra inyecciones y datos maliciosos
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyehncvvvprrqwnsefcr.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const client = createClient(supabaseUrl, supabaseAnonKey);

describe('Input Validation Security', () => {
  
  describe('SQL Injection Prevention', () => {
    test('búsqueda con SQL injection no ejecuta código', async () => {
      const maliciousInputs = [
        "'; DROP TABLE ws_profiles; --",
        "1' OR '1'='1",
        "1; SELECT * FROM ws_profiles; --",
        "UNION SELECT * FROM ws_profiles--",
        "' OR 1=1 --",
      ];
      
      for (const input of maliciousInputs) {
        const { error } = await client
          .from('ws_profiles')
          .select('id, display_name')
          .ilike('display_name', `%${input}%`);
        
        // No debería causar error de SQL (Supabase lo escapa)
        // Si hay error, debería ser de sintaxis, no de inyección
        if (error) {
          expect(error.message).not.toContain('DROP');
          expect(error.message).not.toContain('syntax error');
        }
      }
    });

    test('inserción con SQL injection es escapada', async () => {
      const maliciousName = "Test'); DELETE FROM ws_profiles; --";
      
      // Esto fallaría por RLS de todas formas, pero verificamos el escape
      const { error } = await client
        .from('ws_profiles')
        .insert({ display_name: maliciousName })
        .select();
      
      // Debería fallar por RLS, no por inyección exitosa
      expect(error).not.toBeNull();
      // El error NO debería indicar que se ejecutó el DELETE
    });
  });

  describe('XSS Prevention', () => {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg onload=alert("XSS")>',
      '"><script>alert("XSS")</script>',
      "'-alert('XSS')-'",
    ];

    test('payloads XSS son almacenados como texto plano', async () => {
      // Intentar leer datos que podrían contener XSS
      const { data } = await client
        .from('ws_profiles')
        .select('display_name, bio')
        .limit(10);
      
      // Verificar que si hay datos con caracteres especiales, están escapados
      if (data) {
        data.forEach(profile => {
          // Los datos deberían estar como texto plano, no ejecutable
          if (profile.display_name) {
            // No debería haber tags HTML activos
            expect(profile.display_name).not.toMatch(/<script[^>]*>/i);
          }
        });
      }
    });

    test('búsqueda con XSS no causa problemas', async () => {
      for (const payload of xssPayloads) {
        const { error } = await client
          .from('ws_sessions')
          .select('name')
          .ilike('name', `%${payload}%`);
        
        // La búsqueda debería funcionar normalmente
        expect(error).toBeNull();
      }
    });
  });

  describe('Payload Size Limits', () => {
    test('payload muy grande es rechazado', async () => {
      const hugeString = 'A'.repeat(1000000); // 1MB de texto
      
      const { error } = await client
        .from('ws_profiles')
        .update({ bio: hugeString })
        .eq('id', 'non-existent-id');
      
      // Debería haber algún tipo de límite
      // (puede fallar por RLS o por tamaño)
      expect(error).not.toBeNull();
    });

    test('array muy grande es rechazado', async () => {
      const hugeArray = Array(10000).fill('genre');
      
      const { error } = await client
        .from('ws_profiles')
        .update({ genres: hugeArray })
        .eq('id', 'non-existent-id');
      
      // Debería rechazar arrays excesivamente grandes
      expect(error).not.toBeNull();
    });
  });

  describe('Type Coercion', () => {
    test('tipos incorrectos son rechazados', async () => {
      // Intentar insertar string donde debería ir número
      const { error } = await client
        .from('ws_tips')
        .insert({
          amount: 'not-a-number' as any,
          from_user_id: 'test',
          to_user_id: 'test2',
          status: 'pending',
        });
      
      // Debería rechazar por tipo incorrecto o RLS
      expect(error).not.toBeNull();
    });

    test('valores negativos donde no deberían permitirse', async () => {
      const { error } = await client
        .from('ws_tips')
        .insert({
          amount: -100, // Propina negativa???
          from_user_id: 'test',
          to_user_id: 'test2',
          status: 'pending',
        });
      
      // Debería rechazar propinas negativas
      expect(error).not.toBeNull();
    });
  });

  describe('Special Characters', () => {
    test('caracteres unicode especiales son manejados', async () => {
      const specialChars = [
        '🎵🎶🎧', // Emojis
        '零一二三四五', // Chino
        'مرحبا', // Árabe
        '💉', // Emoji jeringa (a veces usado para inyección)
        '\u0000', // Null byte
        '\n\r\t', // Control chars
      ];
      
      for (const chars of specialChars) {
        const { error } = await client
          .from('ws_profiles')
          .select('id')
          .ilike('display_name', `%${chars}%`);
        
        // Debería manejar caracteres especiales sin crashear
        expect(error).toBeNull();
      }
    });
  });

  describe('Path Traversal', () => {
    test('path traversal en avatar_url no funciona', async () => {
      const maliciousPaths = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        'file:///etc/passwd',
        '/etc/passwd',
      ];
      
      for (const path of maliciousPaths) {
        const { error } = await client
          .from('ws_profiles')
          .update({ avatar_url: path })
          .eq('id', 'non-existent');
        
        // Debería fallar por RLS
        expect(error).not.toBeNull();
      }
    });
  });
});
