-- =====================================================
-- MIGRACIÓN 008: Sistema de Rachas
-- WhatsSound — 4 Feb 2026
-- =====================================================

-- -----------------------------------------------------
-- 1. CAMPOS DE RACHA EN ws_profiles
-- -----------------------------------------------------
ALTER TABLE ws_profiles 
  ADD COLUMN IF NOT EXISTS streak_current INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_best INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_last_date DATE;

-- -----------------------------------------------------
-- 2. TABLA: Historial de actividad diaria
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ws_daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sessions_joined INTEGER DEFAULT 0,
  songs_requested INTEGER DEFAULT 0,
  songs_voted INTEGER DEFAULT 0,
  tips_sent INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  reactions_sent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

CREATE INDEX idx_daily_activity_user ON ws_daily_activity(user_id);
CREATE INDEX idx_daily_activity_date ON ws_daily_activity(activity_date);

ALTER TABLE ws_daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su actividad" 
  ON ws_daily_activity FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Sistema puede insertar actividad" 
  ON ws_daily_activity FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sistema puede actualizar actividad" 
  ON ws_daily_activity FOR UPDATE 
  USING (auth.uid() = user_id);

-- -----------------------------------------------------
-- 3. FUNCIÓN: Actualizar racha al unirse a sesión
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid UUID)
RETURNS void AS $$
DECLARE
  last_date DATE;
  current_streak INTEGER;
  best_streak INTEGER;
  today DATE := CURRENT_DATE;
BEGIN
  -- Obtener datos actuales
  SELECT streak_last_date, streak_current, streak_best 
  INTO last_date, current_streak, best_streak
  FROM ws_profiles 
  WHERE id = user_uuid;

  -- Calcular nueva racha
  IF last_date IS NULL THEN
    -- Primera actividad
    current_streak := 1;
  ELSIF last_date = today THEN
    -- Ya contado hoy, no hacer nada
    RETURN;
  ELSIF last_date = today - 1 THEN
    -- Día consecutivo, incrementar
    current_streak := current_streak + 1;
  ELSE
    -- Racha rota, empezar de nuevo
    current_streak := 1;
  END IF;

  -- Actualizar mejor racha si es necesario
  IF current_streak > best_streak THEN
    best_streak := current_streak;
  END IF;

  -- Guardar
  UPDATE ws_profiles SET
    streak_current = current_streak,
    streak_best = best_streak,
    streak_last_date = today
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- 4. FUNCIÓN: Registrar actividad diaria
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION record_daily_activity(
  user_uuid UUID,
  activity_type TEXT -- 'session', 'request', 'vote', 'tip', 'message', 'reaction'
)
RETURNS void AS $$
BEGIN
  INSERT INTO ws_daily_activity (user_id, activity_date)
  VALUES (user_uuid, CURRENT_DATE)
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    sessions_joined = CASE WHEN activity_type = 'session' THEN ws_daily_activity.sessions_joined + 1 ELSE ws_daily_activity.sessions_joined END,
    songs_requested = CASE WHEN activity_type = 'request' THEN ws_daily_activity.songs_requested + 1 ELSE ws_daily_activity.songs_requested END,
    songs_voted = CASE WHEN activity_type = 'vote' THEN ws_daily_activity.songs_voted + 1 ELSE ws_daily_activity.songs_voted END,
    tips_sent = CASE WHEN activity_type = 'tip' THEN ws_daily_activity.tips_sent + 1 ELSE ws_daily_activity.tips_sent END,
    messages_sent = CASE WHEN activity_type = 'message' THEN ws_daily_activity.messages_sent + 1 ELSE ws_daily_activity.messages_sent END,
    reactions_sent = CASE WHEN activity_type = 'reaction' THEN ws_daily_activity.reactions_sent + 1 ELSE ws_daily_activity.reactions_sent END,
    updated_at = NOW();
  
  -- Actualizar racha si es primera actividad del día
  IF activity_type = 'session' THEN
    PERFORM update_user_streak(user_uuid);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- 5. FUNCIÓN: Obtener stats de racha
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_streak_stats(user_uuid UUID)
RETURNS TABLE (
  current_streak INTEGER,
  best_streak INTEGER,
  last_active DATE,
  streak_alive BOOLEAN,
  days_this_week INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.streak_current, 0),
    COALESCE(p.streak_best, 0),
    p.streak_last_date,
    CASE 
      WHEN p.streak_last_date >= CURRENT_DATE - 1 THEN true 
      ELSE false 
    END,
    (
      SELECT COUNT(DISTINCT activity_date)::INTEGER
      FROM ws_daily_activity
      WHERE user_id = user_uuid
        AND activity_date >= date_trunc('week', CURRENT_DATE)
    )
  FROM ws_profiles p
  WHERE p.id = user_uuid;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- FIN MIGRACIÓN 008
-- =====================================================
