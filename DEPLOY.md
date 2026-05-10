# Deploy Guide — RecipeCrave

End-to-end deploy walkthrough. Assumes you already have a Hostinger domain (`recipecrave.com`) and all the free-tier accounts from the launch checklist.

---

## Architecture

```
recipecrave.com (Hostinger registrar)
        ↓
Cloudflare DNS (nameservers swapped)
        ↓
Vercel (Next.js hosting, free Hobby tier)
        ↓
Supabase (Postgres + Auth + Storage, free tier)
```

---

## Step 1 — Push code to GitHub

The repo is already committed to:

```
https://github.com/gridpointdigitalsolution-sys/Recipe-Crave-web-app
```

Future pushes:

```bash
git add -A
git commit -m "feat: ..."
git push origin main
```

---

## Step 2 — Connect Vercel to GitHub

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select `gridpointdigitalsolution-sys/Recipe-Crave-web-app`
4. Framework Preset: **Next.js** (auto-detected)
5. Root Directory: **leave as-is** (project lives at repo root)
6. Build settings: **leave defaults** (`npm run build` / `.next`)
7. Click **Environment Variables** and paste every variable from your `.env.local` (the version-controlled `.env.example` lists what's needed)
8. Click **Deploy**

First deploy takes ~3 minutes. You'll get a `*.vercel.app` URL.

---

## Step 3 — Point recipecrave.com to Vercel via Cloudflare

### 3a. Add domain to Vercel

1. In Vercel: **Project → Settings → Domains**
2. Click **Add** → enter `recipecrave.com`
3. Repeat for `www.recipecrave.com`
4. Vercel shows the DNS records you need to add.

### 3b. Add DNS records in Cloudflare

1. Log in to Cloudflare → select `recipecrave.com`
2. Go to **DNS → Records**
3. Add records exactly as Vercel asks. Usually:

   | Type  | Name | Value                  | Proxy        |
   |-------|------|------------------------|--------------|
   | A     | @    | 76.76.21.21            | DNS only (gray cloud) |
   | CNAME | www  | cname.vercel-dns.com   | DNS only (gray cloud) |

   ⚠️ **Set proxy to "DNS only" (gray cloud), not orange.** Vercel handles its own SSL; Cloudflare's orange proxy can conflict.

4. Save. Vercel will verify within 1–10 minutes.
5. SSL certificate provisioned automatically.

### 3c. Verify

Visit `https://recipecrave.com`. Should serve the live site.

---

## Step 4 — Push Supabase schema

Locally with the Supabase DB URL set in `.env.local`:

```bash
npm run db:generate
npm run db:push
```

This creates all tables (recipes, users, collections, etc.) in your Supabase project.

To inspect:

```bash
npm run db:studio
```

Opens a local web UI at http://localhost:4983.

---

## Step 5 — Submit to search engines

### Google Search Console

1. https://search.google.com/search-console
2. Add property: **Domain** → `recipecrave.com`
3. Verify via DNS TXT record in Cloudflare
4. Submit sitemap: `https://recipecrave.com/sitemap.xml`
5. Wait 1–7 days for first indexing

### Bing Webmaster Tools

1. https://www.bing.com/webmasters
2. Import directly from Google Search Console (one click)
3. Verify
4. Submit sitemap

### IndexNow (instant indexing for Bing + Yandex)

Built into the Vercel deploy — no action needed unless you want to install the optional `next-sitemap` push.

---

## Step 6 — Apply for Google AdSense

**Wait until the site has at least 30 days of activity and 1,000+ organic visits.**

1. https://www.google.com/adsense/start
2. Sign up, add `recipecrave.com`
3. Place the verification snippet in `src/app/layout.tsx` `<head>` (or via `NEXT_PUBLIC_ADSENSE_CLIENT` env)
4. Update `public/ads.txt` with your real `pub-XXXX` ID
5. Apply for review. AdSense usually responds in 2–14 days.
6. After approval, the AdSlots in this app activate automatically when `NEXT_PUBLIC_ADSENSE_CLIENT` is set.

---

## Step 7 — Set up analytics dashboards

You'll see traffic in three places:

- **Umami Cloud:** https://cloud.umami.is — real-time pageviews
- **PostHog:** https://us.posthog.com — funnels, retention, session recordings
- **Google Search Console:** SEO impressions, click-through rate
- **Vercel Analytics:** built-in Web Vitals

Bookmark all four.

---

## Step 8 — Newsletter domain verification

For Resend to send from `hello@recipecrave.com`:

1. Resend dashboard → **Domains → Add Domain**
2. Enter `recipecrave.com`
3. Resend gives you DKIM and SPF DNS records
4. Add them in Cloudflare DNS
5. Click **Verify**
6. Update `RESEND_FROM_EMAIL` in Vercel environment vars

---

## Troubleshooting

### Deploy fails with "Missing env vars"

Add them in **Vercel → Project → Settings → Environment Variables**.

### `recipecrave.com` doesn't load after DNS change

Wait 30 minutes. Then check:

```bash
nslookup recipecrave.com
```

Should return Vercel's IPs.

### SSL cert error

In Cloudflare DNS, make sure the record is **gray cloud (DNS only)**, not orange.

### Sitemap shows old data

Vercel ISR refreshes every 1 hour. Force refresh by redeploying.

---

## Day-1 launch checklist

- [ ] Vercel deploy successful
- [ ] `recipecrave.com` resolves
- [ ] All 12 seed recipes accessible at `/recipes/[slug]`
- [ ] Sitemap loads at `/sitemap.xml`
- [ ] Robots.txt loads at `/robots.txt`
- [ ] Google Search Console verified
- [ ] Bing Webmaster Tools verified
- [ ] Newsletter form sends test email
- [ ] Schema.org validates ([Google Rich Results Test](https://search.google.com/test/rich-results))
- [ ] Lighthouse mobile score 90+
- [ ] Privacy + Terms + Editorial pages live
- [ ] `ads.txt` accessible (with placeholder until AdSense approved)
