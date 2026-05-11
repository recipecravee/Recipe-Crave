# RecipeCrave — Context Handoff for Next Claude

> Drop this in front of any new Claude session. Everything that happened on `recipecrave.com` is captured here.
> Last updated: 2026-05-11 — second pass by Claude Opus 4.7.

## ⚡ Latest session changes (top of file so you read these first)

1. **DNS finally fixed via Cloudflare dashboard** (Hostinger A + AAAA records purged, replaced with Vercel A=76.76.21.21 + CNAME www=cname.vercel-dns.com, both gray-cloud DNS only). Domain `recipecrave.com` should be live with green padlock now.

2. **About page rewritten** with user's exact copy + line breaks between sections. See `src/app/about/page.tsx`.

3. **Image bank rewritten** with REAL dish-relevant photos. Used Unsplash internal search API (`unsplash.com/napi/search/photos?query=X`) to fetch actual jollof rice / cucumber / plantain photos instead of random IDs. ~70 dishes verified. See `src/content/image-bank.ts`.

4. **+10 country recipes** added: Russian (Borscht, Beef Stroganoff), Canadian (Poutine), Indonesian (Nasi Goreng), German (Schnitzel), Turkish (Doner), Polish (Pierogi), Argentinian (Chimichurri Steak), Peruvian (Ceviche), Egyptian (Koshari), Australian (Pavlova). Total: 79 recipes, 32 cuisines.

5. **Mobile nav** redesigned with pill buttons + right-edge gradient fade hint so users see it scrolls.

6. **Copy humanized** — stripped em-dashes site-wide.

7. **Supabase reseeded**: 79 recipes + 13 collections live in DB.

8. **Vercel build green**: 249 static routes.

## ⚠️ If you (next Claude) get the "image doesn't match dish" complaint again

The fix is in `src/content/image-bank.ts`. The image IDs there came from real Unsplash search results — but Unsplash search is fuzzy and some matches may still be off (e.g., a jollof search could return a generic rice dish photo).

**To swap any image:**
```bash
curl -s "https://unsplash.com/napi/search/photos?query=DISH+NAME&per_page=5" | python -c "
import sys, json, re
d = json.load(sys.stdin)
for p in d.get('results', []):
    url = p.get('urls', {}).get('regular', '')
    if 'plus.unsplash.com' in url or 'premium_' in url: continue
    m = re.search(r'/photo-([a-z0-9-]+)\?', url)
    if m: print(m.group(1)); break
"
```
Replace the photo ID in `image-bank.ts` for the dish key.

---

---

## 🟢 Current State: LIVE

| What | Status | URL / Detail |
|------|--------|--------------|
| Code repo | ✅ Live | https://github.com/recipecravee/Recipe-Crave (branch: `main`) |
| Vercel deploy | ✅ Ready | https://recipe-crave.vercel.app |
| Custom domain `recipecrave.com` | ⏳ Added in Vercel, awaiting DNS records | Will resolve once Cloudflare DNS records added |
| Custom domain `www.recipecrave.com` | ⏳ Same as above | |
| Supabase project | ✅ Live | `kauqukwkqeybmtvvodep` region `aws-1-eu-north-1` |
| Supabase schema | ✅ 8 tables created | recipes, users, reviews, collections, user_saved_recipes, meal_plans, pantry_items, newsletter_subscribers |
| Supabase seeded | ✅ 68 recipes, 13 collections | |
| All env vars in Vercel | ✅ 18 set | Production + Preview |

**Latest commit:** `7a4f18f` (after this: env var paste in Vercel UI did a fresh prod deploy without new commit).

---

## 🎯 ONE thing left for the user

Add 2 DNS records in Cloudflare to point `recipecrave.com` at Vercel. **Vercel domain `recipecrave.com` is already added** — just needs DNS to resolve.

### DNS records to add in Cloudflare → DNS → Records

