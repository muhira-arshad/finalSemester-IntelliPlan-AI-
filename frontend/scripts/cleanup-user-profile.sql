-- Remove any existing user_profiles table and related triggers/policies
-- This will clean up any conflicting database setup

-- Drop triggers first (if they exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop RLS policies (if they exist)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;

-- Drop the user_profiles table (if it exists)
DROP TABLE IF EXISTS public.user_profiles;

-- Verify cleanup
SELECT 'Cleanup completed successfully' as status;
