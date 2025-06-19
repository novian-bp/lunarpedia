/*
  # Create user addons table

  1. New Tables
    - `user_addons`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `service_id` (uuid, foreign key to services)
      - `addon_type` (text)
      - `addon_name` (text)
      - `credits_per_month` (integer)
      - `status` (text, default 'active')
      - `activated_at` (timestamp)
      - `next_billing` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_addons` table
    - Add policies for users to manage their own addons
    - Add policy for admins to read all addons
*/

-- Create user_addons table
CREATE TABLE IF NOT EXISTS user_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  addon_type text NOT NULL,
  addon_name text NOT NULL,
  credits_per_month integer NOT NULL CHECK (credits_per_month > 0),
  status text DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'cancelled')),
  activated_at timestamptz DEFAULT now() NOT NULL,
  next_billing timestamptz NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_addons_user_id ON user_addons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_service_id ON user_addons(service_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_status ON user_addons(status);

-- Enable RLS
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own addons"
  ON user_addons
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all addons"
  ON user_addons
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_user_addons_updated_at
  BEFORE UPDATE ON user_addons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();