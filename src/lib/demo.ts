/**
 * WhatsSound — Demo & Test Mode Manager
 * 
 * 3 modes:
 * 1. ?demo=true    → INVESTOR DEMO: bypass auth, read-only, no writes to DB
 * 2. ?test=nombre  → TEST MODE: real Supabase, real writes, auto-create user by name
 * 3. ?demo=false   → PRODUCTION: real auth with phone OTP
 * 
 * Test mode users: ?test=angel, ?test=quique, ?test=leo, etc.
 * Each gets a unique profile in Supabase. Can invite unlimited people.
 */

import { Platform } from 'react-native';
import { supabase } from './supabase';

let _isDemoMode: boolean | null = null;
let _testUser: string | null = null;
let _testProfile: TestProfile | null = null;

interface TestProfile {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  is_dj: boolean;
}

// ─── Test user registry (auto-expand with any name) ─────────

const PRESET_USERS: Record<string, { display_name: string; is_dj: boolean }> = {
  angel:   { display_name: 'Ángel Fernández', is_dj: false },
  quique:  { display_name: 'Quique Alonso', is_dj: false },
  kike:    { display_name: 'Kike Alonso', is_dj: true },
  leo:     { display_name: 'Leo (IA)', is_dj: false },
  milo:    { display_name: 'Milo', is_dj: false },
  adrian:  { display_name: 'Adrián', is_dj: false },
  maria:   { display_name: 'María García', is_dj: false },
  pablo:   { display_name: 'Pablo Rodríguez', is_dj: false },
  carlos:  { display_name: 'DJ Carlos Madrid', is_dj: true },
  luna:    { display_name: 'Luna DJ', is_dj: true },
  sarah:   { display_name: 'Sarah B', is_dj: true },
  paco:    { display_name: 'Paco Techno', is_dj: true },
};

/**
 * Generate a deterministic UUID from a username
 * Format: eeee0001-0000-0000-0000-{12 hex chars from name}
 */
function nameToUUID(name: string): string {
  const hex = Array.from(name.toLowerCase().padEnd(12, '0'))
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 12);
  return `eeee0001-0000-0000-0000-${hex}`;
}

// ─── Mode detection ─────────────────────────────────────────

function _detectMode() {
  if (Platform.OS === 'web') {
    try {
      const params = new URLSearchParams(window.location.search);
      
      // Test mode: ?test=nombre
      if (params.has('test')) {
        const testName = params.get('test')?.toLowerCase().trim();
        if (testName) {
          _testUser = testName;
          _isDemoMode = false;
          localStorage.setItem('ws_test_user', testName);
          localStorage.removeItem('ws_demo_mode');
          return;
        }
      }
      
      // Demo mode: ?demo=true
      if (params.has('demo')) {
        _isDemoMode = params.get('demo') !== 'false';
        _testUser = null;
        localStorage.setItem('ws_demo_mode', _isDemoMode ? 'true' : 'false');
        localStorage.removeItem('ws_test_user');
        return;
      }
      
      // Check localStorage (sticky)
      const storedTest = localStorage.getItem('ws_test_user');
      if (storedTest) {
        _testUser = storedTest;
        _isDemoMode = false;
        return;
      }
      const storedDemo = localStorage.getItem('ws_demo_mode');
      if (storedDemo !== null) {
        _isDemoMode = storedDemo === 'true';
        return;
      }
    } catch {}
  }

  // Default: demo mode ON
  _isDemoMode = true;
}

export function isDemoMode(): boolean {
  if (_isDemoMode === null) _detectMode();
  return _isDemoMode!;
}

export function isTestMode(): boolean {
  if (_isDemoMode === null) _detectMode();
  return _testUser !== null;
}

export function getTestUserName(): string | null {
  if (_isDemoMode === null) _detectMode();
  return _testUser;
}

/**
 * Force set demo mode
 */
export function setDemoMode(enabled: boolean) {
  _isDemoMode = enabled;
  _testUser = null;
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem('ws_demo_mode', enabled ? 'true' : 'false');
      localStorage.removeItem('ws_test_user');
    } catch {}
  }
}

/**
 * Enable test mode for a phone number (used by login with test phones)
 * Creates a pseudo test user based on the phone number
 * Marks that profile creation is needed (won't auto-inject user)
 */
