import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About ${SITE.name}`,
  description: 'Most recipe apps are built around saving. We built RecipeCrave around cooking.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="container py-12 lg:py-16">
      <article className="container-prose mx-auto space-y-10">
        <header>
          <h1 className="font-serif text-4xl text-ink sm:text-5xl">About {SITE.name}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-muted">
            Most recipe apps are built around saving. We built RecipeCrave around cooking.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            There&apos;s a gap between the recipe you bookmarked six months ago and the meal that actually ends up on your table. We exist to close that gap.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-ink">Our mission</h2>
          <p className="text-base leading-relaxed text-ink-muted">
            Make home cooking easier, cheaper, and more likely to actually happen.
          </p>
          <p className="text-base leading-relaxed text-ink-muted">
            That means recipes with real nutrition data, honest cost-per-serving breakdowns, an AI meal planner that works around your pantry and your budget, and a voice cook mode so your phone stays clean while you cook.
          </p>
          <p className="text-base leading-relaxed text-ink-muted">
            All of it free. No paywalls, no gated features. Ads keep the lights on so everything stays free for everyone.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-ink">How we&apos;re different</h2>
          <p className="text-base leading-relaxed text-ink-muted">
            Every recipe on RecipeCrave comes with calories, macros, and cost per serving before you commit to a single ingredient.
          </p>
          <p className="text-base leading-relaxed text-ink-muted">
            Our meal planner builds your week around what you already have and what you can actually afford, not a fantasy shopping list.
          </p>
          <p className="text-base leading-relaxed text-ink-muted">
            Voice cook mode reads each step out loud so you never have to touch your screen mid-cook.
          </p>
          <p className="text-base leading-relaxed text-ink-muted">
            We support multiple languages and units including naira, pounds, euros, grams, and cups because home cooks are everywhere.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-ink">How we test recipes</h2>
          <p className="text-base leading-relaxed text-ink-muted">
            Our recipes are tested in real home kitchens, not commercial studios with industrial equipment.
          </p>
          <p className="text-base leading-relaxed text-ink-muted">
            AI helps with formatting and nutrition calculations but every recipe is reviewed by a human before it goes live. We label AI-assisted content clearly because you deserve to know what you&apos;re cooking from.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-ink">Who we are</h2>
          <p className="text-base leading-relaxed text-ink-muted">
            We&apos;re a small team obsessed with making home cooking more accessible, especially for people on tight budgets, new to the kitchen, or with dietary needs the food world tends to overlook.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-ink">Get in touch</h2>
          <p className="text-base leading-relaxed text-ink-muted">
            Questions, feedback, partnerships or press, reach us at{' '}
            <a href={`mailto:${SITE.email}`} className="text-terracotta-500 underline">
              {SITE.email}
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
