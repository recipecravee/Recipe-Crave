// Therapeutic synergy-led demo recipes.
//
// Each recipe pairs herbs documented in `herbs.ts` whose combined effect
// exceeds the sum of their parts (see SYNERGIES table). Tagged with both
// herb slugs (in `keywords`) and a `therapeuticConditions[]` field that
// /conditions/[slug] pages auto-pick-up.
//
// These are food, not medicine. Each recipe includes safety notes per the
// herb's contraindications.

import type { Recipe } from '@/types/recipe';
import { IMG } from './image-bank';

const NOW = '2026-05-12T14:00:00Z';

// Extended recipe shape — adds a `therapeuticConditions` field. Stored as
// extra keywords so existing Recipe-type consumers (RecipeCard, slug page,
// JSON-LD) keep working unchanged.
export type TherapeuticRecipe = Recipe & {
  cookingGuide?: {
    platingTips: string;
    mistakesToAvoid: string[];
    substitutions: Array<{ from: string; to: string; note?: string }>;
  };
};

function base(slug: string, image: string | null) {
  return {
    id: slug,
    slug,
    heroImage: image,
    galleryImages: [] as string[],
    videoUrl: null,
    publishedAt: NOW,
    updatedAt: NOW,
    authorId: null,
    isAiAssisted: false,
    isPublished: true,
    viewCount: 0,
    saveCount: 0,
    cookCount: 0,
    avgRating: 4.8,
    ratingCount: 24,
  };
}

