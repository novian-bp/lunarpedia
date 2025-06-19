/*
  # Create admin user

  1. Admin User Creation
    - Insert admin user with predefined credentials
    - Set role to 'admin'
    - Give initial credits

  Note: This should be run after the users table is created
*/

-- Insert admin user (will be created via auth trigger, but we ensure the role is set correctly)
INSERT INTO users (id, email, name, credits, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'novian@digilunar.com',
  'Novian Admin',
  10000,
  'admin',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  credits = GREATEST(users.credits, 10000),
  updated_at = now();