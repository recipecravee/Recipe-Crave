# RecipeCrave — Full Audit Findings

Audited via local preview (http://localhost:3000). Catalog scanned: 244 recipes across 14 category pages, 65 cuisine pages, 11 diet pages, 13 collection pages, 8 herb pages, plus drinks/iced-treats.

**This document is read-only — nothing fixed yet.** Use this as the punch-list.

---

## 1. SLUG / TITLE TYPOS (need rename)

| Bad slug | Bad title | Should be |
|---|---|---|
| `carribean-rice-and-peas` | "Carribean Rice And Peas" | `caribbean-rice-and-peas` / "Caribbean Rice And Peas" (one R) |
| `yam-and-sweet-ptatoes` | "Yam And Sweet Ptatoes" | `yam-and-sweet-potatoes` / "Yam And Sweet Potatoes" (missing "o") |
| `butter-fly-fluffy-moi-moi` | "Butter Fly Fluffy Moi Moi" | Likely `butterfly-moi-moi` (one word) — needs your confirmation on exact name |
| `1-basmati-rice-7-goat-meat` | "1. Basmati Rice 7. Goat Meat" | Numbered-list import bug. Could be `goat-meat-basmati-rice` OR split into two separate recipes. **NEEDS USER DECISION.** |

---

## 2. WRONG DESCRIPTION BLEEDS (text shows wrong recipe)

| Recipe | Wrong description it currently shows | Should be |
|---|---|---|
| `crispy-fried-chicken` | "Garlic bread is made to accompany most soups" | Real fried chicken description |
| `parfait` | "Nobody goes wrong with a lemon cake, it is perfect every time" | Real parfait description |
| `yam-and-sweet-ptatoes` | "Stewing is done on the top of a cooker..." (casserole-sauce text) | Real yam + sweet potato porridge description |

---

## 3. STRAY NUMBER PREFIXES IN DESCRIPTIONS

27 recipes have descriptions starting with a stray digit (import bug — list-position number left in text). Pattern: `description: '<number> <real text>...'`. All in `recipecrave-recipes.ts`. Fix by stripping the leading number + space.

Affected slugs:
butterfly-prawns (77), scotch-egg (78), popcorn-chicken (82), beer-batter-fish-burger (63), beef-burger (56), singapore-noodles (50), pink-pasta (52), asun-rice (32), carribean-rice-and-peas (33), atama-banga (30), potato-balls (102), flavoured-pancakes (107), efo-riro (16), ofe-owerri (27), seafood-boil (31), fisherman-soup (29), buka-stew (5), ofada-sauce (4), charcuterie-board (76), grilled-fish (115), naan-bread (127), stuffed-masa (128), kelewele (137), full-salad (138), fresh-fish-pepper-soup (131), cowtail-and-plantain (15), ekpang-nkukwo (14).

---

## 4. EXTRA TYPOS IN DESCRIPTIONS

| Recipe | Typo | Fix |
|---|---|---|
| `scotch-egg` | "A scotch egg is a boiled egg is a boiled egg that has been..." | Remove duplicated "is a boiled egg" |
| `spicy-chili-garlic-noodles` | "gets read in about fifteen minuets" | "gets ready in about fifteen minutes" (read→ready, minuets→minutes) |

---

## 5. GENERIC PLACEHOLDER DESCRIPTIONS (47 recipes — auto-import boilerplate)

Pattern: "A signature [category] recipe — detailed prep, ingredient mapping, and finishing technique by the RecipeCrave kitchen team."

These need real recipe descriptions. **Many you may need to supply.**

### Cocktails & mocktails (19 — almost the whole category)
sloppy-joes·shrimp-taco·onion-rings·fish-roll·chicken-nuggets·apple-pie·plantain-chips·subway-sandwich·crispy-calamari-and-tartar·ginger-bread-cookies·samosa-and-spring-roll·spicy-beef-penne·prawn-native-pasta·shawarma·waffles·mashed-potatoes·oreo-crumble·single-skillet-chocolate-chips-cookies·velvet·chocolate-muffin·rotisserie-chicken·grilled-prawns·t-bone-steak·honey-barbecue-wings·isi-ewu·1-basmati-rice-7-goat-meat·bush-meat-and-plantain·simple-oreo-milk-shake·whiskey-sour-without-eggs·tequila-sunrise·flavor-mimosa·cosmopolitan·rainbow-paradise·long-island-iced-tea·margarita·champagne-holiday·classic-mojito·passion-fruit-daiquiri·wings-signature·classic-martini·moscow-mule·kiwi-fizz·wavy·blue-colada·cinnamon-mimosa·bubble-signature·whipped-cream-mimosa

---

## 6. WRONG CATEGORY ASSIGNMENTS

| Recipe | Currently in | Should be in |
|---|---|---|
| `charcuterie-board` | /categories/desserts | /categories/sides OR new /categories/appetizers |
| `tropical-juice` | /categories/porridges | /categories/drinks |
| `fish-roll` | Has "snacks" description but appears in /categories/small-chops | Pick one category, fix description label |

---

## 7. DUPLICATE RECIPES (same dish, two slugs)

| Slug A | Slug B | Action |
|---|---|---|
| `zobo` | `zobo-hibiscus-drink` | Merge — delete one, redirect 301 |
| `akara` | `akara-bean-fritters` | Merge OR clearly differentiate (one Nigerian, one mass-appeal description?) |

---

## 8. IMAGE DUPES (multiple recipes share same photo)

Total: **18 image-key collisions** across catalog. Each collision means 2-6 recipes display the identical thumbnail.

### Severe (5+ recipes share one photo)
| Photo ID | Used by recipes |
|---|---|
| `photo-1598515214211` (efo-riro shot) | efo-riro, ofe-owerri, oha-soup, owo, waterleaf-soup, vegetable-sauce (**6-way**) |
| `photo-1551024709` (generic cocktail) | bubble-signature, kiwi-fizz, rainbow-paradise, wavy, wings-signature (**5-way**) |

### Medium (3-4 recipes share)
| Photo ID | Recipes |
|---|---|
| `photo-1540714605746` (plantain) | fried-plantain-and-eggs, plantain-chips, bush-meat-and-plantain, cowtail-and-plantain |
| `photo-1647162264554` (akara) | akara, akara-bean-fritters, yamarita |
| `photo-1577906096429` (mashed potatoes) | buttered-potatoes, mashed-potatoes, potato-balls |
| `photo-1583549322901` (seafood okra) | fisherman-soup, seafood-boil, seafood-okra |
| `photo-1559339352` (ofada/local rice) | native-rice, atama-banga, ofada-sauce |
| `photo-1565958011703` (mimosa) | cinnamon-mimosa, flavor-mimosa, whipped-cream-mimosa |
| `photo-1603894584373` (butter chicken) | butter-chicken-curry, casserole-sauce, turkey-stew |
| `photo-1601050690597` (samosas) | money-bag, samosa-and-spring-roll, beef-samosas |

### Light (2 recipes share)
| Photo | Recipes |
|---|---|
| `photo-1572448862527` | nkwobi, filipino-chicken-adobo |
| `photo-1565299507177` | isi-ewu, lebanese-tabbouleh, west-african-groundnut-stew (+ others from world-cuisine-heroes global replace) |
| `photo-1620921568790` | cream-cheese-bread, garlic-bread |
| `photo-1610213011891` | fish-roll, meat-pie |
| `photo-1611699363906` | chicken-quesadilla, shrimp-taco |
| `photo-1488477181946` | israeli-hummus, kenyan-ugali, chilean-empanadas, nepalese-momos, ukrainian-borscht (+ more — global replacement leftover) |
| `photo-1672856399624` | grilled-turkey, rotisserie-chicken |
| `photo-1535007813616` | grilled-fish, grilled-fish-and-bole |
| `photo-1713934895383` | singapore-noodles, spicy-chili-garlic-noodles |
| `photo-1568901346375` | beef-burger, beer-batter-fish-burger |
| `photo-1631709497146` | garlic-ginger-immune-broth, vietnamese-pho |
| `photo-1636654931290` | chicken-salad, full-salad |

---

## 9. CONFIRMED IMAGE MISMATCHES (image content does NOT match dish name)

### Confirmed from user mobile screenshot
1. **`native-rice`** → image shows BEACH/RESTAURANT VIEW with chairs + ocean. Photo `1559339352`. **WRONG.**
2. **`jambalaya-rice`** → image shows CITY/RIVER SKYLINE (New Orleans). Photo `1655070180522`. **WRONG.**

### Confirmed from preview audit
3. **`ashwagandha-chamomile-bedtime-rice-pudding`** → image shows GREEN SMOOTHIE (photo-1623065422902). Should be rice pudding. **WRONG.**
4. **`atama-banga`** → uses ofada photo (local rice stew). Atama is palm-fruit soup with atama leaves — different look. **WRONG.**
5. **`vegetable-sauce`** → uses efo-riro photo. Vegetable sauce ≠ efo riro. **WRONG.**
6. **`crispy-fried-chicken`** → has garlic-bread description (already in section 2). Image is photo-1672856399624 (chicken-ish, OK) but desc wrong.

### Suspected (visual unknowns — need user reference)
7. `1-basmati-rice-7-goat-meat` — currently uses curry-goat photo + generic desc
8. `bush-meat-and-plantain` — uses plantain photo, OK-ish but bush meat dish needs its own visual
9. `velvet` — what is this? Image looks like generic dessert
10. `kelewele` — has stray "137" prefix, image may or may not match
11. `naan-bread` — uses naan image (probably fine)
12. `stuffed-masa` — has stray "128" prefix; image unknown
13. `fresh-fish-pepper-soup` — has stray "131" prefix; uses pepper-soup image (probably fine)
14. `nkwobi` — current image is generic meat. Real nkwobi is shredded cow-foot with palm oil + utazi.
15. `isi-ewu` — current image is generic spicy meat. Real isi ewu is goat-head with palm oil.

---

## 10. RECIPES THAT NEED YOUR REFERENCE PHOTO

These dishes I cannot accurately identify a stock photo for without your input. Please send photos OR confirm an Unsplash URL for each:

### Nigerian dishes (specific look I don't have stock for)
- **nkwobi** — shredded cow foot, palm oil base, served in wooden bowl
- **isi-ewu** — goat head pieces with utazi leaves and palm-oil sauce
- **buka-stew** — Lagos-style red palm-oil stew, deep ruby
- **ofada-sauce** — green ayamase pepper sauce (NOT the rice itself)
- **ofe-akwu** — palm-kernel stew, brown/burnt-orange
- **atama-banga** — banga soup with atama leaves, oily palm-fruit base
- **ofe-owerri** — dark-green Imo-state soup
- **oha-soup** — light green oha-leaves soup
- **owo** — Urhobo soup
- **waterleaf-soup** — light green waterleaf
- **moin-moin** (and `butter-fly-fluffy-moi-moi`) — steamed bean pudding, orange-brown
- **akara** — orange-brown bean fritters
- **yamarita** — fried-yam coated in egg/crumb
- **fish-roll** — sausage-roll-shaped tuna pastry
- **meat-pie** — Nigerian style (not British)
- **kelewele** — spicy fried plantain cubes
- **stuffed-masa** — northern Nigerian rice cake stuffed with meat
- **chin-chin** — fried sweet dough cubes
- **scotch-egg** — Nigerian-style (probably OK with stock)
- **suya-rice** — jollof with suya beef
- **asun-rice** — spicy goat-meat jollof
- **native-rice** — palm-oil-stained "concoction rice"
- **bush-meat-and-plantain** — grasscutter/antelope meat with plantain
- **fried-plantain-and-eggs** ("dodo + eggs")
- **smokey-jollof-rice** — heavily charred bottom, dark
- **signature-coconut-rice** — pale-orange rice with coconut chunks
- **cowtail-and-plantain** — cow-tail porridge
- **ekpang-nkukwo** — cocoyam wrap soup
- **fried-beans** — Nigerian style
- **yam-and-sweet-potatoes** — porridge form

### Cocktails / mocktails (mostly generic; can use stock)
Anything specific to YOUR cocktail recipes (e.g., "Wings Signature", "Bubble Signature", "Wavy", "Rainbow Paradise", "Kiwi Fizz", "Champagne Holiday", "Cinnamon Mimosa") — these are signature/proprietary names. **What do they look like? Provide reference.**

### Other regional uncertainties
- **west-african-groundnut-stew** — peanut-based deep stew
- **kenyan-ugali-and-sukuma-wiki** — ugali (corn meal) + sukuma (greens)
- **senegalese-yassa-poulet** — yellow chicken in onion-mustard sauce
- **ivorian-attieke-with-grilled-fish** — couscous-like cassava + grilled fish
- **mongolian-beef** — restaurant-style brown beef strips
- **cambodian-fish-amok** — yellow coconut-fish curry
- **sri-lankan-fish-curry** — yellow/red Sri Lankan curry
- **filipino-chicken-adobo** — soy-vinegar braised chicken
- **hainanese-chicken-rice** — pale poached chicken + jade rice
- **portuguese-bacalhau-a-bras** — shredded salt cod with potato strings
- **belgian-moules-frites** — mussels + fries
- **soul-food-fried-chicken-and-collards** — Southern crispy chicken + dark collards
- **cajun-jambalaya** — confirm: the photo-1655070180522 image (New Orleans skyline) is on the recipe — needs SWAP
- **hawaiian-poke-bowl** — raw tuna on rice with mango/seaweed

---

## 11. CONTENT GAPS

- **/categories/iced-treats** only has 3 recipes. Need: sundae, frozen yogurt, gelato variants, frappes, granita.
- **Most cocktail recipes have GENERIC placeholder descriptions** — all 19 cocktails need real recipe text.
- **Many "signature" cocktails (Wings, Bubble, Wavy, Rainbow Paradise)** have no real recipe content — what are they?

---

## SUMMARY

| Issue type | Count |
|---|---|
| Slug + title typos | 4 |
| Description bleeds (wrong text on card) | 3 |
| Stray number prefixes | 27 |
| Other text typos | 2 |
| Generic placeholder descriptions | 47 |
| Wrong category assignments | 3 |
| Duplicate recipes | 2 |
| Image-key dupes (sets) | 18 |
| Confirmed image-content mismatches | 6 |
| Visual unknowns needing your reference | 35-40 |

## RECOMMENDED ORDER OF FIXING

1. **Mass-fix the 27 stray-number-prefix descriptions** (mechanical regex)
2. **Fix 3 wrong-description bleeds** (paste correct text)
3. **Rename 4 typo slugs** (with 301 redirects to preserve SEO)
4. **Move 3 wrong-category recipes**
5. **Merge 2 duplicate recipes**
6. **Replace 6 confirmed wrong-content images** (you provide URLs)
7. **Replace 18 dupe-image keys** (you provide URLs for distinct ones)
8. **Write 47 real descriptions** for placeholder recipes (you confirm content)
9. **Add ~15 iced-treats recipes** to fill category
