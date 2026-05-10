import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About ${SITE.name}`,
  description: 'Learn about RecipeCrave — the free AI cooking coach built to help home cooks plan, save, and actually cook every week.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="container py-12 lg:py-16">
      <article className="prose prose-lg container-prose mx-auto">
        <h1>About {SITE.name}</h1>
        <p>
          {SITE.name} is a free AI-powered recipe platform built by home cooks, for home cooks. We started this project because every other recipe app
          treated saving recipes as the goal. We think actually cooking them is.
        </p>

        <h2>Our mission</h2>
        <p>
          Close the gap between &ldquo;I saved this&rdquo; and &ldquo;I made this.&rdquo; That means recipes with real nutrition data, honest per-serving costs,
          ingredient-aware suggestions, and a meal planner that respects your budget and your schedule. All free.
        </p>

        <h2>How we&apos;re different</h2>
        <ul>
          <li>Calories, macros, and cost per serving on every single recipe.</li>
          <li>AI meal planner that builds your week around your pantry and your budget.</li>
          <li>Voice cook mode so your phone doesn&apos;t get covered in flour.</li>
          <li>Multi-language and multi-unit support — naira, pounds, euros, grams, cups.</li>
          <li>No paywalls. Ads support the lights so the recipes can stay free.</li>
        </ul>

        <h2>How we test recipes</h2>
        <p>
          Recipes are developed and tested in real home kitchens — not commercial studios with industrial ovens. AI assists with formatting, FAQ generation,
          and nutrition calculation, but every recipe is reviewed by a human before publishing. We label AI-assisted content clearly.
        </p>

        <h2>Who we are</h2>
        <p>
          {SITE.name} is built and operated by {SITE.publisher}. We&apos;re a small team obsessed with making home cooking easier, cheaper, and more fun for
          everyone — especially people new to the kitchen, on tight budgets, or with dietary needs the food world tends to ignore.
        </p>

        <h2>Get in touch</h2>
        <p>
          Questions, feedback, partnerships, press: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </article>
    </div>
  );
}
