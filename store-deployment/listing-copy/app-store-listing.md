# App Store Listing — RecipeCrave

Copy each block into the matching App Store Connect field. Character limits are Apple's hard caps.

---

## Name  (≤ 30 chars)

```
RecipeCrave: Cook Smart
```

> 22 chars. Same as Play for cross-store consistency.

---

## Subtitle  (≤ 30 chars)

```
Recipes, plans & pantry match
```

> 29 chars. Subtitle is the second-largest text in the App Store search result — pack it with primary value props.

---

## Promotional text  (≤ 170 chars, editable anytime without re-review)

```
New: AI meal planner generates a personalised week in 30 seconds. Plus offline recipes, food-as-medicine guides, and a pantry matcher that uses what you already have.
```

> 168 chars. Use this slot to announce the latest feature without resubmitting — Apple lets you change it any time.

---

## Description  (≤ 4000 chars)

```
RecipeCrave is your everyday cooking companion. From a 30-second meal planner to a pantry-matched recipe engine, it takes the guesswork out of "what's for dinner?" — and pairs every dish with optional food-as-medicine insights when you want them.

WHAT YOU CAN DO

• Discover real recipes — Thousands of tested dishes across Italian, Indian, Thai, Mexican, Mediterranean, and modern American cuisines. Filter by diet (vegan, keto, gluten-free, dairy-free, paleo, low-FODMAP), course, total time, or ingredients on hand.

• Match your pantry — Tell RecipeCrave what's in your fridge and we surface recipes you can cook tonight without a grocery run. Perfect matches first, then near-misses ("you're one onion away").

• Generate a meal plan — One tap turns "I want a healthy week" into a full Mon–Sun plan with a shopping list. Lock the meals you love; swap the ones you don't.

• Cook with herbs intentionally — Browse our food-as-medicine vertical: ginger for nausea, turmeric for inflammation, garlic for immunity. Every claim is sourced; every page reminds you it's culinary guidance, not medical advice.

• Scale + convert without tabs — Built-in calculators handle servings (resize recipes 1× → 12× live), unit conversion (cups ↔ grams), recipe cost, calorie estimates, ingredient substitutions, baking ratios, and storage life.

• Reads offline — Open RecipeCrave with no signal and your last-viewed recipes still load. Add to your home screen for a full-screen, app-like experience.

• Daily inspiration — Optional push notifications send a 09:00 daily digest of seasonal recipes, herbal tips, and how-to guides. One tap to mute.

PRIVACY-FIRST BY DEFAULT

No ads. No third-party trackers. Anonymous analytics only. Newsletter signup is optional and you can delete your data anytime from your profile page. We never sell email lists.

WHY RECIPECRAVE

We built RecipeCrave because every other recipe site burns the screen with autoplay video ads and 1,500-word personal essays before the ingredients. Here, the recipe loads in under a second, the print version actually prints clean, and the food-as-medicine section is written by humans who care about evidence.

Cook better. Waste less. Feel more like yourself.

Got feedback? hello@recipecrave.com.
```

---

## Keywords  (≤ 100 chars, comma-separated, single string — Apple uses these to drive search)

```
recipes,meal planner,pantry,cooking,healthy,vegan,keto,herbs,grocery,kitchen,diet,food
```

> 87 chars. Don't repeat words from Name or Subtitle (Apple indexes both automatically — wasted slots).

---

## Support URL

```
https://www.recipecrave.com/contact
```

## Marketing URL

```
https://www.recipecrave.com
```

## Privacy Policy URL

```
https://www.recipecrave.com/privacy
```

---

## App Review notes  (paste into "Notes" under App Review Information)

```
RecipeCrave is a wrapped PWA of https://www.recipecrave.com built via PWABuilder.

Key native-bridge features Apple should test:
1. OFFLINE: Force the device into Airplane Mode after opening the app once. Browse to a previously-viewed recipe — content still renders from cache. Browse to a never-viewed URL — fallback /offline.html renders.
2. PUSH: Settings → Notifications → RecipeCrave is exposed. The 09:00 daily digest fires via the production cron when subscribed.
3. SPLASH: Cold launch displays the iOS splash image matching the device — we've generated assets for 12 device families × 2 orientations.
4. SHARE: The native iOS share sheet is available from every recipe page (handles via Web Share API where supported).

There is no login wall — the entire app is browsable without an account. An optional "Profile" page lets users save recipes; auth is via magic link.

Contact: hello@recipecrave.com if you need anything during review.
```

---

## What's new  (≤ 4000 chars, per release)

### 1.0 — initial launch

```
Welcome to RecipeCrave! This first release packs:
• Thousands of tested recipes filterable by diet, cuisine, and pantry
• One-tap weekly meal planner with shopping list
• Pantry-matcher: cook tonight with what you already have
• Food-as-medicine guides for everyday herbs
• 11 built-in calculators (scaling, conversion, cost, substitutions)
• Full offline support — recipes load with no signal
• Optional daily digest push notifications

Send feedback to hello@recipecrave.com.
```

---

## Age rating answers (questionnaire — answer No to everything except)

Apple's questionnaire is in App Store Connect → App Information → Age Rating. Answer:

- **Frequent/Intense Realistic Violence:** None
- **Frequent/Intense Cartoon or Fantasy Violence:** None
- **Profanity or Crude Humor:** None
- **Mature/Suggestive Themes:** None
- **Horror/Fear Themes:** None
- **Sexual Content or Nudity:** None
- **Alcohol, Tobacco, or Drug Use or References:** None
- **Simulated Gambling:** None
- **Medical/Treatment Information:** **Infrequent/Mild** (the food-as-medicine vertical references herbs for wellness; every page has a disclaimer that it is not medical advice)
- **Unrestricted Web Access:** No (in-app browsing is scoped to recipecrave.com)
- **Gambling and Contests:** No
- **User Generated Content:** **Yes — Limited** (variations are moderator-approved before public display)

→ Resulting age rating: **4+**
