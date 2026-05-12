import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Calendar, ShoppingCart, Mic, Camera, Wallet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { getFeaturedRecipes, getAllCollections } from '@/lib/data/recipes';
import { TESTIMONIALS } from '@/content/testimonials';
import { CUISINES, DIETS, SITE } from '@/lib/constants';
import { QuickFilters } from '@/components/home/QuickFilters';
import { RecipeOfTheDay } from '@/components/home/RecipeOfTheDay';
import { getAllRecipes } from '@/lib/data/recipes';

export default async function HomePage() {
  const [featured, collections, all] = await Promise.all([
    getFeaturedRecipes(8),
    getAllCollections(),
    getAllRecipes(),
  ]);

  // Pick a recipe-of-the-day deterministically based on UTC day-of-year so all
  // visitors on a given day see the same pick. Avoids hydration mismatch.
  const today = new Date();
  const dayIdx =
    Math.floor((today.getTime() - Date.UTC(today.getUTCFullYear(), 0, 0)) / 86400000) % Math.max(1, all.length);
  const recipeOfDay = all[dayIdx] ?? all[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-cream" aria-hidden />
        <div className="container relative grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1.5 h-3 w-3" aria-hidden /> Free forever. no paywall
            </Badge>
            <h1 className="text-balance font-serif text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
              The AI cooking coach that turns <span className="text-terracotta-400">what you have</span> into{' '}
              <span className="text-forest-500">what you crave.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg text-ink-muted">
              Calories, costs, and step-by-step instructions on every recipe. AI meal plans built around your budget. Pantry-aware suggestions for tonight. Voice-guided cook mode for when your hands are covered in flour.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/recipes">Browse 1000+ recipes</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pantry-match">What&apos;s in my fridge?</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-ink-muted">
              Trusted by home cooks in 30+ countries. No ads in the way of the recipe.
            </p>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-md rounded-3xl bg-white p-6 shadow-xl">
              <div className="absolute inset-0 -z-10 -rotate-2 rounded-3xl bg-terracotta-100" aria-hidden />
              <Image
                src="/logo.png"
                alt={SITE.name}
                width={400}
                height={400}
                className="h-full w-full object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="absolute -bottom-4 -left-4 max-w-[200px] rounded-2xl bg-white p-4 shadow-lg">
              <p className="text-xs font-medium text-forest-500">$2.20 / serving</p>
              <p className="font-serif text-sm text-ink">Chickpea Coconut Curry</p>
              <p className="text-xs text-ink-muted">35 min · vegan · 410 kcal</p>
            </div>
            <div className="absolute -right-2 -top-2 max-w-[200px] rounded-2xl bg-white p-4 shadow-lg">
              <p className="text-xs font-medium text-terracotta-500">AI meal plan</p>
              <p className="font-serif text-sm text-ink">5 dinners under $25</p>
              <p className="text-xs text-ink-muted">tailored to your pantry</p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators — each card is now a full link to the feature it
          describes. User flow: read pitch → click straight to the tool. */}
      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Sparkles, title: 'AI Meal Planner', body: 'Tell us your budget, diet, and schedule. Get a full week of meals + grocery list.', href: '/meal-planner', cta: 'Plan my week' },
            { icon: Camera, title: 'Pantry Photo Scan', body: 'Snap your fridge. We identify ingredients and suggest recipes you can make right now.', href: '/pantry-match', cta: 'Scan my pantry' },
            { icon: Calendar, title: 'Cost + Calories on every recipe', body: 'No more guessing. Every recipe shows per-serving cost and full nutrition.', href: '/recipes', cta: 'Browse recipes' },
            { icon: Mic, title: 'Voice Cook Mode', body: '"Next." "Repeat." "Set timer 8 minutes." Hands-free cooking from start to finish.', href: '/recipes', cta: 'Pick a recipe to cook' },
            { icon: ShoppingCart, title: 'Smart Grocery Lists', body: 'Combine multiple recipes into one shopping list. Export to your favorite store.', href: '/meal-planner', cta: 'Build my list' },
            { icon: Wallet, title: '100% Free. No paywall.', body: 'Every feature, free. AdSense supports the lights. You get cooking.', href: '/recipes', cta: 'Start cooking' },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group flex flex-col rounded-2xl border border-ink/5 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-terracotta-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-100">
                <feature.icon className="h-5 w-5 text-terracotta-500" aria-hidden />
              </div>
              <h3 className="mt-4 font-serif text-lg">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{feature.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-terracotta-500 transition-transform group-hover:translate-x-0.5">
                {feature.cta} <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-terracotta-500">Fresh from the kitchen</p>
            <h2 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">Tested recipes worth your time</h2>
          </div>
          <Link href="/recipes" className="hidden items-center gap-1 text-sm font-medium text-terracotta-500 hover:text-terracotta-600 sm:inline-flex">
            All recipes <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((recipe, i) => (
            <RecipeCard key={recipe.slug} recipe={recipe} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* Cuisines */}
      <section className="bg-cream-200/40 py-16">
        <div className="container">
          <h2 className="mb-8 font-serif text-3xl text-ink sm:text-4xl">Explore by cuisine</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CUISINES.slice(0, 12).map((c) => (
              <Link
                key={c.slug}
                href={`/cuisine/${c.slug}`}
                className="group flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md focus-ring"
              >
                <span className="text-2xl" aria-hidden>{c.emoji}</span>
                <span className="font-medium text-ink group-hover:text-terracotta-500">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Filters + Recipe of the Day — strategy doc requires both
          surfaced on the homepage to capture broad-intent search traffic and
          give returning visitors a fresh anchor every day. */}
      <section className="container py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
          <QuickFilters />
          {recipeOfDay ? <RecipeOfTheDay recipe={recipeOfDay} /> : null}
        </div>
      </section>

      {/* Herbal Cooking Hub CTA — surfaces the food-as-medicine layer
          prominently for first-time visitors who would otherwise miss it. */}
      <section className="container py-12">
        <Link
          href="/herbal-cooking"
          className="group block rounded-3xl bg-gradient-to-br from-forest-100 via-cream-50 to-terracotta-50 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-forest-700">
                🌿 New · Herbal Cooking Hub
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-ink group-hover:text-forest-700 sm:text-4xl">
                Cook your way to better health
              </h2>
              <p className="mt-3 max-w-2xl text-base text-ink-muted">
                Match herbs to your aches, energy dips, sleep struggles, or
                cold-season prep. Five demo recipes, daily-intake guidance, and
                drug-safety checks — all free, all explained in plain English.
              </p>
            </div>
            <span className="inline-flex shrink-0 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm group-hover:bg-forest-700">
              Explore the hub →
            </span>
          </div>
        </Link>
      </section>

      {/* Collections */}
      <section className="container py-16">
        <h2 className="mb-8 font-serif text-3xl text-ink sm:text-4xl">Hand-picked collections</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {collections.slice(0, 6).map((col) => {
            const thumbs = col.recipes.filter((r) => r.heroImage).slice(0, 4);
            return (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-ring"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-cream-200">
                  {thumbs.length === 0 ? (
                    <div className="h-full w-full bg-gradient-to-br from-forest-100 via-cream-200 to-terracotta-100" aria-hidden />
                  ) : thumbs.length === 1 ? (
                    <Image
                      src={thumbs[0]!.heroImage!}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 400px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager" />
                  ) : thumbs.length === 2 ? (
                    <div className="grid h-full w-full grid-cols-2 gap-0.5">
                      {thumbs.map((r) => (
                        <div key={r.slug} className="relative h-full w-full overflow-hidden">
                          <Image
                            src={r.heroImage!}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 200px, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="eager" />
                        </div>
                      ))}
                    </div>
                  ) : thumbs.length === 3 ? (
                    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
                      <div className="relative row-span-2 h-full w-full overflow-hidden">
                        <Image src={thumbs[0]!.heroImage!} alt="" fill sizes="(min-width: 1024px) 200px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="eager" />
                      </div>
                      <div className="relative h-full w-full overflow-hidden">
                        <Image src={thumbs[1]!.heroImage!} alt="" fill sizes="(min-width: 1024px) 200px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="eager" />
                      </div>
                      <div className="relative h-full w-full overflow-hidden">
                        <Image src={thumbs[2]!.heroImage!} alt="" fill sizes="(min-width: 1024px) 200px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="eager" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
                      {thumbs.map((r) => (
                        <div key={r.slug} className="relative h-full w-full overflow-hidden">
                          <Image
                            src={r.heroImage!}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 200px, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="eager" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-forest-500">{col.recipes.length} recipes</p>
                  <h3 className="font-serif text-xl text-ink group-hover:text-terracotta-500">{col.title}</h3>
                  <p className="text-sm text-ink-muted">{col.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Diets */}
      <section className="bg-cream-200/40 py-16">
        <div className="container">
          <h2 className="mb-8 font-serif text-3xl text-ink sm:text-4xl">Recipes for every diet</h2>
          <div className="flex flex-wrap gap-2">
            {DIETS.map((d) => (
              <Link
                key={d.slug}
                href={`/diet/${d.slug}`}
                className="rounded-full border border-ink/10 bg-white px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-terracotta-400 hover:text-terracotta-500 focus-ring"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-16">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-terracotta-500">Early users speak</p>
          <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Real cooks, real kitchens</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
            Voices from our beta testers across 12 countries. Names changed; experiences not.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.slice(0, 9).map((t) => (
            <figure key={t.name} className="rounded-2xl bg-white p-6 shadow-sm">
              <blockquote className="text-sm leading-relaxed text-ink">&ldquo;{t.body}&rdquo;</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: t.avatarColor }}
                  aria-hidden
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-ink">{t.name}</p>
                  <p className="text-xs text-ink-muted">{t.role} · {t.location}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest-500 py-16 text-white">
        <div className="container text-center">
          <h2 className="font-serif text-3xl sm:text-4xl">Stop saving recipes you&apos;ll never cook.</h2>
          <p className="mx-auto mt-3 max-w-xl text-cream-200">
            Build a week of meals in 30 seconds. Free, forever, no signup wall in your way.
          </p>
          <Button size="lg" variant="default" asChild className="mt-8 bg-terracotta-400 hover:bg-terracotta-500">
            <Link href="/meal-planner">Plan my week. it&apos;s free</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