export function enableTestModeForPhone(phone: string) {
  // Generate a username from phone (last 6 digits)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const username = `tester_${cleanPhone.slice(-6)}`;
  
  _testUser = username;
  _isDemoMode = false;
  
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem('ws_test_user', username);
      localStorage.setItem('ws_test_phone', phone);
      localStorage.setItem('ws_test_needs_profile', 'true'); // Mark needs profile creation
      localStorage.removeItem('ws_demo_mode');
    } catch {}
  }
}

/**
 * Clear the needs_profile flag after profile is created
 */
export function clearTestNeedsProfile() {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem('ws_test_needs_profile');
    } catch {}
  }
}

/**
 * Get or create test user profile in Supabase.
 * Auto-creates if not found. Returns profile for auth store injection.
 */
export async function getOrCreateTestUser(): Promise<TestProfile | null> {
  if (!_testUser) return null;
  if (_testProfile) return _testProfile;

  const username = _testUser.toLowerCase().replace(/[^a-z0-9]/g, '');
  const uuid = nameToUUID(username);
  const preset = PRESET_USERS[username];
  const displayName = preset?.display_name || _testUser.charAt(0).toUpperCase() + _testUser.slice(1);
  const isDj = preset?.is_dj || false;

  // Try to find existing
  const { data: existing } = await supabase
    .from('ws_profiles')
    .select('*')
    .eq('id', uuid)
    .single();

  if (existing) {
    _testProfile = {
      id: existing.id,
      display_name: existing.display_name,
      username: existing.username,
      avatar_url: existing.avatar_url,
      is_dj: existing.is_dj,
    };
    return _testProfile;
  }

  // Create new test user
  const { data: created, error } = await supabase
    .from('ws_profiles')
    .insert({
      id: uuid,
      display_name: displayName,
      username: username,
      is_dj: isDj,
      dj_name: isDj ? displayName : null,
      genres: ['reggaeton', 'pop'],
    })
    .select()
    .single();

  if (error) {
    console.warn('Failed to create test user:', error.message);
    // Return a local-only profile
    _testProfile = { id: uuid, display_name: displayName, username, avatar_url: null, is_dj: isDj };
    return _testProfile;
  }

  _testProfile = {
    id: created.id,
    display_name: created.display_name,
    username: created.username,
    avatar_url: created.avatar_url,
    is_dj: created.is_dj,
  };
  return _testProfile;
}

// ─── Static demo profiles (for investor demo, read-only) ────

export const DEMO_USER = {
  id: 'a0000001-0000-0000-0000-000000000001',
  display_name: 'María García',
  username: 'mariagarcia',
  avatar_url: null,
  is_dj: false,
};

export const DEMO_DJ = {
  id: 'd0000001-0000-0000-0000-000000000001',
  display_name: 'DJ Carlos Madrid',
  username: 'carlosmadrid',
  dj_name: 'DJ Carlos Madrid',
  is_dj: true,
};

// ─── Session demo data (extracted from session/[id].tsx) ───

export const DEMO_SESSION = {
  djName: 'DJ Carlos Madrid',
  genre: 'Reggaetón / Latin',
  listeners: 45,
  queueCount: 12,
};

export const DEMO_NOW_PLAYING = {
  title: 'Pepas', 
  artist: 'Farruko', 
  album: 'La 167',
  art: 'https://e-cdns-images.dzcdn.net/images/cover/6ebe38518b35b9fab21e9a1e21b0d400/500x500-000000-80-0-0.jpg',
  preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3',
  duration: 204, 
  currentTime: 107,
};

