/*
  # Create service types table

  1. New Tables
    - `service_types`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text, unique)
      - `docker_image` (text)
      - `description` (text)
      - `credits_per_month` (integer)
      - `status` (text, default 'draft')
      - `default_environment` (jsonb)
      - `default_ports` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `service_types` table
    - Add policy for authenticated users to read published service types
    - Add policy for admins to manage all service types

  3. Sample Data
    - Insert default service types (n8n, Chatwoot, PostgreSQL)
*/

-- Create service_types table
CREATE TABLE IF NOT EXISTS service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text UNIQUE NOT NULL,
  docker_image text NOT NULL,
  description text NOT NULL,
  credits_per_month integer NOT NULL CHECK (credits_per_month > 0),
  status text DEFAULT 'draft' NOT NULL CHECK (status IN ('published', 'draft', 'archived')),
  default_environment jsonb DEFAULT '{}' NOT NULL,
  default_ports jsonb DEFAULT '[]' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read published service types"
  ON service_types
  FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Admins can manage all service types"
  ON service_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_service_types_updated_at
  BEFORE UPDATE ON service_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default service types
INSERT INTO service_types (name, type, docker_image, description, credits_per_month, status, default_environment, default_ports) VALUES
(
  'n8n Workflow Automation',
  'n8n',
  'n8nio/n8n:latest',
  'Powerful workflow automation platform with visual editor and 200+ integrations',
  50,
  'published',
  '{"N8N_BASIC_AUTH_ACTIVE": "true", "N8N_BASIC_AUTH_USER": "admin", "N8N_BASIC_AUTH_PASSWORD": ""}',
  '[{"internal": 5678, "external": 5678, "protocol": "HTTP"}]'
),
(
  'Chatwoot Customer Support',
  'chatwoot',
  'chatwoot/chatwoot:latest',
  'Open-source customer engagement platform with live chat and multi-channel support',
  40,
  'published',
  '{"POSTGRES_PASSWORD": "", "REDIS_PASSWORD": "", "SECRET_KEY_BASE": "", "POSTGRES_USER": "chatwoot", "POSTGRES_DB": "chatwoot_production"}',
  '[{"internal": 3000, "external": 3000, "protocol": "HTTP"}]'
),
(
  'PostgreSQL Database',
  'database',
  'postgres:15-alpine',
  'Reliable PostgreSQL database with automatic backups and high availability',
  30,
  'published',
  '{"POSTGRES_DB": "myapp", "POSTGRES_USER": "admin", "POSTGRES_PASSWORD": ""}',
  '[{"internal": 5432, "external": 5432, "protocol": "TCP"}]'
)
ON CONFLICT (type) DO UPDATE SET
  name = EXCLUDED.name,
  docker_image = EXCLUDED.docker_image,
  description = EXCLUDED.description,
  credits_per_month = EXCLUDED.credits_per_month,
  status = EXCLUDED.status,
  default_environment = EXCLUDED.default_environment,
  default_ports = EXCLUDED.default_ports,
  updated_at = now();