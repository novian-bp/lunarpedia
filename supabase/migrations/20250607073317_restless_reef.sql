/*
  # Fix users table INSERT policy

  1. Policy Changes
    - Drop the existing INSERT policy that uses `uid()` 
    - Create a new INSERT policy that uses `auth.uid()` for proper authentication
    - This allows authenticated users to create their own profile during signup

  2. Security
    - Maintains RLS protection
    - Only allows users to insert their own profile data
    - Uses correct Supabase auth function
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create a new INSERT policy with correct auth function
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);