/*
  # Create AI Interactions Table

  1. New Tables
    - `ai_interactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `session_id` (text)
      - `mentor_id` (text)
      - `user_message` (text)
      - `ai_response` (text)
      - `context` (jsonb)
      - `sentiment` (jsonb)
      - `intent` (jsonb)
      - `processing_time` (integer)
      - `timestamp` (timestamptz)

  2. Security
    - Enable RLS on `ai_interactions` table
    - Users can only access their own interactions
*/

CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  mentor_id text NOT NULL CHECK (mentor_id IN ('rohn', 'jobs', 'wozniak', 'davinci', 'delacroix')),
  user_message text NOT NULL,
  ai_response text NOT NULL,
  context jsonb DEFAULT '{}',
  sentiment jsonb DEFAULT '{}',
  intent jsonb DEFAULT '{}',
  processing_time integer DEFAULT 0,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own interactions
CREATE POLICY "Users can read own AI interactions"
  ON ai_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI interactions"
  ON ai_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_session_id ON ai_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_mentor_id ON ai_interactions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_timestamp ON ai_interactions(timestamp DESC);