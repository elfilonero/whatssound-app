-- =====================================================
-- MIGRACIÓN 006: Ratings, Payments y Stats
-- WhatsSound — 4 Feb 2026
-- =====================================================

-- -----------------------------------------------------
-- 1. VALORACIONES DE SESIONES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ws_session_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES ws_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, user_id) -- Un usuario solo puede valorar una vez por sesión
);

CREATE INDEX idx_session_ratings_session ON ws_session_ratings(session_id);
CREATE INDEX idx_session_ratings_user ON ws_session_ratings(user_id);

ALTER TABLE ws_session_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings visible para todos" 
  ON ws_session_ratings FOR SELECT USING (true);

CREATE POLICY "Usuarios pueden valorar" 
  ON ws_session_ratings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar su valoración" 
  ON ws_session_ratings FOR UPDATE 
  USING (auth.uid() = user_id);

-- -----------------------------------------------------
-- 2. MÉTODOS DE PAGO (Stripe)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ws_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL,
  stripe_customer_id TEXT,
  type TEXT NOT NULL DEFAULT 'card', -- card, apple_pay, google_pay
  brand TEXT, -- visa, mastercard, amex
  last4 TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payment_methods_user ON ws_payment_methods(user_id);
CREATE INDEX idx_payment_methods_stripe ON ws_payment_methods(stripe_payment_method_id);

ALTER TABLE ws_payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven sus métodos de pago" 
  ON ws_payment_methods FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden añadir métodos" 
  ON ws_payment_methods FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus métodos" 
  ON ws_payment_methods FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus métodos" 
  ON ws_payment_methods FOR DELETE 
  USING (auth.uid() = user_id);

-- -----------------------------------------------------
-- 3. CUENTAS CONECTADAS DE DJ (Stripe Connect)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ws_dj_stripe_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dj_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_account_id TEXT NOT NULL,
  charges_enabled BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  details_submitted BOOLEAN DEFAULT false,
  country TEXT DEFAULT 'ES',
  currency TEXT DEFAULT 'eur',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_dj_stripe_account ON ws_dj_stripe_accounts(stripe_account_id);

ALTER TABLE ws_dj_stripe_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "DJ ve su cuenta" 
  ON ws_dj_stripe_accounts FOR SELECT 
  USING (auth.uid() = dj_id);

CREATE POLICY "Sistema puede crear cuentas" 
  ON ws_dj_stripe_accounts FOR INSERT 
  WITH CHECK (auth.uid() = dj_id);

CREATE POLICY "Sistema puede actualizar cuentas" 
  ON ws_dj_stripe_accounts FOR UPDATE 
  USING (auth.uid() = dj_id);

-- -----------------------------------------------------
-- 4. PAGOS A DJS (Payouts)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ws_dj_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dj_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending', -- pending, processing, paid, failed
  stripe_transfer_id TEXT,
  stripe_payout_id TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  tips_count INTEGER DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0, -- 13% comisión
  net_amount DECIMAL(10,2), -- amount - platform_fee
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX idx_dj_payouts_dj ON ws_dj_payouts(dj_id);
CREATE INDEX idx_dj_payouts_status ON ws_dj_payouts(status);

ALTER TABLE ws_dj_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "DJ ve sus pagos" 
  ON ws_dj_payouts FOR SELECT 
  USING (auth.uid() = dj_id);

-- -----------------------------------------------------
-- 5. ESTADÍSTICAS POR HORA
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ws_hourly_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES ws_sessions(id) ON DELETE CASCADE,
  hour_timestamp TIMESTAMPTZ NOT NULL, -- Inicio de la hora
  listener_count INTEGER DEFAULT 0,
  peak_listeners INTEGER DEFAULT 0,
  songs_played INTEGER DEFAULT 0,
  songs_requested INTEGER DEFAULT 0,
  tips_count INTEGER DEFAULT 0,
  tips_amount DECIMAL(10,2) DEFAULT 0,
  reactions_count INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, hour_timestamp)
);

CREATE INDEX idx_hourly_stats_session ON ws_hourly_stats(session_id);
CREATE INDEX idx_hourly_stats_timestamp ON ws_hourly_stats(hour_timestamp);

ALTER TABLE ws_hourly_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stats visibles" 
  ON ws_hourly_stats FOR SELECT USING (true);

