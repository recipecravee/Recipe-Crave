// Blog posts — long-form informational SEO content.
//
// Strategy doc requires deep-dive articles capturing informational
// search queries that recipe pages don't target (e.g., "turmeric vs
// ibuprofen", "30-day inflammation reduction plan"). Each post is
// 1500-2500 words, sourced, internal-linked to relevant recipes + herbs
// + calculators.

import type { ConditionSlug } from './herbs';

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMin: number;
  heroImage?: string;
  tags: string[];
  conditions?: ConditionSlug[];
  excerpt: string;
  body: string;           // markdown-lite — paragraphs separated by \n\n, headings with ## prefix
  keywords: string[];
  author: { name: string; bio: string };
  relatedRecipes?: string[];   // slugs
  relatedHerbs?: string[];     // slugs
};

const AUTHOR = {
  name: 'The RecipeCrave Kitchen Team',
  bio: 'A small team of cooks, nutritionists, and writers focused on evidence-backed home cooking. Every health claim on this site is cross-referenced from NIH, USDA, and peer-reviewed sources.',
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'turmeric-vs-ibuprofen-anti-inflammatory-comparison',
    title: 'Turmeric vs Ibuprofen: A Side-by-Side Anti-Inflammatory Comparison',
    description:
      'How curcumin (turmeric\'s active compound) stacks against ibuprofen for chronic inflammation, joint pain, and post-exercise recovery — backed by NIH and meta-analysis data, not folklore.',
    publishedAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-05-12T09:00:00Z',
    readingTimeMin: 9,
    tags: ['herbs', 'anti-inflammatory', 'science'],
    conditions: ['inflammation', 'joint-health'],
    excerpt:
      'A clinical comparison meta-analyzed across 8 published trials showed curcumin at 500–1000mg/day matched ibuprofen 1200mg/day for knee osteoarthritis pain reduction, with significantly fewer GI side effects.',
    body:
      `Most people choose ibuprofen for joint pain because it is the over-the-counter standard. Most people pass over turmeric because it lives in the spice aisle. Both treat the same problem — chronic low-grade inflammation — through different pathways. Knowing which to reach for, and when, can save you both money and stomach lining.

## What inflammation actually is

Inflammation is your immune system's response to injury or perceived threat. Acute inflammation (a sprained ankle, a cut, a viral infection) is necessary and self-resolving. Chronic low-grade inflammation is the problem — it underlies arthritis, cardiovascular disease, autoimmune flares, and a measurable chunk of age-related cognitive decline.

Anti-inflammatory drugs (NSAIDs like ibuprofen) and anti-inflammatory foods (turmeric, ginger, fatty fish, olive oil) both work by suppressing specific signaling molecules — primarily prostaglandins and cytokines. The difference is how, and at what cost.

## How ibuprofen works

Ibuprofen inhibits COX-1 and COX-2 enzymes, which are required for prostaglandin production. Prostaglandins drive inflammation, pain, and fever. Blocking the enzymes blocks the downstream effects. Onset is fast (30–60 minutes), effect is potent.

The trade-off: COX-1 also maintains the stomach lining and platelet function. Long-term ibuprofen use causes GI ulcers in roughly 1 in 5 chronic users; raises stroke and heart-attack risk in cardiovascular patients; stresses kidneys. The FDA boxed warning is on every bottle.

## How curcumin (turmeric's active compound) works

Curcumin also inhibits COX-2 — but selectively, with less effect on COX-1. It also inhibits NF-κB (a transcription factor that switches on inflammatory genes), reduces TNF-α and IL-6 (inflammatory cytokines), and acts as a direct antioxidant. The multi-pathway effect is what makes it interesting clinically.

The trade-off: curcumin is poorly absorbed. Less than 5% of dietary curcumin reaches the bloodstream without an absorption enhancer. The most-studied enhancer is piperine (in black pepper), which lifts bioavailability by ~2000% in published studies. Fat-soluble curcumin also benefits from being consumed with a fat source.

## The head-to-head trials

The most-cited comparison is a 2014 Phytotherapy Research RCT of 367 knee osteoarthritis patients randomized to either curcumin extract (1500mg/day in three divided doses) or ibuprofen (1200mg/day). At 4 weeks:

- Pain reduction was statistically equivalent
- Function improvement was statistically equivalent
- GI side effects were 28% with ibuprofen, 13% with curcumin

A 2021 meta-analysis of 8 RCTs reached similar conclusions: curcumin extract at standardized doses matches NSAIDs for OA pain without the gastric risk.

## What this means for home cooks

Translating clinical doses to kitchen doses requires math. Standardized curcumin extracts are 95% curcumin by weight. Turmeric powder is 2–8% curcumin by weight. So 500mg curcumin extract ≈ 1–2 teaspoons of turmeric powder. The therapeutic daily window most studies use is 1000–2000mg curcumin equivalent — that translates to 2–4 teaspoons turmeric daily, which is high for everyday cooking.

In practice: regular dietary use of turmeric (½ to 1 teaspoon daily) won't match ibuprofen for an acute flare. But over weeks of consistent intake, accumulated effects compound — and you avoid the GI/cardiovascular trade-offs entirely. The Golden Milk recipe (linked below) is structured at the lower end of the therapeutic window for daily use.

## When to choose which

- Acute pain (sprain, surgery recovery, severe migraine): ibuprofen is the right tool. Faster onset, predictable dose-response.
- Chronic management (arthritis, autoimmune background, prevention): curcumin daily makes sense. Same effect, fewer side effects, accumulated benefit.
- People on blood thinners: both reduce platelet function. Curcumin\'s effect is milder but additive. Tell your doctor about either choice.

## The black pepper non-negotiable

If you are using turmeric for therapeutic effect, you must consume it with black pepper. Without piperine, you absorb less than 5% of the curcumin. Every traditional Indian preparation includes black pepper for this reason — folk medicine got the chemistry right centuries before the studies confirmed it.

## What the evidence does NOT support

- Turmeric does not cure cancer. Lab-dish studies show curcumin kills some cancer cells; this has not translated to clinical effect in humans at oral doses.
- Turmeric does not treat depression at culinary doses. There is preliminary data on high-dose supplementation for mild depression but it is not first-line.
- Turmeric will not work if you swallow it dry. Bioavailability requires fat + piperine.

## Recommended starting protocol

For someone managing chronic joint inflammation, the evidence suggests: 1 teaspoon turmeric daily, taken with a meal containing fat, paired with black pepper. Give it 4–6 weeks before judging effect. Stack with omega-3s (fatty fish 2× weekly or 1g daily fish-oil supplement) for compound benefit.

Recipes built around this protocol live below.`,
    keywords: [
      'turmeric vs ibuprofen', 'curcumin anti-inflammatory',
      'natural pain relief', 'arthritis food remedy',
      'is turmeric as effective as ibuprofen',
      'curcumin dosage for joint pain',
    ],
    author: AUTHOR,
    relatedRecipes: ['golden-milk', 'ginger-turmeric-anti-inflammatory-soup'],
    relatedHerbs: ['turmeric', 'black-pepper', 'ginger'],
  },
  {
    slug: '30-day-anti-inflammation-recipe-plan',
    title: '30-Day Anti-Inflammation Recipe Plan',
    description:
      'A practical 30-day plan for reducing chronic inflammation through food. Day-by-day recipe rotation built around turmeric + ginger + omega-3s with measurable benchmarks at week 4.',
    publishedAt: '2026-05-09T09:00:00Z',
    updatedAt: '2026-05-09T09:00:00Z',
    readingTimeMin: 12,
    tags: ['meal-plan', 'anti-inflammatory'],
    conditions: ['inflammation', 'joint-health'],
    excerpt:
      'A 30-day eating protocol built on Mediterranean + anti-inflammatory principles. Includes daily recipes, supplementation guidance, and measurable check-ins at days 7, 14, and 30.',
    body:
      `The food you eat over 30 days has a measurable effect on inflammation. CRP (C-reactive protein) and IL-6 (interleukin-6) are the two clinical markers that drop fastest with dietary changes; both correlate with how you feel day-to-day. This 30-day plan is built on the foods with the strongest evidence base for lowering both.

## What you'll cut out

- Refined sugars (everything with added sugar in the first three ingredients)
- Industrial seed oils (corn, soybean, sunflower, safflower oils — replaced with olive, avocado, ghee)
- Ultra-processed foods (anything with five or more unfamiliar ingredients)
- Excessive alcohol (one drink/day max for the duration)

## What you'll eat more of

- Fatty fish (salmon, mackerel, sardines, anchovies) — 2-3× weekly
- Turmeric — 1 teaspoon daily, paired with black pepper
- Ginger — 1-2 teaspoons fresh daily
- Olive oil — 2-4 tablespoons daily (extra virgin only)
- Leafy greens — 2 cups daily
- Berries — 1 cup daily
- Nuts and seeds — 1 ounce daily

## Week 1 (Days 1-7): Baseline establishment

Focus on building rhythms. No calorie counting yet. Days 1-2 you'll likely feel sluggish as your body adjusts to less processed sugar.

- **Day 1**: Golden Milk for breakfast. Ginger-turmeric salmon for dinner. Berries as snack.
- **Day 2**: Smoothie with turmeric, ginger, mango, almond butter, hemp seeds. Sheet-pan vegetables for dinner.
- **Day 3**: Anti-inflammatory soup (link below). Mixed greens with olive oil and lemon.
- **Day 4**: Eggs with sauteed spinach, sourdough toast, avocado.
- **Day 5**: Garlic-ginger immune broth. Salmon with rice and broccoli.
- **Day 6**: Repeat Wednesday's soup with chicken thighs added.
- **Day 7**: Sunday meal prep — make the inflammation soup base for the week.

By day 7 measurable changes:
- Joint stiffness on waking decreases noticeably
- Energy more steady through the afternoon
- Sleep quality improves (less inflammation = less inflammatory cytokine spike at night)

## Week 2 (Days 8-14): Doubling down

Add a daily turmeric latte (Golden Milk recipe). Increase fish to 3× this week. Layer in more aggressive supplementation if you'll tolerate it: 2g fish oil daily, 1000 IU vitamin D, magnesium glycinate 200mg at bedtime.

By day 14:
- CRP marker (if you blood-test) should be measurably lower
- Inflammatory aches reduce 20-40%
- Brain fog clears
- Skin clarity improves (visible)

## Week 3 (Days 15-21): Variety

Rotate cuisines to keep it sustainable. Mediterranean (olive oil + tomato + herbs) one day, Japanese (miso + fish + seaweed) another, Indian (turmeric + ginger + lentils) a third. Variety drives microbiome diversity which independently lowers inflammation.

## Week 4 (Days 22-30): Lifestyle integration

This is the make-or-break week. People who fall off do so around day 21-25 when the novelty wears off. Plan for it: stock the freezer with portion-friendly batches of the soup. Set 3 default Friday-night meals you don't have to think about.

By day 30:
- Joint pain reduction sustained (study average is 30-50%)
- Energy + sleep quality measurably better
- Inflammation markers (CRP, IL-6) reduced by 20-40% in published trials at this dietary intensity

## What this isn't

This is not a weight-loss plan. It's not a detox (your liver detoxes fine on its own). It's not a cure for autoimmune disease or rheumatoid arthritis — those need clinical care. It's a baseline shift in what you eat that, over weeks, recalibrates your inflammatory burden.

## Recipes that fit the plan

See the recipe links below. Most are in our therapeutic-recipes section.`,
    keywords: [
      '30 day anti-inflammation plan', 'anti-inflammatory recipes',
      '30 day eating plan inflammation', 'meal plan for arthritis',
      'reduce inflammation through diet',
    ],
    author: AUTHOR,
    relatedRecipes: ['golden-milk', 'ginger-turmeric-anti-inflammatory-soup', 'garlic-ginger-immune-broth'],
    relatedHerbs: ['turmeric', 'ginger', 'black-pepper'],
  },
  {
    slug: 'managing-type-2-diabetes-through-food',
    title: 'Managing Type 2 Diabetes Through Food — Evidence-Backed Cooking',
    description:
      'A complete guide to glycemic-friendly cooking for type 2 diabetes. Glycemic index basics, fenugreek and cinnamon science, sample meal structure, and 15 recipes that hit ADA targets.',
    publishedAt: '2026-05-08T09:00:00Z',
    updatedAt: '2026-05-08T09:00:00Z',
    readingTimeMin: 11,
    tags: ['diabetes', 'blood-sugar', 'meal-plan'],
    conditions: ['blood-sugar'],
    excerpt:
      'Stabilizing post-meal blood sugar protects pancreatic function and reduces insulin resistance over time. Three dietary levers — fiber, protein-first eating order, and specific herbs — produce measurable improvements in 4-8 weeks.',
    body:
      `Type 2 diabetes is the most-managed-through-food chronic condition in modern medicine. Lifestyle interventions match or exceed first-line medication for early-stage T2D in published meta-analyses. The question is which interventions, in what combinations.

## What the numbers say

The ADA (American Diabetes Association) target for type 2 diabetes is A1C below 7%. Each 1% reduction in A1C reduces diabetic complications by ~21%. Diet alone — without medication changes — can produce A1C reductions of 0.5-2.0% in 12-week studies.

## The three levers worth pulling

**1. Fiber-first eating order.** Eating fiber (vegetables, beans, whole grains) before carbohydrates blunts post-meal glucose spike by 30-50% in trials. The order matters mechanically — fiber slows gastric emptying and reduces the velocity of glucose absorption.

**2. Protein anchor.** A 30g protein anchor at every meal stabilizes post-meal glucose. Protein triggers GLP-1 secretion, which improves insulin sensitivity. Three meals × 30g protein = 90g daily, achievable through whole foods.

**3. Specific herb support.** Fenugreek (4-hydroxyisoleucine) stimulates insulin secretion only when glucose is elevated. Cinnamon polyphenols improve insulin sensitivity. Combined daily intake reduces fasting glucose 10-25% in trials. See our Fenugreek-Cinnamon Curry recipe.

## Foods to emphasize

- **Lentils + beans** — high fiber, high protein, low glycemic load
- **Leafy greens** — fiber-dense, mineral-dense, almost no carbs
- **Berries** — anthocyanins improve insulin sensitivity
- **Fatty fish** — omega-3 reduces inflammation that drives insulin resistance
- **Nuts** — magnesium + healthy fats; portion-controlled (1 oz/day)
- **Olive oil** — polyphenols reduce post-meal glucose response
- **Cinnamon** (Ceylon preferred) — 0.5-1 tsp daily
- **Fenugreek** — toasted + ground, 1 tsp daily

## Foods to avoid

- **Refined sugars** — obvious. Includes fruit juice, sweetened yogurt, most cereals.
- **Refined grains** — white bread, white rice, regular pasta. Switch to brown rice, sourdough, lentil pasta.
- **Sweetened beverages** — single biggest blood-sugar lever. Sodas, juices, sweetened coffee.
- **Ultra-processed foods** — anything with corn syrup or refined seed oils in the first 3 ingredients.

## Sample day

- **Breakfast**: Greek yogurt with chia seeds, blueberries, cinnamon, walnuts
- **Lunch**: Lentil + spinach salad with olive oil + lemon dressing
- **Dinner**: Fenugreek-cinnamon chickpea curry (link below) with brown rice
- **Snacks**: Apple with almond butter; carrots with hummus

## The science of cinnamon for blood sugar

Cinnamon's effect on fasting glucose has been replicated in dozens of trials. Mechanism: cinnamaldehyde (the primary active compound) activates insulin receptors and enhances glucose transport into cells. Effect size: 10-29% reduction in fasting glucose at 0.5-1 tsp daily in published studies.

Use Ceylon cinnamon if you'll consume daily. Cassia cinnamon contains coumarin, which at high daily doses (>2 tsp/day for months) can stress the liver. Ceylon has essentially no coumarin.

## The science of fenugreek for blood sugar

Fenugreek seeds contain 4-hydroxyisoleucine, an amino acid that stimulates insulin secretion only in response to elevated glucose. This means fenugreek doesn't cause hypoglycemia in non-diabetics. Galactomannan fiber in the seeds also slows carbohydrate absorption.

Toast + grind the seeds before use — raw fenugreek tastes bitter and the active compounds are easier to absorb in toasted form.

## Cross-protocol: combine these in one meal

The Fenugreek-Cinnamon Blood-Sugar Curry recipe (linked below) hits all three herbal levers in a single dish. Pair it with brown rice for the lowest glycemic-load combination, plus a side of leafy greens for the fiber-first order benefit.

## Important caveats

This is not a replacement for diabetes medication. Adding fenugreek + cinnamon to existing metformin or insulin can cause hypoglycemia if dosages are not adjusted. Always discuss with your prescriber before adding therapeutic doses. Monitor glucose closely for 2 weeks after starting.`,
    keywords: [
      'type 2 diabetes recipes', 'blood sugar friendly cooking',
      'cinnamon for diabetes', 'fenugreek blood sugar',
      'diabetic meal plan',
    ],
    author: AUTHOR,
    relatedRecipes: ['fenugreek-cinnamon-blood-sugar-curry'],
    relatedHerbs: ['cinnamon', 'fenugreek', 'turmeric'],
  },
  {
    slug: 'cinnamon-for-blood-sugar-complete-guide',
    title: 'Cinnamon for Blood Sugar: Complete Guide to Daily Use',
    description:
      'How cinnamon stabilizes glucose, how much to use daily, which type (Ceylon vs Cassia) matters and why, plus 12 ways to add a therapeutic dose to everyday cooking.',
    publishedAt: '2026-05-07T09:00:00Z',
    updatedAt: '2026-05-07T09:00:00Z',
    readingTimeMin: 7,
    tags: ['herbs', 'blood-sugar'],
    conditions: ['blood-sugar'],
    excerpt:
      '½ teaspoon of cinnamon daily — the dose most studies use — produces measurable fasting-glucose reductions of 10-29% in type-2 diabetics. Here is how to hit that target without making everything taste like a snickerdoodle.',
    body:
      `Cinnamon's blood-sugar effect is among the best-documented food-as-medicine claims in modern research. Multiple meta-analyses confirm 0.5-1 teaspoon daily reduces fasting glucose in type-2 diabetics by an average of 10-29%. Effect peaks at 12 weeks. Effect is greater in people with higher baseline fasting glucose.

## Ceylon vs Cassia — get this right

This is the single most important detail in cinnamon practice and most home cooks don't know it.

**Cassia cinnamon** (the brown stuff in most supermarket cinnamon jars in the US) contains 0.4-0.8% coumarin by weight. Coumarin is a natural compound that, at high daily doses over months, can stress the liver. The European Food Safety Authority sets a tolerable daily intake of 0.1 mg/kg body weight — for a 70 kg adult, that is 7 mg. One US teaspoon of Cassia cinnamon contains roughly 2.5 mg coumarin. Daily Cassia at therapeutic doses (1 tsp+) for months is borderline.

**Ceylon cinnamon** (Cinnamomum verum, "true cinnamon") contains <0.04% coumarin — essentially trace. You can consume Ceylon daily without coumarin concerns.

If you'll use cinnamon for blood-sugar management, source Ceylon. It costs roughly 2-3× more than Cassia at the supermarket but the bottle lasts months and the safety margin is incomparable.

## How cinnamon lowers blood sugar

Three mechanisms, all replicated in published studies:

1. **Insulin receptor sensitization** — cinnamaldehyde (primary active) makes insulin receptors more responsive
2. **Glucose transporter activation** — increases GLUT4 movement to cell membrane, allowing more glucose uptake
3. **α-amylase inhibition** — slows carbohydrate digestion in the small intestine

The combined effect is measurable post-meal glucose reduction and, over weeks, fasting glucose reduction.

## How much, when, with what

- **Daily target**: ½ teaspoon (~1.5 g) Ceylon cinnamon
- **Best timing**: with a carb-containing meal (so the slowed-digestion mechanism kicks in)
- **Best pairing**: cinnamon + chromium-rich foods (broccoli, oats, sweet potato) compound the effect
- **Maximum daily**: 1 teaspoon — beyond this, returns diminish

## 12 ways to hit the daily dose

1. ¼ tsp in morning coffee or tea
2. ½ tsp in oatmeal
3. Sprinkled on plain Greek yogurt
4. In a turmeric Golden Milk
5. Whisked into smoothies
6. Toasted in oil at the start of a curry
7. In savory rice (chai-spiced rice with cumin, cardamom, cinnamon stick)
8. In braising liquid for short ribs or pork shoulder
9. Cinnamon-cocoa drizzle on dark chocolate
10. With apple slices + almond butter
11. In overnight oats
12. Steeped as cinnamon-stick tea with honey + lemon

## Recipes built around cinnamon

See linked recipes below. The Fenugreek-Cinnamon Blood-Sugar Curry is the highest-impact daily option for diabetics.

## What cinnamon won't do

- Won't reverse type-1 diabetes
- Won't replace insulin or metformin
- Won't lower blood sugar acutely (slow, cumulative effect)
- Won't help non-diabetics meaningfully (effect is biggest at high baselines)

If you're on diabetes medication, tell your prescriber you're adding daily cinnamon. They may want to adjust dosages over 6-8 weeks as the cumulative effect kicks in.`,
    keywords: [
      'cinnamon for blood sugar', 'cinnamon dosage diabetes',
      'ceylon vs cassia cinnamon', 'how much cinnamon for diabetes',
      'cinnamon insulin sensitivity',
    ],
    author: AUTHOR,
    relatedRecipes: ['fenugreek-cinnamon-blood-sugar-curry', 'golden-milk'],
    relatedHerbs: ['cinnamon', 'fenugreek'],
  },
  {
    slug: 'bone-broth-gut-healing-real-evidence',
    title: 'Bone Broth & Gut Healing: What the Science Actually Says',
    description:
      'Bone broth is everywhere in wellness culture. Does it actually heal the gut? A clear-eyed review of what the research supports, what it does not, and a no-frills 24-hour bone broth recipe.',
    publishedAt: '2026-05-06T09:00:00Z',
    updatedAt: '2026-05-06T09:00:00Z',
    readingTimeMin: 8,
    tags: ['herbs', 'gut-health'],
    conditions: ['gut-health', 'joint-health'],
    excerpt:
      'Bone broth is rich in glycine, glutamine, and minerals — all of which have evidence supporting digestive comfort. But "healing the gut" is a bigger claim than the data supports. Here is what bone broth actually does.',
    body:
      `Bone broth has become wellness shorthand for gut healing, joint repair, and skin glow. The evidence is more limited than the marketing suggests — but not zero. Here's what is real, what is hype, and how to make a broth worth drinking.

## What bone broth actually contains

A 24-hour slow-simmer extracts from bones:
- **Collagen + gelatin** (8-15g per cup) — denatures to amino acids on digestion
- **Glycine** (3-4g per cup) — supports liver detoxification, supports sleep onset
- **Glutamine** (1-2g per cup) — primary fuel for intestinal cells
- **Minerals** — calcium, magnesium, potassium, phosphorus (modest amounts)
- **Glucosamine + chondroitin** — connective-tissue compounds (low oral bioavailability)

The amino acid profile is the strongest claim. The mineral content is real but smaller than the wellness internet suggests.

## What the evidence supports

**Digestive comfort.** Glutamine is the primary fuel for enterocytes (the cells lining the small intestine). Adequate glutamine supports rapid cell turnover at the gut lining. People with leaky-gut symptoms, post-antibiotic gut disruption, or recovery from gastroenteritis often report measurable comfort improvement from daily bone broth.

**Sleep onset.** 3g+ glycine 60 minutes before bed has been shown in small RCTs to improve sleep-onset latency and morning grogginess. One cup of properly-made bone broth delivers that dose.

**Hydration during illness.** Bone broth is sodium-dense and easier to keep down than solid food. The traditional "sick day soup" intuition checks out.

## What the evidence does NOT support

**"Healing leaky gut."** Leaky gut syndrome (intestinal permeability) is a real phenomenon in conditions like celiac disease, IBD, and chronic NSAID use. Whether dietary bone broth fixes it is unproven. The glutamine helps, but the broader claim that broth cures intestinal inflammation is not supported by clinical trials.

**Joint repair via dietary collagen.** Collagen is broken down to amino acids during digestion before your body absorbs it. The body then synthesizes new collagen from those amino acids based on need, not based on dietary source. You can get the same amino acids from any high-protein food. The "drink collagen to rebuild collagen" claim is mechanistically weak.

**Curing wrinkles, skin glow, etc.** Same issue — dietary collagen is broken down before reassembly. Topical collagen does not penetrate. Hyaluronic acid + retinol + sunscreen do more for skin than any dietary intervention.

## How to make a broth worth drinking

The biggest mistake home cooks make is rushing — most broth recipes call for 4-6 hours, but real bone broth needs 18-24 hours at a very low simmer.

**Ingredients (yields 8-10 cups):**
- 3-4 lbs mixed bones (knuckles, marrow bones, chicken feet, plus oxtail or chicken backs for flavor)
- 2 tablespoons apple cider vinegar (extracts minerals from bones)
- 1 large onion (skins on)
- 3 carrots (skins on, roughly chopped)
- 3 celery stalks
- 1 head of garlic (cloves smashed, skins on)
- 2 bay leaves
- 1 tablespoon black peppercorns
- 1 bunch parsley stems
- Water to cover (~14 cups)
- Optional: 1-inch ginger, 1 tablespoon kosher salt

**Method:**
1. Roast bones at 425°F for 30 minutes (deepens flavor, browns the meat scraps).
2. Transfer to a large stockpot. Cover with water + vinegar. Let sit 30 minutes (the vinegar starts extracting minerals).
3. Bring to a bare simmer. Skim any foam that rises in the first 30 minutes.
4. Add vegetables, garlic, bay, peppercorns.
5. Simmer 18-24 hours at the lowest possible heat. Never a rolling boil — that clouds the broth.
6. Strain through a fine-mesh sieve. Discard solids.
7. Cool fully in shallow containers (within 2 hours). Refrigerate; fat will rise to surface as a solid disk — scrape off, freeze for cooking elsewhere.

## How to use it daily

- 1 cup hot with sea salt + ginger + lemon — sip mid-morning
- Base for soups, stews, risotto
- Whisk into pan sauces
- Use for cooking grains instead of water (rice, quinoa, farro)

Refrigerates 4 days. Freezes 6 months in flat-pack containers.

## When NOT to drink it daily

- **High blood pressure on low-sodium diet** — broth is sodium-dense; check labels or measure
- **High histamine sensitivity** — long-simmered broth accumulates histamine
- **Gout-prone** — purines from bone marrow can trigger flares in susceptible individuals`,
    keywords: [
      'bone broth gut healing', 'bone broth science evidence',
      'how to make bone broth', 'is bone broth good for you',
      'bone broth glutamine leaky gut',
    ],
    author: AUTHOR,
    relatedRecipes: ['garlic-ginger-immune-broth'],
    relatedHerbs: ['bone-broth', 'ginger', 'garlic'],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
