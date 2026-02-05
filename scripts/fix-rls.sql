-- Permitir INSERT público en ws_profiles
DROP POLICY IF EXISTS "Allow public insert" ON ws_profiles;
CREATE POLICY "Allow public insert" ON ws_profiles 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (true);

-- Permitir UPDATE público en ws_profiles  
DROP POLICY IF EXISTS "Allow public update" ON ws_profiles;
CREATE POLICY "Allow public update" ON ws_profiles 
  FOR UPDATE TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

-- Permitir SELECT público en ws_profiles
DROP POLICY IF EXISTS "Allow public select" ON ws_profiles;
CREATE POLICY "Allow public select" ON ws_profiles 
  FOR SELECT TO anon, authenticated 
  USING (true);
