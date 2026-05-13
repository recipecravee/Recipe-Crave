import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Activity, BarChart3, Mail, Globe, Github, Database, Search, Cookie } from 'lucide-react';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin/auth';
import { getAllRecipes, getAllCollections } from '@/lib/data/recipes';
import { HERBS } from '@/content/herbs';
import { BLOG_POSTS } from '@/content/blog-posts';
import { HOW_TO_GUIDES } from '@/content/how-to-guides';
import { MEAL_PLANS } from '@/content/meal-plans';
import { SITE, CUISINES, DIETS } from '@/lib/constants';
import { AdminLogoutButton } from './AdminLogoutButton';

export const dynamic = 'force-dynamic';
// Re-render every 30s so live KPI numbers stay current without a refresh.
export const revalidate = 30;

export default async function AdminDashboardPage() {
  // Gate the page server-side. Public visitors get bounced to the login.
  const c = await cookies();
  const session = verifySession(c.get(ADMIN_COOKIE_NAME)?.value);
  if (!session.ok) redirect('/admin/login');

  const [recipes, collections] = await Promise.all([getAllRecipes(), getAllCollections()]);
  const featured = recipes.filter((r) => r.viewCount > 0 || r.saveCount > 0).length;
  const totalViews = recipes.reduce((acc, r) => acc + (r.viewCount ?? 0), 0);
  const totalSaves = recipes.reduce((acc, r) => acc + (r.saveCount ?? 0), 0);
  const totalCooks = recipes.reduce((acc, r) => acc + (r.cookCount ?? 0), 0);
  const avgRating =
    recipes.length === 0
      ? 0
      : recipes.reduce((acc, r) => acc + (r.avgRating ?? 0), 0) / recipes.length;
  const commit = (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 7) || 'local';
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? 'main';
  const region = process.env.VERCEL_REGION ?? 'local';
  const now = new Date();

  return (
    <div className="container py-10 lg:py-12">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
            Owner area · live
          </p>
          <h1 className="mt-1 font-serif text-4xl text-ink">RecipeCrave Admin Dashboard</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Signed in as <strong className="text-ink">{session.username}</strong> · {region} · commit {commit} on {branch} · auto-refresh 30s · {now.toUTCString()}
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {/* KPI tiles — internal numbers from the recipe data layer */}
      <h2 className="mb-4 font-serif text-2xl">Site KPIs</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Kpi label="Published recipes" value={recipes.length.toLocaleString()} />
        <Kpi label="Collections" value={collections.length.toLocaleString()} />
        <Kpi label="Herbs catalogued" value={HERBS.length.toLocaleString()} />
        <Kpi label="Blog posts" value={BLOG_POSTS.length.toLocaleString()} />
        <Kpi label="How-to guides" value={HOW_TO_GUIDES.length.toLocaleString()} />
        <Kpi label="Meal plans" value={MEAL_PLANS.length.toLocaleString()} />
        <Kpi label="Cuisines" value={CUISINES.length.toLocaleString()} />
        <Kpi label="Diets" value={DIETS.length.toLocaleString()} />
      </div>

      {/* Engagement counters (in-app) */}
      <h2 className="mb-4 mt-10 font-serif text-2xl">Engagement (in-app counters)</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Total recipe views" value={totalViews.toLocaleString()} accent />
        <Kpi label="Total saves" value={totalSaves.toLocaleString()} accent />
        <Kpi label="Total cooks logged" value={totalCooks.toLocaleString()} accent />
        <Kpi label="Average rating" value={avgRating.toFixed(2)} accent />
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        Engagement counts are in-app today (view/save/cook events stored on the recipe rows). For
        true visitor-level metrics use the GA4 Realtime panel linked below.
      </p>

      {/* Live external dashboards */}
      <h2 className="mb-4 mt-12 font-serif text-2xl">Live external dashboards</h2>
      <p className="text-sm text-ink-muted">
        These open in new tabs. Each is the canonical source of truth for the data it covers.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashLink
          icon={Activity}
          label="GA4 Realtime"
          desc="Visitors right now, top pages, geography. Property: RecipeCrave Production."
          href="https://analytics.google.com/analytics/web/#/p0/realtime/overview"
          accent="terracotta"
        />
        <DashLink
          icon={Search}
          label="Search Console"
          desc="Queries, clicks, impressions, indexing status, sitemap health."
          href="https://search.google.com/search-console?resource_id=https%3A%2F%2Frecipecrave.com%2F"
          accent="forest"
        />
        <DashLink
          icon={BarChart3}
          label="Vercel Analytics"
          desc="Page load speed, Core Web Vitals, error rate, bandwidth."
          href="https://vercel.com/bracknell-s-projects/recipe-crave/analytics"
          accent="amber"
        />
        <DashLink
          icon={Mail}
          label="Resend Logs"
          desc="Email delivery, bounce rate, open/click events. Daily digest at 09:00 UTC."
          href="https://resend.com/emails"
          accent="terracotta"
        />
        <DashLink
          icon={Globe}
          label="Cloudflare"
          desc="DNS records, SSL/TLS, AI crawler control, security insights."
          href={`https://dash.cloudflare.com/?to=/:account/${SITE.url.replace(/^https?:\/\//, '')}`}
          accent="forest"
        />
        <DashLink
          icon={Github}
          label="GitHub repo"
          desc="Code, commits, branch protection, deployment history."
          href="https://github.com/recipecravee/Recipe-Crave"
          accent="amber"
        />
        <DashLink
          icon={Database}
          label="Vercel Deployments"
          desc="Build status, redeploy triggers, env-var management."
          href="https://vercel.com/bracknell-s-projects/recipe-crave/deployments"
          accent="terracotta"
        />
        <DashLink
          icon={Cookie}
          label="Privacy / cookies"
          desc="Public-facing privacy policy + CCPA opt-out details."
          href="/privacy"
          accent="forest"
          internal
        />
        <DashLink
          icon={Database}
          label="Variation moderation"
          desc="Review user-submitted recipe variations: approve, reject, or flag as spam."
          href="/admin/variations"
          accent="terracotta"
          internal
        />
      </div>

      {/* Top performing recipes by view */}
      <h2 className="mb-4 mt-12 font-serif text-2xl">Top 10 recipes by view count</h2>
      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left text-xs uppercase tracking-wider text-ink-subtle">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Cuisine</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Saves</th>
              <th className="px-4 py-3">Cooks</th>
              <th className="px-4 py-3">Rating</th>
            </tr>
          </thead>
          <tbody>
            {[...recipes]
              .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
              .slice(0, 10)
              .map((r, i) => (
                <tr key={r.slug} className="border-t border-ink/5">
                  <td className="px-4 py-3 font-bold text-ink-muted">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/recipes/${r.slug}`} className="font-semibold text-ink hover:text-terracotta-500">
                      {r.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-muted">{r.cuisine.replace(/-/g, ' ')}</td>
                  <td className="px-4 py-3">{(r.viewCount ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3">{(r.saveCount ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3">{(r.cookCount ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3">{(r.avgRating ?? 0).toFixed(2)} ({r.ratingCount ?? 0})</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <p className="mt-10 text-xs text-ink-subtle">
        Dashboard auto-revalidates every 30 seconds. {featured} recipes currently have any engagement. Site sourced from <code>{SITE.url}</code>.
      </p>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${accent ? 'border-terracotta-200 bg-terracotta-50/50' : 'border-ink/10 bg-white'}`}>
      <p className="text-xs font-bold uppercase tracking-widest text-ink-subtle">{label}</p>
      <p className="mt-2 font-serif text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

type Accent = 'terracotta' | 'forest' | 'amber';

function DashLink({
  icon: Icon,
  label,
  desc,
  href,
  accent,
  internal,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  label: string;
  desc: string;
  href: string;
  accent: Accent;
  internal?: boolean;
}) {
  const styles: Record<Accent, string> = {
    terracotta: 'border-terracotta-200 hover:border-terracotta-500',
    forest: 'border-forest-200 hover:border-forest-500',
    amber: 'border-amber-200 hover:border-amber-500',
  };
  const icons: Record<Accent, string> = {
    terracotta: 'text-terracotta-500',
    forest: 'text-forest-700',
    amber: 'text-amber-700',
  };
  const props = internal
    ? { href }
    : { href, target: '_blank' as const, rel: 'noopener noreferrer' };
  const Tag = internal ? Link : 'a';
  return (
    <Tag
      {...props}
      className={`group flex flex-col rounded-2xl border-2 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${styles[accent]}`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${icons[accent]}`} aria-hidden />
        <span className="font-serif text-lg font-bold text-ink">{label}</span>
        {!internal ? <ExternalLink className="ml-auto h-4 w-4 text-ink-muted" aria-hidden /> : null}
      </div>
      <p className="mt-2 text-sm text-ink-muted">{desc}</p>
    </Tag>
  );
}
