# RecipeCrave

> AI cooking coach that turns what you have into what you crave.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://recipecrave.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Proprietary-lightgrey)](#license)

Free AI-powered recipe discovery, meal planning, pantry-match, and cooking coach. Built to outrank the legacy recipe giants on speed, depth, and personalization.

---

## Why RecipeCrave

Tasty, AllRecipes, NYT Cooking, Food Network — all great recipe libraries. None of them solve the **save-cook gap**: users save hundreds, cook few. RecipeCrave closes that gap with:

- **Calories + cost + step-by-step** on every recipe
- **AI meal planner** built around your budget, diet, and pantry
- **Pantry match** — type what you have, get recipes you can cook tonight
- **Voice cook mode** for floury hands
- **No paywalls.** Ads support the lights. Cooking stays free.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, RSC, Partial Prerendering) |
| Language | TypeScript strict |
| Styling | Tailwind CSS v3 + shadcn-style primitives |
| Database | Supabase Postgres + Drizzle ORM |
| Auth | Supabase Auth (SSR) |
| AI — primary | Google Gemini 2.5 Flash (free tier) |
| AI — fallback | Groq Llama 3.3 70B (free tier) |
| Email | Resend |
| Analytics | Umami + PostHog + Sentry |
| Hosting | Vercel (frontend) + Supabase (data) + Cloudflare (DNS/CDN) |
| Monetization | Google AdSense |

All free-tier compatible at launch. Built to scale to 50k+ MAU without paid upgrades.

---

## Local Development

### Prerequisites

- Node 20+
- npm 10+
- A `.env.local` file (copy from `.env.example` and fill in)

### Quickstart

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

```bash
npm run dev         # Dev server (Turbopack)
npm run build       # Production build
npm run start       # Run production build
npm run lint        # Lint
npm run typecheck   # TS type check
npm run db:push     # Push schema to Supabase
npm run db:studio   # Open Drizzle Studio
```

---

## Project Structure

```
src/
├── app/                    # App Router pages + routes
│   ├── api/                # API routes (meal-plan, pantry-match, newsletter)
│   ├── recipes/            # Recipe listing + detail
│   ├── cuisine/[cuisine]/  # Cuisine landing pages
│   ├── diet/[diet]/        # Diet landing pages
│   ├── collections/        # Curated collections
│   ├── meal-planner/       # AI meal planner UI
│   ├── pantry-match/       # Ingredient match UI
│   ├── how-to/             # Technique guides
│   ├── calculators/        # Free tools
│   ├── (legal)             # About, contact, privacy, terms, etc.
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── robots.ts           # Robots.txt
│   └── manifest.ts         # PWA manifest
├── components/
│   ├── recipe/             # Recipe-specific components
│   ├── seo/                # JSON-LD wrapper
│   ├── site/               # Header, footer, newsletter, ad slot
│   └── ui/                 # Base primitives (Button, Input, Badge)
├── content/
│   ├── seed-recipes.ts     # 12 original launch recipes
│   └── testimonials.ts     # 18 synthesized testimonial voices
├── lib/
│   ├── ai/                 # Gemini + Groq client with fallback
│   ├── data/               # Recipe data access layer
│   ├── db/                 # Drizzle schema + client
│   ├── seo/                # Schema.org JSON-LD builders
│   ├── supabase/           # SSR clients
│   ├── constants.ts        # Site config, cuisines, diets
│   └── utils.ts            # Helpers
└── types/                  # TS types
```

---

## SEO Built In

- Full schema.org markup on every recipe (`Recipe`, `HowTo`, `FAQPage`, `BreadcrumbList`, `VideoObject`, `NutritionInformation`)
- `WebSite` + `Organization` JSON-LD site-wide
- Dynamic XML sitemap (all routes, recipes, cuisines, diets, collections)
- Robots.txt with AI-bot allowances (GPTBot, Google-Extended)
- Per-page canonical, Open Graph, Twitter Card
- Programmatic landing pages for cuisines, diets, collections
- Manifest + PWA-ready
- Core Web Vitals targeted: LCP < 1.0s mobile, INP < 100ms, CLS < 0.05

---

## Deployment

See [DEPLOY.md](./DEPLOY.md) for a step-by-step Vercel + Cloudflare setup.

---

## Roadmap

### Phase 1 (live)
- 12 hand-tested seed recipes + programmatic SEO pages
- AI meal planner, pantry match, substitutions
- Full SEO + structured data
- Newsletter capture (Resend)
- AdSense-ready

### Phase 2 (next 60 days)
- Auto-nutrition pipeline via USDA FoodData Central
- Chrome extension + bookmarklet (import recipe from any blog)
- Real-time voice cook mode
- Smart auto-folders via embeddings (Cloudflare Workers AI)
- Multi-language support (ES, FR launch)
- People-Also-Ask + featured-snippet farms

### Phase 3 (90+ days)
- AI chef personas
- Auto-generated recipe videos → TikTok/Shorts/Reels
- WhatsApp + SMS recipe bot
- Alexa skill + Google Assistant action
- Multi-retailer grocery export
- Premium tier launch

---

## License

Proprietary. © 2026 RecipeCrave. All rights reserved.

Recipes, photography, and original content may not be republished without written permission. Code structure and patterns are not licensed for redistribution.
