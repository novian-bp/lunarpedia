/*
  # Add INSERT policy for users table

  1. Security Changes
    - Add RLS policy to allow authenticated users to insert their own user profile
    - Policy ensures users can only insert records where the user ID matches their auth ID

  This fixes the 401 error that occurs during user sign-up when trying to create a user profile.
*/

-- Add INSERT policy for users table
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);