| Type  | Name | Value                                      | Proxy status         |
|-------|------|--------------------------------------------|----------------------|
| A     | @    | `76.76.21.21`                              | **DNS only (gray cloud)** |
| CNAME | www  | `cname.vercel-dns.com.`                    | **DNS only (gray cloud)** |

Optional (Vercel-recommended for apex):
| Type  | Name | Value                                          | Proxy                |
|-------|------|------------------------------------------------|----------------------|
| CNAME | @    | `0c1011e26eabdd00.vercel-dns-017.com.`         | DNS only (gray)      |

⚠️ **Cloud must be GRAY (DNS only), NOT orange.** Orange proxy breaks Vercel SSL.

Once added → Vercel auto-validates within 5 min → SSL provisions → `https://recipecrave.com` resolves.

---

## 📊 What was built (full picture)

### Stack
- **Framework:** Next.js 16.2.6 (App Router, RSC, Partial Prerendering)
- **Language:** TypeScript strict, zero `any`
- **Styling:** Tailwind CSS v3 + shadcn-style primitives
- **Database:** Supabase Postgres + Drizzle ORM
- **Auth:** Supabase Auth (SSR via @supabase/ssr)
- **AI primary:** Google Gemini 2.5 Flash
- **AI fallback:** Groq Llama 3.3 70B
- **Email:** Resend
- **Analytics:** Umami + PostHog + Sentry
- **Hosting:** Vercel Hobby tier (free)
- **DNS:** Cloudflare free tier
- **Domain registrar:** Hostinger (not used for hosting, just the domain)
- **Monetization:** Google AdSense slots reserved (apply after 1k visits/mo)

