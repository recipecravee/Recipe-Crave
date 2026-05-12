import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles, Leaf, Heart, Activity, Clock, ChefHat, ShieldCheck,
  FlaskConical, Sun, Coffee, Apple,
} from 'lucide-react';
import { HERBS, CONDITIONS } from '@/content/herbs';
import { getAllRecipes } from '@/lib/data/recipes';
import { SeasonalHerbs } from '@/components/site/SeasonalHerbs';

export const metadata: Metadata = {
  title: 'Herbal Cooking Hub — Cook Your Way to Better Health',
  description:
    'Friendly beginner guide to cooking with medicinal herbs. Match herbs to common ailments, find the right meal for the right moment, and try our 5 demo recipes. No mystery, no jargon, just food that helps.',
  alternates: { canonical: '/herbal-cooking' },
  keywords: [
    'cooking with herbs for health',
    'medicinal herbs cooking guide',
    'herbal recipes for beginners',
    'food as medicine',
    'how to use turmeric in cooking',
    'cooking for inflammation',
    'herbal kitchen guide',
  ],
};

// "Common-language" ailment buckets — friendlier than the clinical
// condition names on /herbs. Each maps to one of the existing condition
// slugs in herbs.ts but uses plain-English framing for visitors who
// don't know what "joint health" means but do know "my knees hurt."
const AILMENT_BUCKETS: Array<{
  label: string;
  conditionSlug: string;
  icon: typeof Heart;
  intro: string;
  topHerbs: string[];
}> = [
  {
    label: 'Aches, pains, swelling',
    conditionSlug: 'inflammation',
    icon: Heart,
    intro: 'Daily turmeric, ginger, and omega-3s reduce the body-wide inflammation that drives joint pain, swelling, and stiff mornings.',
    topHerbs: ['turmeric', 'ginger', 'black-pepper', 'rosemary'],
  },
  {
    label: 'Blood sugar swings, low energy after meals',
    conditionSlug: 'blood-sugar',
    icon: Activity,
    intro: 'Cinnamon and fenugreek modestly steady blood sugar. Pair with fiber-first eating order to keep energy stable through the afternoon.',
    topHerbs: ['cinnamon', 'fenugreek', 'turmeric'],
  },
  {
    label: 'Bloated, gassy, slow digestion',
    conditionSlug: 'digestion',
    icon: Apple,
    intro: 'Bitter herbs spark your digestive juices. Fennel after a heavy meal, ginger before, peppermint when nothing else helps.',
    topHerbs: ['ginger', 'fennel', 'peppermint', 'cumin'],
  },
  {
    label: 'Trouble sleeping, stressed-out',
    conditionSlug: 'sleep-stress',
    icon: Sun,
    intro: 'Chamomile tonight, ashwagandha daily. The cortisol-lowering effect compounds over 2-4 weeks.',
    topHerbs: ['chamomile', 'ashwagandha', 'cinnamon'],
  },
  {
    label: 'Cold coming on, run-down',
    conditionSlug: 'immune',
    icon: ShieldCheck,
    intro: 'Garlic + ginger broth at the first sign. Crush garlic, let it rest 10 min before cooking — that activates the allicin.',
    topHerbs: ['garlic', 'ginger', 'turmeric', 'thyme'],
  },
  {
    label: 'Heart, cholesterol, blood pressure',
    conditionSlug: 'heart-health',
    icon: Heart,
    intro: 'Mediterranean-style cooking with olive oil + garlic + tomato has the strongest published evidence for cardiovascular protection.',
    topHerbs: ['garlic', 'olive-oil', 'hibiscus', 'cinnamon'],
  },
  {
    label: 'Memory, focus, brain fog',
    conditionSlug: 'brain-cognition',
    icon: FlaskConical,
    intro: 'Rosemary in cooking + omega-3 fatty fish 2-3 times a week. Even smelling rosemary improves working-memory in studies.',
    topHerbs: ['rosemary', 'turmeric', 'sage'],
  },
  {
    label: 'Gut microbiome, leaky gut',
    conditionSlug: 'gut-health',
    icon: Leaf,
    intro: 'Fermented foods daily (sauerkraut, miso, kefir) feed beneficial bacteria. Bone broth provides glutamine for the gut lining.',
    topHerbs: ['miso', 'sauerkraut', 'bone-broth', 'ginger'],
  },
];

