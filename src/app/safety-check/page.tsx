import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { SafetyCheckClient } from './SafetyCheckClient';

export const metadata: Metadata = {
  title: 'Therapeutic Herb Safety Checker — Drug Interactions & Contraindications',
  description:
    'Free safety checker. Pick your meds and conditions to flag interactions with 30+ therapeutic herbs. Sourced from NIH, MSK, and WHO databases.',
  alternates: { canonical: '/safety-check' },
  keywords: [
    'herb drug interaction checker',
    'turmeric warfarin interaction',
    'cinnamon metformin interaction',
    'ashwagandha thyroid medication',
    'herbal supplement safety',
    'medication contraindication checker',
  ],
};

export default function SafetyCheckPage() {
  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/herbs" className="hover:text-ink">Herbs</Link></li>
          <li aria-hidden>›</li>
          <li className="text-ink">Safety check</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden /> Drug + condition interactions
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
          Therapeutic herb safety checker
        </h1>
        <p className="mt-4 text-lg text-ink-muted">
          Some herbs in our recipes are food at culinary doses and medicine
          at therapeutic doses. Select the medications you take and the
          conditions you have — we&apos;ll flag known interactions across all
          30+ herbs in the catalog. Every flag includes source citations
          and a plain-English explanation of why the interaction matters.
        </p>
      </header>

      <SafetyCheckClient />

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200">
        <h2 className="font-serif text-xl text-amber-900">Important caveats</h2>
        <ul className="mt-3 space-y-2 text-sm text-amber-900/90">
          <li><strong>This is educational, not medical advice.</strong> Use the flags to prompt a conversation with your prescriber — not as a green light or stop sign.</li>
          <li><strong>Culinary doses are usually fine.</strong> Most flags apply at therapeutic supplementation doses (capsule extracts, concentrated tinctures). A pinch of turmeric on roasted vegetables is not the same as 2g curcumin extract.</li>
          <li><strong>Pre-surgery</strong> — pause all herbal supplements 2 weeks before any scheduled surgery. Tell your surgeon about every supplement you take.</li>
          <li><strong>Severity grades</strong> — <span className="rounded bg-red-200 px-1 font-bold">severe</span> = avoid combination; <span className="rounded bg-amber-200 px-1 font-bold">caution</span> = monitor; <span className="rounded bg-cream-200 px-1 font-bold">mild</span> = usually fine at culinary doses.</li>
        </ul>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl">Sources</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-muted">
          <li>NIH National Center for Complementary and Integrative Health (NCCIH)</li>
          <li>Memorial Sloan Kettering &quot;About Herbs&quot; database</li>
          <li>WHO Monographs on Selected Medicinal Plants</li>
          <li>Drugs.com / Lexicomp interaction registries</li>
          <li>American College of Obstetricians and Gynecologists (ACOG) for pregnancy guidance</li>
        </ul>
      </section>
    </div>
  );
}
