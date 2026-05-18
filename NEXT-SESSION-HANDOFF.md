# RecipeCrave — Next Session Handover

> **Drop this into any new Claude Code session.** Tells the next instance exactly what was done, what's next, and what's blocking.
>
> **Location:** `F:/MY OWN APP RECEIP CRAVE/recipecrave/NEXT-SESSION-HANDOFF.md`
>
> **Last updated:** 2026-05-18 by Claude Opus 4.7 (caveman mode active)

---

## Quick start for the next Claude

Read these three files first, in order:

1. **`NEXT-SESSION-HANDOFF.md`** (this file) — state of play, what to do next
2. **`LAUNCH-AUDIT-REPORT.md`** — the full pre-launch audit (155 issues, 634 pages, scored 78/100 after Phase 1)
3. **`AUDIT-FINDINGS.md`** — page-by-page walk-through log from the preview-server audit
4. **`CONTEXT-HANDOFF-FOR-CLAUDE.md`** — older cumulative project handoff (still valid for everything pre-audit)

---

## Where we are right now

### Site state
- **Production:** https://www.recipecrave.com — live, fully deployed
- **Latest commit:** `32382a5` Phase 1 launch-audit fixes — mechanical cleanup pass
- **Branch:** `main`
- **All 634 sitemap URLs:** HTTP 200, no broken pages
- **Image bank:** 197 unique URLs, all 200, no dupes inside the bank
- **TypeScript:** `npx tsc --noEmit` exits 0

### Launch readiness
**78 / 100** (was 63 before Phase 1). Status: **Needs Major Corrections** because of image-content mismatches and 28 remaining placeholder descriptions in Phase 2.

---

## Phase 1 — DONE ✓ (mechanical fixes — no user input needed)

All shipped in commit `32382a5`. Verified live on production.

**Content text fixes**
- 27 stray-number-prefix descriptions stripped (e.g. "32 Asun rice is enjoyed..." → "Asun rice is enjoyed...")
- scotch-egg: removed duplicated "is a boiled egg is a boiled egg" phrase
- spicy-chili-garlic-noodles: "gets read in about fifteen minuets" → "are ready in about fifteen minutes"
- atama-banga: "concumed" → "consumed"

