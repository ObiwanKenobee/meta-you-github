/*
  # Create Growth History Table

  1. New Tables
    - `growth_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `metrics` (jsonb)
      - `source` (text)
      - `notes` (text)
      - `timestamp` (timestamptz)

  2. Security
    - Enable RLS on `growth_history` table
    - Users can only access their own growth history
*/

CREATE TABLE IF NOT EXISTS growth_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metrics jsonb NOT NULL,
  source text DEFAULT 'manual' CHECK (source IN ('manual', 'activity', 'assessment', 'ai')),
  notes text,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE growth_history ENABLE ROW LEVEL SECURITY;

-- Users can only access their own growth history
CREATE POLICY "Users can read own growth history"
  ON growth_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own growth history"
  ON growth_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_growth_history_user_id ON growth_history(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_history_timestamp ON growth_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_growth_history_source ON growth_history(source);