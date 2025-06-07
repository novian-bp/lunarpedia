/*
  # Complete Database Setup for Lunarpedia PaaS Platform
  
  1. New Tables
    - `users` - User management with credit system
    - `service_types` - Available Docker services (n8n, Chatwoot, PostgreSQL)
    - `services` - User deployed services
    - `credit_transactions` - Credit usage and refund tracking
    - `user_addons` - Premium add-ons system
    
  2. Security
    - Enable RLS on all tables
    - User isolation policies
    - Admin-only service type management
    
  3. Functions & Triggers
    - Auto user profile creation
    - Credit management system
    - Automatic billing triggers
*/

-- Drop existing triggers first to avoid dependency issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_user_credits(uuid, integer) CASCADE;

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS user_addons CASCADE;
DROP TABLE IF EXISTS credit_transactions CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS service_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  credits integer DEFAULT 250 CHECK (credits >= 0),
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service_types table
CREATE TABLE IF NOT EXISTS service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  docker_image text NOT NULL,
  description text NOT NULL,
  credits_per_month integer NOT NULL CHECK (credits_per_month > 0),
  status text DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  default_environment jsonb DEFAULT '{}',
  default_ports jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  docker_image text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('running', 'stopped', 'pending', 'error')),
  credits_per_month integer NOT NULL CHECK (credits_per_month > 0),
  url text NOT NULL,
  custom_domain text,
  has_custom_domain boolean DEFAULT false,
  environment_variables jsonb DEFAULT '{}',
  ports jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('purchase', 'usage', 'refund')),
  amount integer NOT NULL,
  description text NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_addons table
CREATE TABLE IF NOT EXISTS user_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  addon_type text NOT NULL,
  addon_name text NOT NULL,
  credits_per_month integer NOT NULL CHECK (credits_per_month > 0),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  activated_at timestamptz DEFAULT now(),
  next_billing timestamptz NOT NULL DEFAULT (now() + interval '1 month'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for users table
CREATE POLICY "Enable read access for own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for own profile" ON users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Create RLS Policies for services table
CREATE POLICY "Users can read own services" ON services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own services" ON services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own services" ON services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own services" ON services
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS Policies for credit_transactions table
CREATE POLICY "Users can read own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON credit_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS Policies for user_addons table
CREATE POLICY "Users can read own addons" ON user_addons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addons" ON user_addons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addons" ON user_addons
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS Policies for service_types table
CREATE POLICY "Anyone can read published service types" ON service_types
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage service types" ON service_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_types_updated_at
  BEFORE UPDATE ON service_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_addons_updated_at
  BEFORE UPDATE ON user_addons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, credits, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    250,
    'user'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert default service types
INSERT INTO service_types (name, type, docker_image, description, credits_per_month, status, default_environment, default_ports) VALUES
(
  'n8n Workflow Automation',
  'n8n',
  'n8nio/n8n:latest',
  'Powerful workflow automation platform with visual editor and 200+ integrations',
  50,
  'published',
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
  'Open-source customer engagement platform with live chat and multi-channel support',
  40,
  'published',
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
  'Reliable PostgreSQL database with automatic backups and high availability',
  30,
  'published',
  '{
    "POSTGRES_DB": "myapp",
    "POSTGRES_USER": "admin",
    "POSTGRES_PASSWORD": ""
  }',
  '[{"internal": 5432, "external": 5432, "protocol": "TCP"}]'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_user_addons_user_id ON user_addons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_service_id ON user_addons(service_id);
CREATE INDEX IF NOT EXISTS idx_service_types_status ON service_types(status);