// Meal-moment use cases — friendlier than browsing by category.
const MOMENT_BUCKETS: Array<{ label: string; href: string; icon: typeof Coffee; tip: string }> = [
  { label: 'Morning ritual', href: '/recipes/golden-milk', icon: Coffee, tip: 'Golden Milk before breakfast — turmeric + black pepper + ginger to start the day anti-inflammatory.' },
  { label: 'Quick weeknight dinner', href: '/recipes/ginger-turmeric-anti-inflammatory-soup', icon: Clock, tip: 'Ginger-Turmeric Lentil Soup — 40 minutes, hits multiple health pathways.' },
  { label: 'Cold/flu recovery', href: '/recipes/garlic-ginger-immune-broth', icon: ShieldCheck, tip: 'Garlic-Ginger Broth — sip when you feel run-down. 30 minutes start-to-finish.' },
  { label: 'Bedtime calm', href: '/recipes/ashwagandha-chamomile-bedtime-rice-pudding', icon: Sun, tip: 'Ashwagandha-Chamomile Rice Pudding 90 min before bed. Cortisol-lowering + sleep-promoting.' },
  { label: 'Daily diabetic-friendly', href: '/recipes/fenugreek-cinnamon-blood-sugar-curry', icon: Activity, tip: 'Fenugreek-Cinnamon Curry — built for blood sugar management without sacrificing flavor.' },
];

