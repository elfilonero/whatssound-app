-- =============================================
-- MIGRACIÓN RÁPIDA - Copiar y pegar en Supabase
-- URL: https://supabase.com/dashboard/project/xyehncvvvprrqwnsefcr/sql/new
-- =============================================

-- 1. Añadir columnas a ws_profiles
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS golden_boost_available INT DEFAULT 1;
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS golden_boost_last_reset TIMESTAMPTZ DEFAULT now();
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS golden_boosts_received INT DEFAULT 0;
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS golden_boosts_given INT DEFAULT 0;
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS sessions_listened_this_week INT DEFAULT 0;
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS sessions_listened_reset TIMESTAMPTZ DEFAULT now();
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS golden_badge TEXT DEFAULT 'none';
ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS permanent_sponsors_count INT DEFAULT 0;

-- 2. Crear tabla de patrocinadores permanentes
CREATE TABLE IF NOT EXISTS ws_golden_boost_permanent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
  to_dj_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
  message TEXT,
  amount_cents INT DEFAULT 1999,
  created_at TIMESTAMPTZ DEFAULT now(),
  display_order INT DEFAULT 0,
  is_highlighted BOOLEAN DEFAULT false,
  CONSTRAINT unique_permanent_sponsor UNIQUE (from_user_id, to_dj_id)
);

-- 3. RLS para tabla permanente
ALTER TABLE ws_golden_boost_permanent ENABLE ROW LEVEL SECURITY;
CREATE POLICY "permanent_select_all" ON ws_golden_boost_permanent FOR SELECT USING (true);
CREATE POLICY "permanent_insert_own" ON ws_golden_boost_permanent FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- 4. Trigger para contadores
CREATE OR REPLACE FUNCTION handle_permanent_sponsor()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ws_profiles SET permanent_sponsors_count = permanent_sponsors_count + 1 WHERE id = NEW.to_dj_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_permanent_sponsor ON ws_golden_boost_permanent;
CREATE TRIGGER on_permanent_sponsor AFTER INSERT ON ws_golden_boost_permanent FOR EACH ROW EXECUTE FUNCTION handle_permanent_sponsor();

-- 5. Verificar
SELECT 'Migración completada!' as status;
SELECT column_name FROM information_schema.columns WHERE table_name = 'ws_profiles' AND column_name LIKE 'golden%' OR column_name LIKE 'permanent%';
