/**
 * WhatsSound — Integration Tests: Supabase Songs & Votes
 * Verifica la cola de canciones y sistema de votos
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyehncvvvprrqwnsefcr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

describe('Supabase Songs Integration', () => {
  
  describe('READ songs (cola)', () => {
    test('puede leer canciones de una sesión', async () => {
      // Obtener una sesión primero
      const { data: sessions } = await supabase
        .from('ws_sessions')
        .select('id')
        .limit(1);
      
      if (sessions && sessions.length > 0) {
        const { data, error } = await supabase
          .from('ws_songs')
          .select('id, title, artist, votes, status')
          .eq('session_id', sessions[0].id)
          .order('votes', { ascending: false });
        
        expect(error).toBeNull();
        expect(Array.isArray(data)).toBe(true);
      }
    });

    test('puede filtrar por estado', async () => {
      const { data, error } = await supabase
        .from('ws_songs')
        .select('id, title, status')
        .eq('status', 'pending')
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
      
      // Todas deben tener status pending
      if (data) {
        data.forEach(song => {
          expect(song.status).toBe('pending');
        });
      }
    });

    test('puede leer canción con quien la pidió', async () => {
      const { data, error } = await supabase
        .from('ws_songs')
        .select(`
          id,
          title,
          artist,
          requester:ws_profiles!requested_by(display_name)
        `)
        .limit(5);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('Estructura de datos', () => {
    test('canción tiene campos requeridos', async () => {
      const { data } = await supabase
        .from('ws_songs')
        .select('*')
        .limit(1)
        .single();
      
      if (data) {
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('title');
        expect(data).toHaveProperty('artist');
        expect(data).toHaveProperty('session_id');
        expect(data).toHaveProperty('votes');
        expect(data).toHaveProperty('status');
      }
    });

    test('status tiene valores válidos', async () => {
      const { data } = await supabase
        .from('ws_songs')
        .select('status')
        .limit(20);
      
      const validStatuses = ['pending', 'approved', 'rejected', 'played'];
      
      if (data) {
        data.forEach(song => {
          expect(validStatuses).toContain(song.status);
        });
      }
    });
  });

  describe('Ordenamiento de cola', () => {
    test('canciones ordenadas por votos descendente', async () => {
      const { data, error } = await supabase
        .from('ws_songs')
        .select('id, title, votes')
        .eq('status', 'pending')
        .order('votes', { ascending: false })
        .limit(10);
      
      expect(error).toBeNull();
      
      if (data && data.length > 1) {
        // Verificar ordenamiento
        for (let i = 0; i < data.length - 1; i++) {
          expect(data[i].votes).toBeGreaterThanOrEqual(data[i + 1].votes);
        }
      }
    });

    test('puede obtener siguiente canción', async () => {
      const { data: sessions } = await supabase
        .from('ws_sessions')
        .select('id')
        .eq('is_active', true)
        .limit(1);
      
      if (sessions && sessions.length > 0) {
        const { data, error } = await supabase
          .from('ws_songs')
          .select('id, title, artist, votes')
          .eq('session_id', sessions[0].id)
          .in('status', ['pending', 'approved'])
          .order('votes', { ascending: false })
          .limit(1)
          .single();
        
        // Puede no haber canciones
        expect(error?.code !== 'PGRST116' || data !== null).toBe(true);
      }
    });
  });

  describe('Conteos', () => {
    test('puede contar canciones por sesión', async () => {
      const { data: sessions } = await supabase
        .from('ws_sessions')
        .select('id')
        .limit(1);
      
      if (sessions && sessions.length > 0) {
        const { count, error } = await supabase
          .from('ws_songs')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', sessions[0].id);
        
        expect(error).toBeNull();
        expect(typeof count).toBe('number');
      }
    });

    test('puede contar canciones pendientes', async () => {
      const { count, error } = await supabase
        .from('ws_songs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      expect(error).toBeNull();
      expect(typeof count).toBe('number');
    });
  });
});

describe('Supabase Votes Integration', () => {
  
  describe('READ votes', () => {
    test('puede leer votos de una canción', async () => {
      const { data: songs } = await supabase
        .from('ws_songs')
        .select('id')
        .gt('votes', 0)
        .limit(1);
      
      if (songs && songs.length > 0) {
        const { data, error } = await supabase
          .from('ws_votes')
          .select('id, user_id, song_id')
          .eq('song_id', songs[0].id);
        
        expect(error).toBeNull();
        expect(Array.isArray(data)).toBe(true);
      }
    });
  });
});
