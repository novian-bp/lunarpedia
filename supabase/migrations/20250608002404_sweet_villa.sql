/*
  # Check User Data Migration
  
  This migration helps verify user data and provides queries to check user registration.
*/

-- Query to check all users in public.users table
-- Run this in SQL Editor to see all registered users
-- SELECT id, email, name, role, credits, created_at FROM users ORDER BY created_at DESC;

-- Query to check if a specific user exists
-- SELECT * FROM users WHERE email = 'your-email@example.com';

-- Query to manually create admin user if needed
-- INSERT INTO users (id, email, name, credits, role) 
-- VALUES (
--   gen_random_uuid(),
--   'admin@example.com',
--   'Admin User',
--   10000,
--   'admin'
-- );

-- Function to check user registration status
CREATE OR REPLACE FUNCTION check_user_registration(user_email text)
RETURNS TABLE(
  user_id uuid,
  email text,
  name text,
  role text,
  credits integer,
  created_at timestamptz,
  auth_user_exists boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.credits,
    u.created_at,
    EXISTS(SELECT 1 FROM auth.users au WHERE au.id = u.id) as auth_user_exists
  FROM users u
  WHERE u.email = user_email;
END;
$$;

-- Function to manually sync auth user to public users (if trigger failed)
CREATE OR REPLACE FUNCTION manual_sync_user(auth_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  auth_user_data record;
BEGIN
  -- Get auth user data
  SELECT id, email, raw_user_meta_data
  INTO auth_user_data
  FROM auth.users
  WHERE id = auth_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Auth user not found';
  END IF;
  
  -- Insert into public users if not exists
  INSERT INTO public.users (id, email, name, credits, role)
  VALUES (
    auth_user_data.id,
    auth_user_data.email,
    COALESCE(auth_user_data.raw_user_meta_data->>'name', split_part(auth_user_data.email, '@', 1)),
    250,
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$;