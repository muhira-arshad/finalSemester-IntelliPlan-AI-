-- EMERGENCY RESET - Only run this if the above doesn't work
-- This will reset the entire public schema (BE CAREFUL!)

-- WARNING: This will delete ALL data in public schema
-- Only run if you're sure you want to start completely fresh

-- Uncomment the lines below ONLY if you want to completely reset
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres;
-- GRANT ALL ON SCHEMA public TO public;

SELECT 'Emergency reset script ready - uncomment lines above to execute' as warning;
