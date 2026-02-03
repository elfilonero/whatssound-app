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
