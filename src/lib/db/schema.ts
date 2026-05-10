import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  jsonb,
  real,
  boolean,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  locale: text('locale').default('en-US').notNull(),
  units: text('units').default('us').notNull(),
  householdSize: integer('household_size').default(2).notNull(),
  weeklyBudgetUsd: real('weekly_budget_usd'),
  dietaryPrefs: jsonb('dietary_prefs').$type<string[]>().default([]).notNull(),
  allergies: jsonb('allergies').$type<string[]>().default([]).notNull(),
  skillLevel: text('skill_level').default('beginner').notNull(),
  premiumUntil: timestamp('premium_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Ingredient = {
  name: string;
  qty: number;
  unit: string;
  notes?: string;
  substitutes?: string[];
};

export type Instruction = {
  step: number;
  text: string;
  imageUrl?: string;
  timerMin?: number;
};

export type Nutrition = {
  calories: number;
  fatG: number;
  satFatG: number;
  carbsG: number;
  sugarG: number;
  fiberG: number;
  proteinG: number;
  sodiumMg: number;
  cholesterolMg?: number;
};

export type FaqItem = { q: string; a: string };

export const recipes = pgTable(
  'recipes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    heroImage: text('hero_image'),
    galleryImages: jsonb('gallery_images').$type<string[]>().default([]).notNull(),
    videoUrl: text('video_url'),
    prepTimeMin: integer('prep_time_min').notNull(),
    cookTimeMin: integer('cook_time_min').notNull(),
    totalTimeMin: integer('total_time_min').notNull(),
    servings: integer('servings').notNull(),
    difficulty: text('difficulty').notNull(),
    cuisine: text('cuisine').notNull(),
    course: text('course').notNull(),
    occasion: text('occasion'),
    equipment: jsonb('equipment').$type<string[]>().default([]).notNull(),
    ingredients: jsonb('ingredients').$type<Ingredient[]>().notNull(),
    instructions: jsonb('instructions').$type<Instruction[]>().notNull(),
    tips: text('tips'),
    storageNotes: text('storage_notes'),
    freezerNotes: text('freezer_notes'),
    nutrition: jsonb('nutrition').$type<Nutrition>(),
    costPerServingUsd: real('cost_per_serving_usd'),
    dietaryTags: jsonb('dietary_tags').$type<string[]>().default([]).notNull(),
    allergenTags: jsonb('allergen_tags').$type<string[]>().default([]).notNull(),
    keywords: jsonb('keywords').$type<string[]>().default([]).notNull(),
    faq: jsonb('faq').$type<FaqItem[]>().default([]).notNull(),
    authorId: uuid('author_id'),
    isAiAssisted: boolean('is_ai_assisted').default(false).notNull(),
    isPublished: boolean('is_published').default(true).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    viewCount: integer('view_count').default(0).notNull(),
    saveCount: integer('save_count').default(0).notNull(),
    cookCount: integer('cook_count').default(0).notNull(),
    avgRating: real('avg_rating').default(0).notNull(),
    ratingCount: integer('rating_count').default(0).notNull(),
  },
  (t) => ({
    slugIdx: index('recipes_slug_idx').on(t.slug),
    cuisineIdx: index('recipes_cuisine_idx').on(t.cuisine),
    courseIdx: index('recipes_course_idx').on(t.course),
    publishedIdx: index('recipes_published_idx').on(t.isPublished, t.publishedAt),
  }),
);

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id').notNull(),
  userId: uuid('user_id').notNull(),
  rating: integer('rating').notNull(),
  body: text('body'),
  photos: jsonb('photos').$type<string[]>().default([]).notNull(),
  wouldMakeAgain: boolean('would_make_again'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  heroImage: text('hero_image'),
  recipeIds: jsonb('recipe_ids').$type<string[]>().default([]).notNull(),
  curatedBy: text('curated_by'),
  intro: text('intro'),
  seoMeta: jsonb('seo_meta').$type<{ title?: string; description?: string }>(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userSavedRecipes = pgTable(
  'user_saved_recipes',
  {
    userId: uuid('user_id').notNull(),
    recipeId: uuid('recipe_id').notNull(),
    savedAt: timestamp('saved_at', { withTimezone: true }).defaultNow().notNull(),
    folder: text('folder').default('all').notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.recipeId] }) }),
);

export const mealPlans = pgTable('meal_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  weekStartDate: text('week_start_date').notNull(),
  plan: jsonb('plan').$type<Record<string, string[]>>().notNull(),
  groceryList: jsonb('grocery_list').$type<Ingredient[]>().default([]).notNull(),
  generatedByAi: boolean('generated_by_ai').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const pantryItems = pgTable('pantry_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  qty: real('qty'),
  unit: text('unit'),
  expiryDate: text('expiry_date'),
  addedAt: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  source: text('source'),
  consentedAt: timestamp('consented_at', { withTimezone: true }).defaultNow().notNull(),
  unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
});