### Routes (217 total)
- Homepage `/` with hero, features, recipe grid, cuisine tiles, collections, diet pills, 18 testimonials
- `/recipes` listing with search + cuisine + diet + course filters
- `/recipes/[slug]` detail with full schema.org Recipe + FAQ + Breadcrumb JSON-LD
- `/recipes/[slug]/print` print-optimized version (noindex)
- `/cuisine/[cuisine]` — 22 cuisines: nigerian, ghanaian, jamaican, italian, mexican, indian, chinese, japanese, thai, mediterranean, american, french, middle-eastern, korean, vietnamese, caribbean, spanish, greek, south-african, ethiopian, brazilian, west-african
- `/diet/[diet]` — 14 diets: vegetarian, vegan, gluten-free, dairy-free, keto, paleo, low-carb, low-calorie, low-fat, low-sodium, high-protein, diabetic, halal, kosher
- `/collections` + `/collections/[slug]` — 13 collections
- `/categories` — directory index
- `/meal-planner` AI meal plan generator
- `/pantry-match` — ingredient → recipe match
- `/how-to` + `/calculators` placeholders
- `/login` + `/signup` (Supabase auth, email/password + Google OAuth)
- `/account` protected route (redirects to /login)
- `/auth/callback` OAuth handler
- 6 legal pages: about, contact, privacy, terms, editorial-policy, nutrition-disclaimer
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/icon`, `/apple-icon`, `/opengraph-image`, `/twitter-image`
- API: `/api/health`, `/api/ai/meal-plan`, `/api/ai/substitute`, `/api/pantry-match`, `/api/newsletter/subscribe`

### Recipe content
- **68 recipes** seeded across 22 cuisines (16 American, 10 Nigerian, 4 Middle Eastern, 3 each Italian/French/Spanish/Korean/Ghanaian/Jamaican/Chinese/Indian/Thai, plus 1-2 each of Brazilian/Vietnamese/Mediterranean/Japanese/Greek/Filipino/Ethiopian)
- Every recipe has: 6-12 ingredients, 4-8 instructions w/ optional timers, nutrition (calories/macros/sodium), cost per serving, dietary + allergen tags, FAQ pairs, hero image from curated Unsplash bank
- 13 collections: African Feast, Nigerian Essentials, Small Chops Party Pack, 20-Minute Dinners, Vegan Weeknights, Comfort Food Classics, Sweet Treats, Drinks & Smoothies, Game Day Eats, Around the World in 10 Dinners, Celebration Desserts, Mediterranean Mood, Fancy French
- All seed data lives at `src/content/seed-recipes.ts` (static, SSG-friendly) AND seeded into Supabase via `scripts/seed.ts`

### SEO machinery
- Full Recipe schema.org JSON-LD on every recipe page (Recipe, HowToStep, NutritionInformation, AggregateRating, FAQPage, BreadcrumbList, VideoObject when applicable)
- Organization + WebSite JSON-LD site-wide
- Dynamic XML sitemap (all routes, recipes, cuisines, diets, collections)
- Robots.txt with explicit allow for GPTBot + Google-Extended
- Per-page canonical, Open Graph, Twitter Card, OG image auto-generated 1200×630
- Programmatic landing pages for 22 cuisines × 14 diets × 13 collections + categories index
- Mobile-first responsive (verified at 360/768/1024/1440)

### Auth
- Supabase Auth wired via SSR middleware (`src/middleware.ts`)
- Login + signup pages render at `/login` + `/signup`
- Email/password + Google OAuth supported
- `/account` redirects to `/login` if unauthenticated
- Header is auth-aware (shows User avatar if logged in, "Log in" link otherwise)
- **Important:** Middleware + Supabase server client are now **safe-fail** — site won't 500 if env vars missing

---

## 🛠 Major fixes during the session

### Sentry v9 ↔ Next 16 ERESOLVE (Vercel build failure)
- Upgraded `@sentry/nextjs` from `^9.47.1` to `^10.52.0`
- Added `.npmrc` with `legacy-peer-deps=true` + `engine-strict=false`
- `next.config.mjs` lazy-imports `@sentry/nextjs` only when `SENTRY_AUTH_TOKEN` is set
- Resolves: `npm error code ERESOLVE / Could not resolve dependency: peer next@^*13.2.0 || ^14.0 || ^15.0.0-rc.0`

### Supabase pooler region not us-east-1
- Project found in `aws-1-eu-north-1` (Stockholm) — note `aws-1` prefix, not `aws-0`
- Direct connection (`db.{ref}.supabase.co`) does NOT resolve — Supabase deprecated this
- Working URL: `postgresql://postgres.kauqukwkqeybmtvvodep:IPPXtZgbArhSYt5F@aws-1-eu-north-1.pooler.supabase.com:6543/postgres`
- `scripts/find-region.mjs` will auto-scan if needed again

### Drizzle CLI couldn't load .env
- Updated `db:push`, `db:generate`, `db:migrate`, `db:studio` scripts to use Node 22's `--env-file=.env.local`
- Interactive prompts hang in non-TTY (Vercel/CI) — use `scripts/apply-migration.mjs` instead for non-interactive deploys

### Live site 500 / MIDDLEWARE_INVOCATION_FAILED
- Root cause: ZERO env vars set in Vercel (user clicked Deploy without pasting)
- Fix 1: Patched `src/middleware.ts` + `src/lib/supabase/server.ts` to fail gracefully on missing env
- Fix 2: Bulk-added all 18 env vars via `.env` file upload through Vercel's hidden file input (used JS `File` API + `DataTransfer` to populate `input[type=file][accept=env]` and dispatched `change` event)

### Image bank — 6 broken Unsplash URLs
- Scanned all 60+ photo IDs via `<img>` `onload`/`onerror`
- Replaced broken IDs: jollofRice, ricePeas, plantain, pho, falafel, meatPie, fish
- Added `<RecipeImage>` client component with `onError` fallback to brand gradient
- `next.config.mjs` allows `images.unsplash.com`

### Rebrand: GridPoint → RecipeCrave
- `SITE.publisher` is single source of truth in `src/lib/constants.ts`
- Email is `recipecravee@gmail.com` (public contact)
- All legal pages, footer, schema.org Organization use SITE.publisher dynamically

