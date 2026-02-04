-- ============================================
-- WhatsSound — Aplicar Golden Boost Migration
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Primero verificar que no exista la tabla
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'ws_golden_boosts') THEN
    RAISE NOTICE 'Tabla ws_golden_boosts no existe, procediendo con migración...';
  ELSE
    RAISE NOTICE 'Tabla ws_golden_boosts ya existe, saltando creación...';
  END IF;
END $$;

-- 2. Crear tabla si no existe
CREATE TABLE IF NOT EXISTS ws_golden_boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
  to_dj_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES ws_sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  message TEXT,
  CONSTRAINT no_self_boost CHECK (from_user_id != to_dj_id)
);

-- 3. Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_golden_boosts_from_user ON ws_golden_boosts(from_user_id);
CREATE INDEX IF NOT EXISTS idx_golden_boosts_to_dj ON ws_golden_boosts(to_dj_id);
CREATE INDEX IF NOT EXISTS idx_golden_boosts_session ON ws_golden_boosts(session_id);
CREATE INDEX IF NOT EXISTS idx_golden_boosts_created ON ws_golden_boosts(created_at DESC);

-- 4. Añadir campos a ws_profiles (safe - usa IF NOT EXISTS)
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS golden_boost_available INT DEFAULT 1;
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS golden_boost_last_reset TIMESTAMPTZ DEFAULT now();
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS golden_boosts_received INT DEFAULT 0;
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS golden_boosts_given INT DEFAULT 0;
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS sessions_listened_this_week INT DEFAULT 0;
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS sessions_listened_reset TIMESTAMPTZ DEFAULT now();
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS golden_badge TEXT DEFAULT 'none';

-- 5. Habilitar RLS
ALTER TABLE ws_golden_boosts ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas RLS (drop si existen)
DROP POLICY IF EXISTS "golden_boosts_select_all" ON ws_golden_boosts;
DROP POLICY IF EXISTS "golden_boosts_insert_own" ON ws_golden_boosts;
DROP POLICY IF EXISTS "golden_boosts_no_update" ON ws_golden_boosts;
DROP POLICY IF EXISTS "golden_boosts_no_delete" ON ws_golden_boosts;

CREATE POLICY "golden_boosts_select_all" ON ws_golden_boosts FOR SELECT USING (true);
CREATE POLICY "golden_boosts_insert_own" ON ws_golden_boosts FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "golden_boosts_no_update" ON ws_golden_boosts FOR UPDATE USING (false);
CREATE POLICY "golden_boosts_no_delete" ON ws_golden_boosts FOR DELETE USING (false);

-- 7. Crear/reemplazar función de trigger
CREATE OR REPLACE FUNCTION handle_golden_boost_given()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar disponibilidad
  IF (SELECT golden_boost_available FROM ws_profiles WHERE id = NEW.from_user_id) < 1 THEN
    RAISE EXCEPTION 'No tienes Golden Boosts disponibles';
  END IF;
  
  -- Decrementar del dador
  UPDATE ws_profiles 
  SET golden_boost_available = golden_boost_available - 1,
      golden_boosts_given = golden_boosts_given + 1
  WHERE id = NEW.from_user_id;
  
  -- Incrementar del receptor
  UPDATE ws_profiles 
  SET golden_boosts_received = golden_boosts_received + 1
  WHERE id = NEW.to_dj_id;
  
  -- Actualizar badge
  PERFORM update_golden_badge(NEW.to_dj_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Crear/reemplazar trigger
DROP TRIGGER IF EXISTS on_golden_boost_given ON ws_golden_boosts;
CREATE TRIGGER on_golden_boost_given
BEFORE INSERT ON ws_golden_boosts
FOR EACH ROW EXECUTE FUNCTION handle_golden_boost_given();

-- 9. Función para actualizar badge
CREATE OR REPLACE FUNCTION update_golden_badge(profile_id UUID)
RETURNS VOID AS $$
DECLARE
  total_received INT;
  new_badge TEXT;
BEGIN
  SELECT golden_boosts_received INTO total_received
  FROM ws_profiles WHERE id = profile_id;
  
  new_badge := CASE
    WHEN total_received >= 500 THEN 'hall_of_fame'
    WHEN total_received >= 100 THEN 'verified'
    WHEN total_received >= 50 THEN 'fan_favorite'
    WHEN total_received >= 10 THEN 'rising_star'
    ELSE 'none'
  END;
  
  UPDATE ws_profiles SET golden_badge = new_badge WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Función de reset semanal (viernes 12:00)
CREATE OR REPLACE FUNCTION reset_weekly_golden_boosts()
RETURNS VOID AS $$
BEGIN
  UPDATE ws_profiles
  SET golden_boost_available = 1,
      golden_boost_last_reset = now(),
      sessions_listened_this_week = 0,
      sessions_listened_reset = now()
  WHERE golden_boost_last_reset < (now() - INTERVAL '7 days');
  
  RAISE NOTICE 'Golden Boosts reseteados - Viernes antes de comer';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Función de acelerador
CREATE OR REPLACE FUNCTION check_golden_boost_accelerator(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  sessions_count INT;
BEGIN
  SELECT sessions_listened_this_week INTO sessions_count
  FROM ws_profiles WHERE id = user_id;
  
  IF sessions_count >= 5 THEN
    UPDATE ws_profiles
    SET golden_boost_available = golden_boost_available + 1,
        sessions_listened_this_week = 0
    WHERE id = user_id AND sessions_listened_this_week >= 5;
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Crear vistas
CREATE OR REPLACE VIEW ws_golden_boost_leaderboard AS
SELECT 
  p.id, p.display_name, p.avatar_url,
  p.golden_boosts_received, p.golden_badge,
  RANK() OVER (ORDER BY p.golden_boosts_received DESC) as rank
FROM ws_profiles p
WHERE p.golden_boosts_received > 0
ORDER BY p.golden_boosts_received DESC;

-- 13. Grants
GRANT SELECT ON ws_golden_boost_leaderboard TO authenticated;

-- ============================================
-- ✅ MIGRACIÓN COMPLETADA
-- ============================================
SELECT 'Golden Boost migration applied successfully!' as status;
