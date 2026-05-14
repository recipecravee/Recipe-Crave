# Google Play Store — Submission Walkthrough

**Target:** ship RecipeCrave to the Play Store as a Trusted Web Activity (TWA) wrapper around https://www.recipecrave.com.

**One-time cost:** $25 USD (Google Play Console developer registration).
**Time from zero to "in review":** about 2 hours of active work.

---

## Step 1 — Register your Play Console account

1. Open https://play.google.com/console/signup.
2. Choose **organisation** account (better tax handling than personal).
3. Pay the $25 fee. Google will email an identity verification request — upload a government ID and confirm address. Typical clear time: 1–3 days.
4. Once verified, you'll have an empty Play Console dashboard.

---

## Step 2 — Generate the Android wrapper via PWABuilder

PWABuilder is Microsoft's free, open-source PWA-to-store tool. It produces a signed `.aab` (Android App Bundle) that the Play Store accepts directly.

1. Visit **https://www.pwabuilder.com/?url=https://www.recipecrave.com**.
2. Wait for the score to load — should be **90+** since the manifest, service worker, and icons are all in place.
3. Click **Package for stores → Android**.
4. In the form:
   - **Package ID:** `com.recipecrave.app`  (this is permanent — pick once, never changes)
   - **App name:** `RecipeCrave`
   - **Launcher name:** `RecipeCrave`
   - **App version:** `1.0.0`
   - **App version code:** `1`  (increment by 1 on every future upload)
   - **Signing key:** select **"Use mine"** and let PWABuilder generate one. **Save the keystore file + password** to a password manager — losing it means you cannot ever publish updates.
   - **Display mode:** `standalone`
   - **Status bar colour:** `#C75D3C`  (terracotta brand)
   - **Splash colour:** `#FFF8F0`  (cream background)
   - **Notification delegation:** **enabled**
   - **Location delegation:** disabled
   - **Play Billing:** disabled (no in-app purchases yet)
5. Click **Generate**. After ~60 seconds you'll get a `.zip` containing:
   - `app-release-bundle.aab`  ← upload this to Play
   - `assetlinks.json`  ← see Step 3
   - `signing-key-info.txt`  ← back this up immediately
   - `next-steps.html`  ← PWABuilder's own README

---

## Step 3 — Verify domain ownership (Digital Asset Links)

TWAs require a public `assetlinks.json` proving your domain owns the package ID. Without this, the Android wrapper will show a URL bar at the top (looks unprofessional and Play rejects it).

1. Open `assetlinks.json` from the PWABuilder zip.
2. Copy it to `public/.well-known/assetlinks.json` in this repo.
3. Commit + deploy.
4. Verify it's live: `curl https://www.recipecrave.com/.well-known/assetlinks.json` should return 200 + the JSON.
5. Run Google's verifier: `https://developers.google.com/digital-asset-links/tools/generator?relation=delegate_permission/common.handle_all_urls&site=https://www.recipecrave.com&package_name=com.recipecrave.app`

---

## Step 4 — Create the Play Console app entry

1. Play Console → **Create app**.
2. Fill the basics:
   - **App name:** RecipeCrave
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
   - **Declarations:** confirm the Play Developer Programme Policies + US export laws.
3. You'll land on the app dashboard with a setup checklist on the left. Work down the list:

   - **App access** — choose "All functionality available without restrictions".
   - **Ads** — "No, my app does not contain ads" (RecipeCrave doesn't run third-party ad networks; affiliate links are not ads).
   - **Content rating** — Complete IARC questionnaire. RecipeCrave is **Everyone** (no violence, no profanity, no UGC outside moderated variations).
   - **Target audience** — Age 13+. Confirm not targeting children.
   - **News app** — No.
   - **COVID-19 contact tracing** — No.
   - **Data safety** — see `../listing-copy/shared-metadata.md` for the canonical answers (email collection, no location, no payment).
   - **Government apps** — No.
   - **Financial features** — No.
   - **Health features** — No (the food-as-medicine section has clear disclaimers; not medical advice).

---

## Step 5 — Fill the store listing

1. Sidebar → **Main store listing**.
2. Copy the text from `../listing-copy/play-store-listing.md` into the corresponding fields.
3. Upload the graphics from `../assets/`:
   - **App icon:** `play-store-icon-512x512.png`
   - **Feature graphic:** `play-feature-graphic-1024x500.png`
   - **Phone screenshots:** `screenshot-phone-1080x1920.png` (need 2–8, generate more if you want by taking phone-frame screenshots of the live site)
4. Select **Food & Drink** as primary category.
5. Tags: `Food`, `Cooking`, `Recipes`, `Meal planning`, `Healthy eating`.

---

## Step 6 — Upload the .aab and create a release

1. Sidebar → **Production → Create new release**.
2. Upload `app-release-bundle.aab` from the PWABuilder zip.
3. **Release name:** `1.0.0 — initial launch`.
4. **Release notes:** see `../listing-copy/play-store-listing.md` → "What's new".
5. Click **Save** then **Review release**.
6. On the review screen, fix any warnings (Google will surface missing data safety items, wrong icon dimensions, etc.).
7. Click **Start rollout to production**.

---

## Step 7 — Wait for review

- Initial review: **1–3 days** typical, occasionally up to 7 days for new accounts.
- Status changes from "In review" → "Approved" → "Published" → live on Play Store within ~2 hours of approval.
- If rejected, Google emails specifics. Most common rejection: missing data safety form. Fix and resubmit.

---

## After approval — update flow

To ship a new version:

1. Bump `manifest.ts` version (informational only).
2. Regenerate `.aab` via PWABuilder with `appVersionCode` incremented (e.g. `2`).
3. Sign with the **same keystore** from Step 2.
4. Upload to Play Console → Production → Create new release.
5. Review takes **24 hours typical** for updates (faster than initial).

Most days you won't need to do this — TWAs always load the latest live web app, so content/UI changes go out instantly to existing installs.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| URL bar appears at top of wrapped app | `assetlinks.json` not deployed or wrong SHA-256. Re-run Google's verifier. |
| Splash screen flashes white | `manifest.ts` `background_color` must match TWA splash colour (`#FFF8F0`). |
| Push notifications don't fire | Notification delegation wasn't enabled in PWABuilder step. Regenerate bundle. |
| Lost keystore | Cannot recover. Must remove app and resubmit under a new package ID (loses all installs and reviews). **Back up the keystore.** |
