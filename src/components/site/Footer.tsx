import Link from 'next/link';
import { Calculator, Sliders, Thermometer, Scale } from 'lucide-react';
import { SITE, CUISINES, DIETS } from '@/lib/constants';
import { NewsletterForm } from '@/components/site/NewsletterForm';

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream-200/40">
      <div className="container py-12 lg:py-16">
        {/* Prominent Kitchen Tools strip */}
        <Link
          href="/calculators"
          className="group mb-12 flex flex-col gap-4 rounded-2xl border-2 border-forest-300 bg-gradient-to-r from-forest-50 via-forest-100 to-cream-100 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-forest-500 hover:shadow-md sm:flex-row sm:items-center sm:gap-6 sm:p-6"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 text-white shadow-sm transition-transform group-hover:scale-110">
            <Calculator className="h-7 w-7" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-forest-600">
              Free · No signup · 8 live tools
            </p>
            <p className="font-serif text-xl font-bold text-ink sm:text-2xl">
              Kitchen Tools &amp; Calculators
            </p>
            <p className="mt-0.5 text-sm text-ink-muted">
              Cups→grams · Oven temps · Real-time recipe scaler &amp; more.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-forest-700 shadow-sm">
              <Scale className="h-3.5 w-3.5" aria-hidden /> Units
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-forest-700 shadow-sm">
              <Thermometer className="h-3.5 w-3.5" aria-hidden /> Temp
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-forest-700 shadow-sm">
              <Sliders className="h-3.5 w-3.5" aria-hidden /> Scaler
            </span>
            <span className="hidden sm:inline-flex shrink-0 rounded-full bg-forest-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              Open →
            </span>
          </div>
        </Link>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl">
              <span className="text-ink">Recipe</span>
              <span className="text-terracotta-400">Crave</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm text-ink-muted">
              {SITE.tagline} Free for everyone — built to actually get you cooking, not just saving recipes.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-ink">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li><Link href="/recipes" className="hover:text-ink">All Recipes</Link></li>
              <li><Link href="/collections" className="hover:text-ink">Collections</Link></li>
              <li><Link href="/meal-planner" className="hover:text-ink">Meal Planner</Link></li>
              <li><Link href="/pantry-match" className="hover:text-ink">Pantry Match</Link></li>
              <li><Link href="/how-to" className="hover:text-ink">How-To Guides</Link></li>
              <li><Link href="/calculators" className="hover:text-ink">Free Tools</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-ink">Cuisines</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              {CUISINES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/cuisine/${c.slug}`} className="hover:text-ink">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-ink">Dietary</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              {DIETS.slice(0, 6).map((d) => (
                <li key={d.slug}>
                  <Link href={`/diet/${d.slug}`} className="hover:text-ink">{d.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink/10 pt-6 text-xs text-ink-muted lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} {SITE.publisher}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-4">
            <li><Link href="/about" className="hover:text-ink">About</Link></li>
            <li><Link href="/contact" className="hover:text-ink">Contact</Link></li>
            <li><Link href="/editorial-policy" className="hover:text-ink">Editorial Policy</Link></li>
            <li><Link href="/nutrition-disclaimer" className="hover:text-ink">Nutrition Disclaimer</Link></li>
            <li><Link href="/privacy" className="hover:text-ink">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-ink">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
