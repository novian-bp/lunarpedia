/*
  # Complete Lunarpedia Database Schema

  1. New Tables
    - `users` - User profiles with credits and role management
    - `service_types` - Available service templates with pricing
    - `services` - User-deployed services with configuration
    - `credit_transactions` - Credit usage and purchase history
    - `user_addons` - Additional services and features for users

  2. Functions
    - `update_user_credits` - Safely update user credit balance
    - `handle_new_user` - Automatically create user profile on signup

  3. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    - Set up triggers for automatic user profile creation

  4. Initial Data
    - Seed service types for common applications
    - Set up default configurations
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  credits integer DEFAULT 250,
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
  credits_per_month integer NOT NULL DEFAULT 0,
  status text DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  default_environment jsonb DEFAULT '{}',
  default_ports jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  docker_image text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('running', 'stopped', 'pending', 'error')),
  credits_per_month integer NOT NULL DEFAULT 0,
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
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('purchase', 'usage', 'refund')),
  amount integer NOT NULL,
  description text NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_addons table
CREATE TABLE IF NOT EXISTS user_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  addon_type text NOT NULL,
  addon_name text NOT NULL,
  credits_per_month integer NOT NULL DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  activated_at timestamptz DEFAULT now(),
  next_billing timestamptz DEFAULT (now() + interval '1 month'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to update user credits
CREATE OR REPLACE FUNCTION update_user_credits(user_id uuid, credit_change integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users 
  SET 
    credits = credits + credit_change,
    updated_at = now()
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, credits, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    250,
    'user'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service types policies
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
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Services table policies
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

CREATE POLICY "Admins can read all services"
  ON services
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Credit transactions policies
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

CREATE POLICY "Admins can read all transactions"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User addons policies
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

CREATE POLICY "Users can delete own addons"
  ON user_addons
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Insert sample service types
INSERT INTO service_types (name, type, docker_image, description, credits_per_month, default_environment, default_ports) VALUES
  (
    'WordPress',
    'cms',
    'wordpress:latest',
    'Popular content management system for blogs and websites',
    50,
    '{"WORDPRESS_DB_HOST": "db", "WORDPRESS_DB_NAME": "wordpress", "WORDPRESS_DB_USER": "wordpress", "WORDPRESS_DB_PASSWORD": "password"}',
    '[{"internal": 80, "external": 8080, "protocol": "http"}]'
  ),
  (
    'Node.js App',
    'application',
    'node:18-alpine',
    'Runtime environment for JavaScript applications',
    30,
    '{"NODE_ENV": "production", "PORT": "3000"}',
    '[{"internal": 3000, "external": 3000, "protocol": "http"}]'
  ),
  (
    'PostgreSQL Database',
    'database',
    'postgres:15',
    'Powerful open-source relational database',
    40,
    '{"POSTGRES_DB": "myapp", "POSTGRES_USER": "admin", "POSTGRES_PASSWORD": "password"}',
    '[{"internal": 5432, "external": 5432, "protocol": "tcp"}]'
  ),
  (
    'Redis Cache',
    'cache',
    'redis:7-alpine',
    'In-memory data structure store for caching',
    25,
    '{"REDIS_PASSWORD": "password"}',
    '[{"internal": 6379, "external": 6379, "protocol": "tcp"}]'
  ),
  (
    'Nginx Web Server',
    'webserver',
    'nginx:alpine',
    'High-performance web server and reverse proxy',
    20,
    '{}',
    '[{"internal": 80, "external": 8080, "protocol": "http"}, {"internal": 443, "external": 8443, "protocol": "https"}]'
  ),
  (
    'MongoDB Database',
    'database',
    'mongo:6',
    'Document-oriented NoSQL database',
    45,
    '{"MONGO_INITDB_ROOT_USERNAME": "admin", "MONGO_INITDB_ROOT_PASSWORD": "password"}',
    '[{"internal": 27017, "external": 27017, "protocol": "tcp"}]'
  ),
  (
    'Python Flask App',
    'application',
    'python:3.11-slim',
    'Lightweight web framework for Python applications',
    35,
    '{"FLASK_ENV": "production", "FLASK_APP": "app.py"}',
    '[{"internal": 5000, "external": 5000, "protocol": "http"}]'
  ),
  (
    'Docker Registry',
    'registry',
    'registry:2',
    'Private Docker image registry',
    60,
    '{"REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY": "/var/lib/registry"}',
    '[{"internal": 5000, "external": 5000, "protocol": "http"}]'
  )
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_user_addons_user_id ON user_addons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_service_id ON user_addons(service_id);
CREATE INDEX IF NOT EXISTS idx_service_types_status ON service_types(status);