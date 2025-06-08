/*
  # Create Auto Admin User

  1. Updates the handle_new_user function to automatically assign admin role
     to users with specific email addresses
  2. Adds a predefined admin email that will get admin role automatically
  
  Note: Change the email address to your desired admin email
*/

-- Update the handle_new_user function to auto-assign admin role for specific emails
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text := 'user';
  admin_emails text[] := ARRAY['admin@lunarpedia.com', 'novian@digilunar.com']; -- Add your admin emails here
BEGIN
  -- Check if the email should get admin role
  IF NEW.email = ANY(admin_emails) THEN
    user_role := 'admin';
  END IF;

  INSERT INTO public.users (id, email, name, credits, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN user_role = 'admin' THEN 10000  -- Give admin users more credits
      ELSE 250 
    END,
    user_role
  );
  RETURN NEW;
END;
$$;

-- If you want to manually set an existing user as admin, uncomment and modify this:
-- UPDATE users SET role = 'admin', credits = 10000 WHERE email = 'your-email@example.com';