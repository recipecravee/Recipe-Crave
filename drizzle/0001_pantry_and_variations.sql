-- 0001_pantry_and_variations.sql
--
-- Unlocks TODO #11 (Pantry Matcher cloud sync) and TODO #12 (Variation
-- moderation queue) once Supabase project is provisioned.
--
-- How to apply:
--   1. Owner provisions Supabase project at https://supabase.com (free tier).
--   2. Copy DATABASE_URL into .env.local.
--   3. Run: npx drizzle-kit push  (or: psql $DATABASE_URL -f drizzle/0001_pantry_and_variations.sql)
--   4. Set Row Level Security policies per the comments below.
--
-- Free-tier safe: indexes are minimal, no extensions beyond pg defaults,
-- no full-text search infra (Postgres trigram extension is optional).

-- ============================================================
-- pantry_items — TODO #11
-- ============================================================
-- One row per ingredient a logged-in user has on hand. localStorage
-- already drives this for guests; once user authenticates, their cached
-- pantry uploads into this table and the localStorage cache becomes the
-- write-through read cache.
CREATE TABLE IF NOT EXISTS pantry_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient  TEXT NOT NULL,                      -- canonical name (matches recipe.ingredients[].name)
  quantity    NUMERIC,                            -- optional
  unit        TEXT,                               -- optional ('g', 'cup', 'tbsp', etc.)
  expires_at  DATE,                               -- optional "use by" date for the matcher
  source      TEXT NOT NULL DEFAULT 'manual',     -- 'manual' | 'photo-scan' | 'meal-plan'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, ingredient)
);

CREATE INDEX IF NOT EXISTS pantry_items_user_idx ON pantry_items (user_id);
CREATE INDEX IF NOT EXISTS pantry_items_expires_idx ON pantry_items (expires_at) WHERE expires_at IS NOT NULL;

-- Row-Level Security: each user only sees / mutates their own rows.
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY pantry_items_owner_select ON pantry_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY pantry_items_owner_insert ON pantry_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY pantry_items_owner_update ON pantry_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY pantry_items_owner_delete ON pantry_items FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- recipe_variations — TODO #12
-- ============================================================
-- User-submitted variations of recipes. Moderation queue: status defaults
-- to 'pending' and admin promotes to 'approved' before the public recipe
-- page renders them. Spam control via per-user rate limit at the API layer.
CREATE TABLE IF NOT EXISTS recipe_variations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_slug   TEXT NOT NULL,
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,   -- anonymous allowed
  display_name  TEXT,                                                 -- user-chosen name, optional
  body          TEXT NOT NULL CHECK (length(body) BETWEEN 20 AND 4000),
  ingredient_swaps JSONB DEFAULT '[]'::JSONB,                         -- [{from, to, reason}, ...]
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  helpful_count INTEGER NOT NULL DEFAULT 0,
  reviewed_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS recipe_variations_recipe_idx ON recipe_variations (recipe_slug, status);
CREATE INDEX IF NOT EXISTS recipe_variations_pending_idx ON recipe_variations (status, created_at)
  WHERE status = 'pending';

ALTER TABLE recipe_variations ENABLE ROW LEVEL SECURITY;

-- Anyone can read APPROVED variations.
CREATE POLICY recipe_variations_public_read ON recipe_variations
  FOR SELECT
  USING (status = 'approved');

-- Authors can read their own pending submissions (lets them check status).
CREATE POLICY recipe_variations_author_read ON recipe_variations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone (incl. anon) can submit. API layer rate-limits per IP / per user.
CREATE POLICY recipe_variations_anyone_insert ON recipe_variations
  FOR INSERT
  WITH CHECK (status = 'pending');

-- Only the owner email allowlist (set this up via Supabase auth.users metadata
-- or a dedicated 'admins' table) can moderate. Owner: recipecrave@gmail.com.
-- Below assumes you'll add an `is_admin` claim on the user — adjust to whatever
-- your auth setup uses.
CREATE POLICY recipe_variations_admin_update ON recipe_variations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM auth.users u
      WHERE u.id = auth.uid()
        AND (u.raw_user_meta_data ->> 'is_admin')::BOOLEAN = TRUE
    )
  );

-- ============================================================
-- helpful_votes — supports recipe_variations.helpful_count
-- ============================================================
-- Per-user vote so a single visitor can only +1 a variation once.
CREATE TABLE IF NOT EXISTS variation_helpful_votes (
  variation_id UUID NOT NULL REFERENCES recipe_variations(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (variation_id, user_id)
);

ALTER TABLE variation_helpful_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY votes_owner_select ON variation_helpful_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY votes_owner_insert ON variation_helpful_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY votes_owner_delete ON variation_helpful_votes FOR DELETE USING (auth.uid() = user_id);

-- Auto-bump helpful_count when a vote is inserted.
CREATE OR REPLACE FUNCTION bump_helpful_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE recipe_variations
       SET helpful_count = helpful_count + 1
     WHERE id = NEW.variation_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE recipe_variations
       SET helpful_count = GREATEST(helpful_count - 1, 0)
     WHERE id = OLD.variation_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS variation_helpful_votes_count_trig ON variation_helpful_votes;
CREATE TRIGGER variation_helpful_votes_count_trig
AFTER INSERT OR DELETE ON variation_helpful_votes
FOR EACH ROW EXECUTE FUNCTION bump_helpful_count();

-- ============================================================
-- updated_at auto-touch on both new tables
-- ============================================================
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pantry_items_touch ON pantry_items;
CREATE TRIGGER pantry_items_touch BEFORE UPDATE ON pantry_items
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS recipe_variations_touch ON recipe_variations;
CREATE TRIGGER recipe_variations_touch BEFORE UPDATE ON recipe_variations
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
