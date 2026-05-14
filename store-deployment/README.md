# RecipeCrave — Store Deployment Kit

Everything needed to ship RecipeCrave to the **Google Play Store** and the **Apple App Store** as a wrapped PWA. The web app is already production-ready (manifest, service worker, offline page, push notifications, maskable icons, iOS splash screens). This folder packages the assets + step-by-step submission notes so the only outstanding cost when you're ready is the developer-account fees.

> **Source of truth:** the live PWA at https://www.recipecrave.com. Both stores just wrap that URL — you do **not** need to maintain a separate native codebase.

---

## TL;DR — what to do when you're ready

| Step | Cost | Time | Notes |
|------|------|------|-------|
| 1. Create Google Play Console account | **$25 USD one-time** | 1 day for ID verify | https://play.google.com/console/signup |
| 2. Create Apple Developer Program account | **$99 USD / year** | 1–3 days for review | https://developer.apple.com/programs/enroll/ |
| 3. Generate Android `.aab` via PWABuilder | Free | 10 min | https://www.pwabuilder.com/?url=https://www.recipecrave.com |
| 4. Generate iOS Xcode project via PWABuilder | Free (Mac required) | 30 min | Same site, iOS tab |
| 5. Upload `.aab` to Play Console | — | 30 min | See `android/README.md` |
| 6. Sign + upload `.ipa` to App Store Connect | — | 1–2 h | See `ios/README.md` |
| 7. Fill listing copy | — | 30 min | Already drafted in `listing-copy/` |
| 8. Wait for review | — | 1–3 days Play, 24–48 h Apple | — |

**Total out-of-pocket: $124 first year, $99/year after.**

---

## Folder layout

```
store-deployment/
├── README.md                       ← you are here
├── android/
│   └── README.md                   ← Play Store submission walkthrough
├── ios/
│   └── README.md                   ← App Store submission walkthrough
├── listing-copy/
│   ├── play-store-listing.md       ← Title, descriptions, keywords for Play
│   ├── app-store-listing.md        ← Title, subtitle, keywords for App Store
│   └── shared-metadata.md          ← Privacy URL, support URL, age rating, category
└── assets/
    ├── play-feature-graphic-1024x500.png      ← Required Play hero
    ├── play-store-icon-512x512.png            ← Required Play icon
    ├── app-store-icon-1024x1024.png           ← Required App Store icon
    ├── screenshot-phone-1080x1920.png         ← Play phone screenshot
    ├── screenshot-phone-1242x2208-iphone-5_5.png   ← App Store 5.5" iPhone
    ├── screenshot-phone-1242x2688-iphone-6_5.png   ← App Store 6.5" iPhone
    ├── screenshot-phone-1284x2778-iphone-6_7.png   ← App Store 6.7" iPhone
    └── screenshot-ipad-2048x2732-12_9.png          ← App Store 12.9" iPad
```

---

## Why the PWA-wrap path

1. **Single codebase.** Every product change ships to web, Android, and iOS at the same time — no native rewrites.
2. **Push notifications already work** on Android (web push) and iOS 16.4+ (PWA push when installed to home screen).
3. **Offline support already shipped** via `/public/sw.js` (cache-first static, network-first HTML, SWR images, `/offline.html` fallback).
4. **Splash screens already shipped** for 12 iOS device families × 2 orientations via `IosSplashLinks.tsx`.
5. **Maskable icons already shipped** in `public/icons/` at 192/512/1024.
6. **Shortcuts already shipped** in `manifest.ts` (Meal Planner, Pantry, Recipes).

Apple's 2024 PWA policy clarification confirmed wrapped PWAs are App Store eligible. Google has always accepted TWAs (Trusted Web Activities) — that's what PWABuilder generates for Play.

---

## Before you submit — sanity checklist

Run these from a fresh terminal at the repo root:

```bash
# 1. Production build clean
pnpm build

# 2. Lighthouse PWA category ≥ 90 on mobile
npx lighthouse https://www.recipecrave.com \
  --only-categories=pwa --preset=mobile --view

# 3. Manifest valid + service worker registers
# Visit https://www.recipecrave.com in Chrome → DevTools → Application

# 4. PWABuilder score ≥ 80
# Visit https://www.pwabuilder.com/?url=https://www.recipecrave.com
```

If anything below 90 PWA score, fix the missing manifest field or icon before generating the wrapper.

---

## After approval — keeping releases simple

Once both stores have your app live, future releases are mostly automatic:

- **Web changes** ship to users instantly (no store review needed for content tweaks, recipe additions, copy fixes).
- **Major UI overhauls** still ship instantly — TWAs and wrapped PWAs always load the latest live HTML.
- **Only re-submit to the stores** when you bump the `manifest.ts` version *or* want to change the store listing (screenshots, description, icon).

Most apps re-submit 1–2× per year to refresh screenshots. That's it.

---

## Support contacts

- Play Console help: https://support.google.com/googleplay/android-developer
- App Store Connect help: https://developer.apple.com/contact/
- PWABuilder Discord: https://aka.ms/pwabuilderdiscord (Microsoft-backed, very responsive)
