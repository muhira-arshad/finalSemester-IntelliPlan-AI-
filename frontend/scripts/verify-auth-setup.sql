-- Verify that auth is working correctly without user_profiles table
-- Check auth.users table structure

SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Check if there are any remaining triggers on auth.users
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- Verify no user_profiles table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
    ) 
    THEN 'user_profiles table still exists - needs manual removal'
    ELSE 'user_profiles table successfully removed'
  END as user_profiles_status;