export default async function HerbalCookingHubPage() {
  const allRecipes = await getAllRecipes();
  // Demo recipes are the 5 therapeutic ones we built
  const demoSlugs = [
    'golden-milk',
    'ginger-turmeric-anti-inflammatory-soup',
    'garlic-ginger-immune-broth',
    'ashwagandha-chamomile-bedtime-rice-pudding',
    'fenugreek-cinnamon-blood-sugar-curry',
  ];
  const demoRecipes = demoSlugs
    .map((s) => allRecipes.find((r) => r.slug === s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <div className="container py-10 lg:py-14">
      {/* HERO */}
      <header className="mb-12 max-w-4xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
          <Leaf className="h-3.5 w-3.5" aria-hidden /> Herbal cooking hub
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl lg:text-6xl">
          Cook your way to <span className="text-terracotta-500">better health</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">
          You don&apos;t need a degree in herbalism. You need a few cupboard staples and one
          minute of guidance. Pick what your body needs help with — we&apos;ll point you at the
          right herbs, the right recipe, and the right time of day to eat it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/recipes/golden-milk"
            className="rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-600"
          >
            Try a 10-minute starter recipe
          </Link>
          <Link
            href="/safety-check"
            className="rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-bold text-ink hover:border-amber-500 hover:text-amber-700"
          >
            On medication? Check safety first
          </Link>
        </div>
      </header>

      {/* AILMENT-FIRST DISCOVERY (the friendly entry point) */}
      <section className="mb-14">
        <h2 className="mb-2 font-serif text-3xl text-ink">What can we help with?</h2>
        <p className="mb-6 max-w-2xl text-ink-muted">
          Pick anything that bothers you. We translate the science into the right cooking move.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {AILMENT_BUCKETS.map((bucket) => {
            const Icon = bucket.icon;
            return (
              <Link
                key={bucket.conditionSlug}
                href={`/conditions/${bucket.conditionSlug}`}
                className="group block rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 text-forest-700 group-hover:bg-forest-200">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="mt-3 font-serif text-base font-bold text-ink group-hover:text-terracotta-600">
                  {bucket.label}
                </p>
                <p className="mt-2 line-clamp-3 text-xs text-ink-muted">{bucket.intro}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {bucket.topHerbs.slice(0, 3).map((h) => (
                    <span
                      key={h}
                      className="rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-700"
                    >
                      {h.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* MEAL MOMENT */}
      <section className="mb-14 rounded-2xl bg-gradient-to-br from-terracotta-50 via-cream-50 to-forest-50 p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-3xl text-ink">When do you want to eat it?</h2>
        <p className="mt-2 max-w-2xl text-ink-muted">
          The same herbs work different jobs depending on when you cook them. Morning vs.
          evening matters. Sick day vs. random Tuesday matters too.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOMENT_BUCKETS.map((m) => {
            const Icon = m.icon;
            return (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className="block rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-terracotta-500" aria-hidden />
                    <p className="font-serif text-base font-bold text-ink">{m.label}</p>
                  </div>
                  <p className="mt-2 text-xs text-ink-muted">{m.tip}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* SEASONAL HERB ROTATION (already built) */}
      <section className="mb-14">
        <SeasonalHerbs />
      </section>

      {/* DEMO RECIPES — the 5 we wrote */}
      <section className="mb-14">
        <h2 className="mb-2 font-serif text-3xl text-ink">Five recipes to try first</h2>
        <p className="mb-6 max-w-2xl text-ink-muted">
          Each pairs herbs that amplify each other — turmeric + black pepper boosts curcumin
          absorption by 2000%, garlic + ginger broadens antimicrobial range. Start here.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {demoRecipes.map((r) => (
            <Link
              key={r.slug}
              href={`/recipes/${r.slug}`}
              className="group block rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-serif text-sm font-bold text-ink group-hover:text-terracotta-600">{r.title}</p>
              <p className="mt-1 text-[11px] text-ink-muted">{r.totalTimeMin} min · {r.servings} servings</p>
            </Link>
          ))}
        </div>
      </section>

      {/* BEGINNER FAQ */}
      <section className="mb-14">
        <h2 className="mb-4 font-serif text-3xl text-ink">Beginner questions</h2>
        <div className="space-y-3">
          {[
            {
              q: 'Will this replace my medication?',
              a: 'No. Herbal cooking is supportive — it complements care, not replaces it. Severe or progressive conditions need a clinician. Use our /safety-check tool to flag interactions with any medications you take.',
            },
            {
              q: 'How long until I notice a difference?',
              a: 'Acute effects (better digestion after a ginger tea, calmer after chamomile) — same evening. Cumulative effects (lower inflammation, better fasting glucose) — 2-6 weeks of daily intake.',
            },
            {
              q: 'Do I need to buy expensive supplements?',
              a: 'No. Everything on this site is achievable with grocery-store ingredients. Bulk-buying common herbs like turmeric, cinnamon, and ginger costs a few dollars a month.',
            },
            {
              q: 'What if I miss a day?',
              a: 'Fine. Consistency matters more than perfection. Aim for 5 days a week of intentional herb intake, not 7.',
            },
            {
              q: 'Can I use dried herbs instead of fresh?',
              a: 'Yes, but ratios change: 1 tablespoon fresh = 1 teaspoon dried (3:1). Add fresh herbs at the end of cooking, dried at the beginning.',
            },
            {
              q: 'I am pregnant or breastfeeding — what should I avoid?',
              a: 'High-dose turmeric extracts, ashwagandha, fenugreek seeds, and concentrated essential oils. Culinary use of most kitchen herbs is fine. Always check /safety-check or your OB before adding therapeutic doses.',
            },
          ].map((f, i) => (
            <details key={i} className="group rounded-2xl bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none font-bold text-ink">
                {f.q}
                <span aria-hidden className="float-right text-terracotta-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* DEEP DIVE LINKS */}
      <section className="rounded-2xl bg-cream-100 p-6 sm:p-8">
        <h2 className="font-serif text-2xl text-ink">Want to go deeper?</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li>
            <Link href="/herbs" className="font-bold text-terracotta-600 hover:underline">
              <FlaskConical className="mr-1 inline h-4 w-4" aria-hidden />
              Browse all 32 herbs
            </Link>
            <span className="text-ink-muted"> — active compounds, daily intake, cooking methods, contraindications, and PubMed citations per herb.</span>
          </li>
          <li>
            <Link href="/meal-plans" className="font-bold text-terracotta-600 hover:underline">
              <Sparkles className="mr-1 inline h-4 w-4" aria-hidden />
              30-day condition meal plans
            </Link>
            <span className="text-ink-muted"> — anti-inflammation, diabetes, gut healing, sleep optimization. Daily meals, shopping lists, milestones.</span>
          </li>
          <li>
            <Link href="/safety-check" className="font-bold text-terracotta-600 hover:underline">
              <ShieldCheck className="mr-1 inline h-4 w-4" aria-hidden />
              Drug + condition safety check
            </Link>
            <span className="text-ink-muted"> — tick your meds + conditions, get flagged interactions w/ source citations.</span>
          </li>
          <li>
            <Link href="/profile" className="font-bold text-terracotta-600 hover:underline">
              <ChefHat className="mr-1 inline h-4 w-4" aria-hidden />
              Build your personalized health profile
            </Link>
            <span className="text-ink-muted"> — auto-recommend plans and recipes based on conditions you manage.</span>
          </li>
          <li>
            <Link href="/blog" className="font-bold text-terracotta-600 hover:underline">
              <Coffee className="mr-1 inline h-4 w-4" aria-hidden />
              Read deeper articles
            </Link>
            <span className="text-ink-muted"> — turmeric vs. ibuprofen, the science of cinnamon, bone broth evidence review, and more.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
