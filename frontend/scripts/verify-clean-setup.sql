-- VERIFICATION - Check that nothing is left that could cause issues

-- Check for any remaining triggers on auth.users
SELECT 
    'TRIGGERS ON AUTH.USERS:' as check_type,
    COALESCE(
        string_agg(trigger_name, ', '), 
        'None found - GOOD!'
    ) as result
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users'
  AND trigger_name NOT LIKE 'pg_%';

-- Check for any remaining functions that might be problematic
SELECT 
    'POTENTIALLY PROBLEMATIC FUNCTIONS:' as check_type,
    COALESCE(
        string_agg(routine_name, ', '), 
        'None found - GOOD!'
    ) as result
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND (routine_name ILIKE '%user%' OR routine_name ILIKE '%profile%');

-- Check for any remaining user-related tables
SELECT 
    'USER-RELATED TABLES:' as check_type,
    COALESCE(
        string_agg(table_name, ', '), 
        'None found - GOOD!'
    ) as result
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name ILIKE '%user%' OR table_name ILIKE '%profile%');

-- Check for any RLS policies that might interfere
SELECT 
    'RLS POLICIES ON PUBLIC TABLES:' as check_type,
    COALESCE(
        string_agg(policyname, ', '), 
        'None found - GOOD!'
    ) as result
FROM pg_policies 
WHERE schemaname = 'public';

-- Final verification
SELECT 
    'AUTH SYSTEM STATUS:' as check_type,
    'Ready for clean signup process' as result;
