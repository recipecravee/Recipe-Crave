# RecipeCrave — Deploy to `recipecrave.com`

End-to-end guide to taking RecipeCrave from this repo to a live site on `recipecrave.com`. Your domain is registered at Hostinger; your DNS is at Cloudflare; your code lives on GitHub; your app runs on Vercel.

---

## Architecture (already in place)

```
recipecrave.com  (registered at Hostinger)
        │
        │  nameservers point to Cloudflare ✅ already done
        ▼
Cloudflare DNS  (free plan)
        │
        │  CNAME / A records point to Vercel
        ▼
Vercel  (free Hobby tier)
        │
        │  runs the Next.js app at every push
        ▼
GitHub  (recipecravee/Recipe-Crave) ✅ repo live
        │
        │  Supabase Auth + DB + Storage
        ▼
Supabase  (free tier — must be unpaused)
```

> Note: Hostinger is just the **domain registrar**. The site itself runs on Vercel. You will not upload files to `public_html`. Hostinger only matters when renewing the domain or changing nameservers — both already configured.

---

## Step 1 — Code is on GitHub ✅

Already pushed to:

```
https://github.com/recipecravee/Recipe-Crave
```

Every `git push origin main` from this repo updates the live site automatically once Step 2 is connected.

---

## Step 2 — Connect Vercel to GitHub (one click)

This is the one place I cannot do for you — Vercel requires you to grant repo access from your browser.

1. Open **https://vercel.com/new**
2. Sign in with the GitHub account that owns `recipecravee/Recipe-Crave`
3. Click **Import** next to `recipecravee/Recipe-Crave`
4. **Framework Preset**: leave as **Next.js** (auto-detected)
5. **Root Directory**: leave as repository root
6. **Build & Output Settings**: leave defaults (`npm run build`, `.next`)
7. Click **Environment Variables** → paste each variable from your `.env.local`
   - `NEXT_PUBLIC_SITE_URL=https://recipecrave.com`
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...`
   - `SUPABASE_DB_URL=...`
   - `GOOGLE_GEMINI_API_KEY=...`
   - `GROQ_API_KEY=...`
   - `CLOUDFLARE_ACCOUNT_ID=...`
   - `CLOUDFLARE_API_TOKEN=...`
   - `USDA_API_KEY=...`
   - `RESEND_API_KEY=...`
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID=...`
   - `NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js`
   - `NEXT_PUBLIC_POSTHOG_KEY=...`
   - `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`
   - `NEXT_PUBLIC_SENTRY_DSN=...`
8. Click **Deploy**

Wait ~2–3 minutes. You will get a `*.vercel.app` URL.

After this point, **every push to GitHub auto-deploys**. No further Vercel clicks needed.

---

## Step 3 — Point `recipecrave.com` at Vercel

### 3a. Tell Vercel about the domain

1. In Vercel: open your project → **Settings → Domains**
2. Add `recipecrave.com`
3. Add `www.recipecrave.com`
4. Vercel will show two DNS records you need to add.

### 3b. Add the DNS records in Cloudflare

1. Log in to **https://dash.cloudflare.com**
2. Open `recipecrave.com` → **DNS → Records**
3. Add the records Vercel showed you. Typical values:

   | Type  | Name  | Value                 | Proxy status         |
   |-------|-------|-----------------------|----------------------|
   | A     | @     | `76.76.21.21`         | **DNS only** (gray)  |
   | CNAME | www   | `cname.vercel-dns.com.` | **DNS only** (gray) |

   ⚠️ **The proxy cloud must be GRAY (DNS only), not orange.** Vercel issues its own SSL certificate — orange-cloud Cloudflare proxy conflicts and breaks HTTPS.

4. Save. Propagation usually completes in **2–15 minutes**.
5. Back in Vercel, the domain status changes to **Valid Configuration** and SSL provisions automatically.

### 3c. Verify

Open `https://recipecrave.com` in a fresh tab. Should serve the live site with a green padlock.

---

## Step 4 — Unpause + seed Supabase

Supabase free-tier projects auto-pause after ~7 days of inactivity. Restore it before the app can authenticate users or save data.

1. Open **https://supabase.com/dashboard**
2. Select the `recipecrave` project
3. If you see a **Restore project** button, click it. Wait ~60 seconds.
4. Left sidebar → **SQL Editor → New query**
5. Open `drizzle/0000_clean_miss_america.sql` in this repo
6. Copy the entire file → paste into SQL Editor → click **Run** (bottom-right)
7. You should see "Success. No rows returned." All 8 tables created.

Confirm tables exist: left sidebar → **Table Editor**. You should see: `users`, `recipes`, `reviews`, `collections`, `user_saved_recipes`, `meal_plans`, `pantry_items`, `newsletter_subscribers`.

---

## Step 5 — Resend email domain verification (optional, for sending from `@recipecrave.com`)

Newsletter currently sends from a Resend-provided sender. To send from `hello@recipecrave.com`:

1. Resend dashboard → **Domains → Add Domain** → enter `recipecrave.com`
2. Resend gives DKIM + SPF DNS records
3. In Cloudflare DNS, add those records (gray cloud)
4. Click **Verify** in Resend after ~5 minutes
5. Update `RESEND_FROM_EMAIL` in Vercel environment variables

Skip this step if you are happy receiving inbound mail at `recipecravee@gmail.com` (the public contact email already wired into the site).

---

## Step 6 — Submit to Google + Bing

After `recipecrave.com` resolves with content:

1. **Google Search Console**: https://search.google.com/search-console
   - Add property: **Domain** → `recipecrave.com`
   - Verify via Cloudflare TXT record
   - Submit sitemap: `https://recipecrave.com/sitemap.xml`
2. **Bing Webmaster Tools**: https://www.bing.com/webmasters
   - Import from Google Search Console (one click)

Indexing begins in 1–7 days. AdSense application unlocks at ~1,000 monthly visits.

---

## Step 7 — Apply for Google AdSense (after launch traffic builds)

Wait until the site has **30 days of activity** and at least **1,000 organic monthly visits**.

1. https://www.google.com/adsense/start
2. Add `recipecrave.com`
3. Place the verification snippet via env var:
   - In Vercel → Environment Variables → add `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXX`
4. Update `public/ads.txt` with your real `pub-XXXXXXXX` ID
5. Apply for review. AdSense responds in 2–14 days.
6. After approval, ad slots in the app activate automatically.

---

## Troubleshooting

### Vercel build fails — "Missing environment variable"
Add the missing variable in **Vercel → Project → Settings → Environment Variables**, then redeploy.

### `recipecrave.com` shows Cloudflare error page
Cloudflare DNS records still proxy-enabled (orange). Flip both records to **DNS only** (gray cloud).

### Supabase auth not working
Project paused — restore in Supabase dashboard. Confirm DB tables exist via Table Editor.

### Images on recipe cards not loading
Confirm `images.unsplash.com` is in `next.config.mjs` remotePatterns. Already configured in this repo.

### Hostinger asks me to upload files
Ignore. We are not hosting on Hostinger. Hostinger only manages the domain registration; nameservers already point to Cloudflare which routes to Vercel.

---

## Daily operations after launch

| Task | Where |
|------|-------|
| Push code updates | `git push origin main` → auto-deploys via Vercel |
| Watch traffic | https://cloud.umami.is/share/... (Umami) |
| Watch product metrics | https://us.posthog.com (PostHog) |
| Watch errors | https://sentry.io |
| Watch search performance | https://search.google.com/search-console |
| Watch revenue | https://www.google.com/adsense (after approved) |

All free-tier accounts. No paid services required until traffic scales past ~50k visits/month.