**3 wrong-description bleeds (one recipe was showing another's text)**
- crispy-fried-chicken (was showing garlic-bread text) — real fried-chicken description written
- parfait (was showing lemon-cake text) — real parfait description written
- yam-and-sweet-potatoes (was showing casserole-sauce text) — real porridge description written

**Junk-text description fix**
- potato-balls had the raw ingredient list mashed into one paragraph as description. Rewrote with a real prose description.

**Slug rename + 301 redirects (in next.config.mjs)**
- `/recipes/carribean-rice-and-peas` → `/recipes/caribbean-rice-and-peas` (one R)
- `/recipes/yam-and-sweet-ptatoes` → `/recipes/yam-and-sweet-potatoes` (missing "o")
- `/recipes/zobo` → `/recipes/zobo-hibiscus-drink` (duplicate-recipe merge)
- `/recipes/akara` → `/recipes/akara-bean-fritters` (duplicate-recipe merge)

**Category reassignments (3 recipes were in the wrong category)**
- charcuterie-board: course='dessert' → 'side' (now on /categories/sides)
- tropical-juice: course='dinner', occasion='porridge' → course='drink', occasion=null (now on /categories/drinks)
- fish-roll: generic placeholder description replaced with real text

**SEO meta cleanup**
- 7 over-long descriptions trimmed to ~155 chars: /herbs, /safety-check, /herbal-cooking, /diets, /blog, /how-to, /submit-recipe
- 2 too-short descriptions expanded: /terms (was 38), /about (was 78)

### Verified live URLs (curl-confirmed)

```
200  /recipes/caribbean-rice-and-peas
200  /recipes/yam-and-sweet-potatoes
200  /recipes/zobo-hibiscus-drink
200  /recipes/akara-bean-fritters
308  /recipes/carribean-rice-and-peas  -> /recipes/caribbean-rice-and-peas
308  /recipes/yam-and-sweet-ptatoes    -> /recipes/yam-and-sweet-potatoes
308  /recipes/zobo                     -> /recipes/zobo-hibiscus-drink
308  /recipes/akara                    -> /recipes/akara-bean-fritters
```

---

## Phase 2 — PENDING (needs user-provided reference photos and recipe data)

### Blockers — user needs to provide these before Phase 2 can start

#### 1. Reference photos for ~35 specific dishes

Stock-photo libraries lack authentic photos for these. User must paste an Unsplash URL OR upload a photo file for each.

**Nigerian dishes (highest priority — most "wrong" images currently)**
nkwobi · isi-ewu · buka-stew · ofada-sauce · ofe-akwu · atama-banga · ofe-owerri · oha-soup · owo · waterleaf-soup · moin-moin · butter-fly-fluffy-moi-moi · akara-bean-fritters (keep — distinct from generic akara) · yamarita · fish-roll · meat-pie · nigerian-meat-pie · kelewele · stuffed-masa · chin-chin · suya-rice · asun-rice · native-rice · bush-meat-and-plantain · smokey-jollof-rice · signature-coconut-rice · cowtail-and-plantain · ekpang-nkukwo · fried-beans · yam-and-sweet-potatoes

**Regional cuisines (22 currently share one fallback photo on /cuisines)**
venezuelan-arepas-con-reina-pepiada · portuguese-bacalhau-a-bras · british-shepherds-pie · irish-stew · hungarian-goulash · austrian-wiener-schnitzel · ukrainian-borscht · hawaiian-poke-bowl · cajun-jambalaya · soul-food-fried-chicken-and-collards · sri-lankan-fish-curry · nepalese-momos · cambodian-fish-amok · mongolian-beef · israeli-hummus · kenyan-ugali-and-sukuma-wiki · senegalese-yassa-poulet · ivorian-attieke-with-grilled-fish · colombian-bandeja-paisa · chilean-empanadas-de-pino · belgian-moules-frites · tex-mex-beef-fajitas

#### 2. Recipe data for 10 invented "signature" cocktails

These appear to be house-invented drinks. No cookbook has them. Need: ingredients + brief description + photo for each.

wings-signature · bubble-signature · wavy · rainbow-paradise · kiwi-fizz · flavor-mimosa · cinnamon-mimosa · whipped-cream-mimosa · champagne-holiday · blue-colada

#### 3. Two clarifications

- **`velvet`** recipe — single-word title, no description. What is this? Red velvet cake? Velvet cocktail?
- **`1-basmati-rice-7-goat-meat`** — title literally reads "1. Basmati Rice 7. Goat Meat" (numbered-list import bug). Is this ONE dish (rename to `basmati-rice-with-goat-meat`) or TWO recipes that got mashed together?

### What I will do once user supplies the above

**Image fixes**
- Replace 22 cuisine-hero images currently sharing one fallback photo with distinct dish-specific photos
- Fix 6 confirmed image-content mismatches: native-rice (beach photo), jambalaya-rice (NYC skyline), ashwagandha-bedtime-rice-pudding (green smoothie), atama-banga (wrong stew), vegetable-sauce (efo-riro photo), crispy-fried-chicken (handled in Phase 1 desc; image was OK)
- Break up 18 image-key dupe sets (multiple recipes sharing same IMG.key) — including the 6-way `efoRiro` dupe across 5 different Nigerian soups + vegetable-sauce
- Replace `isi-ewu` and `nkwobi` photos (currently generic peppered-meat shots) with authentic versions

**Content fixes**
- Write 28 remaining placeholder descriptions (apple-pie, plantain-chips, sloppy-joes, shrimp-taco, onion-rings, chicken-nuggets, subway-sandwich, crispy-calamari-and-tartar, ginger-bread-cookies, spicy-beef-penne, prawn-native-pasta, shawarma, waffles, mashed-potatoes, oreo-crumble, single-skillet-chocolate-chips-cookies, chocolate-muffin, rotisserie-chicken, grilled-prawns, t-bone-steak, honey-barbecue-wings, isi-ewu, bush-meat-and-plantain, simple-oreo-milk-shake, whiskey-sour-without-eggs, tequila-sunrise, classic-mojito, cosmopolitan, passion-fruit-daiquiri, classic-martini, moscow-mule, margarita, long-island-iced-tea) — these need user-confirmed real recipe text OR Claude can write generic-but-accurate descriptions if user signs off
- Write 10 new signature-cocktail recipes once user provides ingredients
- Resolve `velvet` and `1-basmati-rice-7-goat-meat` once user decides

---

## Open backlog (post-launch nice-to-haves)

From `AUTONOMOUS-GOALS.md`:

1. Wire `ApprovedVariations` component onto `/quick/[combo]` programmatic pages
2. Add Twitter+OG cards on per-slug cuisine/diet/collections detail pages (index pages already have them)
3. Add ~24 more drink recipes (user wanted 40 on /drinks; current = 16)
4. Add 10-15 more iced-treat recipes (current = 3, sparse category)
5. Recipe content backfill — 50 highest-traffic recipes get hand-written 80-160-word intros (Goal 3 in AUTONOMOUS-GOALS.md)
6. Image-bank duplicate audit (likely clean now)
7. Admin dashboard a11y sweep (Goal 4)
8. Apple App Store + Google Play Store submissions (see `/store-deployment/`)
   - Need: Apple Developer fee $99/yr + Play Console fee $25 one-time
   - Need: a Mac (or cloud Mac like MacInCloud ~$1/hour) to build iOS .ipa

---

## How to use this handover

### To continue Phase 2 (most common case)

1. Open new Claude Code session at the repo root:
   ```powershell
   cd "F:/MY OWN APP RECEIP CRAVE/recipecrave"
   claude --dangerously-skip-permissions
   ```
2. Paste this prompt:
   ```
   Read NEXT-SESSION-HANDOFF.md, LAUNCH-AUDIT-REPORT.md, and AUDIT-FINDINGS.md.
   I am providing the Phase 2 reference materials. Below are [photos/recipes/decisions]:

   [user pastes their references]

   Proceed with Phase 2 fixes. Type-check, commit, push to main. Don't ask permission
   for things in scope of the audit report.
   ```
3. Walk away. Come back when the work is committed and pushed.

### To audit again (verify Phase 1 actually stuck)

```
Re-run the audit. Sample 30 random recipes from /recipes/ on production.
Confirm none have stray number prefixes, all descriptions are real, no 404s
on the 4 renamed slugs and the 4 redirect slugs. Report findings.
```

### To run a long-horizon /goal autonomously

Requires Claude Code 2.1.139+ (installed). Use the templates in `AUTONOMOUS-GOALS.md`.

---

## Key environment / state notes for the next Claude

- **Git auth:** `gh auth login` already set up as `recipecravee` account. `gh auth setup-git` ran. `git push origin main` works without prompting.
- **GitHub remote:** `https://github.com/recipecravee/Recipe-Crave.git`
- **Local git user:** `gridpointdigitalsolution@gmail.com` (display name "GridPoint Digital Solution"). Doesn't matter for push since gh stored a recipecravee token.
- **Vercel:** auto-deploys on push to main. ~60-90 seconds from `git push` to live.
- **Apex → www redirect** is in place at DNS/Vercel. Site MUST be served from `https://www.recipecrave.com` (SITE.url constant hardcoded — see `src/lib/constants.ts`).
- **Preview server:** `.claude/launch.json` already has "Next.js Dev" config. Start with `mcp__Claude_Preview__preview_start` if available.
- **Browser MCP:** `mcp__Claude_in_Chrome__*` tools available. Use for visual verification of specific pages.

---

## Files Claude will care about

| File | Purpose |
|---|---|
| `src/content/recipecrave-recipes.ts` | The 175+ Nigerian/American/global recipes (heroImages reference `IMG.key` lookups) |
| `src/content/seed-recipes.ts` | The 79 verbose seed recipes + the 15 new drinks I added |
| `src/content/world-cuisine-heroes.ts` | The ONE hero recipe per world cuisine — these use direct URL strings, not IMG.key |
| `src/content/therapeutic-recipes.ts` | Therapeutic herb-paired recipes |
| `src/content/image-bank.ts` | 197 unique Unsplash URLs keyed by short name (`IMG.zobo`, `IMG.shakshuka`, etc.) |
| `src/content/menu-categories.ts` | Filter rules per /categories/X page (course + occasion + titleKeywords) |
| `src/lib/data/recipes.ts` | Data-access layer — combines + dedupes recipes from the 4 content files |
| `next.config.mjs` | 301 redirects live here |

---

## Commit history of this audit work

```
32382a5 Phase 1 launch-audit fixes — mechanical cleanup pass
884aece fix(seo): canonical URLs were pointing at apex but site lives at www
d5c3c1d fix(images): 5 more dead world-cuisine-hero URLs + hotChocolate dupe
e2fce85 fix(images+content): broken thumbs, sides human pics, +15 drink recipes
2a9b246 fix(home): "AdSense supports the lights" claim contradicted /about
2115581 fix(about+quick): more title-dup fixes + ads copy correction
5781321 fix(seo): kill duplicate brand suffix in 9 page titles + contact typo
8143634 fix(images): kill 2 dead Unsplash URLs + dedupe 7 collisions
6520f9f fix(menu+images): broken mega-menu hrefs + missing stews-sauces thumbnails
2049e0f Add AUTONOMOUS-GOALS.md — 5 /goal conditions for autonomous Claude Code runs
51ebe6e Update handoff doc — FORTY-FOURTH pass (twitter cards + admin push UI)
8123f04 Twitter card audit + admin dashboard push tile & test button
```

---

## Critical: response style

User has been asking responses in **caveman mode** (terse, drop articles, fragments OK). Source: `superpowers:caveman` skill / SessionStart hook. Don't write essay-style responses unless multi-step sequences risk misread. Code/commits/PRs stay normal.

Pattern: `[thing] [action] [reason]. [next step].`

Yes: "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"
No: "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by..."

---

## One-paragraph summary

RecipeCrave is mechanically 100% healthy (634/634 URLs HTTP 200, valid SEO, no broken images at the infrastructure layer). Phase 1 of the launch audit shipped commit `32382a5` on 2026-05-18 — cleaned up 27 stray-prefix descriptions, 3 wrong-description bleeds, 4 typo slugs (with 308 redirects), 2 duplicate-recipe merges, 3 wrong category assignments, 9 SEO meta length problems, and 1 junk-description rewrite. Site moved from 63/100 to 78/100 launch readiness. Phase 2 is blocked on the user providing reference photos for ~35 specific dishes (especially Nigerian ones and 22 regional-cuisine heroes) and authoring data for 10 invented "signature" cocktails. Once those land, the next Claude does the image swaps + content writes and commits Phase 2.