---

## 🔑 Env vars set in Vercel (18 total)

Names listed below. **Actual values live in `.env.local` on user's machine and in Vercel's encrypted store — never committed to this repo.**

```
NEXT_PUBLIC_SITE_URL                  = https://recipecrave.com
NEXT_PUBLIC_SITE_NAME                 = RecipeCrave
NEXT_PUBLIC_SUPABASE_URL              = https://kauqukwkqeybmtvvodep.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY         = [REDACTED — Supabase JWT, anon role]
SUPABASE_SERVICE_ROLE_KEY             = [REDACTED — Supabase JWT, service_role]
SUPABASE_DB_URL                       = postgresql://postgres.kauqukwkqeybmtvvodep:[REDACTED]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres
GOOGLE_GEMINI_API_KEY                 = [REDACTED — Google AI Studio key]
GROQ_API_KEY                          = [REDACTED — Groq Cloud key]
CLOUDFLARE_ACCOUNT_ID                 = 9d977b053cb41ac4d3434eb29a8ab2e7
CLOUDFLARE_API_TOKEN                  = [REDACTED — Cloudflare Workers AI token]
USDA_API_KEY                          = [REDACTED — FoodData Central key]
RESEND_API_KEY                        = [REDACTED — Resend send key]
RESEND_FROM_EMAIL                     = hello@recipecrave.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID          = 4dfbe66d-d492-4dec-9443-485a585faf7a
NEXT_PUBLIC_UMAMI_SCRIPT_URL          = https://cloud.umami.is/script.js
NEXT_PUBLIC_POSTHOG_KEY               = [REDACTED — PostHog project key]
NEXT_PUBLIC_POSTHOG_HOST              = https://us.i.posthog.com
NEXT_PUBLIC_SENTRY_DSN                = [REDACTED — Sentry ingest DSN]
```

⚠️ **Rotate these on Supabase, Gemini, Groq, Cloudflare, Resend, PostHog** if they were ever shared in chat. The new Claude can read actual values from the user's local `.env.local` if needed.

---

## 🧠 User context

- **Account:** GitHub `recipecravee`, Vercel team `Bracknell's projects` (slug `bracknell-s-projects`)
- **Email:** `recipecravee@gmail.com`
- **Domain:** `recipecrave.com` (registered Hostinger, DNS at Cloudflare)
- **Project IDs:**
  - Vercel: `prj_KhHUxZN1NZae1ua4U4nKA7C9j3HH` (project name `recipe-crave`)
  - Supabase: `kauqukwkqeybmtvvodep`
- **Mode:** Caveman (user prefers terse responses). Hook reminders auto-fire — don't apologize for them.
- **Preference:** Do not use "GridPoint Digital Solution" anywhere — always RecipeCrave.

There is a **duplicate Vercel project** `recipe-crave-16kv` that can be deleted (also points to the same repo, also green). User wasn't able to clean it up — instruct them to go to `Settings → General → Delete Project` (scroll bottom).

---

## 🗂 Repo structure

