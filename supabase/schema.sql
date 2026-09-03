-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT DEFAULT 'Floresta',
  status TEXT DEFAULT 'Custodiado',
  score INT DEFAULT 0,
  peso FLOAT DEFAULT 0,
  impacto FLOAT DEFAULT 0,
  variacao FLOAT DEFAULT 0,
  preco FLOAT DEFAULT 0,
  volume TEXT,
  metodologia TEXT,
  verificacao TEXT,
  localizacao TEXT DEFAULT 'Brasil',
  originador TEXT,
  blockchain TEXT DEFAULT 'Polygon',
  data_listagem TEXT,
  logo_url TEXT,
  links JSONB DEFAULT '{}',
  acreditacao JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EVIDENCES
CREATE TABLE IF NOT EXISTS evidences (
  id TEXT PRIMARY KEY,
  projeto_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  pilar_num INT,
  name TEXT,
  type TEXT DEFAULT 'Link',
  source TEXT,
  status TEXT DEFAULT 'Pendente',
  link_url TEXT,
  file_url TEXT,
  date TEXT,
  validated_by TEXT DEFAULT 'compliance@b4.capital',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  role TEXT DEFAULT 'admin',
  projects TEXT[] DEFAULT '{}',
  totp_enabled BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTION LOGS
CREATE TABLE IF NOT EXISTS action_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES admin_users(id),
  action TEXT,
  target TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PILAR OBLIGATIONS
CREATE TABLE IF NOT EXISTS pilar_obligations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projeto_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  pilar_num INT,
  name TEXT,
  required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IBAS HISTORY
CREATE TABLE IF NOT EXISTS ibas_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE,
  value FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilar_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibas_history ENABLE ROW LEVEL SECURITY;

-- Projects: public read, authenticated write
CREATE POLICY "public_read_projects" ON projects FOR SELECT USING (true);
CREATE POLICY "admin_write_projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Evidences: public read, authenticated write
CREATE POLICY "public_read_evidences" ON evidences FOR SELECT USING (true);
CREATE POLICY "admin_write_evidences" ON evidences FOR ALL USING (auth.role() = 'authenticated');

-- pilar_obligations: public read
CREATE POLICY "public_read_obligations" ON pilar_obligations FOR SELECT USING (true);
CREATE POLICY "admin_write_obligations" ON pilar_obligations FOR ALL USING (auth.role() = 'authenticated');

-- ibas_history: public read
CREATE POLICY "public_read_history" ON ibas_history FOR SELECT USING (true);
CREATE POLICY "admin_write_history" ON ibas_history FOR ALL USING (auth.role() = 'authenticated');

-- admin_users: only authenticated
CREATE POLICY "auth_admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

-- action_logs: only authenticated
CREATE POLICY "auth_logs" ON action_logs FOR ALL USING (auth.role() = 'authenticated');
