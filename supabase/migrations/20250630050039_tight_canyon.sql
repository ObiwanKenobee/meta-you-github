/*
  # Create Database Functions and Triggers

  1. Functions
    - `get_user_analytics` - Get comprehensive user analytics
    - `update_growth_metrics` - Update user growth metrics with history
    - `create_notification` - Create notifications for users
    - `get_collaboration_recommendations` - Get project recommendations

  2. Triggers
    - Auto-create user profile on user creation
    - Auto-update growth metrics when profile changes
    - Auto-create notifications for achievements
*/

-- Function to get user analytics
CREATE OR REPLACE FUNCTION get_user_analytics(target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  total_sessions integer;
  total_interactions integer;
  avg_session_length interval;
  growth_trend jsonb;
BEGIN
  -- Check if user can access this data
  IF auth.uid() != target_user_id AND NOT EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Get session count from analytics events
  SELECT COUNT(DISTINCT session_id) INTO total_sessions
  FROM analytics_events
  WHERE user_id = target_user_id;

  -- Get AI interaction count
  SELECT COUNT(*) INTO total_interactions
  FROM ai_interactions
  WHERE user_id = target_user_id;

  -- Get growth trend from last 30 days
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', DATE(timestamp),
      'metrics', metrics
    ) ORDER BY timestamp
  ) INTO growth_trend
  FROM growth_history
  WHERE user_id = target_user_id
    AND timestamp >= NOW() - INTERVAL '30 days';

  -- Build result
  result := jsonb_build_object(
    'totalSessions', COALESCE(total_sessions, 0),
    'totalInteractions', COALESCE(total_interactions, 0),
    'growthTrend', COALESCE(growth_trend, '[]'::jsonb),
    'lastUpdated', NOW()
  );

  RETURN result;
END;
$$;

-- Function to update growth metrics with history tracking
CREATE OR REPLACE FUNCTION update_growth_metrics(
  target_user_id uuid,
  new_metrics jsonb,
  source_type text DEFAULT 'manual',
  notes_text text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user can update this data
  IF auth.uid() != target_user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update user profile
  UPDATE user_profiles
  SET 
    growth_metrics = new_metrics,
    updated_at = NOW()
  WHERE user_id = target_user_id;

  -- Insert into growth history
  INSERT INTO growth_history (user_id, metrics, source, notes)
  VALUES (target_user_id, new_metrics, source_type, notes_text);

  -- Check for achievements and create notifications
  PERFORM check_and_create_achievement_notifications(target_user_id, new_metrics);
END;
$$;

-- Function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
  target_user_id uuid,
  notification_type text,
  notification_priority text,
  notification_title text,
  notification_message text,
  notification_data jsonb DEFAULT '{}',
  notification_action_url text DEFAULT NULL,
  notification_expires_at timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (
    user_id, type, priority, title, message, data, action_url, expires_at
  ) VALUES (
    target_user_id, notification_type, notification_priority, 
    notification_title, notification_message, notification_data, 
    notification_action_url, notification_expires_at
  ) RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$;

-- Function to check achievements and create notifications
CREATE OR REPLACE FUNCTION check_and_create_achievement_notifications(
  target_user_id uuid,
  new_metrics jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  metric_key text;
  metric_value numeric;
  achievement_title text;
  achievement_message text;
BEGIN
  -- Check each metric for achievement thresholds
  FOR metric_key, metric_value IN SELECT * FROM jsonb_each_text(new_metrics)
  LOOP
    -- Check for milestone achievements (25, 50, 75, 90, 100)
    IF metric_value::numeric >= 25 AND metric_value::numeric < 50 THEN
      achievement_title := 'Quarter Master: ' || initcap(metric_key);
      achievement_message := 'You''ve reached 25% in ' || metric_key || '! Keep growing!';
    ELSIF metric_value::numeric >= 50 AND metric_value::numeric < 75 THEN
      achievement_title := 'Half Way Hero: ' || initcap(metric_key);
      achievement_message := 'Amazing! You''ve reached 50% in ' || metric_key || '!';
    ELSIF metric_value::numeric >= 75 AND metric_value::numeric < 90 THEN
      achievement_title := 'Excellence Achiever: ' || initcap(metric_key);
      achievement_message := 'Outstanding! You''ve reached 75% in ' || metric_key || '!';
    ELSIF metric_value::numeric >= 90 AND metric_value::numeric < 100 THEN
      achievement_title := 'Master Level: ' || initcap(metric_key);
      achievement_message := 'Incredible! You''ve reached 90% in ' || metric_key || '!';
    ELSIF metric_value::numeric >= 100 THEN
      achievement_title := 'Perfect Mastery: ' || initcap(metric_key);
      achievement_message := 'Congratulations! You''ve achieved 100% in ' || metric_key || '!';
    END IF;

    -- Create notification if achievement reached
    IF achievement_title IS NOT NULL THEN
      -- Check if this achievement notification already exists
      IF NOT EXISTS (
        SELECT 1 FROM notifications
        WHERE user_id = target_user_id
          AND type = 'achievement'
          AND title = achievement_title
          AND created_at >= NOW() - INTERVAL '1 day'
      ) THEN
        PERFORM create_notification(
          target_user_id,
          'achievement',
          'high',
          achievement_title,
          achievement_message,
          jsonb_build_object('metric', metric_key, 'value', metric_value),
          '/achievements'
        );
      END IF;
    END IF;

    -- Reset for next iteration
    achievement_title := NULL;
    achievement_message := NULL;
  END LOOP;
END;
$$;

-- Function to get collaboration recommendations
CREATE OR REPLACE FUNCTION get_collaboration_recommendations(target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_age_group text;
  user_interests text[];
  recommendations jsonb;
BEGIN
  -- Get user's age group and interests
  SELECT age_group INTO user_age_group
  FROM users
  WHERE id = target_user_id;

  -- Get recommended projects based on age group and interests
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'title', title,
      'description', description,
      'category', category,
      'participantCount', jsonb_array_length(participants),
      'matchScore', 
        CASE 
          WHEN user_age_group = ANY(age_groups) THEN 0.8
          ELSE 0.4
        END
    )
  ) INTO recommendations
  FROM collaboration_projects
  WHERE status IN ('planning', 'active')
    AND created_by != target_user_id
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements(participants) AS p
      WHERE (p->>'userId')::uuid = target_user_id
    )
  ORDER BY 
    CASE WHEN user_age_group = ANY(age_groups) THEN 1 ELSE 0 END DESC,
    created_at DESC
  LIMIT 10;

  RETURN COALESCE(recommendations, '[]'::jsonb);
END;
$$;

-- Trigger function to auto-create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Trigger to create user profile when user is created
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Trigger function to log security events for failed logins
CREATE OR REPLACE FUNCTION log_security_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log failed login attempts
  IF NEW.login_attempts > OLD.login_attempts THEN
    INSERT INTO security_events (
      user_id, event_type, severity, details, risk_score
    ) VALUES (
      NEW.id,
      'failed_login',
      CASE 
        WHEN NEW.login_attempts >= 5 THEN 'high'
        WHEN NEW.login_attempts >= 3 THEN 'medium'
        ELSE 'low'
      END,
      jsonb_build_object(
        'login_attempts', NEW.login_attempts,
        'email', NEW.email
      ),
      NEW.login_attempts * 10
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to log security events
CREATE TRIGGER log_security_event_trigger
  AFTER UPDATE ON users
  FOR EACH ROW
  WHEN (NEW.login_attempts IS DISTINCT FROM OLD.login_attempts)
  EXECUTE FUNCTION log_security_event();