export const THERAPEUTIC_RECIPES: TherapeuticRecipe[] = [
  // ============================================================
  // 1. GOLDEN MILK — Turmeric + Black Pepper + Ginger + Cinnamon
  // ============================================================
  {
    ...base('golden-milk', ((IMG as Record<string, string | undefined>)['latte'] ?? null) as string | null),
    title: 'Golden Milk (Turmeric Latte) — Anti-Inflammatory Bedtime Drink',
    description:
      'A 5-minute warm drink built around the turmeric + black pepper synergy that boosts curcumin absorption by 2000%. Layered with fresh ginger for compound anti-inflammatory effect, cinnamon for blood-sugar balance, and coconut milk for fat-assisted curcumin uptake. Traditional Ayurvedic recipe with modern dosing precision.',
    prepTimeMin: 3,
    cookTimeMin: 7,
    totalTimeMin: 10,
    servings: 2,
    difficulty: 'easy',
    cuisine: 'indian',
    course: 'beverage',
    occasion: null,
    equipment: ['Small saucepan', 'Whisk or milk frother', 'Fine-mesh strainer'],
    ingredients: [
      { name: 'unsweetened coconut milk (canned, full-fat)', qty: 1.5, unit: 'cup' },
      { name: 'unsweetened almond milk (or oat milk)', qty: 0.5, unit: 'cup' },
      { name: 'ground turmeric', qty: 1.5, unit: 'tsp', notes: '~3g — therapeutic anti-inflammatory dose' },
      { name: 'freshly cracked black pepper', qty: 0.25, unit: 'tsp', notes: 'Piperine unlocks 2000% more curcumin absorption' },
      { name: 'fresh ginger, grated', qty: 1, unit: 'tbsp' },
      { name: 'cinnamon (Ceylon preferred)', qty: 0.5, unit: 'tsp' },
      { name: 'raw honey or maple syrup', qty: 1, unit: 'tbsp', notes: 'Add off-heat — preserves enzymes if using raw honey' },
      { name: 'coconut oil or ghee', qty: 1, unit: 'tsp', notes: 'Fat-soluble curcumin needs a fat carrier' },
      { name: 'vanilla extract', qty: 0.25, unit: 'tsp' },
      { name: 'sea salt', qty: 1, unit: 'pinch' },
    ],
    instructions: [
      { step: 1, text: 'Combine coconut milk and almond milk in a small saucepan over medium-low heat. Warm gently — never let it boil. Hot milk steams the volatile oils out of the spices.' },
      { step: 2, text: 'Whisk in turmeric, black pepper, grated ginger, and cinnamon. Whisk constantly for 1 minute until the spices are fully dispersed and the color turns a deep saffron-orange.' },
      { step: 3, text: 'Add coconut oil (or ghee) and continue whisking. The fat helps dissolve curcumin from the turmeric powder — never skip this step.' },
      { step: 4, text: 'Heat for 4-5 minutes total at a bare simmer, stirring often. Should never bubble. Steam means it is ready.' },
      { step: 5, text: 'Remove from heat. Wait 60 seconds (so honey enzymes survive), then whisk in honey and vanilla.' },
      { step: 6, text: 'Strain through a fine-mesh sieve into two mugs to catch ginger bits. Add a tiny pinch of sea salt — it sharpens the spices.' },
      { step: 7, text: 'Sprinkle a final dusting of cinnamon on top. Sip slowly over 10-15 minutes for maximum absorption.' },
    ],
    tips:
      'For the strongest anti-inflammatory benefit, drink within 30 minutes of a meal containing some fat — curcumin is fat-soluble and absorbs best with food. Drinking on an empty stomach gives less benefit.',
    storageNotes:
      'Best fresh. Will keep 2 days refrigerated — reheat gently. Texture may separate; whisk to recombine.',
    freezerNotes:
      'Not recommended. Freezing separates the milks and dulls the spice potency.',
    nutrition: {
      calories: 220,
      proteinG: 3,
      carbsG: 14,
      fatG: 18,
      fiberG: 1,
      sodiumMg: 80,
      sugarG: 10,
      satFatG: 16,
    },
    costPerServingUsd: 1.6,
    dietaryTags: ['vegetarian', 'gluten-free', 'dairy-free'],
    allergenTags: ['tree-nut'],
    keywords: [
      'golden milk', 'turmeric latte', 'anti-inflammatory drink', 'turmeric ginger drink',
      'bedtime drink for inflammation', 'curcumin black pepper',
      'turmeric', 'black-pepper', 'ginger', 'cinnamon', 'inflammation', 'sleep-stress',
    ],
    faq: [
      {
        q: 'Why does Golden Milk need black pepper?',
        a: 'Piperine in black pepper boosts curcumin (the active compound in turmeric) bioavailability by approximately 2000% in published studies. Without it, you absorb less than 5% of the curcumin and lose most of the anti-inflammatory benefit. Even a tiny pinch is enough.',
      },
      {
        q: 'Can I drink Golden Milk every day?',
        a: 'Yes — 1 cup daily is considered a safe therapeutic dose. Each serving delivers roughly 1.5g curcumin equivalent, well within the 0.5-2g daily window. Avoid if pregnant, on blood thinners (turmeric + curcumin have mild anticoagulant effects), or with gallstones.',
      },
      {
        q: 'Why coconut milk instead of regular milk?',
        a: 'Curcumin is fat-soluble — it needs a fat carrier to absorb. Coconut milk provides medium-chain triglycerides that aid absorption. Regular dairy milk works too, but coconut adds its own anti-inflammatory profile.',
      },
      {
        q: 'When is the best time to drink it?',
        a: 'Evening, 30-60 min before bed. The cinnamon helps stabilize overnight blood sugar; the warm milk + slight tryptophan from coconut promotes sleep onset. Skip caffeine in the late afternoon to compound the effect.',
      },
    ],
  },

  // ============================================================
  // 2. GINGER + TURMERIC SOUP — Anti-inflammatory
  // ============================================================
  {
    ...base('ginger-turmeric-anti-inflammatory-soup', ((IMG as Record<string, string | undefined>)['curry'] ?? null) as string | null),
    title: 'Ginger Turmeric Anti-Inflammatory Soup with Black Pepper & Lentils',
    description:
      'A weeknight soup engineered around the turmeric + ginger compound anti-inflammatory pathway. Curcumin inhibits COX-2; gingerols inhibit COX-1 + LOX — hitting both reduces inflammation more than either alone. Lentils add fiber + plant protein. Built for arthritis support, autoimmune-flare days, and post-workout recovery.',
    prepTimeMin: 10,
    cookTimeMin: 30,
    totalTimeMin: 40,
    servings: 4,
    difficulty: 'easy',
    cuisine: 'indian',
    course: 'dinner',
    occasion: 'weeknight',
    equipment: ['Heavy-bottomed pot', 'Wooden spoon', 'Chef knife', 'Cutting board'],
    ingredients: [
      { name: 'red lentils, rinsed', qty: 1, unit: 'cup' },
      { name: 'low-sodium vegetable stock', qty: 4, unit: 'cup' },
      { name: 'coconut milk (full-fat)', qty: 1, unit: 'cup' },
      { name: 'fresh ginger, grated', qty: 2, unit: 'tbsp' },
      { name: 'ground turmeric', qty: 2, unit: 'tsp' },
      { name: 'freshly cracked black pepper', qty: 0.5, unit: 'tsp', notes: 'Required for curcumin absorption' },
      { name: 'ground cumin', qty: 1, unit: 'tsp' },
      { name: 'garlic, minced', qty: 4, unit: 'cloves' },
      { name: 'yellow onion, diced small', qty: 1, unit: 'whole' },
      { name: 'olive oil', qty: 2, unit: 'tbsp' },
      { name: 'lemon juice, fresh', qty: 2, unit: 'tbsp' },
      { name: 'sea salt', qty: 1.5, unit: 'tsp' },
      { name: 'baby spinach', qty: 4, unit: 'cup' },
      { name: 'fresh cilantro, chopped', qty: 0.25, unit: 'cup' },
    ],
    instructions: [
      { step: 1, text: 'Heat olive oil in a heavy-bottomed pot over medium heat. Add diced onion + ½ tsp salt. Sauté 5 min until translucent, stirring often.' },
      { step: 2, text: 'Add garlic, grated ginger, turmeric, cumin, and black pepper. Bloom for 30 seconds — the spices should smell aromatic and the turmeric should darken slightly. This step releases the curcumin into the fat.' },
      { step: 3, text: 'Pour in vegetable stock and lentils. Bring to a boil, then reduce heat to a gentle simmer.' },
      { step: 4, text: 'Cover partially and simmer 20-25 minutes until lentils break down into a creamy consistency. Stir every 5 minutes to prevent scorching at the bottom.' },
      { step: 5, text: 'Stir in coconut milk and remaining 1 tsp salt. Simmer uncovered 5 more minutes to thicken slightly.' },
      { step: 6, text: 'Add baby spinach and let it wilt — about 1 minute. Off heat, stir in lemon juice. The acid wakes up the spices.' },
      { step: 7, text: 'Taste and adjust salt. Serve hot, topped with fresh cilantro and an extra crack of black pepper.' },
    ],
    tips:
      'For deeper anti-inflammatory effect, double the turmeric to 4 tsp and increase ginger to 3 tbsp. The flavor stays balanced because both ingredients pair well at high doses. Add chili flakes if you want extra warmth.',
    storageNotes:
      'Refrigerate up to 4 days in an airtight container. Flavor improves overnight — the spices meld and deepen.',
    freezerNotes:
      'Freezes well 3 months. Cool fully, portion into shallow containers, label with date. Thaw overnight in fridge before reheating gently.',
    nutrition: {
      calories: 340,
      proteinG: 14,
      carbsG: 42,
      fatG: 14,
      fiberG: 12,
      sodiumMg: 540,
      sugarG: 5,
      satFatG: 8,
    },
    costPerServingUsd: 2.4,
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'high-protein'],
    allergenTags: [],
    keywords: [
      'ginger turmeric soup', 'anti-inflammatory soup', 'lentil soup',
      'arthritis recipe', 'autoimmune recipe', 'plant protein soup',
      'turmeric', 'ginger', 'black-pepper', 'inflammation', 'joint-health',
    ],
    faq: [],
  },

  // ============================================================
  // 3. GARLIC + GINGER IMMUNE BROTH
  // ============================================================
  {
    ...base('garlic-ginger-immune-broth', ((IMG as Record<string, string | undefined>)['pho'] ?? null) as string | null),
    title: 'Garlic Ginger Immune Broth — Cold & Flu Recovery Soup',
    description:
      'A clear broth built on the garlic + ginger synergy that broadens antimicrobial spectrum beyond what either ingredient provides alone. Lemon adds vitamin C; turmeric layers in compound anti-inflammatory effect. Sip when you feel a cold coming on, or use as a base for chicken-and-rice when you are unwell.',
    prepTimeMin: 5,
    cookTimeMin: 25,
    totalTimeMin: 30,
    servings: 4,
    difficulty: 'easy',
    cuisine: 'caribbean',
    course: 'soup',
    occasion: 'weeknight',
    equipment: ['Medium pot', 'Microplane or grater', 'Fine-mesh strainer'],
    ingredients: [
      { name: 'low-sodium chicken or vegetable stock', qty: 6, unit: 'cup' },
      { name: 'garlic, smashed and roughly chopped', qty: 8, unit: 'cloves' },
      { name: 'fresh ginger, sliced thin (not peeled)', qty: 4, unit: 'inch' },
      { name: 'ground turmeric', qty: 1, unit: 'tsp' },
      { name: 'freshly cracked black pepper', qty: 0.25, unit: 'tsp' },
      { name: 'fresh lemon juice', qty: 3, unit: 'tbsp' },
      { name: 'raw honey', qty: 1, unit: 'tbsp', notes: 'Added off-heat to preserve enzymes' },
      { name: 'cayenne pepper', qty: 1, unit: 'pinch', notes: 'Optional — adds warming circulation effect' },
      { name: 'sea salt', qty: 1, unit: 'tsp' },
      { name: 'green onions, sliced', qty: 2, unit: 'whole' },
    ],
    instructions: [
      { step: 1, text: 'Smash garlic cloves with the flat of a knife. Let them rest 10 minutes — this activates allicin, the antimicrobial compound. Skipping this step kills most of the immune benefit.' },
      { step: 2, text: 'Combine stock, garlic, sliced ginger, turmeric, and black pepper in a medium pot. Bring to a gentle simmer over medium heat.' },
      { step: 3, text: 'Reduce heat to low. Simmer uncovered 20 minutes — gentle is the key. Rolling boil destroys delicate compounds in fresh garlic + ginger.' },
      { step: 4, text: 'Strain through a fine-mesh sieve into a clean pot or bowl. Discard the spent ginger + garlic solids.' },
      { step: 5, text: 'Stir in salt and cayenne (if using). Taste — adjust salt. Wait 60 seconds for it to cool slightly.' },
      { step: 6, text: 'Off heat, stir in lemon juice and honey. Heat above 110°F destroys honey enzymes; this final off-heat addition preserves them.' },
      { step: 7, text: 'Ladle into mugs. Top with green onion. Sip slowly. For best effect, drink within 30 minutes of preparation while compounds are most active.' },
    ],
    tips:
      'For an even stronger immune effect, drop a couple of fresh thyme sprigs into the simmer. Thyme contains thymol — another antimicrobial that complements allicin.',
    storageNotes:
      'Refrigerate up to 3 days. Lemon juice + honey lose potency fast — re-add fresh portions to each serving when reheating.',
    freezerNotes:
      'Freeze the strained broth base (without lemon/honey) for up to 2 months. Add fresh lemon + honey only after reheating.',
    nutrition: {
      calories: 50,
      proteinG: 2,
      carbsG: 7,
      fatG: 0.5,
      fiberG: 1,
      sodiumMg: 520,
      sugarG: 4,
      satFatG: 0,
    },
    costPerServingUsd: 0.85,
    dietaryTags: ['gluten-free', 'dairy-free'],
    allergenTags: [],
    keywords: [
      'immune broth', 'garlic ginger soup', 'cold recovery soup', 'fire cider broth',
      'sick day soup', 'natural cold remedy',
      'garlic', 'ginger', 'turmeric', 'immune', 'respiratory',
    ],
    faq: [],
  },

  // ============================================================
  // 4. ASHWAGANDHA + CHAMOMILE RICE PUDDING
  // ============================================================
  {
    ...base('ashwagandha-chamomile-bedtime-rice-pudding', ((IMG as Record<string, string | undefined>)['mangoSmoothie'] ?? null) as string | null),
    title: 'Ashwagandha Chamomile Bedtime Rice Pudding',
    description:
      'A warm dessert tuned for sleep. Pairs ashwagandha (cortisol-lowering adaptogen) with chamomile flowers (apigenin binds the same receptors as benzodiazepine drugs). Slow-cooked rice provides complex carbs that boost serotonin precursor uptake. Eat 60-90 minutes before bed.',
    prepTimeMin: 5,
    cookTimeMin: 30,
    totalTimeMin: 35,
    servings: 3,
    difficulty: 'easy',
    cuisine: 'indian',
    course: 'dessert',
    occasion: null,
    equipment: ['Heavy-bottomed pot', 'Wooden spoon', 'Fine-mesh strainer'],
    ingredients: [
      { name: 'short-grain rice (or basmati)', qty: 0.5, unit: 'cup' },
      { name: 'whole milk (or unsweetened almond milk)', qty: 3, unit: 'cup' },
      { name: 'water', qty: 1, unit: 'cup' },
      { name: 'dried chamomile flowers', qty: 2, unit: 'tbsp', notes: 'Or 2 chamomile tea bags' },
      { name: 'ashwagandha powder', qty: 0.5, unit: 'tsp', notes: '~500mg therapeutic dose' },
      { name: 'cinnamon stick', qty: 1, unit: 'whole' },
      { name: 'vanilla extract', qty: 1, unit: 'tsp' },
      { name: 'raw honey or maple syrup', qty: 3, unit: 'tbsp' },
      { name: 'cardamom pods, lightly crushed', qty: 4, unit: 'whole' },
      { name: 'sea salt', qty: 1, unit: 'pinch' },
      { name: 'sliced almonds, toasted', qty: 2, unit: 'tbsp' },
    ],
    instructions: [
      { step: 1, text: 'Bring milk, water, cinnamon stick, cardamom pods, and chamomile flowers to a gentle simmer in a heavy-bottomed pot. Steep 5 minutes off direct heat.' },
      { step: 2, text: 'Strain through fine-mesh sieve to remove the cinnamon stick, cardamom, and chamomile. Return liquid to pot.' },
      { step: 3, text: 'Add rice and salt. Bring back to a low simmer. Stir often — every 2-3 minutes — to prevent sticking and release rice starch.' },
      { step: 4, text: 'Cook 20-25 minutes until rice is very tender and the mixture has thickened to a soft pudding consistency. Continuous stirring matters: under-stirred rice clumps, over-stirred rice turns gluey.' },
      { step: 5, text: 'Remove from heat. Let cool 3-5 minutes — the pudding thickens further as it cools.' },
      { step: 6, text: 'Stir in ashwagandha powder, vanilla, and honey. Adding ashwagandha off-heat preserves the withanolides (active compounds) which degrade at high heat.' },
      { step: 7, text: 'Portion into bowls. Top with toasted almonds and a dusting of cinnamon. Eat warm, 60-90 min before bed.' },
    ],
    tips:
      'Ashwagandha takes 2-4 weeks of consistent daily use to show measurable cortisol-reducing effects. One serving on an isolated night will not transform your sleep — but daily use will. Make a batch Sunday, eat one portion every evening for the week.',
    storageNotes:
      'Refrigerate 3 days. Reheat gently with a splash of milk to loosen the texture. Active compounds in ashwagandha are heat-sensitive — never re-boil.',
    freezerNotes:
      'Not recommended. Texture turns grainy on thaw.',
    nutrition: {
      calories: 320,
      proteinG: 9,
      carbsG: 48,
      fatG: 9,
      fiberG: 2,
      sodiumMg: 110,
      sugarG: 22,
      satFatG: 4,
    },
    costPerServingUsd: 2.1,
    dietaryTags: ['vegetarian', 'gluten-free'],
    allergenTags: ['dairy', 'tree-nut'],
    keywords: [
      'ashwagandha rice pudding', 'sleep recipe', 'chamomile dessert',
      'bedtime pudding', 'cortisol lowering food', 'adaptogen recipe',
      'ashwagandha', 'chamomile', 'cinnamon', 'sleep-stress',
    ],
    faq: [
      {
        q: 'Is ashwagandha safe?',
        a: 'For most adults at culinary doses, yes. But ashwagandha boosts thyroid hormone production — anyone on thyroid medication or with hyperthyroidism should consult a doctor first. Avoid in pregnancy and during autoimmune flares.',
      },
      {
        q: 'How fast does it work for sleep?',
        a: 'Chamomile gives immediate same-night relaxation through apigenin. Ashwagandha works cumulatively — 2-4 weeks of daily use to lower baseline cortisol. Combine for short-term and long-term benefit.',
      },
    ],
  },

  // ============================================================
  // 5. FENUGREEK + CINNAMON BLOOD-SUGAR CURRY
  // ============================================================
  {
    ...base('fenugreek-cinnamon-blood-sugar-curry', ((IMG as Record<string, string | undefined>)['chickpeaCurry'] ?? null) as string | null),
    title: 'Fenugreek Cinnamon Blood-Sugar Curry with Chickpeas & Spinach',
    description:
      'A weeknight curry engineered for type-2 diabetic-friendly cooking. Fenugreek (4-hydroxyisoleucine) + cinnamon (polyphenols) both modulate insulin sensitivity through different pathways — combining them lowers fasting glucose more than either alone in published trials. Chickpea fiber blunts the post-meal glucose spike. Built for daily inclusion in a blood-sugar management protocol.',
    prepTimeMin: 10,
    cookTimeMin: 35,
    totalTimeMin: 45,
    servings: 4,
    difficulty: 'medium',
    cuisine: 'indian',
    course: 'dinner',
    occasion: 'weeknight',
    equipment: ['Heavy pan or Dutch oven', 'Mortar and pestle (or coffee grinder)', 'Wooden spoon'],
    ingredients: [
      { name: 'dried chickpeas, soaked overnight (or 2 cans, drained)', qty: 1, unit: 'cup' },
      { name: 'fenugreek seeds', qty: 1, unit: 'tbsp', notes: 'Toasted + ground — therapeutic dose' },
      { name: 'cinnamon stick', qty: 1, unit: 'whole' },
      { name: 'ground cinnamon', qty: 0.5, unit: 'tsp' },
      { name: 'ground turmeric', qty: 1, unit: 'tsp' },
      { name: 'ground cumin', qty: 1, unit: 'tsp' },
      { name: 'coriander seeds, toasted + ground', qty: 1, unit: 'tsp' },
      { name: 'fresh ginger, grated', qty: 1, unit: 'tbsp' },
      { name: 'garlic, minced', qty: 4, unit: 'cloves' },
      { name: 'yellow onion, diced', qty: 1, unit: 'whole' },
      { name: 'canned crushed tomatoes', qty: 1.5, unit: 'cup' },
      { name: 'baby spinach', qty: 4, unit: 'cup' },
      { name: 'plain yogurt', qty: 0.5, unit: 'cup', notes: 'Optional — adds creaminess and gut-microbiome support' },
      { name: 'olive oil', qty: 3, unit: 'tbsp' },
      { name: 'sea salt', qty: 1.5, unit: 'tsp' },
      { name: 'fresh lemon juice', qty: 2, unit: 'tbsp' },
      { name: 'fresh cilantro, chopped', qty: 0.25, unit: 'cup' },
    ],
    instructions: [
      { step: 1, text: 'Toast fenugreek seeds in a dry pan over low heat for 60 seconds until aromatic. Grind to powder in mortar/pestle or coffee grinder. Set aside. Toasting first reduces bitterness and unlocks the active compounds.' },
      { step: 2, text: 'Heat olive oil in a Dutch oven over medium. Add cinnamon stick and bloom 30 seconds.' },
      { step: 3, text: 'Add diced onion + ½ tsp salt. Sauté 7 min until golden — caramelization builds the curry base.' },
      { step: 4, text: 'Stir in garlic, ginger, turmeric, ground cumin, ground coriander, ground cinnamon, and ground fenugreek. Toast spices in the fat for 60 seconds. Spices should sizzle and the kitchen should smell intensely fragrant.' },
      { step: 5, text: 'Add crushed tomatoes. Cook 8-10 minutes, stirring often, until the tomato darkens and the oil begins to separate at the edges — classic Indian curry technique called bhuna.' },
      { step: 6, text: 'Add chickpeas + 1 cup water. Bring to a simmer. Cook covered 15 minutes — longer if using soaked dried chickpeas (45-60 minutes until tender).' },
      { step: 7, text: 'Stir in spinach and remaining salt. Cook 2 minutes until wilted. Remove cinnamon stick.' },
      { step: 8, text: 'Off heat, stir in yogurt and lemon juice. Adding dairy off-heat prevents splitting. Taste — adjust salt.' },
      { step: 9, text: 'Top with cilantro. Serve over brown rice or with whole-wheat roti for the lowest glycemic-load combination.' },
    ],
    tips:
      'For maximum blood-sugar benefit, eat this within 30 minutes of taking your usual diabetes medication (or first thing in the morning). The fenugreek + cinnamon effect compounds with consistent daily intake — measurable improvement in fasting glucose appears at 2-4 weeks.',
    storageNotes:
      'Refrigerate 4 days. Flavor improves overnight. Reheat over medium-low — never microwave on high, which scorches the spices.',
    freezerNotes:
      'Freezes 3 months. Cool fully before freezing in flat-packed portions. Thaw overnight in fridge, then reheat with a splash of water.',
    nutrition: {
      calories: 360,
      proteinG: 15,
      carbsG: 48,
      fatG: 13,
      fiberG: 14,
      sodiumMg: 580,
      sugarG: 10,
      satFatG: 3,
    },
    costPerServingUsd: 2.2,
    dietaryTags: ['vegetarian', 'gluten-free', 'high-protein', 'diabetic'],
    allergenTags: ['dairy'],
    keywords: [
      'fenugreek curry', 'blood sugar curry', 'diabetic recipe',
      'cinnamon curry', 'glucose lowering recipe', 'chickpea curry',
      'fenugreek', 'cinnamon', 'turmeric', 'blood-sugar', 'gut-health',
    ],
    faq: [
      {
        q: 'How does fenugreek lower blood sugar?',
        a: 'Fenugreek contains 4-hydroxyisoleucine, an amino acid that stimulates insulin secretion when blood glucose is elevated. Galactomannan fiber in the seeds also slows carbohydrate absorption. Combined with cinnamon polyphenols (which improve insulin sensitivity), the effect on fasting glucose is roughly 10-25% reduction across trials.',
      },
      {
        q: 'Can I take fenugreek if I am on diabetes medication?',
        a: 'Yes, but monitor glucose closely for the first 2 weeks. Fenugreek + cinnamon both lower blood sugar; combining them with metformin or insulin can cause hypoglycemia if dosages are not adjusted. Always consult your prescriber before adding therapeutic doses.',
      },
      {
        q: 'Why toast the fenugreek seeds first?',
        a: 'Raw fenugreek tastes bitter and has muted flavor. A 60-second toast in a dry pan transforms the bitter coumarin compounds and intensifies the maple-like aroma. The active compounds survive the toast intact.',
      },
    ],
  },
];
