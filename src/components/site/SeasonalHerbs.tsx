import Link from 'next/link';
import { Sun, Snowflake, Cloud, Leaf } from 'lucide-react';

// Seasonal herb rotation per strategy doc.
//
// Mapping pulls from traditional Western + Ayurvedic seasonal eating
// principles. The idea: rotating across seasons exposes the body to
// different active compounds and prevents tolerance to any one herb.
//
// Season detection based on Northern-Hemisphere month-of-year. Could be
// flipped via timezone or user preference in a future pass.

type Season = 'spring' | 'summer' | 'fall' | 'winter';

const SEASON_DATA: Record<Season, {
  label: string;
  icon: typeof Sun;
  intro: string;
  theme: string;
  herbs: Array<{ slug: string; name: string; benefit: string }>;
  cssBg: string;
  cssText: string;
}> = {
  spring: {
    label: 'Spring',
    icon: Leaf,
    intro: 'Spring is for renewal and gentle detoxification. Bitter greens stimulate digestion, support liver function, and clear winter heaviness.',
    theme: 'Detoxification + renewal',
    herbs: [
      { slug: 'fennel', name: 'Fennel', benefit: 'Gentle digestive, supports lymphatic clearance' },
      { slug: 'peppermint', name: 'Peppermint', benefit: 'Cooling bitter herb, supports digestion' },
      { slug: 'lemongrass', name: 'Lemongrass', benefit: 'Light cleansing tea base' },
      { slug: 'basil', name: 'Basil', benefit: 'Fresh-growing season, supports digestive heat' },
    ],
    cssBg: 'from-forest-50 to-cream-50',
    cssText: 'text-forest-700',
  },
  summer: {
    label: 'Summer',
    icon: Sun,
    intro: 'Summer cooking favors cooling foods and digestive herbs. Hot weather slows digestion; mint, basil, and hibiscus help.',
    theme: 'Cooling + digestion',
    herbs: [
      { slug: 'peppermint', name: 'Peppermint', benefit: 'Cooling action, eases bloating in heat' },
      { slug: 'basil', name: 'Basil', benefit: 'Fresh summer abundance, aromatic + cooling' },
      { slug: 'hibiscus', name: 'Hibiscus', benefit: 'Iced tea base, mildly diuretic, cooling' },
      { slug: 'chamomile', name: 'Chamomile', benefit: 'Mild calming infusion for hot evenings' },
    ],
    cssBg: 'from-amber-50 to-cream-50',
    cssText: 'text-amber-700',
  },
  fall: {
    label: 'Fall',
    icon: Cloud,
    intro: 'Fall transitions toward warming and immune preparation. Ginger and garlic dominate; flu season is around the corner.',
    theme: 'Immune prep + warming',
    herbs: [
      { slug: 'ginger', name: 'Ginger', benefit: 'Warming, antimicrobial, broad immune support' },
      { slug: 'garlic', name: 'Garlic', benefit: 'Allicin antimicrobial, cardiovascular support' },
      { slug: 'turmeric', name: 'Turmeric', benefit: 'Joint comfort as weather cools' },
      { slug: 'rosemary', name: 'Rosemary', benefit: 'Cognitive support, warming aromatic' },
    ],
    cssBg: 'from-amber-50 to-terracotta-50',
    cssText: 'text-amber-800',
  },
  winter: {
    label: 'Winter',
    icon: Snowflake,
    intro: 'Winter herbs warm from the inside. Cinnamon, clove, and cardamom anchor warming preparations. Heavier, slow-cooked meals welcome more potent spices.',
    theme: 'Warming + resistance',
    herbs: [
      { slug: 'cinnamon', name: 'Cinnamon', benefit: 'Warming, blood-sugar support during heavier meals' },
      { slug: 'clove', name: 'Clove', benefit: 'Deep warming spice, antioxidant powerhouse' },
      { slug: 'cardamom', name: 'Cardamom', benefit: 'Aromatic warming, digestion support' },
      { slug: 'ashwagandha', name: 'Ashwagandha', benefit: 'Adaptogenic warmth for shorter days + stress' },
    ],
    cssBg: 'from-cream-100 to-cream-200',
    cssText: 'text-ink',
  },
};

function currentSeason(): Season {
  // Northern Hemisphere month-to-season mapping
  const month = new Date().getMonth(); // 0 = Jan
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

/**
 * Seasonal herb rotation widget. Detects current season server-side and
 * surfaces 4 herbs in seasonal alignment with traditional eating principles.
 * Each links to its herb-detail page.
 */
export function SeasonalHerbs() {
  const season = currentSeason();
  const data = SEASON_DATA[season];
  const Icon = data.icon;

  return (
    <section className={`rounded-2xl bg-gradient-to-br ${data.cssBg} p-6 shadow-sm`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${data.cssText}`} aria-hidden />
        <p className={`text-xs font-bold uppercase tracking-widest ${data.cssText}`}>
          {data.label} herb rotation · {data.theme}
        </p>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">{data.intro}</p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.herbs.map((h) => (
          <li key={h.slug}>
            <Link
              href={`/herbs/${h.slug}`}
              className="group block rounded-xl border border-ink/10 bg-white p-3 transition-colors hover:border-forest-400"
            >
              <p className="font-bold text-ink group-hover:text-forest-700">{h.name}</p>
              <p className="mt-1 text-[11px] text-ink-muted">{h.benefit}</p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[11px] text-ink-subtle">
        Rotating herbs by season exposes the body to different active compounds
        + prevents tolerance to any single one. Traditional eating principles
        meet modern published evidence.
      </p>
    </section>
  );
}
