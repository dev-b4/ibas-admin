-- Tabela projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  score NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela evidences
CREATE TABLE evidences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela admin_users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  totp_secret TEXT,
  totp_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela action_logs
CREATE TABLE action_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,
  target TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela pilar_obligations
CREATE TABLE pilar_obligations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  pillar TEXT NOT NULL,
  obligation TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela ibas_history
CREATE TABLE ibas_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilar_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibas_history ENABLE ROW LEVEL SECURITY;

-- Allow read for everyone, write for authenticated admin users
CREATE POLICY "Allow public read for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read for evidences" ON evidences FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for evidences" ON evidences FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read for pilar_obligations" ON pilar_obligations FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for pilar_obligations" ON pilar_obligations FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read for ibas_history" ON ibas_history FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for ibas_history" ON ibas_history FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin read for admin_users" ON admin_users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access for admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin read for action_logs" ON action_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin insert for action_logs" ON action_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
