
-- Step 1: Add the kitchen role to the enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'kitchen';