export const DEMO_QUEUE = [
  { id: 'q1', title: 'Gasolina', artist: 'Daddy Yankee', art: 'https://e-cdns-images.dzcdn.net/images/cover/ed4fed49e1447e63e4e8d0e0e3a20ca3/500x500-000000-80-0-0.jpg', preview: '', by: 'María G.', votes: 8, dur: '3:12' },
  { id: 'q2', title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', art: 'https://e-cdns-images.dzcdn.net/images/cover/11be4e951f2e7467b255f4e2a4c37ae8/500x500-000000-80-0-0.jpg', preview: '', by: 'Pablo R.', votes: 6, dur: '3:47' },
  { id: 'q3', title: 'Dákiti', artist: 'Bad Bunny & Jhay Cortez', art: 'https://e-cdns-images.dzcdn.net/images/cover/59e41ee07b3a9af3e1a8a6ce79b5a7bb/500x500-000000-80-0-0.jpg', preview: '', by: 'Ana L.', votes: 5, dur: '3:25' },
  { id: 'q4', title: 'La Bicicleta', artist: 'Shakira & Carlos Vives', art: 'https://e-cdns-images.dzcdn.net/images/cover/a61aec4942e11c528e0dda3a39978af3/500x500-000000-80-0-0.jpg', by: 'Carlos M.', votes: 4, dur: '3:40' },
  { id: 'q5', title: 'Vivir Mi Vida', artist: 'Marc Anthony', art: 'https://e-cdns-images.dzcdn.net/images/cover/cf1ef4ff2daa7e6fde7a171f8e934b33/500x500-000000-80-0-0.jpg', by: 'Sofía T.', votes: 3, dur: '4:11' },
  { id: 'q6', title: 'Baila Conmigo', artist: 'Selena Gomez & Rauw Alejandro', art: 'https://e-cdns-images.dzcdn.net/images/cover/13e56cd62c1804214ef3e8b1c01c6f67/500x500-000000-80-0-0.jpg', by: 'Diego F.', votes: 2, dur: '3:08' },
];

interface ChatMsg { id: string; user: string; text: string; time: string; isMine: boolean; role?: 'dj'|'vip'|'mod'; }

export const DEMO_CHAT: ChatMsg[] = [
  { id:'c1', user:'DJ Carlos', text:'¡Bienvenidos al Viernes Latino! 🎉🔥 Vamos a darle caña toda la noche', time:'22:15', isMine:false, role:'dj' },
  { id:'c2', user:'María G.', text:'🔥🔥🔥 Vamos!!!', time:'22:16', isMine:false },
  { id:'c3', user:'Pablo R.', text:'Ponme reggaetón viejo porfa!!', time:'22:17', isMine:false },
  { id:'c4', user:'Tú', text:'Esta sesión está brutal 🙌', time:'22:18', isMine:true },
  { id:'c5', user:'Ana L.', text:'DJ Carlos el mejor de Madrid!! ❤️', time:'22:19', isMine:false, role:'vip' },
  { id:'c6', user:'DJ Carlos', text:'Pepas para arrancar! A mover esas caderas 💃', time:'22:20', isMine:false, role:'dj' },
  { id:'c7', user:'Sofía T.', text:'TEMAZOOO 🎵🔥🔥', time:'22:21', isMine:false },
  { id:'c8', user:'Diego F.', text:'Quién más está en la pista? 🕺', time:'22:22', isMine:false },
  { id:'c9', user:'ModLaura', text:'Recordad que podéis pedir canciones 🎶', time:'22:22', isMine:false, role:'mod' },
  { id:'c10', user:'Tú', text:'La siguiente tiene que ser Gasolina!! 🔥', time:'22:23', isMine:true },
  { id:'c11', user:'Carlos M.', text:'Jajaja todos pidiendo reggaetón 😂😂', time:'22:24', isMine:false },
  { id:'c12', user:'María G.', text:'¿Alguien más bailando en casa? 💃🕺', time:'22:25', isMine:false },
];

export const DEMO_PEOPLE = [
  { id:'p1', name:'DJ Carlos Madrid', role:'dj' as const, on:true },
  { id:'p2', name:'ModLaura', role:'mod' as const, on:true },
  { id:'p3', name:'Ana López', role:'vip' as const, on:true },
  { id:'p4', name:'María García', role:undefined, on:true },
  { id:'p5', name:'Pablo Rodríguez', role:undefined, on:true },
  { id:'p6', name:'Sofía Torres', role:undefined, on:true },
  { id:'p7', name:'Diego Fernández', role:undefined, on:true },
  { id:'p8', name:'Carlos Martín', role:undefined, on:true },
  { id:'p9', name:'Lucía Vega', role:undefined, on:true },
  { id:'p10', name:'Javier Hernández', role:undefined, on:false },
];
