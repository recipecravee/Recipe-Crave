# Shared Metadata — Both Stores

Canonical answers for the privacy/data-safety/age-rating forms. Both Apple and Google ask near-identical questions phrased differently. Use this file as the single source of truth so the answers match across stores (mismatches trigger rejection on Apple specifically).

---

## 1. Data collection — what RecipeCrave actually collects

| Data | Source | Why collected | Linked to user? | Used for tracking? |
|------|--------|---------------|-----------------|---------------------|
| **Email address** | Newsletter signup, account magic-link | Send digest + verify identity | Yes (account) / No (newsletter-only) | No |
| **Display name** | Optional profile field | UX personalisation | Yes | No |
| **Saved recipes / pantry items** | User actions while signed in | Sync across devices via Supabase | Yes | No |
| **Anonymous analytics events** | Plausible / Umami | Aggregate page-view counts, no fingerprinting | No | No |
| **IP address** | Vercel edge + Supabase logs | Rate limiting + abuse prevention only | No (hashed before storage) | No |
| **Push subscription endpoint** | Service Worker (opt-in only) | Deliver daily digest if user subscribed | Yes | No |

### What RecipeCrave does **not** collect

- Precise or approximate location
- Contacts list
- Photos / camera / microphone
- Health / fitness data
- Payment info (no in-app purchases)
- Browsing history outside the app
- Device identifiers (no IDFA, no Android Ad ID)

---

## 2. Apple App Privacy form — direct copy

In App Store Connect → App Privacy, declare these data types:

### Data Linked to You
- **Contact Info → Email Address** (App Functionality)
- **User Content → Other User Content** (App Functionality) — saved recipes, pantry items
- **Identifiers → User ID** (App Functionality) — Supabase auth UUID

### Data Not Linked to You
- **Usage Data → Product Interaction** (Analytics) — page views, button clicks
- **Diagnostics → Crash Data** (App Functionality)
- **Diagnostics → Performance Data** (App Functionality)

### Tracking
**No data used for tracking purposes.** Confirm the "Are you using data for tracking?" toggle is OFF.

---

## 3. Google Play Data Safety form — direct copy

Play Console → App content → Data safety. Declare:

### Data types collected
- ✅ **Personal info → Email address** (required: optional, purpose: Account management + Communications)
- ✅ **Personal info → Name** (optional, App functionality)
- ✅ **App activity → App interactions** (optional, Analytics)
- ✅ **App info and performance → Crash logs** (optional, App functionality)
- ✅ **App info and performance → Diagnostics** (optional, App functionality)

### Data sharing
**No data is shared with third parties.**
*(Vercel and Supabase are processors, not third parties for Play's purposes. List them in privacy policy only.)*

### Security practices
- ✅ Data is encrypted in transit (HTTPS everywhere)
- ✅ You can request that data be deleted (profile page → delete account)
- ✅ Independent security review: Not yet

---

## 4. Permissions declared

| Permission | When requested | Why |
|-----------|----------------|-----|
| **Notifications** | After user taps "Enable daily digest" CTA | Push the 09:00 recipe digest |
| **Storage** | Implicit (TWA / wrapper) | Cache recipes for offline reading |

No location, camera, mic, contacts, calendar, or background location.

---

## 5. Content rating

| Store | Rating | Reason |
|-------|--------|--------|
| Apple | **4+** | No objectionable content; food-as-medicine sections carry disclaimers |
| Play (IARC) | **Everyone** | Same as above |

---

## 6. Categories

| Store | Primary | Secondary |
|-------|---------|-----------|
| Apple | Food & Drink | Health & Fitness |
| Play | Food & Drink | (n/a — Play uses tags not secondary cat) |

---

## 7. Compliance attestations (both stores ask)

- **Does the app comply with COPPA?** Yes — not directed at children under 13. Newsletter requires age 13+ confirmation.
- **Does the app use export-controlled encryption?** No (only standard HTTPS/TLS). Both stores accept the "uses exempt encryption" declaration.
- **Does the app contain ads?** No (affiliate links don't count as ads under either store's definition — they are editorial product recommendations).
- **Government identifier required?** No.
- **Financial services?** No.
- **Restricted content (alcohol, tobacco, drugs, weapons, gambling)?** No.

---

## 8. Support + legal URLs (used by both stores)

| Field | URL |
|-------|-----|
| Privacy Policy | https://www.recipecrave.com/privacy |
| Terms of Service | https://www.recipecrave.com/terms |
| Support / Contact | https://www.recipecrave.com/contact |
| Marketing site | https://www.recipecrave.com |
| About | https://www.recipecrave.com/about |
| Editorial Policy | https://www.recipecrave.com/editorial-policy |
| Nutrition Disclaimer | https://www.recipecrave.com/nutrition-disclaimer |

> All seven URLs already live and indexable. Verify each returns HTTP 200 before submitting.
