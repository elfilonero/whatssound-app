/**
 * WhatsSound — Security Tests: Row Level Security
 * Verifica que RLS protege los datos correctamente
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyehncvvvprrqwnsefcr.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const anonClient = createClient(supabaseUrl, supabaseAnonKey);

describe('Row Level Security Tests', () => {
  
  describe('Profiles RLS', () => {
    test('perfiles públicos son accesibles', async () => {
      const { data, error } = await anonClient
        .from('ws_profiles')
        .select('id, display_name, is_dj')
        .limit(5);
      
      expect(error).toBeNull();
      // Campos públicos deberían ser accesibles
      if (data && data.length > 0) {
        expect(data[0]).toHaveProperty('display_name');
      }
    });

    test('datos sensibles de perfil no son accesibles sin auth', async () => {
      const { data } = await anonClient
        .from('ws_profiles')
        .select('phone, email, private_notes')
        .limit(5);
      
      // Campos privados no deberían existir o estar vacíos
      if (data && data.length > 0) {
        data.forEach(profile => {
          // Si estos campos existen, deberían estar vacíos para anon
          expect(profile.phone).toBeFalsy();
          expect(profile.email).toBeFalsy();
        });
      }
    });
  });

  describe('Tips RLS', () => {
    test('no se pueden ver propinas de otros usuarios sin auth', async () => {
      const { data } = await anonClient
        .from('ws_tips')
        .select('id, amount, from_user_id, to_user_id')
        .limit(10);
      
      // Sin auth, no debería ver propinas (RLS)
      expect(data?.length || 0).toBe(0);
    });

    test('no se puede insertar propina sin auth', async () => {
      const { error } = await anonClient
        .from('ws_tips')
        .insert({
          from_user_id: 'fake-user-id',
          to_user_id: 'another-fake-id',
          amount: 100,
          status: 'completed',
        });
      
      // Debería fallar por RLS
      expect(error).not.toBeNull();
    });
  });

  describe('Sessions RLS', () => {
    test('sesiones activas públicas son accesibles', async () => {
      const { data, error } = await anonClient
        .from('ws_sessions')
        .select('id, name, is_active')
        .eq('is_active', true)
        .limit(5);
      
      expect(error).toBeNull();
      // Sesiones públicas deberían ser visibles
    });

    test('no se puede modificar sesión sin ser el DJ', async () => {
      // Obtener una sesión existente
      const { data: sessions } = await anonClient
        .from('ws_sessions')
        .select('id')
        .limit(1);
      
      if (sessions && sessions.length > 0) {
        const { error } = await anonClient
          .from('ws_sessions')
          .update({ name: 'HACKED!' })
          .eq('id', sessions[0].id);
        
        // Debería fallar por RLS
        expect(error).not.toBeNull();
      }
    });

    test('no se puede eliminar sesión sin auth', async () => {
      const { data: sessions } = await anonClient
        .from('ws_sessions')
        .select('id')
        .limit(1);
      
      if (sessions && sessions.length > 0) {
        const { error } = await anonClient
          .from('ws_sessions')
          .delete()
          .eq('id', sessions[0].id);
        
        // Debería fallar por RLS
        expect(error).not.toBeNull();
      }
    });
  });

  describe('Votes RLS', () => {
    test('no se puede votar sin auth', async () => {
      const { error } = await anonClient
        .from('ws_votes')
        .insert({
          song_id: 'fake-song-id',
          user_id: 'fake-user-id',
        });
      
      // Debería fallar
      expect(error).not.toBeNull();
    });
  });

  describe('Messages RLS', () => {
    test('no se pueden leer mensajes privados sin auth', async () => {
      const { data } = await anonClient
        .from('ws_private_messages')
        .select('*')
        .limit(10);
      
      // Sin auth, no debería ver mensajes privados
      expect(data?.length || 0).toBe(0);
    });

    test('no se pueden leer mensajes de chat sin ser miembro', async () => {
      const { data } = await anonClient
        .from('ws_messages')
        .select('*')
        .limit(10);
      
      // Sin auth y sin ser miembro, no debería ver mensajes
      expect(data?.length || 0).toBe(0);
    });
  });

  describe('User Settings RLS', () => {
    test('no se pueden leer ajustes de otros usuarios', async () => {
      const { data } = await anonClient
        .from('ws_user_settings')
        .select('*')
        .limit(10);
      
      // Sin auth, no debería ver ajustes de nadie
      expect(data?.length || 0).toBe(0);
    });
  });

  describe('Golden Boosts RLS', () => {
    test('no se puede dar Golden Boost sin auth', async () => {
      const { error } = await anonClient
        .from('ws_golden_boosts')
        .insert({
          from_user_id: 'fake-user',
          to_user_id: 'another-fake',
        });
      
      expect(error).not.toBeNull();
    });
  });
});
