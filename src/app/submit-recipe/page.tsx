import type { Metadata } from 'next';
import Link from 'next/link';
import { ChefHat, Camera, ListChecks, Sparkles } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { SubmitRecipeForm } from './SubmitRecipeForm';

export const metadata: Metadata = {
  title: 'Submit your recipe',
  description:
    'Share a recipe you love and get it featured. Our kitchen team reviews every submission. Full credit to you — byline and backlink.',
  alternates: { canonical: `${SITE.url}/submit-recipe` },
  openGraph: {
    title: 'Submit your recipe to RecipeCrave',
    description: 'Share a recipe you love and have it featured on RecipeCrave.',
    url: `${SITE.url}/submit-recipe`,
    images: [
      {
        url: `${SITE.url}/api/og?eyebrow=Submit&accent=amber&title=${encodeURIComponent('Submit your recipe to RecipeCrave')}&subtitle=${encodeURIComponent('Reviewed by our kitchen team. Full byline credit + backlink to you.')}`,
        width: 1200,
        height: 630,
        alt: 'Submit your recipe to RecipeCrave',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit your recipe to RecipeCrave',
    description: 'Share a recipe you love and have it featured on RecipeCrave.',
    images: [
      `${SITE.url}/api/og?eyebrow=Submit&accent=amber&title=${encodeURIComponent('Submit your recipe to RecipeCrave')}&subtitle=${encodeURIComponent('Reviewed by our kitchen team. Full byline credit + backlink to you.')}`,
    ],
  },
};

export const revalidate = 3600;

export default function SubmitRecipePage() {
  return (
    <article className="container py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-ink">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-ink">Submit your recipe</li>
        </ol>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-terracotta-500">
          Share your kitchen
        </p>
        <h1 className="mt-1 font-serif text-4xl text-ink sm:text-5xl">
          Submit your recipe
        </h1>
        <p className="mt-4 text-base text-ink-muted">
          Got a family classic, a clever weeknight shortcut, or the dish your friends
          keep asking you to make again? Send it in. Our kitchen team tests, photographs,
          and publishes selected submissions with full credit to you — byline, bio,
          and a link back to anywhere you want.
        </p>
      </header>

      {/* Form + live preview span full width. The form component handles
          its own two-column split (fields | preview) so the preview
          tracks the form as the user types. */}
      <div className="rounded-3xl border border-cream-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-2 font-serif text-2xl">Recipe details</h2>
        <p className="mb-6 text-sm text-ink-muted">
          All fields except photo URL are required. The card on the right updates as you
          type so you can see exactly how the published recipe will look.
        </p>
        <SubmitRecipeForm />
      </div>

      {/* Editorial guidance — full-width 4-column row below the form. */}
      <section className="mt-12">
        <h2 className="mb-6 font-serif text-2xl">Editorial guidelines</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SidebarCard
            icon={ChefHat}
            title="How submissions work"
            body="Every recipe is read by a human within 7 days. If it fits the site, we test it in our kitchen, shoot photos, and publish under your name with a backlink. If it does not fit, we send a kind reply telling you why."
          />
          <SidebarCard
            icon={ListChecks}
            title="What makes a strong submission"
            body="Specific, ratio-accurate measurements (not 'a pinch'). Honest cook times for the home stove. One or two tested substitutions. A short story about why this recipe matters to you — that is what readers remember."
          />
          <SidebarCard
            icon={Camera}
            title="Photos are optional"
            body="If you have a clean photo of the final dish, paste a URL. Our team can re-shoot if needed — submissions without photos are not penalized."
          />
          <SidebarCard
            icon={Sparkles}
            title="Editorial standards"
            body="No AI-generated recipes without testing. No copy-pasting from other sites. We credit every source and family member you cite."
          />
        </div>
      </section>
    </article>
  );
}

function SidebarCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-ink/5 bg-cream-50/60 p-5">
      <div className="mb-2 flex items-center gap-2 text-terracotta-500">
        <Icon className="h-5 w-5" aria-hidden />
        <h3 className="font-serif text-lg font-bold text-ink">{title}</h3>
      </div>
      <p className="text-sm text-ink-muted">{body}</p>
    </div>
  );
}
