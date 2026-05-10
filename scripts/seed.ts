import postgres from 'postgres';
import { SEED_RECIPES, SEED_COLLECTIONS } from '../src/content/seed-recipes';

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('SUPABASE_DB_URL not set');
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1, idle_timeout: 5 });

async function main() {
  console.log(`Seeding ${SEED_RECIPES.length} recipes...`);
  let inserted = 0;
  let updated = 0;

  for (const r of SEED_RECIPES) {
    const result = await sql`
      INSERT INTO recipes (
        slug, title, description, hero_image, gallery_images, video_url,
        prep_time_min, cook_time_min, total_time_min, servings, difficulty,
        cuisine, course, occasion, equipment, ingredients, instructions,
        tips, storage_notes, freezer_notes, nutrition, cost_per_serving_usd,
        dietary_tags, allergen_tags, keywords, faq,
        author_id, is_ai_assisted, is_published,
        avg_rating, rating_count
      ) VALUES (
        ${r.slug}, ${r.title}, ${r.description}, ${r.heroImage},
        ${JSON.stringify(r.galleryImages)}::jsonb, ${r.videoUrl},
        ${r.prepTimeMin}, ${r.cookTimeMin}, ${r.totalTimeMin}, ${r.servings},
        ${r.difficulty}, ${r.cuisine}, ${r.course}, ${r.occasion},
        ${JSON.stringify(r.equipment)}::jsonb,
        ${JSON.stringify(r.ingredients)}::jsonb,
        ${JSON.stringify(r.instructions)}::jsonb,
        ${r.tips}, ${r.storageNotes}, ${r.freezerNotes},
        ${r.nutrition ? JSON.stringify(r.nutrition) : null}::jsonb,
        ${r.costPerServingUsd},
        ${JSON.stringify(r.dietaryTags)}::jsonb,
        ${JSON.stringify(r.allergenTags)}::jsonb,
        ${JSON.stringify(r.keywords)}::jsonb,
        ${JSON.stringify(r.faq)}::jsonb,
        ${r.authorId}, ${r.isAiAssisted}, ${r.isPublished},
        ${r.avgRating}, ${r.ratingCount}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        hero_image = EXCLUDED.hero_image,
        updated_at = NOW()
      RETURNING (xmax = 0) AS is_insert
    `;
    if (result[0]?.is_insert) inserted++;
    else updated++;
  }
  console.log(`✓ Recipes: ${inserted} inserted, ${updated} updated`);

  console.log(`\nSeeding ${SEED_COLLECTIONS.length} collections...`);
  let cInserted = 0;
  let cUpdated = 0;
  for (const c of SEED_COLLECTIONS) {
    const recipeRows = await sql<Array<{ id: string }>>`
      SELECT id FROM recipes WHERE slug = ANY(${c.recipeSlugs})
    `;
    const ids = recipeRows.map((row) => row.id);
    const result = await sql`
      INSERT INTO collections (slug, title, description, recipe_ids)
      VALUES (${c.slug}, ${c.title}, ${c.description}, ${JSON.stringify(ids)}::jsonb)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        recipe_ids = EXCLUDED.recipe_ids,
        updated_at = NOW()
      RETURNING (xmax = 0) AS is_insert
    `;
    if (result[0]?.is_insert) cInserted++;
    else cUpdated++;
  }
  console.log(`✓ Collections: ${cInserted} inserted, ${cUpdated} updated`);

  const recipeCountRows = await sql<Array<{ count: number }>>`
    SELECT COUNT(*)::int AS count FROM recipes
  `;
  const collectionCountRows = await sql<Array<{ count: number }>>`
    SELECT COUNT(*)::int AS count FROM collections
  `;
  console.log(
    `\n📊 DB totals: ${recipeCountRows[0]?.count ?? 0} recipes, ${collectionCountRows[0]?.count ?? 0} collections`,
  );
}

main()
  .then(async () => {
    await sql.end();
    process.exit(0);
  })
  .catch(async (e) => {
    await sql.end();
    console.error('SEED FAILED:', e instanceof Error ? e.message : e);
    process.exit(1);
  });
