/*
  # Create services table

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `type` (text)
      - `docker_image` (text)
      - `status` (text, default 'pending')
      - `credits_per_month` (integer)
      - `url` (text, unique)
      - `custom_domain` (text, nullable)
      - `has_custom_domain` (boolean, default false)
      - `environment_variables` (jsonb)
      - `ports` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `services` table
    - Add policies for users to manage their own services
    - Add policy for admins to read all services
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  docker_image text NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('running', 'stopped', 'pending', 'error')),
  credits_per_month integer NOT NULL CHECK (credits_per_month > 0),
  url text UNIQUE NOT NULL,
  custom_domain text,
  has_custom_domain boolean DEFAULT false NOT NULL,
  environment_variables jsonb DEFAULT '{}' NOT NULL,
  ports jsonb DEFAULT '[]' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_type ON services(type);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own services"
  ON services
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

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

-- Create trigger for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();