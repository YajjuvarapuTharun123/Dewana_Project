-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to clean up previous attempts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;

-- CORRECTED POLICIES (Using user_id)

-- 1. VIEW: Everyone can view profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING ( true );

-- 2. INSERT: Authenticated users can insert their own profile checking user_id
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = user_id );

-- 3. UPDATE: Authenticated users can update their own profile checking user_id
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING ( auth.uid() = user_id );
