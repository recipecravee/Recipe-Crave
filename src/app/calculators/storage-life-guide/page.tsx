import type { Metadata } from 'next';
import Link from 'next/link';
import { StorageLifeGuide } from './StorageLifeGuide';

export const metadata: Metadata = {
  title: 'Food Storage Life Guide — How Long Does It Last?',
  description:
    'Searchable food storage database. How long does opened mayo last? Do eggs go bad? Get pantry, fridge, and freezer storage times, spoilage signs, and reheating safety for 75+ common foods. Free, no signup.',
  alternates: { canonical: '/calculators/storage-life-guide' },
  keywords: [
    'food storage life',
    'how long does food last',
    'how long does mayo last',
    'how long do eggs last',
    'food expiration guide',
    'fridge storage times',
    'freezer storage times',
    'food spoilage signs',
    'USDA FoodKeeper',
  ],
};

export default function StorageLifeGuidePage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-6">
        <Link href="/calculators" className="text-sm text-terracotta-500 hover:text-terracotta-600">
          ← All calculators
        </Link>
      </header>

      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">
          Storage guide
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">Food Storage Life Guide</h1>
        <p className="mt-3 text-lg text-ink-muted">
          Searchable database for &quot;how long is this safe to eat?&quot; questions. Get pantry,
          fridge, and freezer life for 75+ common foods, plus spoilage signs and reheating safety.
          Built from USDA FoodKeeper and FDA cold-chain guidance.
        </p>
      </div>

      <StorageLifeGuide />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl">How to read these times</h2>
        <p className="mt-3 text-ink-muted">
          Times reflect <strong>best quality</strong> — peak flavor and texture. Food past these
          windows is often still safe to eat if there are no spoilage signs, but quality drops.
          Always use the spoilage-sign checklist as the final word, not the calendar.
        </p>
        <p className="mt-3 text-ink-muted">
          <strong>Freezer times are quality, not safety.</strong> Properly frozen food at 0°F (−18°C)
          stays safe indefinitely. After the listed window, texture and flavor degrade but the food
          will not make you sick (assuming it was fresh when frozen and never thawed in between).
        </p>
        <p className="mt-3 text-ink-muted">
          <strong>The two-hour rule.</strong> Perishable foods left at room temperature for more
          than two hours (one hour if above 90°F / 32°C) should be discarded. Bacteria multiply
          fastest in the &quot;danger zone&quot; of 40°F to 140°F (4°C to 60°C).
        </p>
        <div className="mt-6 rounded-xl bg-cream-100 p-4">
          <p className="text-sm font-semibold text-ink">When in doubt, throw it out</p>
          <p className="mt-1 text-sm text-ink-muted">
            Tasting a small amount to &quot;check&quot; is not safe — many foodborne pathogens give
            no warning flavor or smell. Cost of food &lt; cost of food poisoning.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">Storage zones explained</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Pantry</p>
            <p className="mt-2 text-sm text-ink-muted">
              50–70°F (10–21°C). Dark, dry, ventilated. Most dry goods, canned foods, unopened
              condiments, and a few hardy vegetables.
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Fridge</p>
            <p className="mt-2 text-sm text-ink-muted">
              At or below 40°F (4°C). Coldest at the back, warmest in the door. Raw meat on the
              bottom shelf to prevent drips.
            </p>
          </div>
          <div className="rounded-xl bg-sky-50 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-700">Freezer</p>
            <p className="mt-2 text-sm text-ink-muted">
              At or below 0°F (−18°C). Always thaw in fridge, cold water, or microwave — never on
              the counter.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-forest-50 p-6 ring-1 ring-forest-200">
        <h2 className="font-serif text-2xl text-forest-700">Sources</h2>
        <p className="mt-3 text-sm text-ink-muted">
          Times sourced from the USDA FoodKeeper App (US Department of Agriculture, Food Safety and
          Inspection Service), the FDA Refrigerator &amp; Freezer Storage Chart, and FoodSafety.gov
          guidance. Generic times are conservative — your specific brand may show different
          best-by guidance on the package, which takes precedence.
        </p>
      </section>
    </div>
  );
}
