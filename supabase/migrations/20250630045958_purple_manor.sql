/*
  # Create Analytics Events Table

  1. New Tables
    - `analytics_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `event_type` (text)
      - `event_data` (jsonb)
      - `session_id` (text)
      - `user_agent` (text)
      - `ip_address` (inet)
      - `timestamp` (timestamptz)
      - `processed` (boolean)

  2. Security
    - Enable RLS on `analytics_events` table
    - Users can only access their own events
    - Admins can access all events for analytics
*/

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  session_id text,
  user_agent text,
  ip_address inet,
  timestamp timestamptz DEFAULT now(),
  processed boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own events
CREATE POLICY "Users can read own analytics events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own events
CREATE POLICY "Users can insert own analytics events"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admins can access all events
CREATE POLICY "Admins can access all analytics events"
  ON analytics_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_processed ON analytics_events(processed);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);