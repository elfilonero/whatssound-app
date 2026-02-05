/**
 * WhatsSound — Integration Tests: Supabase Tips & Golden Boosts
 * Verifica el sistema de propinas y reconocimientos
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyehncvvvprrqwnsefcr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

describe('Supabase Tips Integration', () => {
  
  describe('READ tips', () => {
    test('puede leer propinas', async () => {
      const { data, error } = await supabase
        .from('ws_tips')
        .select('id, amount, status, created_at')
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    test('puede filtrar propinas completadas', async () => {
      const { data, error } = await supabase
        .from('ws_tips')
        .select('id, amount, status')
        .eq('status', 'completed')
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
      
      if (data) {
        data.forEach(tip => {
          expect(tip.status).toBe('completed');
        });
      }
    });

    test('puede leer propina con DJ y usuario', async () => {
      const { data, error } = await supabase
        .from('ws_tips')
        .select(`
          id,
          amount,
          from_user:ws_profiles!from_user_id(display_name),
          to_dj:ws_profiles!to_user_id(display_name, dj_name)
        `)
        .limit(5);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('Estructura de datos', () => {
    test('propina tiene campos requeridos', async () => {
      const { data } = await supabase
        .from('ws_tips')
        .select('*')
        .limit(1)
        .single();
      
      if (data) {
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('amount');
        expect(data).toHaveProperty('from_user_id');
        expect(data).toHaveProperty('to_user_id');
        expect(data).toHaveProperty('status');
      }
    });

    test('amount es número positivo', async () => {
      const { data } = await supabase
        .from('ws_tips')
        .select('amount')
        .limit(10);
      
      if (data) {
        data.forEach(tip => {
          expect(typeof tip.amount).toBe('number');
          expect(tip.amount).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Agregaciones', () => {
    test('puede sumar propinas de un DJ', async () => {
      // Obtener un DJ
      const { data: djs } = await supabase
        .from('ws_profiles')
        .select('id')
        .eq('is_dj', true)
        .limit(1);
      
      if (djs && djs.length > 0) {
        const { data, error } = await supabase
          .from('ws_tips')
          .select('amount')
          .eq('to_user_id', djs[0].id)
          .eq('status', 'completed');
        
        expect(error).toBeNull();
        
        if (data) {
          const total = data.reduce((sum, tip) => sum + (tip.amount || 0), 0);
          expect(typeof total).toBe('number');
        }
      }
    });

    test('puede contar propinas totales', async () => {
      const { count, error } = await supabase
        .from('ws_tips')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      
      expect(error).toBeNull();
      expect(typeof count).toBe('number');
    });
  });
});

describe('Supabase Golden Boosts Integration', () => {
  
  describe('READ golden boosts', () => {
    test('puede leer golden boosts', async () => {
      const { data, error } = await supabase
        .from('ws_golden_boosts')
        .select('id, from_user_id, to_user_id, created_at')
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    test('puede leer con relaciones', async () => {
      const { data, error } = await supabase
        .from('ws_golden_boosts')
        .select(`
          id,
          from_user:ws_profiles!from_user_id(display_name),
          to_user:ws_profiles!to_user_id(display_name, dj_name)
        `)
        .limit(5);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('Ranking de Golden Boosts', () => {
    test('puede obtener ranking de DJs por Golden Boosts', async () => {
      const { data, error } = await supabase
        .from('ws_profiles')
        .select('id, display_name, dj_name, golden_boosts_received')
        .eq('is_dj', true)
        .order('golden_boosts_received', { ascending: false })
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
      
      // Verificar ordenamiento
      if (data && data.length > 1) {
        for (let i = 0; i < data.length - 1; i++) {
          const current = data[i].golden_boosts_received || 0;
          const next = data[i + 1].golden_boosts_received || 0;
          expect(current).toBeGreaterThanOrEqual(next);
        }
      }
    });

    test('puede contar Golden Boosts esta semana', async () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count, error } = await supabase
        .from('ws_golden_boosts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString());
      
      expect(error).toBeNull();
      expect(typeof count).toBe('number');
    });
  });
});
