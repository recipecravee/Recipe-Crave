CREATE TABLE IF NOT EXISTS "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"hero_image" text,
	"recipe_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"curated_by" text,
	"intro" text,
	"seo_meta" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meal_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"week_start_date" text NOT NULL,
	"plan" jsonb NOT NULL,
	"grocery_list" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"generated_by_ai" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"source" text,
	"consented_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pantry_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"qty" real,
	"unit" text,
	"expiry_date" text,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"hero_image" text,
	"gallery_images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"video_url" text,
	"prep_time_min" integer NOT NULL,
	"cook_time_min" integer NOT NULL,
	"total_time_min" integer NOT NULL,
	"servings" integer NOT NULL,
	"difficulty" text NOT NULL,
	"cuisine" text NOT NULL,
	"course" text NOT NULL,
	"occasion" text,
	"equipment" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ingredients" jsonb NOT NULL,
	"instructions" jsonb NOT NULL,
	"tips" text,
	"storage_notes" text,
	"freezer_notes" text,
	"nutrition" jsonb,
	"cost_per_serving_usd" real,
	"dietary_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"allergen_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"faq" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"author_id" uuid,
	"is_ai_assisted" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"save_count" integer DEFAULT 0 NOT NULL,
	"cook_count" integer DEFAULT 0 NOT NULL,
	"avg_rating" real DEFAULT 0 NOT NULL,
	"rating_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "recipes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"body" text,
	"photos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"would_make_again" boolean,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_saved_recipes" (
	"user_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"folder" text DEFAULT 'all' NOT NULL,
	CONSTRAINT "user_saved_recipes_user_id_recipe_id_pk" PRIMARY KEY("user_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar_url" text,
	"locale" text DEFAULT 'en-US' NOT NULL,
	"units" text DEFAULT 'us' NOT NULL,
	"household_size" integer DEFAULT 2 NOT NULL,
	"weekly_budget_usd" real,
	"dietary_prefs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"allergies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skill_level" text DEFAULT 'beginner' NOT NULL,
	"premium_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_slug_idx" ON "recipes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_cuisine_idx" ON "recipes" USING btree ("cuisine");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_course_idx" ON "recipes" USING btree ("course");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipes_published_idx" ON "recipes" USING btree ("is_published","published_at");