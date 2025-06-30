/*
  # Create Collaboration Projects Table

  1. New Tables
    - `collaboration_projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `age_groups` (text array)
      - `participants` (jsonb array)
      - `status` (text)
      - `milestones` (jsonb array)
      - `resources` (jsonb array)
      - `tags` (text array)
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `collaboration_projects` table
    - Public projects are readable by all
    - Participants can read and update projects they're part of
*/

CREATE TABLE IF NOT EXISTS collaboration_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('innovation', 'mentorship', 'creative', 'social-impact')),
  age_groups text[] DEFAULT '{}',
  participants jsonb DEFAULT '[]',
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
  milestones jsonb DEFAULT '[]',
  resources jsonb DEFAULT '[]',
  tags text[] DEFAULT '{}',
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE collaboration_projects ENABLE ROW LEVEL SECURITY;

-- Public projects are readable by all authenticated users
CREATE POLICY "Public projects are readable"
  ON collaboration_projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Project creators can update their projects
CREATE POLICY "Creators can update own projects"
  ON collaboration_projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Users can create projects
CREATE POLICY "Users can create projects"
  ON collaboration_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Participants can update projects they're part of
CREATE POLICY "Participants can update projects"
  ON collaboration_projects
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jsonb_array_elements(participants) AS participant
      WHERE (participant->>'userId')::uuid = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_collaboration_projects_created_by ON collaboration_projects(created_by);
CREATE INDEX IF NOT EXISTS idx_collaboration_projects_status ON collaboration_projects(status);
CREATE INDEX IF NOT EXISTS idx_collaboration_projects_category ON collaboration_projects(category);
CREATE INDEX IF NOT EXISTS idx_collaboration_projects_created_at ON collaboration_projects(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_collaboration_projects_updated_at
  BEFORE UPDATE ON collaboration_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();