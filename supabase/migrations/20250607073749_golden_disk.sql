/*
  # Comprehensive RLS Policy Fix

  1. Security
    - Drop and recreate all RLS policies for users table
    - Ensure proper INSERT policy for signup process
    - Fix authentication flow issues

  2. Changes
    - Remove conflicting policies
    - Create proper INSERT policy for user signup
    - Ensure auth.uid() works correctly during signup
*/

-- First, drop all existing policies on users table to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create new policies with proper conditions
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

-- This is the key fix: Allow INSERT during signup process
-- The user ID will be set by the application to match auth.uid()
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also ensure we can handle the case where auth.uid() might be a different type
-- by creating a more permissive policy for INSERT
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- But add a trigger to ensure data integrity
CREATE OR REPLACE FUNCTION ensure_user_id_matches_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure the user can only insert their own profile
  IF NEW.id != auth.uid() THEN
    RAISE EXCEPTION 'User can only create their own profile';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS ensure_user_auth_trigger ON users;
CREATE TRIGGER ensure_user_auth_trigger
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_id_matches_auth();