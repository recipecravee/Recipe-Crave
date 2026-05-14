-- 0002_push_subscriptions.sql
--
-- Web Push subscriptions storage. Powers /api/push/subscribe and the
-- daily-digest cron's push delivery path.
--
-- How to apply:
--   1. Supabase dashboard → SQL Editor → paste this file → Run.
--   2. (Optional) Enable RLS as below — admin/service role bypasses,
--      anon writes go through the API route which uses service role.

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint     TEXT UNIQUE NOT NULL,
  p256dh       TEXT NOT NULL,
  auth         TEXT NOT NULL,
  user_agent   TEXT,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS push_subscriptions_active_idx
  ON push_subscriptions (last_seen_at)
  WHERE unsubscribed_at IS NULL;

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- No public RLS policies — service role bypasses RLS, and the
-- /api/push/subscribe + daily-digest cron use service role only.
-- A user can later be allowed to see their own subscriptions via:
--   CREATE POLICY push_subscriptions_owner_read ON push_subscriptions
--     FOR SELECT USING (auth.uid() = user_id);
