-- Complete Database Setup for Lunarpedia PaaS Platform
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS user_addons CASCADE;
DROP TABLE IF EXISTS credit_transactions CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS service_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_user_credits(uuid, integer);
DROP FUNCTION IF EXISTS handle_new_user();

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  credits integer DEFAULT 250,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service_types table
CREATE TABLE service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  docker_image text NOT NULL,
  description text NOT NULL,
  credits_per_month integer NOT NULL,
  status text DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  default_environment jsonb DEFAULT '{}',
  default_ports jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  docker_image text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('running', 'stopped', 'pending', 'error')),
  credits_per_month integer NOT NULL,
  url text NOT NULL,
  custom_domain text,
  has_custom_domain boolean DEFAULT false,
  environment_variables jsonb DEFAULT '{}',
  ports jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create credit_transactions table
CREATE TABLE credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('purchase', 'usage', 'refund')),
  amount integer NOT NULL,
  description text NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_addons table
CREATE TABLE user_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  addon_type text NOT NULL,
  addon_name text NOT NULL,
  credits_per_month integer NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  activated_at timestamptz DEFAULT now(),
  next_billing timestamptz DEFAULT (now() + interval '1 month'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Services policies
CREATE POLICY "Users can read own services" ON services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own services" ON services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own services" ON services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own services" ON services
  FOR DELETE USING (auth.uid() = user_id);

-- Credit transactions policies
CREATE POLICY "Users can read own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON credit_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User addons policies
CREATE POLICY "Users can read own addons" ON user_addons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addons" ON user_addons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addons" ON user_addons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addons" ON user_addons
  FOR DELETE USING (auth.uid() = user_id);

-- Service types policies (public read)
CREATE POLICY "Anyone can read published service types" ON service_types
  FOR SELECT USING (status = 'published');

-- Admin policies
CREATE POLICY "Admins can do everything on service_types" ON service_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create functions
CREATE OR REPLACE FUNCTION update_user_credits(user_id uuid, credit_change integer)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET credits = credits + credit_change,
      updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, name, credits, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    250,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert default service types
INSERT INTO service_types (name, type, docker_image, description, credits_per_month, default_environment, default_ports) VALUES
(
  'n8n Workflow Automation',
  'n8n',
  'n8nio/n8n:latest',
  'Powerful workflow automation platform with visual editor',
  50,
  '{
    "N8N_BASIC_AUTH_ACTIVE": "true",
    "N8N_BASIC_AUTH_USER": "admin",
    "N8N_BASIC_AUTH_PASSWORD": ""
  }',
  '[{"internal": 5678, "external": 5678, "protocol": "HTTP"}]'
),
(
  'Chatwoot Customer Support',
  'chatwoot',
  'chatwoot/chatwoot:latest',
  'Open-source customer engagement platform',
  40,
  '{
    "POSTGRES_PASSWORD": "",
    "REDIS_PASSWORD": "",
    "SECRET_KEY_BASE": "",
    "POSTGRES_USER": "chatwoot",
    "POSTGRES_DB": "chatwoot_production"
  }',
  '[{"internal": 3000, "external": 3000, "protocol": "HTTP"}]'
),
(
  'PostgreSQL Database',
  'database',
  'postgres:15-alpine',
  'Reliable PostgreSQL database with automatic backups',
  30,
  '{
    "POSTGRES_DB": "myapp",
    "POSTGRES_USER": "admin",
    "POSTGRES_PASSWORD": ""
  }',
  '[{"internal": 5432, "external": 5432, "protocol": "TCP"}]'
);

-- Create indexes for better performance
CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_user_addons_user_id ON user_addons(user_id);
CREATE INDEX idx_service_types_status ON service_types(status);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;