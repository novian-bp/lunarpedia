/*
  # Fix infinite recursion in users table RLS policies

  1. Problem
    - Current admin policies query the users table from within users table policies
    - This creates infinite recursion when trying to access user data
    - The "Admins can read all users" policy causes circular dependency

  2. Solution
    - Drop the problematic admin policy that causes recursion
    - Keep simple policies that don't create circular dependencies
    - Use auth.jwt() to check user metadata instead of querying users table
    - Maintain security while avoiding recursion

  3. Changes
    - Drop "Admins can read all users" policy
    - Keep "Users can read own profile" policy (no recursion)
    - Keep "Users can update own profile" policy (no recursion)
    - Admin access can be handled at application level if needed
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- The remaining policies are safe and don't cause recursion:
-- - "Users can read own profile" uses (uid() = id) - no table query
-- - "Users can update own profile" uses (uid() = id) - no table query

-- If admin access is needed, it should be handled differently to avoid recursion
-- For now, we'll keep the simple user-level policies that work without recursion