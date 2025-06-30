/*
  # Create Innovation Projects Table

  1. New Tables
    - `innovation_projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `status` (text)
      - `mentor` (text)
      - `age_group` (text)
      - `difficulty` (text)
      - `progress` (integer)
      - `milestones` (jsonb array)
      - `resources` (jsonb array)
      - `collaborators` (uuid array)
      - `tags` (text array)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `innovation_projects` table
    - Users can access their own projects and public projects
*/

CREATE TABLE IF NOT EXISTS innovation_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('technical', 'creative', 'philosophical', 'entrepreneurial')),
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
  mentor text CHECK (mentor IN ('rohn', 'jobs', 'wozniak', 'davinci', 'delacroix')),
  age_group text CHECK (age_group IN ('children', 'teens', 'young-adults', 'adults', 'middle-age', 'seniors')),
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'master')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  milestones jsonb DEFAULT '[]',
  resources jsonb DEFAULT '[]',
  collaborators uuid[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE innovation_projects ENABLE ROW LEVEL SECURITY;

-- Users can access their own projects
CREATE POLICY "Users can access own innovation projects"
  ON innovation_projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Collaborators can access projects they're part of
CREATE POLICY "Collaborators can access shared projects"
  ON innovation_projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = ANY(collaborators));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_innovation_projects_user_id ON innovation_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_innovation_projects_status ON innovation_projects(status);
CREATE INDEX IF NOT EXISTS idx_innovation_projects_category ON innovation_projects(category);
CREATE INDEX IF NOT EXISTS idx_innovation_projects_mentor ON innovation_projects(mentor);
CREATE INDEX IF NOT EXISTS idx_innovation_projects_age_group ON innovation_projects(age_group);
CREATE INDEX IF NOT EXISTS idx_innovation_projects_difficulty ON innovation_projects(difficulty);
CREATE INDEX IF NOT EXISTS idx_innovation_projects_created_at ON innovation_projects(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_innovation_projects_updated_at
  BEFORE UPDATE ON innovation_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();