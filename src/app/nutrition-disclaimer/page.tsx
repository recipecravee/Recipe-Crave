import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Nutrition Disclaimer',
  description: 'Important information about how RecipeCrave calculates nutrition and the limits of those numbers.',
  alternates: { canonical: '/nutrition-disclaimer' },
};

export default function NutritionDisclaimerPage() {
  return (
    <div className="container py-12 lg:py-16">
      <article className="prose prose-lg container-prose mx-auto">
        <h1>Nutrition Disclaimer</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p>
          Nutrition information shown on {SITE.name} recipes is provided as an <strong>estimate only</strong>. Real values vary based on specific brands, sizes, preparation methods, and substitutions.
        </p>

        <h2>How we calculate</h2>
        <p>
          We use the USDA FoodData Central database to estimate calories, macros (protein, carbs, fat), fiber, sugar, sodium, and other nutrients. Where USDA data is unavailable, we use trusted secondary sources.
        </p>

        <h2>What can change real values</h2>
        <ul>
          <li>The specific brand of an ingredient (e.g., one brand of soy sauce vs another)</li>
          <li>Substitutions you make</li>
          <li>How you prepare it (oil quantity in pans, draining, trimming)</li>
          <li>Serving size — we estimate based on the &ldquo;servings&rdquo; field; actual portions may differ</li>
          <li>Cooking yield (e.g., reduction, evaporation)</li>
        </ul>

        <h2>Medical and dietary advice</h2>
        <p>
          Recipes and nutrition info are provided for general informational purposes only and are <strong>not medical advice</strong>. If you have a medical condition, food allergy, diabetes, or other dietary restrictions, consult a registered dietitian or your physician before relying on our values for dosing or treatment decisions.
        </p>

        <h2>Allergens</h2>
        <p>
          We tag common allergens on recipes (gluten, dairy, soy, eggs, shellfish, tree nuts, peanuts, fish, sesame). These tags are best-effort. <strong>Always read the full ingredient list and verify with the original packaging if you have a severe allergy.</strong>
        </p>

        <h2>Reporting issues</h2>
        <p>
          Spot a nutrition value that looks off? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the recipe URL and what you noticed. We recalculate and correct within seven days when warranted.
        </p>
      </article>
    </div>
  );
}