-- El DJ de la sesión puede insertar stats
CREATE POLICY "DJ puede insertar stats" 
  ON ws_hourly_stats FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ws_sessions 
      WHERE id = session_id AND dj_id = auth.uid()
    )
  );

-- -----------------------------------------------------
-- 6. ACTUALIZAR ws_tips PARA STRIPE
-- -----------------------------------------------------
ALTER TABLE ws_tips 
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_charge_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending', -- pending, succeeded, failed
  ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS net_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS refunded BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS refund_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_tips_payment_intent ON ws_tips(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_tips_status ON ws_tips(payment_status);

-- -----------------------------------------------------
-- 7. ACTUALIZAR ws_profiles PARA STRIPE
-- -----------------------------------------------------
ALTER TABLE ws_profiles 
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS default_payment_method_id UUID REFERENCES ws_payment_methods(id);

-- -----------------------------------------------------
-- 8. FUNCIÓN: Calcular rating promedio de DJ
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION get_dj_average_rating(dj_uuid UUID)
RETURNS DECIMAL AS $$
  SELECT COALESCE(
    ROUND(AVG(r.rating)::numeric, 1),
    0
  )
  FROM ws_session_ratings r
  JOIN ws_sessions s ON r.session_id = s.id
  WHERE s.dj_id = dj_uuid;
$$ LANGUAGE SQL STABLE;

-- -----------------------------------------------------
-- 9. FUNCIÓN: Calcular balance disponible de DJ
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION get_dj_balance(dj_uuid UUID)
RETURNS TABLE (
  total_earned DECIMAL,
  total_paid DECIMAL,
  available DECIMAL,
  pending DECIMAL
) AS $$
  WITH tip_totals AS (
    SELECT 
      COALESCE(SUM(net_amount), 0) as total_earned
    FROM ws_tips
    WHERE dj_id = dj_uuid 
      AND payment_status = 'succeeded'
      AND refunded = false
  ),
  payout_totals AS (
    SELECT 
      COALESCE(SUM(net_amount), 0) as total_paid
    FROM ws_dj_payouts
    WHERE dj_id = dj_uuid 
      AND status = 'paid'
  ),
  pending_payouts AS (
    SELECT 
      COALESCE(SUM(net_amount), 0) as pending
    FROM ws_dj_payouts
    WHERE dj_id = dj_uuid 
      AND status IN ('pending', 'processing')
  )
  SELECT 
    t.total_earned,
    p.total_paid,
    t.total_earned - p.total_paid - pp.pending as available,
    pp.pending
  FROM tip_totals t, payout_totals p, pending_payouts pp;
$$ LANGUAGE SQL STABLE;

-- -----------------------------------------------------
-- 10. SEED DATA (para demos)
-- -----------------------------------------------------

-- Rating de ejemplo
INSERT INTO ws_session_ratings (session_id, user_id, rating, comment)
SELECT 
  'b0000001-0000-0000-0000-000000000001',
  id,
  (RANDOM() * 2 + 3)::int, -- 3-5 estrellas
  CASE (RANDOM() * 3)::int
    WHEN 0 THEN '¡Sesión increíble! 🔥'
    WHEN 1 THEN 'Muy buen DJ, volvería'
    ELSE 'La mejor sesión del fin de semana'
  END
FROM ws_profiles
WHERE id != (SELECT dj_id FROM ws_sessions WHERE id = 'b0000001-0000-0000-0000-000000000001')
LIMIT 5
ON CONFLICT (session_id, user_id) DO NOTHING;

-- Stats por hora de ejemplo
INSERT INTO ws_hourly_stats (session_id, hour_timestamp, listener_count, peak_listeners, songs_played, tips_count, tips_amount)
VALUES 
  ('b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '3 hours', 34, 34, 8, 2, 5.00),
  ('b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '2 hours', 89, 95, 12, 5, 15.00),
  ('b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '1 hour', 127, 127, 15, 8, 22.50),
  ('b0000001-0000-0000-0000-000000000001', NOW(), 89, 127, 10, 3, 10.00)
ON CONFLICT (session_id, hour_timestamp) DO NOTHING;

-- =====================================================
-- FIN MIGRACIÓN 006
-- =====================================================
