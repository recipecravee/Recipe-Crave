import type { Metadata } from 'next';
import Link from 'next/link';
import { TemperatureAdjuster } from './TemperatureAdjuster';

export const metadata: Metadata = {
  title: 'Oven Temperature Adjuster — °F, °C, Gas Mark, Air Fryer',
  description:
    'Convert oven temperatures across Fahrenheit, Celsius, UK gas marks, and air fryer equivalents. Auto-adjusts for fan-forced (convection) ovens. Free, no signup.',
  alternates: { canonical: '/calculators/temperature-adjuster' },
  keywords: [
    'oven temperature converter',
    'celsius to fahrenheit oven',
    'gas mark to celsius',
    'air fryer temperature',
    'convection oven conversion',
    'fan forced oven temp',
  ],
};

export default function TemperatureAdjusterPage() {
  return (
    <div className="container py-10 lg:py-14">
      <header className="mb-6">
        <Link href="/calculators" className="text-sm text-terracotta-500 hover:text-terracotta-600">
          ← All calculators
        </Link>
      </header>

      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-terracotta-500">
          Oven converter
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">Temperature Adjuster</h1>
        <p className="mt-3 text-lg text-ink-muted">
          Convert oven temperatures between Fahrenheit, Celsius, UK gas marks, and air fryer
          equivalents. Toggle fan-forced (convection) to auto-drop the temp by 20°C / 25°F. Useful
          when a recipe was written for one country&apos;s oven but you have another.
        </p>
      </div>

      <TemperatureAdjuster />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl">How fan-forced (convection) adjusts</h2>
        <p className="mt-3 text-ink-muted">
          Fan-forced ovens circulate hot air. Food cooks faster and browns more evenly than in a
          conventional oven set to the same temperature. The standard rule: drop the temperature
          by <strong>20°C (about 25°F)</strong> when using fan-forced. So a 180°C conventional
          recipe runs at 160°C fan-forced.
        </p>
        <p className="mt-3 text-ink-muted">
          Air fryers are essentially small convection ovens. Most recipes adapted from oven to air
          fryer follow the same rule: <strong>drop the temperature by 25°F and the time by 20–25%</strong>.
          Use the air fryer column in the result for a starting point, then check 5 minutes early.
        </p>
        <div className="mt-6 rounded-xl bg-cream-100 p-4">
          <p className="text-sm font-semibold text-ink">Note on gas marks</p>
          <p className="mt-1 text-sm text-ink-muted">
            UK gas marks are integers from 1 to 9 (plus quarter and half settings). Each step is
            roughly 25°F. They&apos;re common in British and Irish cookbooks. The conversions below
            use the standard Mary Berry / BBC Good Food reference.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-4 font-serif text-2xl">Common oven temperature table</h2>
        <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-ink">Description</th>
                <th className="px-4 py-2 text-right font-semibold text-ink">°F</th>
                <th className="px-4 py-2 text-right font-semibold text-ink">°C</th>
                <th className="px-4 py-2 text-right font-semibold text-ink">Gas Mark</th>
                <th className="px-4 py-2 text-right font-semibold text-ink">Fan °C</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              <tr><td className="px-4 py-2">Very cool</td><td className="px-4 py-2 text-right">225</td><td className="px-4 py-2 text-right">110</td><td className="px-4 py-2 text-right">¼</td><td className="px-4 py-2 text-right">90</td></tr>
              <tr><td className="px-4 py-2">Cool</td><td className="px-4 py-2 text-right">275</td><td className="px-4 py-2 text-right">140</td><td className="px-4 py-2 text-right">1</td><td className="px-4 py-2 text-right">120</td></tr>
              <tr><td className="px-4 py-2">Warm</td><td className="px-4 py-2 text-right">300</td><td className="px-4 py-2 text-right">150</td><td className="px-4 py-2 text-right">2</td><td className="px-4 py-2 text-right">130</td></tr>
              <tr><td className="px-4 py-2">Moderately slow</td><td className="px-4 py-2 text-right">325</td><td className="px-4 py-2 text-right">165</td><td className="px-4 py-2 text-right">3</td><td className="px-4 py-2 text-right">145</td></tr>
              <tr><td className="px-4 py-2">Moderate</td><td className="px-4 py-2 text-right">350</td><td className="px-4 py-2 text-right">180</td><td className="px-4 py-2 text-right">4</td><td className="px-4 py-2 text-right">160</td></tr>
              <tr><td className="px-4 py-2">Moderately hot</td><td className="px-4 py-2 text-right">375</td><td className="px-4 py-2 text-right">190</td><td className="px-4 py-2 text-right">5</td><td className="px-4 py-2 text-right">170</td></tr>
              <tr><td className="px-4 py-2">Hot</td><td className="px-4 py-2 text-right">400</td><td className="px-4 py-2 text-right">200</td><td className="px-4 py-2 text-right">6</td><td className="px-4 py-2 text-right">180</td></tr>
              <tr><td className="px-4 py-2">Very hot</td><td className="px-4 py-2 text-right">425</td><td className="px-4 py-2 text-right">220</td><td className="px-4 py-2 text-right">7</td><td className="px-4 py-2 text-right">200</td></tr>
              <tr><td className="px-4 py-2">Hotter</td><td className="px-4 py-2 text-right">450</td><td className="px-4 py-2 text-right">230</td><td className="px-4 py-2 text-right">8</td><td className="px-4 py-2 text-right">210</td></tr>
              <tr><td className="px-4 py-2">Hottest</td><td className="px-4 py-2 text-right">475</td><td className="px-4 py-2 text-right">245</td><td className="px-4 py-2 text-right">9</td><td className="px-4 py-2 text-right">225</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-subtle">
          Sources: BBC Good Food, Mary Berry&apos;s reference table, USDA. Values rounded to
          standard oven dial increments.
        </p>
      </section>
    </div>
  );
}
