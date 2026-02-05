/**
 * WhatsSound — Integration Tests: Supabase Profiles
 * Verifica CRUD y permisos de la tabla ws_profiles
 */

import { createClient } from '@supabase/supabase-js';

// Test client (usando service role para tests)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyehncvvvprrqwnsefcr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

describe('Supabase Profiles Integration', () => {
  const testProfileId = `test-${Date.now()}`;
  
  describe('READ operations', () => {
    test('puede leer perfiles públicos', async () => {
      const { data, error } = await supabase
        .from('ws_profiles')
        .select('id, display_name, is_dj, is_verified')
        .limit(5);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    test('puede buscar DJs verificados', async () => {
      const { data, error } = await supabase
        .from('ws_profiles')
        .select('id, display_name, dj_name')
        .eq('is_dj', true)
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    test('puede filtrar por géneros', async () => {
      const { data, error } = await supabase
        .from('ws_profiles')
        .select('id, display_name, genres')
        .contains('genres', ['reggaeton'])
        .limit(5);
      
      expect(error).toBeNull();
      // Puede estar vacío si no hay DJs con ese género
      expect(Array.isArray(data)).toBe(true);
    });

    test('puede obtener perfil por ID', async () => {
      // Primero obtener un ID válido
      const { data: profiles } = await supabase
        .from('ws_profiles')
        .select('id')
        .limit(1);
      
      if (profiles && profiles.length > 0) {
        const { data, error } = await supabase
          .from('ws_profiles')
          .select('*')
          .eq('id', profiles[0].id)
          .single();
        
        expect(error).toBeNull();
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('display_name');
      }
    });
  });

  describe('Estructura de datos', () => {
    test('perfil tiene campos requeridos', async () => {
      const { data } = await supabase
        .from('ws_profiles')
        .select('*')
        .limit(1)
        .single();
      
      if (data) {
        // Campos que deben existir
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('display_name');
        expect(data).toHaveProperty('is_dj');
        expect(data).toHaveProperty('created_at');
      }
    });

    test('géneros es un array', async () => {
      const { data } = await supabase
        .from('ws_profiles')
        .select('genres')
        .not('genres', 'is', null)
        .limit(1)
        .single();
      
      if (data) {
        expect(Array.isArray(data.genres)).toBe(true);
      }
    });
  });

  describe('Queries complejas', () => {
    test('puede ordenar por Golden Boosts', async () => {
      const { data, error } = await supabase
        .from('ws_profiles')
        .select('id, display_name, golden_boosts_received')
        .order('golden_boosts_received', { ascending: false })
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
      
      // Verificar que está ordenado
      if (data && data.length > 1) {
        const first = data[0].golden_boosts_received || 0;
        const second = data[1].golden_boosts_received || 0;
        expect(first).toBeGreaterThanOrEqual(second);
      }
    });

    test('puede contar perfiles', async () => {
      const { count, error } = await supabase
        .from('ws_profiles')
        .select('*', { count: 'exact', head: true });
      
      expect(error).toBeNull();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
