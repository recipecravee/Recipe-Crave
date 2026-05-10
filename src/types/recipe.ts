import type { Ingredient, Instruction, Nutrition, FaqItem } from '@/lib/db/schema';

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string | null;
  galleryImages: string[];
  videoUrl: string | null;
  prepTimeMin: number;
  cookTimeMin: number;
  totalTimeMin: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  course: string;
  occasion: string | null;
  equipment: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  tips: string | null;
  storageNotes: string | null;
  freezerNotes: string | null;
  nutrition: Nutrition | null;
  costPerServingUsd: number | null;
  dietaryTags: string[];
  allergenTags: string[];
  keywords: string[];
  faq: FaqItem[];
  authorId: string | null;
  isAiAssisted: boolean;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
  viewCount: number;
  saveCount: number;
  cookCount: number;
  avgRating: number;
  ratingCount: number;
};

export type RecipeSummary = Pick<
  Recipe,
  | 'id'
  | 'slug'
  | 'title'
  | 'description'
  | 'heroImage'
  | 'totalTimeMin'
  | 'servings'
  | 'difficulty'
  | 'cuisine'
  | 'course'
  | 'dietaryTags'
  | 'costPerServingUsd'
  | 'avgRating'
  | 'ratingCount'
  | 'saveCount'
> & { calories?: number };
