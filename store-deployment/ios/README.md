# Apple App Store — Submission Walkthrough

**Target:** ship RecipeCrave to the App Store as a wrapped PWA around https://www.recipecrave.com.

**Annual cost:** $99 USD (Apple Developer Program).
**Time from zero to "Waiting for Review":** ~3 hours, plus 1–3 days for Apple identity verification.

> **You will need a Mac.** Apple's submission tools (Xcode, Application Loader, the new Transporter app) are Mac-only. If you don't have one: rent a Mac in the cloud — MacStadium or MacInCloud both offer ~$30/month plans.

---

## Step 1 — Enrol in the Apple Developer Program

1. Open https://developer.apple.com/programs/enroll/.
2. Sign in with an Apple ID (use your business email if you have one).
3. Choose **Organization** if you want to publish under "RecipeCrave" rather than your personal name. Requires a D-U-N-S number (free from Dun & Bradstreet, takes ~5 days).
4. Pay the **$99/year** fee. Apple emails an identity verification request — confirm legal name + address match your government ID.
5. Wait **1–3 days** for approval. You'll land on **App Store Connect** at https://appstoreconnect.apple.com.

---

## Step 2 — Generate the iOS wrapper via PWABuilder

1. Visit **https://www.pwabuilder.com/?url=https://www.recipecrave.com**.
2. **Package for stores → iOS**.
3. Fill the form:
   - **Bundle ID:** `com.recipecrave.app`  (must match what you'll register in Apple)
   - **App name:** `RecipeCrave`
   - **URL:** `https://www.recipecrave.com`
   - **Status bar style:** `default`
   - **Splash colour:** `#FFF8F0`
4. Click **Generate**. Download the `.zip` — it contains an Xcode project, not a finished `.ipa`. (Apple requires the .ipa to be built on a Mac with a real signing cert; PWABuilder can't bypass that.)
5. Unzip onto your Mac.

---

## Step 3 — Register the App ID in the Apple Developer portal

1. Open https://developer.apple.com/account/resources/identifiers/list.
2. Click **+ → App IDs → App → Continue**.
3. Fill:
   - **Description:** RecipeCrave
   - **Bundle ID:** explicit, `com.recipecrave.app`
   - **Capabilities:** check **Push Notifications**, leave everything else default.
4. **Register**.

---

## Step 4 — Open the Xcode project and configure signing

1. On the Mac, install Xcode 16+ from the Mac App Store (free, ~10 GB download — start early).
2. Open `RecipeCrave.xcworkspace` from the PWABuilder zip.
3. In the left sidebar select the project root → **Signing & Capabilities** tab.
4. **Team:** select your Apple Developer team (appears after Step 1 verification).
5. **Bundle Identifier:** `com.recipecrave.app` (should match Step 3 exactly).
6. Tick **Automatically manage signing**. Xcode generates a provisioning profile.
7. Under **Capabilities**, add **Push Notifications**.
8. Set **Deployment Target** to **iOS 16.4** (first version with PWA push support).

---

## Step 5 — Build and archive

1. In Xcode top bar, select **Any iOS Device (arm64)** as the build target (NOT a simulator).
2. Menu → **Product → Archive**. Wait ~2 minutes.
3. The Organizer window opens. Select the new archive.
4. Click **Distribute App → App Store Connect → Upload**.
5. Xcode validates and uploads. Takes 5–15 minutes depending on connection.
6. When done you'll see "Upload Successful". The build will appear in App Store Connect within ~30 minutes after Apple's malware scan.

---

## Step 6 — Create the App Store Connect listing

1. https://appstoreconnect.apple.com → **My Apps → +**.
2. Fill:
   - **Platform:** iOS
   - **Name:** RecipeCrave  (must be ≤ 30 chars and globally unique)
   - **Primary language:** English (U.S.)
   - **Bundle ID:** `com.recipecrave.app`
   - **SKU:** `recipecrave-001`  (internal id, never shown to users)
3. Click **Create**. You land on the app's dashboard.
4. Sidebar → **App Information**:
   - **Subtitle:** copy from `../listing-copy/app-store-listing.md`
   - **Privacy Policy URL:** `https://www.recipecrave.com/privacy`
   - **Category — Primary:** Food & Drink
   - **Category — Secondary:** Health & Fitness
5. Sidebar → **Pricing and Availability**:
   - Price: **Free**
   - Availability: All territories
6. Sidebar → **App Privacy** — answer "Do you collect data?": Yes → declare:
   - **Contact info → Email address** (newsletter signup, account auth) → not linked to user, not used for tracking
   - **Identifiers → User ID** (Supabase auth) → linked to user, not used for tracking
   - **Usage data → Product interaction** (analytics) → not linked to user, used for analytics
   - See `../listing-copy/shared-metadata.md` for the canonical answers.

---

## Step 7 — Fill the version's store page

1. Sidebar → **1.0 Prepare for Submission**.
2. Copy text from `../listing-copy/app-store-listing.md` into:
   - **Promotional text**
   - **Description**
   - **Keywords**
   - **Support URL:** `https://www.recipecrave.com/contact`
   - **Marketing URL:** `https://www.recipecrave.com`
3. Upload screenshots from `../assets/`:
   - **6.7" iPhone:** `screenshot-phone-1284x2778-iphone-6_7.png` (required)
   - **6.5" iPhone:** `screenshot-phone-1242x2688-iphone-6_5.png`
   - **5.5" iPhone:** `screenshot-phone-1242x2208-iphone-5_5.png` (required for old devices)
   - **12.9" iPad:** `screenshot-ipad-2048x2732-12_9.png` (required since the app supports iPad)
4. **App Icon:** Apple pulls this from the Xcode build automatically — confirm `app-store-icon-1024x1024.png` was included in the PWABuilder zip's `Assets.xcassets`.
5. **Build** section: pick the build that uploaded in Step 5.
6. **Age rating:** complete the questionnaire → result should be **4+** (no objectionable content).
7. **App Review Information**:
   - Sign-in required? **No** (the app is browsable without account)
   - Demo account credentials: leave blank
   - Contact info: your email + phone
   - Notes: paste `../listing-copy/app-store-listing.md` → "Review notes" section
8. **Version Release:** "Automatically release this version".

---

## Step 8 — Submit for review

1. Top right → **Add for Review → Submit to App Review**.
2. Status: **Waiting for Review** (typical 24–48 hours).
3. Then: **In Review** (typical 1–4 hours).
4. Then: **Approved** → auto-released to App Store within ~1 hour.

---

## Common rejection reasons (and the fix)

| Rejection | Why | Fix |
|-----------|-----|-----|
| **4.2 — Minimum Functionality** | Apple thinks your app is "just a website" | Emphasise offline support, push notifications, native share, splash screens in review notes. Include a screenshot of the offline page. |
| **5.1.1 — Data Collection** | App Privacy answers don't match what the site actually collects | Re-audit. RecipeCrave collects: emails (auth + newsletter), Supabase user ID, usage analytics. That's it. |
| **2.3.7 — App Name** | "RecipeCrave" already taken | Won't happen — checked clear as of 2026-05. |
| **Bug crash on launch** | Xcode build target wrong | Build with iOS 16.4+ deployment, real device target, not simulator. |

---

## After approval — update flow

For every new release:

1. Bump version in Xcode (Project → General → Version: `1.0.1`, Build: `2`).
2. Archive → upload (Steps 4–5 above).
3. App Store Connect → create new version `1.0.1` → reuse all metadata → select new build → submit for review.
4. Apple typical update review: **24 hours**.

Same as Play: most product changes ship instantly via the wrapped web app. Only re-submit when you want to refresh screenshots, change name, or update the iOS bridge code itself.

---

## Cost summary

| Item | Cost | Cadence |
|------|------|---------|
| Apple Developer Program | $99 USD | Annual |
| Mac (if you don't have one) | ~$30/month | Only when submitting / debugging |
| Everything else | $0 | — |

**Note on cloud Macs:** MacInCloud's "Pay-As-You-Go" plan ($1/hour) is cheapest for a single submission — budget 4–6 hours total. Cancel right after.
