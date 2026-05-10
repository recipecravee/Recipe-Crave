import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description: 'How RecipeCrave develops, tests, and reviews recipes — our editorial standards, AI disclosure, and corrections process.',
  alternates: { canonical: '/editorial-policy' },
};

export default function EditorialPolicyPage() {
  return (
    <div className="container py-12 lg:py-16">
      <article className="prose prose-lg container-prose mx-auto">
        <h1>Editorial Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p>
          At {SITE.name} we treat recipes like reporting: tested, sourced, and corrected when wrong. This page explains how we work.
        </p>

        <h2>Recipe development</h2>
        <ul>
          <li>Every original recipe is developed by a home cook or trained recipe developer.</li>
          <li>Recipes are tested in at least one real home kitchen before publishing. Most are tested two or three times.</li>
          <li>We aim for clear, beginner-friendly language without dumbing down technique.</li>
        </ul>

        <h2>Nutrition data</h2>
        <ul>
          <li>Nutrition is calculated automatically from the USDA FoodData Central database where possible.</li>
          <li>Values are estimates. Specific brands, sizes, and substitutions will change actual values.</li>
          <li>If you need precise nutrition for medical reasons, verify with a registered dietitian or your own measurements.</li>
        </ul>

        <h2>Cost estimates</h2>
        <ul>
          <li>Per-serving cost is estimated from US average grocery prices, refreshed quarterly.</li>
          <li>Local prices vary widely — these numbers are guidelines, not guarantees.</li>
          <li>Future versions will support multi-currency and zip-code price arbitrage for premium users.</li>
        </ul>

        <h2>AI disclosure</h2>
        <p>
          We use AI tools (currently Google Gemini and Groq) to assist with:
        </p>
        <ul>
          <li>Generating recipe FAQs</li>
          <li>Suggesting ingredient substitutions</li>
          <li>Drafting meal plans</li>
          <li>Normalizing recipe formatting</li>
        </ul>
        <p>
          AI does not publish recipes without human review. Where AI substantially generated content, we label it clearly. We do not use AI-generated photography as the primary recipe image without disclosure.
        </p>

        <h2>Corrections</h2>
        <p>
          If you spot an error — a wrong measurement, a missing ingredient, unsafe instruction — email{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We update recipes within seven days when verified. Significant corrections include a note at the bottom of the recipe.
        </p>

        <h2>Sourcing and attribution</h2>
        <ul>
          <li>Inspired-by recipes credit the original tradition, region, or notable practitioner where relevant.</li>
          <li>We do not copy proprietary recipes from other publications. Similar dishes are independently developed.</li>
          <li>Outside research and cookbook references are cited in technique pages.</li>
        </ul>

        <h2>Sponsored content and affiliates</h2>
        <p>
          Where a recipe is sponsored or contains affiliate links, this is disclosed at the top of the recipe and in the recipe schema. Sponsorship does not affect editorial conclusions about whether a recipe works or not. We do not publish dishonest recipes.
        </p>

        <h2>Reader content</h2>
        <p>
          Reviews and comments are user-generated. We moderate for spam, hate, and unsafe advice but otherwise reflect honest reader experience — including when readers found a recipe lacking.
        </p>
      </article>
    </div>
  );
}
