/*
  # Final fix for authentication and RLS issues

  This migration completely resolves the RLS policy conflicts by:
  1. Dropping all existing conflicting policies
  2. Creating clean, working policies
  3. Adding proper triggers for security
  4. Ensuring signup process works correctly

  ## Changes
  1. Clean slate approach - remove all existing policies
  2. Create working INSERT policy for user signup
  3. Add security trigger to prevent abuse
  4. Ensure all other policies work correctly
*/

-- Step 1: Clean slate - remove all existing policies on users table
DO $$ 
BEGIN
  -- Drop all existing policies on users table
  DROP POLICY IF EXISTS "Users can read own profile" ON users;
  DROP POLICY IF EXISTS "Users can update own profile" ON users;
  DROP POLICY IF EXISTS "Users can insert own profile" ON users;
  DROP POLICY IF EXISTS "Users can create own profile" ON users;
  
  -- Drop existing trigger if it exists
  DROP TRIGGER IF EXISTS ensure_user_auth_trigger ON users;
  DROP FUNCTION IF EXISTS ensure_user_id_matches_auth();
END $$;

-- Step 2: Create the security function
CREATE OR REPLACE FUNCTION ensure_user_id_matches_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- During signup, ensure user can only create profile for themselves
  IF NEW.id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied: User can only create their own profile';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create new, working policies
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

-- This is the key policy that allows signup to work
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- Allow insert, but trigger will enforce security

-- Step 4: Create the security trigger
CREATE TRIGGER ensure_user_auth_trigger
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_id_matches_auth();

-- Step 5: Verify RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 6: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users TO authenticated;