```
recipecrave/
├── .claude/launch.json          # dev server configs (Next.js Dev :3000, Drizzle Studio :4983)
├── .env.example                 # public template
├── .env.local                   # local secrets — gitignored
├── .npmrc                       # legacy-peer-deps=true
├── .github/workflows/ci.yml     # lint + typecheck + build
├── CONTEXT-HANDOFF-FOR-CLAUDE.md   # this file
├── DEPLOY.md                    # user-facing deploy guide
├── README.md                    # repo readme
├── drizzle/                     # SQL migration + meta
│   └── 0000_clean_miss_america.sql
├── next.config.mjs              # Sentry lazy, image domains, headers
├── package.json                 # Node 22.x pinned
├── public/
│   ├── ads.txt                  # AdSense placeholder
│   └── logo.png                 # 1254x1254 cream/terracotta/green brand mark
├── scripts/
│   ├── apply-migration.mjs      # non-interactive SQL apply (use instead of db:push if Drizzle prompts hang)
│   ├── find-region.mjs          # Supabase pooler region scanner
│   ├── seed.ts                  # seeds recipes + collections to Supabase
│   └── seed.mjs                 # older variant
├── src/
│   ├── app/                     # App Router
│   │   ├── api/                 # /api/health, /api/ai/*, /api/pantry-match, /api/newsletter/*
│   │   ├── account/             # protected, redirects to /login
│   │   ├── auth/callback/       # OAuth handler
│   │   ├── login/ + signup/
│   │   ├── recipes/[slug]/ + [slug]/print/
│   │   ├── cuisine/[cuisine]/
│   │   ├── diet/[diet]/
│   │   ├── collections/ + [slug]/
│   │   ├── meal-planner/ + pantry-match/
│   │   ├── about/ contact/ privacy/ terms/ editorial-policy/ nutrition-disclaimer/
│   │   ├── icon.tsx apple-icon.tsx opengraph-image.tsx twitter-image.tsx
│   │   ├── sitemap.ts robots.ts manifest.ts
│   │   ├── layout.tsx page.tsx not-found.tsx globals.css
│   ├── components/
│   │   ├── auth/AuthForm.tsx
│   │   ├── recipe/{RecipeCard,RecipeImage,RecipeActions,ReviewsSection,StarRating}.tsx
│   │   ├── seo/JsonLd.tsx
│   │   ├── site/{Header,Footer,NewsletterForm,AdSlot}.tsx
│   │   └── ui/{button,badge,input}.tsx
│   ├── content/
│   │   ├── image-bank.ts       # curated stable Unsplash URLs
│   │   ├── seed-recipes.ts     # 68 recipes + 13 collections
│   │   └── testimonials.ts     # 18 synthesized launch testimonials
│   ├── lib/
│   │   ├── ai/client.ts        # Gemini primary + Groq fallback + in-memory cache
│   │   ├── data/recipes.ts     # SSG read layer (currently reads from seed-recipes.ts)
│   │   ├── db/{schema,client}.ts  # Drizzle
│   │   ├── seo/structured-data.ts # Recipe/FAQ/Breadcrumb/Org/WebSite JSON-LD
│   │   ├── supabase/{server,client}.ts  # SSR + browser clients (safe-fail)
│   │   ├── constants.ts        # SITE, CUISINES, DIETS, COURSES_NAV, NAV_LINKS — single source of truth
│   │   └── utils.ts
│   ├── middleware.ts            # session refresh, safe-fail if Supabase env missing
│   └── types/recipe.ts
```

---

## 🚦 What to do next (in priority order)

### Immediate (Phase 1 polish, after DNS settles)
1. Add the 2 DNS records in Cloudflare (above) → `recipecrave.com` goes live
2. Verify `https://recipecrave.com` resolves with green padlock
3. Submit sitemap to Google Search Console: `https://recipecrave.com/sitemap.xml`
4. Submit to Bing Webmaster Tools (import from GSC, one click)
5. Delete duplicate Vercel project `recipe-crave-16kv`
6. **Rotate exposed API keys**: Supabase service role, Gemini, Groq, Cloudflare, Resend

### Phase 2 (next 30 days)
- Pantry photo scan UI (Claude Vision via Gemini, replace pantry text input with photo upload)
- Voice cook mode UI (Web Speech API, hands-free step advance)
- Recipe Genome embeddings (user/recipe vectors via Voyage AI or Cloudflare Workers AI)
- Smart auto-folders for saved recipes (kmeans on embeddings)
- Chrome extension to import recipes from any blog
- Newsletter Resend domain verification (`hello@recipecrave.com`)
- People-Also-Ask + featured-snippet farms (extra SEO surface)

