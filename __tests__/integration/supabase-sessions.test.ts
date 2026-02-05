/**
 * WhatsSound — Integration Tests: Supabase Sessions
 * Verifica CRUD y permisos de ws_sessions y ws_session_members
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyehncvvvprrqwnsefcr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

describe('Supabase Sessions Integration', () => {
  
  describe('READ sessions', () => {
    test('puede leer sesiones activas', async () => {
      const { data, error } = await supabase
        .from('ws_sessions')
        .select('id, name, is_active, genres')
        .eq('is_active', true)
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    test('puede leer sesión con DJ', async () => {
      const { data, error } = await supabase
        .from('ws_sessions')
        .select(`
          id, 
          name, 
          dj:ws_profiles!dj_id(id, display_name, dj_name)
        `)
        .limit(5);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    test('puede leer sesión con conteo de miembros', async () => {
      const { data, error } = await supabase
        .from('ws_sessions')
        .select(`
          id,
          name,
          members:ws_session_members(count)
        `)
        .eq('is_active', true)
        .limit(5);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    test('puede buscar por género', async () => {
      const { data, error } = await supabase
        .from('ws_sessions')
        .select('id, name, genres')
        .contains('genres', ['reggaeton'])
        .eq('is_active', true)
        .limit(5);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    test('puede buscar por código de invitación', async () => {
      const { data, error } = await supabase
        .from('ws_sessions')
        .select('id, name, join_code')
        .not('join_code', 'is', null)
        .limit(1);
      
      expect(error).toBeNull();
      // El join_code debe ser único si existe
    });
  });

  describe('Session Members', () => {
    test('puede leer miembros de sesión', async () => {
      // Obtener una sesión primero
      const { data: sessions } = await supabase
        .from('ws_sessions')
        .select('id')
        .eq('is_active', true)
        .limit(1);
      
      if (sessions && sessions.length > 0) {
        const { data, error } = await supabase
          .from('ws_session_members')
          .select(`
            id,
            role,
            joined_at,
            profile:ws_profiles!user_id(display_name)
          `)
          .eq('session_id', sessions[0].id)
          .is('left_at', null);
        
        expect(error).toBeNull();
        expect(Array.isArray(data)).toBe(true);
      }
    });

    test('puede contar miembros activos', async () => {
      const { data: sessions } = await supabase
        .from('ws_sessions')
        .select('id')
        .eq('is_active', true)
        .limit(1);
      
      if (sessions && sessions.length > 0) {
        const { count, error } = await supabase
          .from('ws_session_members')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', sessions[0].id)
          .is('left_at', null);
        
        expect(error).toBeNull();
        expect(typeof count).toBe('number');
      }
    });
  });

  describe('Estructura de datos', () => {
    test('sesión tiene campos requeridos', async () => {
      const { data } = await supabase
        .from('ws_sessions')
        .select('*')
        .limit(1)
        .single();
      
      if (data) {
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('name');
        expect(data).toHaveProperty('dj_id');
        expect(data).toHaveProperty('is_active');
        expect(data).toHaveProperty('created_at');
      }
    });
  });

  describe('Queries de ranking', () => {
    test('puede obtener sesiones ordenadas por oyentes', async () => {
      const { data, error } = await supabase
        .from('ws_sessions')
        .select(`
          id,
          name,
          listener_count
        `)
        .eq('is_active', true)
        .order('listener_count', { ascending: false })
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
