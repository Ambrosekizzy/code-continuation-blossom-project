
-- Add unique constraint to username in profiles table
-- First, let's clean up any duplicate usernames if they exist
UPDATE profiles 
SET full_name = full_name || '_' || substr(id::text, 1, 8) 
WHERE full_name IN (
    SELECT full_name 
    FROM profiles 
    WHERE full_name IS NOT NULL 
    GROUP BY full_name 
    HAVING COUNT(*) > 1
);

-- Add unique constraint on username (using full_name column as username)
ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (full_name);

-- Add unique constraint on email 
ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Update the handle_new_user function to use username from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'username', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$$;
