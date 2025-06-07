/*
  # Fix RLS policies for users table

  1. Security Updates
    - Drop existing problematic policies
    - Create proper INSERT policy for user profile creation
    - Create proper SELECT policy for reading own profile
    - Create proper UPDATE policy for updating own profile
  
  2. Policy Details
    - INSERT: Allow users to create their own profile (auth.uid() = id)
    - SELECT: Allow users to read their own profile (auth.uid() = id)
    - UPDATE: Allow users to update their own profile (auth.uid() = id)
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create proper INSERT policy for user profile creation
CREATE POLICY "Users can create own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create proper SELECT policy for reading own profile
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create proper UPDATE policy for updating own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);