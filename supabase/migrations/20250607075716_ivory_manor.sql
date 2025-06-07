/*
  # Complete Lunarpedia PaaS Platform Database Schema

  1. New Tables
    - `users` - User profiles with credit system
    - `service_types` - Available Docker services for deployment
    - `services` - User's deployed services
    - `credit_transactions` - Credit purchase/usage history
    - `user_addons` - Premium add-ons for services

  2. Security
    - Enable RLS on all tables
    - Add policies for user data isolation
    - Add admin-only policies for service types
    - Add secure functions for credit management

  3. Automation
    - Auto-create user profiles on signup
    - Auto-update timestamps
    - Performance indexes
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_addons CASCADE;
DROP TABLE IF EXISTS credit_transactions CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS service_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing triggers and functions to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  credits integer DEFAULT 250 CHECK (credits >= 0),
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service types table (Docker services available for deployment)
CREATE TABLE service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  docker_image text NOT NULL,
  description text NOT NULL,
  credits_per_month integer NOT NULL CHECK (credits_per_month > 0),
  status text DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
  default_environment jsonb DEFAULT '{}',
  default_ports jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User services table
CREATE TABLE services (
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

-- Credit transactions table
CREATE TABLE credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('purchase', 'usage', 'refund')),
  amount integer NOT NULL,
  description text NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- User add-ons table
CREATE TABLE user_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  addon_type text NOT NULL,
  addon_name text NOT NULL,
  credits_per_month integer NOT NULL CHECK (credits_per_month > 0),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  activated_at timestamptz DEFAULT now(),
  next_billing timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Enable insert for authenticated users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for service_types table
CREATE POLICY "Anyone can read published service types"
  ON service_types
  FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Admins can manage service types"
  ON service_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for services table
CREATE POLICY "Users can read own services"
  ON services
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own services"
  ON services
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for credit_transactions table
CREATE POLICY "Users can read own transactions"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions"
  ON credit_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_addons table
CREATE POLICY "Users can read own addons"
  ON user_addons
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own addons"
  ON user_addons
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own addons"
  ON user_addons
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to safely update user credits
CREATE OR REPLACE FUNCTION update_user_credits(
  user_id uuid,
  credit_change integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users 
  SET 
    credits = GREATEST(0, credits + credit_change),
    updated_at = now()
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Function to calculate monthly usage
CREATE OR REPLACE FUNCTION calculate_monthly_usage(user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_usage integer := 0;
BEGIN
  SELECT COALESCE(SUM(credits_per_month), 0)
  INTO total_usage
  FROM services
  WHERE services.user_id = calculate_monthly_usage.user_id
    AND status IN ('running', 'pending');
  
  -- Add addon costs
  SELECT total_usage + COALESCE(SUM(credits_per_month), 0)
  INTO total_usage
  FROM user_addons
  WHERE user_addons.user_id = calculate_monthly_usage.user_id
    AND status = 'active';
  
  RETURN total_usage;
END;
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
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
    -- User already exists, that's fine
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user profile creation (with conflict check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created' 
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns (with conflict checks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_users_updated_at'
  ) THEN
    CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_services_updated_at'
  ) THEN
    CREATE TRIGGER update_services_updated_at 
      BEFORE UPDATE ON services
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_service_types_updated_at'
  ) THEN
    CREATE TRIGGER update_service_types_updated_at 
      BEFORE UPDATE ON service_types
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_addons_updated_at'
  ) THEN
    CREATE TRIGGER update_user_addons_updated_at 
      BEFORE UPDATE ON user_addons
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_user_addons_user_id ON user_addons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_service_id ON user_addons(service_id);
CREATE INDEX IF NOT EXISTS idx_service_types_status ON service_types(status);

-- Insert default service types (with conflict check)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM service_types WHERE type = 'n8n') THEN
    INSERT INTO service_types (name, type, docker_image, description, credits_per_month, status, default_environment, default_ports) VALUES
    (
      'n8n Workflow Automation',
      'n8n',
      'n8nio/n8n:latest',
      'Powerful workflow automation platform with visual editor',
      50,
      'published',
      '{
        "N8N_BASIC_AUTH_ACTIVE": {"value": "true", "required": true, "autoGenerate": false},
        "N8N_BASIC_AUTH_USER": {"value": "admin", "required": true, "autoGenerate": false},
        "N8N_BASIC_AUTH_PASSWORD": {"value": "", "required": true, "secret": true, "autoGenerate": true}
      }',
      '[{"internal": 5678, "external": 5678, "protocol": "HTTP"}]'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM service_types WHERE type = 'chatwoot') THEN
    INSERT INTO service_types (name, type, docker_image, description, credits_per_month, status, default_environment, default_ports) VALUES
    (
      'Chatwoot Customer Support',
      'chatwoot',
      'chatwoot/chatwoot:latest',
      'Open-source customer engagement platform',
      40,
      'published',
      '{
        "POSTGRES_PASSWORD": {"value": "", "required": true, "secret": true, "autoGenerate": true},
        "REDIS_PASSWORD": {"value": "", "required": true, "secret": true, "autoGenerate": true},
        "SECRET_KEY_BASE": {"value": "", "required": true, "secret": true, "autoGenerate": true},
        "POSTGRES_USER": {"value": "chatwoot", "required": true, "autoGenerate": false},
        "POSTGRES_DB": {"value": "chatwoot_production", "required": true, "autoGenerate": false}
      }',
      '[{"internal": 3000, "external": 3000, "protocol": "HTTP"}]'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM service_types WHERE type = 'database') THEN
    INSERT INTO service_types (name, type, docker_image, description, credits_per_month, status, default_environment, default_ports) VALUES
    (
      'PostgreSQL Database',
      'database',
      'postgres:15-alpine',
      'Reliable PostgreSQL database with automatic backups',
      30,
      'published',
      '{
        "POSTGRES_DB": {"value": "myapp", "required": true, "autoGenerate": false},
        "POSTGRES_USER": {"value": "admin", "required": true, "autoGenerate": false},
        "POSTGRES_PASSWORD": {"value": "", "required": true, "secret": true, "autoGenerate": true}
      }',
      '[{"internal": 5432, "external": 5432, "protocol": "TCP"}]'
    );
  END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.services TO authenticated;
GRANT ALL ON public.service_types TO authenticated;
GRANT ALL ON public.credit_transactions TO authenticated;
GRANT ALL ON public.user_addons TO authenticated;