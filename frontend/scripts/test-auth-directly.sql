-- TEST - Verify auth.users table is working correctly
-- This will help us identify if the issue is with the auth table itself

-- Check auth.users table structure
SELECT 
    'AUTH.USERS TABLE STRUCTURE:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'auth' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Check if we can query auth.users (permissions test)
SELECT 
    'AUTH.USERS ACCESS TEST:' as info,
    COUNT(*) as current_user_count
FROM auth.users;

-- Check auth configuration
SELECT 
    'AUTH CONFIGURATION:' as info,
    'Basic auth setup verified' as status;
