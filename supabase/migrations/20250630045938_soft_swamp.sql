/*
  # Create User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `bio` (text)
      - `avatar_url` (text)
      - `location` (jsonb)
      - `growth_metrics` (jsonb)
      - `achievements` (jsonb array)
      - `badges` (jsonb array)
      - `mentorship_level` (text)
      - `connections` (jsonb array)
      - `activity_log` (jsonb array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for profile access based on privacy settings
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio text,
  avatar_url text,
  location jsonb DEFAULT '{}',
  growth_metrics jsonb DEFAULT '{
    "wisdom": 0,
    "creativity": 0,
    "technical": 0,
    "leadership": 0,
    "emotional": 0,
    "physical": 0
  }',
  achievements jsonb DEFAULT '[]',
  badges jsonb DEFAULT '[]',
  mentorship_level text DEFAULT 'seeker' CHECK (mentorship_level IN ('seeker', 'apprentice', 'practitioner', 'mentor', 'sage')),
  connections jsonb DEFAULT '[]',
  activity_log jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Public profiles can be read by anyone
CREATE POLICY "Public profiles are readable"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    (preferences->>'privacy'->>'profileVisibility')::text = 'public'
    OR auth.uid() = user_id
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_mentorship_level ON user_profiles(mentorship_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();