/*
  # Fix users table INSERT policy for signup

  1. Problem
    - Current INSERT policy prevents user profile creation during signup
    - Policy uses auth.uid() = id but during signup, the user record doesn't exist yet

  2. Solution
    - Drop existing INSERT policy
    - Create new INSERT policy that allows authenticated users to insert their own profile
    - Use auth.uid()::text = id::text for proper comparison
*/

-- Drop the existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create a new INSERT policy that allows users to create their profile during signup
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);