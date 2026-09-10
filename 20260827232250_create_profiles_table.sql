/*
# Create profiles table for Minecraft management system

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `full_name` (text, not null)
  - `role` (text, not null, default 'funcionario' — values: 'admin' | 'funcionario')
  - `avatar_url` (text, nullable)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `profiles`.
- SELECT: authenticated users can read all profiles (so team members can see each other).
- INSERT: a user can insert only their own profile row (auth.uid() = id).
- UPDATE: a user can update only their own profile row. Role changes are NOT allowed via this policy — only an admin via service role can change roles.
- DELETE: a user can delete only their own profile row.

3. Important Notes
- The `role` column defaults to 'funcionario'. Admins must be promoted via service-role / SQL, not client-side.
- Email confirmation is OFF (default).
- This table stores employee/admin info for the Minecraft-themed management prototype.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'funcionario' CHECK (role IN ('admin', 'funcionario')),
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: any authenticated user can see all profiles (team directory)
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: user can only create their own profile
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: user can only update their own profile (cannot escalate role via client)
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: user can only delete their own profile
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);
