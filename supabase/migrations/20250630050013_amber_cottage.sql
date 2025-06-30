/*
  # Create Security Events Table

  1. New Tables
    - `security_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key, nullable)
      - `event_type` (text)
      - `severity` (text)
      - `ip_address` (inet)
      - `user_agent` (text)
      - `location` (jsonb)
      - `details` (jsonb)
      - `risk_score` (integer)
      - `resolved` (boolean)
      - `resolved_by` (uuid, foreign key)
      - `resolved_at` (timestamptz)
      - `timestamp` (timestamptz)

  2. Security
    - Enable RLS on `security_events` table
    - Only admins and security team can access security events
    - Users can read events related to their account
*/

CREATE TABLE IF NOT EXISTS security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('login_attempt', 'failed_login', 'suspicious_activity', 'data_access', 'permission_change', 'security_violation')),
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address inet,
  user_agent text,
  location jsonb DEFAULT '{}',
  details jsonb DEFAULT '{}',
  risk_score integer DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  resolved boolean DEFAULT false,
  resolved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Admins can access all security events
CREATE POLICY "Admins can access all security events"
  ON security_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can read security events related to their account
CREATE POLICY "Users can read own security events"
  ON security_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- System can insert security events
CREATE POLICY "System can insert security events"
  ON security_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON security_events(resolved);
CREATE INDEX IF NOT EXISTS idx_security_events_risk_score ON security_events(risk_score DESC);