### Phase 3 (60+ days)
- Auto-generated recipe video → TikTok/Shorts/Reels
- AI Chef Personas with ElevenLabs TTS
- WhatsApp + SMS recipe bot (Twilio + Meta)
- Alexa skill + Google Assistant action
- Multi-retailer grocery export (Instacart, Walmart, Tesco, Kroger)
- Premium tier launch (Stripe), $4.99/mo
- Mobile app (React Native + Expo, shared Supabase backend)

---

## 💸 Cost reality check

All free tier so far. Real numbers from this build:

| Service | Free tier limit | Estimated month 1 use | Pay-tier trigger |
|---------|----------------|-----------------------|------------------|
| Vercel Hobby | 100 GB bandwidth/mo | <1 GB | At ~80k visits/mo → Pro $20/mo |
| Supabase | 500 MB DB, 50k MAU | ~10 MB DB, 0 users | At ~10k users → Pro $25/mo |
| Gemini | 1,500 req/day | <50/day | Effectively never (Flash) |
| Groq | ~14,400 req/day | 0 | Effectively never |
| Resend | 3,000 emails/mo | 0 | At ~2.5k subscribers |
| Cloudflare | unlimited | <1 GB | Never for traffic |
| Sentry | 5,000 errors/mo | <50 | At high error rate |
| PostHog | 1M events/mo | <10k | At ~10k MAU |
| **Total now** | | **$0** | First paid bill ~month 4–6 |

AdSense revenue path (food vertical realistic):
- Month 1–2: 0–500 visits → $0
- Month 3–4: 1k–5k visits → AdSense applies + earns ~$5–25/mo
- Month 6: 10k–25k → ~$50–150/mo
- Month 12: 50k+ → Mediavine/Raptive eligible → $500–1,500/mo

---

## 🧪 How to verify everything yourself (next Claude or user)

### Verify dev locally
```bash
cd recipecrave
npm install
npm run typecheck      # must pass
npm run build          # must pass with 217 routes
npm run dev            # http://localhost:3000
```

### Verify Supabase
```bash
# Schema in place?
node --env-file=.env.local -e "import('postgres').then(async ({default:p}) => { const s=p(process.env.SUPABASE_DB_URL,{prepare:false,max:1}); console.log(await s\`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename\`); await s.end(); })"

# 68 recipes seeded?
node --env-file=.env.local -e "import('postgres').then(async ({default:p}) => { const s=p(process.env.SUPABASE_DB_URL,{prepare:false,max:1}); console.log(await s\`SELECT COUNT(*) FROM recipes\`); await s.end(); })"
```

### Verify Vercel live
- Open https://recipe-crave.vercel.app
- Homepage must render with logo, hero, cuisine tiles, recipe cards
- Click any recipe → detail page renders with hero image
- Mobile viewport (Chrome DevTools, 375px) — verify everything stacks correctly

---

## 📞 Communication notes

- User wants Caveman-mode responses (terse, fragments OK, no filler)
- Don't ask "what's next?" — just keep moving and audit
- Score every phase before progressing
- User can authenticate themselves into Vercel/Supabase/Cloudflare via the Chrome extension `Browser 1` — see `mcp__Claude_in_Chrome__*` tools
- GitHub PAT for pushes lives in user's `ALL API.txt` (outside repo) — pushes to `recipecravee/Recipe-Crave` succeed using it

---

## 🎬 To pick up the work in a fresh Claude session

Open this file. Read top to bottom. The site is **live** at `https://recipe-crave.vercel.app`. The **one** human action left is adding 2 DNS records in Cloudflare. After that, `recipecrave.com` resolves, SSL provisions, search engines can index.

If the user asks "what's next" → start Phase 2 (Pantry scan UI, voice cook mode, chrome extension, recipe genome, Resend domain). Bigger Phase 3 features deserve a separate planning conversation.

Good luck. 🥘
