-- AGGRESSIVE CLEANUP - Remove ALL potential conflicts
-- This will remove any database objects that could interfere with auth

-- 1. Drop ALL triggers on auth.users (including system ones we might have added)
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name, event_object_table 
        FROM information_schema.triggers 
        WHERE event_object_schema = 'auth' 
        AND event_object_table = 'users'
        AND trigger_name NOT LIKE 'pg_%'  -- Keep PostgreSQL system triggers
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || ' ON auth.users CASCADE';
        RAISE NOTICE 'Dropped trigger: %', trigger_record.trigger_name;
    END LOOP;
END $$;

-- 2. Drop ALL functions that might be called by triggers
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS public.insert_user_profile() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS insert_user_profile() CASCADE;

-- 3. Drop ALL user-related tables in public schema
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.user_data CASCADE;

-- 4. Drop ALL RLS policies on any remaining tables
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public'
        AND (policyname ILIKE '%user%' OR policyname ILIKE '%profile%')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON ' || policy_record.schemaname || '.' || policy_record.tablename;
        RAISE NOTICE 'Dropped policy: % on %.%', policy_record.policyname, policy_record.schemaname, policy_record.tablename;
    END LOOP;
END $$;

-- 5. Check for any remaining problematic objects
SELECT 'Cleanup completed - checking for remaining objects...' as status;
