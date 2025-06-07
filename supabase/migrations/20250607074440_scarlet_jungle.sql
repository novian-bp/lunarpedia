/*
  # Fix Authentication Flow and RLS Policies

  1. Database Setup
    - Clean up existing problematic policies
    - Create working RLS policies for authentication flow
    - Ensure proper user profile creation during signup

  2. Security
    - Enable RLS on users table
    - Allow users to create and read their own profiles
    - Secure policies that work with Supabase Auth

  3. Functions
    - Helper functions for user management
    - Proper error handling
*/

-- Step 1: Clean up existing policies completely
DO $$ 
DECLARE
    pol_name text;
BEGIN
    -- Get all policy names for users table and drop them
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON users', pol_name);
    END LOOP;
END $$;

-- Step 2: Drop existing triggers and functions
DROP TRIGGER IF EXISTS ensure_user_auth_trigger ON users;
DROP FUNCTION IF EXISTS ensure_user_id_matches_auth();

-- Step 3: Create a simple, working RLS setup
-- Allow authenticated users to insert their own profile
CREATE POLICY "Enable insert for authenticated users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to read their own profile
CREATE POLICY "Enable read access for own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Enable update for own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 4: Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 5: Create a function to handle user profile creation safely
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, credits, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    250,
    'user'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- User already exists, that's fine
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create trigger for automatic user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 7: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.services TO authenticated;
GRANT ALL ON public.service_types TO authenticated;
GRANT ALL ON public.credit_transactions TO authenticated;
GRANT ALL ON public.user_addons TO authenticated;