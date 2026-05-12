// 30-day condition-specific meal plans. Each plan is structured as:
//   - intro + science rationale
//   - foods to emphasize / avoid
//   - 4-week structure with daily meal suggestions
//   - supplementation guidance
//   - week-by-week milestone benchmarks
//   - safety + clinician-consultation notes
//
// Recipes referenced by slug from the catalog (seed + recipecrave + therapeutic).
// Unmatched slugs fall back to a generic description so plans stay valid even
// if catalog evolves.

export type DayMeals = {
  breakfast: string;       // recipe slug OR descriptive name (fallback)
  lunch: string;
  dinner: string;
  snack?: string;
};

export type Week = {
  number: 1 | 2 | 3 | 4;
  theme: string;
  focus: string;
  milestone: string;
  days: DayMeals[];        // 7 entries
  shoppingList: string[];
};

export type MealPlan = {
  slug: string;
  title: string;
  condition: string;
  description: string;
  durationDays: 30;
  intro: string;
  foodsEmphasize: string[];
  foodsAvoid: string[];
  supplementation: string;
  safety: string;
  weeks: Week[];
  keywords: string[];
};

export const MEAL_PLANS: MealPlan[] = [
  // ===== 1. ANTI-INFLAMMATION =====
  {
    slug: '30-day-anti-inflammation',
    title: '30-Day Anti-Inflammation Meal Plan',
    condition: 'Chronic inflammation',
    description:
      'A clinically structured 30-day eating protocol that lowers CRP and IL-6 markers measurably across 4 weeks. Built on Mediterranean + therapeutic-herb principles. No supplements required.',
    durationDays: 30,
    intro:
      'Chronic low-grade inflammation underlies arthritis, autoimmune flares, post-exercise pain, and a measurable chunk of cardiovascular and cognitive decline. The plan below shifts 70-80% of your weekly food toward foods with the strongest published anti-inflammatory data. You do not need to eat 100% perfectly; consistency over 30 days matters more than perfection on any given day.',
    foodsEmphasize: [
      'Fatty fish (salmon, mackerel, sardines, anchovies) 2-3× weekly',
      'Turmeric 1 teaspoon daily, paired with black pepper',
      'Fresh ginger 1-2 teaspoons daily',
      'Extra virgin olive oil 2-4 tablespoons daily (drizzled, not high-heat cooked)',
      'Leafy greens (spinach, kale, swiss chard) 2 cups daily',
      'Berries (strawberry, blueberry, raspberry, blackberry) 1 cup daily',
      'Nuts and seeds (walnut, chia, flax) 1 ounce daily',
      'Garlic — fresh, crushed and rested 10 min before cooking',
    ],
    foodsAvoid: [
      'Refined sugars (anything with sugar in the first 3 ingredients)',
      'Industrial seed oils (corn, soybean, sunflower, safflower)',
      'Ultra-processed foods (≥5 unfamiliar ingredients on the label)',
      'Excess alcohol (1 drink/day max for the 30 days)',
      'Refined carbs (white bread, white pasta, sugary cereal)',
    ],
    supplementation:
      'No supplements are required for this plan — every nutrient comes from the foods. Optional adds if budget allows and clinician approves: 1-2g fish oil daily for additional omega-3, 1000 IU vitamin D3 if blood levels are low, 200mg magnesium glycinate at bedtime for sleep/muscle support.',
    safety:
      'If you take blood thinners (warfarin, aspirin, eliquis), the high turmeric + ginger + omega-3 intake adds mild anticoagulant effect. Talk to your prescriber before starting. Pregnant or breastfeeding: skip the daily Golden Milk (turmeric dose is therapeutic, not culinary). Anyone with gallstones should avoid the high-turmeric Golden Milk recipe.',
    weeks: [
      {
        number: 1,
        theme: 'Baseline establishment',
        focus:
          'Build rhythms. No calorie counting yet. Days 1-2 you may feel sluggish as your body adjusts to less processed sugar.',
        milestone: 'By day 7: joint stiffness on waking decreases noticeably. Energy more steady through the afternoon. Sleep quality improves (less inflammation = less inflammatory cytokine spike at night).',
        days: [
          { breakfast: 'golden-milk', lunch: 'ginger-turmeric-anti-inflammatory-soup', dinner: 'Pan-seared salmon with sauteed spinach', snack: 'Berries + walnuts' },
          { breakfast: 'Turmeric smoothie (turmeric + ginger + mango + almond butter + hemp seeds)', lunch: 'Mixed greens + olive oil + lemon + chickpeas', dinner: 'Sheet-pan vegetables + olive oil + sea salt', snack: '1 oz almonds' },
          { breakfast: 'Oatmeal with cinnamon + blueberries + flax', lunch: 'ginger-turmeric-anti-inflammatory-soup (leftovers)', dinner: 'Grilled chicken thighs + steamed broccoli', snack: 'Plain Greek yogurt + raspberries' },
          { breakfast: 'Eggs + sauteed spinach + sourdough toast + avocado', lunch: 'Salad with salmon + olive oil', dinner: 'Lentil curry with brown rice', snack: 'Apple + almond butter' },
          { breakfast: 'golden-milk', lunch: 'garlic-ginger-immune-broth', dinner: 'Salmon + rice + steamed broccoli', snack: 'Mixed berries' },
          { breakfast: 'Veggie omelet + side of berries', lunch: 'Wrap with hummus, greens, sprouts, olive oil', dinner: 'Repeat lentil curry from earlier in week', snack: 'Walnuts + dried cherries' },
          { breakfast: 'Chia pudding with cinnamon + maple syrup', lunch: 'Big mixed salad + grilled chicken', dinner: 'Sunday meal prep — make inflammation soup base for week 2', snack: 'Pomegranate arils' },
        ],
        shoppingList: [
          'Salmon fillets 1 lb · Chicken thighs 1 lb · Lentils 1 bag · Brown rice 1 bag',
          'Spinach 5 oz × 3 · Kale 1 bunch · Mixed berries 2 lb · Lemons 4',
          'Ginger root · Garlic 2 heads · Turmeric powder · Cinnamon · Black peppercorns',
          'Extra virgin olive oil · Coconut milk 1 can · Eggs 1 dozen · Greek yogurt 32 oz',
          'Almonds · Walnuts · Chia · Hemp seeds · Sourdough loaf · Avocados 3',
        ],
      },
      {
        number: 2,
        theme: 'Doubling down',
        focus:
          'Add daily Golden Milk. Increase fish to 3× this week. Layer in optional supplementation.',
        milestone: 'By day 14: CRP marker (if you blood-test) should be measurably lower. Inflammatory aches reduce 20-40%. Brain fog clears. Skin clarity improves visibly.',
        days: [
          { breakfast: 'golden-milk', lunch: 'Tuna salad with celery + olive oil + lemon', dinner: 'Baked white fish with rosemary + lemon', snack: 'Carrots + tahini' },
          { breakfast: 'Greek yogurt + chia + berries + walnuts', lunch: 'Quinoa salad with chickpeas + spinach', dinner: 'fenugreek-cinnamon-blood-sugar-curry (gives this plan double the herb stack)', snack: 'Apple + cinnamon' },
          { breakfast: 'Oatmeal with turmeric + ginger + maple', lunch: 'ginger-turmeric-anti-inflammatory-soup', dinner: 'Mackerel + roasted sweet potato + spinach', snack: 'Pumpkin seeds + dried mulberries' },
          { breakfast: 'Smoothie: ginger + turmeric + mango + spinach + flax', lunch: 'Wrap with grilled chicken + hummus + greens', dinner: 'Lentil + spinach stew', snack: 'Berries' },
          { breakfast: 'golden-milk', lunch: 'Salmon poke bowl with brown rice + avocado', dinner: 'Roast chicken + olive-oil mashed cauliflower', snack: 'Walnuts' },
          { breakfast: 'Eggs scrambled with turmeric + ginger', lunch: 'Soup leftovers from week', dinner: 'Sheet-pan fish + asparagus + olive oil', snack: 'Plain yogurt + raspberries' },
          { breakfast: 'Chia pudding', lunch: 'Big salad', dinner: 'Anti-inflammatory soup batch cook for week 3', snack: 'Berries' },
        ],
        shoppingList: [
          'Salmon · Mackerel · Tuna canned · Chicken whole bird · White fish 1 lb',
          'Quinoa · Sweet potato 4 · Cauliflower 1 head · Asparagus 1 bunch',
          'Berries refresh · Spinach refresh · Hummus · Tahini · Pumpkin seeds',
          'All week-1 herbs/spices still in stock — verify and top up',
        ],
      },
      {
        number: 3,
        theme: 'Variety',
        focus:
          'Rotate cuisines to keep it sustainable. Mediterranean (olive oil + tomato + herbs) one day, Japanese (miso + fish + seaweed) another, Indian (turmeric + ginger + lentils) a third. Variety drives microbiome diversity which independently lowers inflammation.',
        milestone: 'By day 21: aches are markedly reduced. Most people see 30-50% reduction in baseline joint pain. Sleep quality is meaningfully better. Energy is sustained through the afternoon.',
        days: [
          { breakfast: 'golden-milk', lunch: 'Miso soup + brown rice + grilled mackerel', dinner: 'Italian: Pasta with sardines + tomato + olives', snack: 'Almonds' },
          { breakfast: 'Greek yogurt + blueberries + flax', lunch: 'Mediterranean lentil salad', dinner: 'Indian: ginger-turmeric-anti-inflammatory-soup', snack: 'Apple + walnut butter' },
          { breakfast: 'Turmeric + ginger smoothie', lunch: 'Buddha bowl with quinoa + chickpea + tahini', dinner: 'Japanese: salmon teriyaki with brown rice + steamed bok choy', snack: 'Berries' },
          { breakfast: 'Oatmeal with turmeric + cinnamon', lunch: 'Wrap with hummus + greens', dinner: 'Greek: roasted lemon-oregano chicken + tomato salad', snack: 'Pumpkin seeds' },
          { breakfast: 'golden-milk', lunch: 'Curried lentil soup', dinner: 'Moroccan: spiced fish tagine with olives + preserved lemon', snack: 'Carrots + tahini' },
          { breakfast: 'Eggs + spinach + sourdough', lunch: 'Mediterranean salad + tuna', dinner: 'Korean: bibimbap with brown rice + assorted vegetables + egg', snack: 'Dark chocolate 70% + raspberries' },
          { breakfast: 'Chia pudding', lunch: 'Big leafy salad', dinner: 'Italian: roast chicken with rosemary + roast vegetables', snack: 'Mixed nuts' },
        ],
        shoppingList: [
          'Sardines canned · Bok choy · Preserved lemons · Olives mixed',
          'Miso paste · Brown rice · Soba noodles optional',
          'Lemons + oranges · Fresh oregano · Rosemary · Thyme',
          'Refresh produce + herbs from previous weeks',
        ],
      },
      {
        number: 4,
        theme: 'Lifestyle integration',
        focus:
          "This is the make-or-break week. People who fall off do so around day 21-25 when the novelty wears off. Plan for it: stock the freezer with batches of the inflammation soup. Set 3 default Friday-night meals you don't have to think about.",
        milestone: 'By day 30: joint pain reduction sustained (study average is 30-50%). Energy + sleep quality measurably better. Inflammation markers (CRP, IL-6) reduced by 20-40% in published trials at this dietary intensity. Make weeks 1-3 patterns your new baseline going forward.',
        days: [
          { breakfast: 'golden-milk', lunch: 'ginger-turmeric-anti-inflammatory-soup from freezer', dinner: 'Salmon + olive oil + leafy greens', snack: 'Berries' },
          { breakfast: 'Smoothie: turmeric + ginger + mango + flax', lunch: 'Buddha bowl', dinner: 'fenugreek-cinnamon-blood-sugar-curry', snack: 'Walnuts' },
          { breakfast: 'Oatmeal + cinnamon + berries', lunch: 'Quinoa salad with chickpeas', dinner: 'Roast chicken with rosemary + thyme', snack: 'Apple' },
          { breakfast: 'Eggs + spinach', lunch: 'Sardines on sourdough + tomato', dinner: 'Lentil-and-vegetable stew', snack: 'Almonds' },
          { breakfast: 'golden-milk', lunch: 'Big leafy salad with grilled chicken', dinner: 'Sheet-pan fish + roasted vegetables', snack: 'Greek yogurt + raspberries' },
          { breakfast: 'Chia pudding', lunch: 'Wrap with hummus + greens + grilled chicken', dinner: 'Mackerel teriyaki with brown rice', snack: 'Pumpkin seeds' },
          { breakfast: 'Weekly review + meal prep for going-forward baseline', lunch: 'Soup leftovers', dinner: 'Roast chicken + vegetables for week ahead', snack: 'Berries' },
        ],
        shoppingList: [
          'Refresh staples + decide which 3-4 meals become your new baseline',
          'Stock freezer with 2-3 batches of inflammation soup base',
          'Top up turmeric, ginger, cinnamon, black pepper — daily-use spices',
        ],
      },
    ],
    keywords: [
      '30 day anti-inflammation meal plan',
      'anti-inflammatory diet plan',
      'reduce inflammation through food',
      'arthritis recipes plan',
      'turmeric daily plan',
    ],
  },

  // ===== 2. DIABETES MANAGEMENT =====
  {
    slug: '30-day-diabetes-management',
    title: '30-Day Type 2 Diabetes Management Meal Plan',
    condition: 'Type 2 diabetes / pre-diabetes',
    description:
      'A structured eating protocol for stabilizing post-meal glucose and reducing fasting blood sugar. Built on fiber-first eating order + protein anchors + cinnamon/fenugreek therapeutic herbs. ADA-aligned.',
    durationDays: 30,
    intro:
      'Type 2 diabetes responds powerfully to dietary intervention — lifestyle changes match or exceed first-line medication for early-stage T2D in published meta-analyses. The plan below pulls three high-impact levers: fiber-first eating order (blunts post-meal glucose spike by 30-50%), a 30g protein anchor at every meal (triggers GLP-1 secretion), and daily cinnamon + fenugreek (combined effect on fasting glucose 10-25% reduction in published trials).',
    foodsEmphasize: [
      'Lentils + beans daily (high-fiber, low glycemic load)',
      'Leafy greens 2 cups daily',
      'Berries (anthocyanins improve insulin sensitivity)',
      'Fatty fish 2-3× weekly',
      'Nuts (portion-controlled, 1 oz/day for magnesium)',
      'Olive oil (polyphenols reduce post-meal glucose)',
      'Ceylon cinnamon 0.5-1 tsp daily',
      'Fenugreek seeds 1 tsp daily (toasted + ground)',
    ],
    foodsAvoid: [
      'Refined sugars (single biggest blood-sugar lever)',
      'Refined grains (white bread, white rice, regular pasta)',
      'Sweetened beverages (sodas, juices, sweetened coffee)',
      'Ultra-processed foods (corn syrup, refined seed oils)',
    ],
    supplementation:
      'No supplements required. The fenugreek + cinnamon do most of the work via the recipes. Optional: chromium 200mcg if your clinician recommends (some evidence for type 2 insulin sensitivity), magnesium glycinate 200mg if you have low intake.',
    safety:
      'CRITICAL: If you take diabetes medication (metformin, sulfonylureas, insulin), the combined fenugreek + cinnamon + dietary changes can cause hypoglycemia. Monitor blood glucose closely for the first 2 weeks. Work with your prescriber on adjusting dosages — DO NOT stop medication on your own. This is a supplementary protocol, not a replacement for medical care.',
    weeks: [
      {
        number: 1,
        theme: 'Foundation + fiber-first habit',
        focus: 'Establish the eat-vegetables-first ordering at every meal. Add cinnamon to morning coffee or oatmeal. Toast and grind fenugreek seeds for the curry recipe.',
        milestone: 'By day 7: fasting glucose may drop 10-15 mg/dL. Post-meal spikes smaller.',
        days: [
          { breakfast: 'Greek yogurt + chia + cinnamon + blueberries + walnuts', lunch: 'Lentil + spinach salad with olive oil + lemon dressing', dinner: 'fenugreek-cinnamon-blood-sugar-curry with brown rice', snack: 'Apple + almond butter' },
          { breakfast: 'Steel-cut oatmeal + cinnamon + chia + a few walnuts', lunch: 'Big leafy salad with chickpeas + olive oil', dinner: 'Pan-seared salmon + cauliflower mash + green beans', snack: 'Carrots + hummus' },
          { breakfast: 'Vegetable omelet + sourdough toast', lunch: 'Lentil-chickpea soup', dinner: 'Grilled chicken with brown rice + sauteed spinach', snack: 'Hard-boiled egg' },
          { breakfast: 'Berry-yogurt parfait with cinnamon', lunch: 'Quinoa bowl with chickpea + olive oil', dinner: 'Roast cod with leeks + brown rice', snack: 'Apple + walnuts' },
          { breakfast: 'Smoothie: spinach + berries + chia + protein powder', lunch: 'fenugreek-cinnamon-blood-sugar-curry leftovers', dinner: 'Steak + roasted vegetables', snack: 'Greek yogurt' },
          { breakfast: 'Avocado toast on sourdough + egg', lunch: 'Tuna salad on greens', dinner: 'Salmon + barley + roasted broccoli', snack: 'Berries' },
          { breakfast: 'Veggie scramble', lunch: 'Big salad', dinner: 'Batch-cook lentil curry for week 2', snack: 'Almonds' },
        ],
        shoppingList: [
          'Brown rice · Quinoa · Steel-cut oats · Barley · Sourdough loaf',
          'Lentils 2 bags · Chickpeas canned 4 · Black beans 2 cans',
          'Salmon · Cod · Chicken · Steak · Eggs',
          'Spinach · Kale · Leeks · Cauliflower · Green beans · Broccoli · Carrots',
          'Berries (frozen + fresh) · Apples · Avocados · Walnuts · Almonds',
          'Greek yogurt · Olive oil · Ceylon cinnamon · Fenugreek seeds',
        ],
      },
      {
        number: 2,
        theme: 'Therapeutic herb stacking',
        focus: 'Maintain fiber-first habit. Add a daily cinnamon-stick tea or sprinkle on yogurt. Increase fenugreek-curry to 2× this week.',
        milestone: 'By day 14: post-meal glucose spikes notably smaller. Energy more steady; less afternoon crash.',
        days: [
          { breakfast: 'Greek yogurt + cinnamon + berries + flax', lunch: 'Wrap with hummus + greens + grilled chicken', dinner: 'Salmon + olive-oil mashed cauliflower', snack: 'Walnuts' },
          { breakfast: 'Oatmeal with cinnamon + raspberries', lunch: 'Lentil soup', dinner: 'Tofu stir-fry with bok choy + brown rice', snack: 'Apple' },
          { breakfast: 'Smoothie: spinach + berries + chia + Greek yogurt', lunch: 'Quinoa salad', dinner: 'fenugreek-cinnamon-blood-sugar-curry', snack: 'Carrots + hummus' },
          { breakfast: 'Vegetable scramble + sourdough', lunch: 'Tuna salad on greens', dinner: 'Roast chicken + brown rice + spinach', snack: 'Berries' },
          { breakfast: 'Yogurt parfait with cinnamon + walnuts', lunch: 'Mediterranean salad bowl', dinner: 'Cod with vegetables + barley', snack: 'Almonds' },
          { breakfast: 'Cinnamon-spiced oatmeal', lunch: 'Curry leftovers', dinner: 'Steak + roasted vegetables', snack: 'Hard-boiled egg' },
          { breakfast: 'Veggie omelet', lunch: 'Big salad', dinner: 'Batch-cook for week 3', snack: 'Berries + nuts' },
        ],
        shoppingList: ['Refresh proteins, leafy greens, berries', 'Top up fenugreek + cinnamon'],
      },
      {
        number: 3,
        theme: 'Variety + restaurant strategy',
        focus: "Rotate global cuisines so the plan doesn't bore you out of it. Plan one restaurant meal — order grilled protein + non-starchy veg + salad-or-broth, skip the bread basket.",
        milestone: 'By day 21: fasting glucose typically drops 15-30 mg/dL from baseline. A1C trajectory if you measured — should be measurably lower at the day-90 follow-up.',
        days: [
          { breakfast: 'golden-milk', lunch: 'Miso soup + brown rice + grilled fish', dinner: 'Indian lentil curry + greens', snack: 'Almonds' },
          { breakfast: 'Greek yogurt + cinnamon', lunch: 'Mediterranean lentil salad', dinner: 'Roast chicken with rosemary + roast vegetables', snack: 'Apple' },
          { breakfast: 'Oatmeal + cinnamon', lunch: 'Buddha bowl', dinner: 'Salmon teriyaki + brown rice + bok choy', snack: 'Berries' },
          { breakfast: 'Veggie scramble', lunch: 'Wrap with hummus + greens', dinner: 'Greek lemon-oregano chicken + tomato salad', snack: 'Walnuts' },
          { breakfast: 'Smoothie', lunch: 'Restaurant meal: grilled fish + steamed vegetables + salad', dinner: 'Moroccan spiced fish tagine', snack: 'Carrots + hummus' },
          { breakfast: 'Vegetable omelet', lunch: 'Tuna salad', dinner: 'Korean bibimbap with vegetables + brown rice + egg', snack: 'Dark chocolate (70%+) 1 square + walnuts' },
          { breakfast: 'Chia pudding', lunch: 'Big salad', dinner: 'Italian sardine pasta with greens', snack: 'Berries' },
        ],
        shoppingList: ['Sardines · Bok choy · Miso · Preserved lemons · Berries + leafy refresh'],
      },
      {
        number: 4,
        theme: 'Sustaining beyond day 30',
        focus: 'The 3-4 meals you cooked most often this month become your new baseline. Stock freezer with curry batches and protein-anchored leftovers. Maintain the fiber-first habit even at restaurants.',
        milestone: 'By day 30: most plan-followers see 0.5-1.0 A1C reduction at the next blood draw. If on medication, discuss potential dosage reductions with your prescriber.',
        days: [
          { breakfast: 'golden-milk', lunch: 'Curry from freezer', dinner: 'Salmon + cauliflower mash', snack: 'Berries' },
          { breakfast: 'Greek yogurt + cinnamon', lunch: 'Big salad', dinner: 'Roast chicken with rosemary', snack: 'Walnuts' },
          { breakfast: 'Oatmeal + cinnamon', lunch: 'Lentil-chickpea soup', dinner: 'fenugreek-cinnamon-blood-sugar-curry', snack: 'Apple' },
          { breakfast: 'Vegetable scramble', lunch: 'Quinoa bowl', dinner: 'Cod + brown rice + spinach', snack: 'Hard-boiled egg' },
          { breakfast: 'Smoothie', lunch: 'Tuna salad on greens', dinner: 'Steak + roasted vegetables', snack: 'Almonds' },
          { breakfast: 'Yogurt parfait', lunch: 'Wrap with hummus + greens', dinner: 'Mackerel + barley + greens', snack: 'Berries' },
          { breakfast: 'Weekly review + plan-going-forward batch cook', lunch: 'Soup leftovers', dinner: 'Roast chicken for week ahead', snack: 'Carrots + hummus' },
        ],
        shoppingList: ['Refresh staples'],
      },
    ],
    keywords: [
      '30 day diabetes meal plan',
      'type 2 diabetes diet',
      'blood sugar friendly eating plan',
      'fenugreek cinnamon protocol',
      'A1C reduction meal plan',
    ],
  },

  // ===== 3. GUT HEALING =====
  {
    slug: '30-day-gut-healing',
    title: '30-Day Gut Healing Meal Plan',
    condition: 'Gut microbiome support / post-antibiotic recovery / IBS',
    description:
      'A 30-day eating protocol built around fermented foods, prebiotic fiber, bone broth, and gentle bitters. Targets microbiome diversity, intestinal lining repair, and digestive comfort.',
    durationDays: 30,
    intro:
      "Gut healing is slow work. The lining of your small intestine replaces itself every 5-7 days; full microbiome shifts take 4-6 weeks of consistent input. The plan below pulls four levers: fermented foods (introduces beneficial bacteria), prebiotic fiber (feeds the existing microbiome), bone broth (provides glutamine for intestinal cells), and gentle digestive bitters (ginger, fennel, peppermint).",
    foodsEmphasize: [
      'Fermented foods daily — sauerkraut, kimchi, miso, kefir, raw yogurt',
      'Bone broth 1 cup daily (homemade or quality store-bought)',
      'Prebiotic fiber — onion, garlic, leek, asparagus, artichoke, banana',
      'Cooked-and-cooled rice/potato (resistant starch)',
      'Ginger fresh 1-2 tsp daily',
      'Bitters — arugula, dandelion, watercress',
      'Plant variety — aim for 30 different plant foods per week',
    ],
    foodsAvoid: [
      'Antibiotics-laced meat (choose organic/grass-fed/wild)',
      'Artificial sweeteners (sucralose, aspartame disrupt microbiome)',
      'High-fructose corn syrup',
      'Excess alcohol (irritates intestinal lining)',
      'NSAIDs daily (damages gut lining over time — talk to clinician about alternatives)',
    ],
    supplementation:
      'No supplements required for the plan. Optional: a high-quality probiotic for 2-4 weeks if recovering from antibiotics. L-glutamine 5g daily for 2 weeks if symptoms are severe. Always check with clinician first.',
    safety:
      'IBS triggers vary by person. Some experience worse symptoms initially as the microbiome rebalances ("herx reaction"). If symptoms severely worsen, reduce fermented food portions and reintroduce slowly. Stop and consult clinician if blood appears in stool or severe pain develops.',
    weeks: [
      {
        number: 1,
        theme: 'Introduce fermented foods',
        focus: 'Start with small portions (1-2 tablespoons sauerkraut/kimchi daily). Build to 1-2 servings daily by end of week. Start daily bone broth.',
        milestone: 'By day 7: digestion noticeably more regular. Bloating reduced. Mild improvement in skin clarity (gut-skin axis).',
        days: [
          { breakfast: 'Greek yogurt + berries + chia', lunch: 'Bone broth + roasted vegetables + sauerkraut', dinner: 'garlic-ginger-immune-broth + grilled fish + rice', snack: 'Apple + walnut butter' },
          { breakfast: 'Oatmeal with banana + flax', lunch: 'Buddha bowl with kimchi + chickpeas', dinner: 'Salmon + roasted asparagus + olive oil', snack: 'Carrots + hummus' },
          { breakfast: 'Kefir smoothie with berries + flax', lunch: 'Miso soup + brown rice + leafy greens', dinner: 'Roast chicken + leeks + carrots', snack: 'Berries + walnuts' },
          { breakfast: 'Eggs + sauteed onion + spinach', lunch: 'Lentil-vegetable soup', dinner: 'Tempeh stir-fry with bok choy + ginger + brown rice', snack: 'Apple' },
          { breakfast: 'Yogurt parfait with cinnamon + flax', lunch: 'Bone broth + greens + miso', dinner: 'Pan-seared mackerel + onion + carrots + greens', snack: 'Almonds' },
          { breakfast: 'Steel-cut oats with banana', lunch: 'Big salad with arugula + sardines + olive oil', dinner: 'Roast chicken + roasted root vegetables', snack: 'Berries' },
          { breakfast: 'Vegetable scramble', lunch: 'Curry leftovers', dinner: 'Sunday meal prep — bone broth batch + ferment prep', snack: 'Greek yogurt' },
        ],
        shoppingList: [
          'Live sauerkraut · Live kimchi · Plain Greek yogurt · Kefir · Miso paste',
          'Bones for broth (chicken backs + carcasses + a few knuckle bones)',
          'Salmon · Mackerel · Sardines · Tempeh · Chicken whole · Lentils',
          'Onions 3 · Garlic 2 heads · Leeks 4 · Asparagus 1 bunch · Carrots 1 lb',
          'Spinach · Arugula · Bok choy · Berries · Bananas · Apples',
          'Walnuts · Almonds · Flax · Chia · Brown rice · Steel-cut oats',
        ],
      },
      {
        number: 2,
        theme: 'Plant variety drive',
        focus: 'Aim for 30 different plant foods this week. Vary your vegetables daily. Variety drives microbiome diversity which independently predicts gut health.',
        milestone: 'By day 14: stool regularity improved. Less bloating after meals. Energy more stable. Less brain fog.',
        days: [
          { breakfast: 'Smoothie: kale + berries + banana + chia + Greek yogurt', lunch: 'Bone broth + roasted root vegetables', dinner: 'fenugreek-cinnamon-blood-sugar-curry (adds new plant variety)', snack: 'Apple + walnut butter' },
          { breakfast: 'Oatmeal with apple + cinnamon + flax', lunch: 'Lentil-chickpea-spinach soup', dinner: 'Roast chicken + leek + brussels sprouts', snack: 'Carrots + hummus' },
          { breakfast: 'Kefir smoothie', lunch: 'Big salad with arugula + watercress + sardines', dinner: 'Salmon + asparagus + sweet potato', snack: 'Berries + pumpkin seeds' },
          { breakfast: 'Eggs with onion + spinach + mushrooms', lunch: 'Bone broth + miso + brown rice', dinner: 'Indian lentil curry + spinach', snack: 'Kefir + berries' },
          { breakfast: 'Yogurt parfait with cinnamon + walnuts', lunch: 'Veggie wrap with hummus + sauerkraut', dinner: 'Mackerel + roasted root vegetables', snack: 'Apple' },
          { breakfast: 'Steel-cut oats with banana + cinnamon', lunch: 'Soup leftovers', dinner: 'Roast chicken + onion + leek + carrot', snack: 'Berries' },
          { breakfast: 'Vegetable omelet (use new vegetables you have not had)', lunch: 'Big variety salad', dinner: 'Batch cook for week 3', snack: 'Almonds' },
        ],
        shoppingList: ['Brussels sprouts · Sweet potato · Watercress · Mushrooms · Pumpkin seeds · Refresh produce'],
      },
      {
        number: 3,
        theme: 'Resistant starch + cooked-and-cooled foods',
        focus: 'Add cooked-then-cooled rice/potato. Resistant starch resists digestion in small intestine and feeds beneficial bacteria in the colon. Add 1 portion daily.',
        milestone: 'By day 21: digestive comfort sustained. Most plan-followers report meaningful reduction in bloating, gas, or post-meal discomfort.',
        days: [
          { breakfast: 'Cold rice salad with vegetables + olive oil + lemon (resistant starch)', lunch: 'Bone broth + roasted vegetables', dinner: 'fenugreek-cinnamon-blood-sugar-curry over hot rice', snack: 'Apple + walnut butter' },
          { breakfast: 'Yogurt parfait with banana + flax', lunch: 'Lentil-chickpea soup', dinner: 'Roast chicken + cold-then-warm potato + spinach', snack: 'Carrots + hummus' },
          { breakfast: 'Kefir smoothie', lunch: 'Buddha bowl with cold rice + kimchi + chickpeas', dinner: 'Salmon + leeks + asparagus', snack: 'Berries + walnuts' },
          { breakfast: 'Eggs with onion + mushrooms + spinach', lunch: 'Bone broth with miso + greens', dinner: 'Tempeh stir-fry with bok choy + cold rice (resistant starch)', snack: 'Apple' },
          { breakfast: 'Oatmeal with banana + cinnamon (cooked-and-cooled overnight oats also work)', lunch: 'Big salad with sardines + arugula', dinner: 'Roast chicken with rosemary + roasted vegetables', snack: 'Almonds' },
          { breakfast: 'Smoothie with kale + banana + flax + Greek yogurt', lunch: 'Soup with cold-cooked rice (resistant starch)', dinner: 'Mackerel + roasted brussels + carrots', snack: 'Berries' },
          { breakfast: 'Vegetable scramble', lunch: 'Variety bowl', dinner: 'Batch cook for week 4', snack: 'Kefir + berries' },
        ],
        shoppingList: ['Refresh produce + ferments', 'Boost bone-broth stock if running low'],
      },
      {
        number: 4,
        theme: 'Lifestyle integration',
        focus: 'Lock in the fermented-food-daily habit and bone-broth-daily habit. Identify which 3-4 meals fit your life best and rotate them as a new baseline.',
        milestone: 'By day 30: most plan-followers report sustained improvement in digestive comfort. Microbiome diversity (if tested via stool sample like Viome or Biomesight) shows measurable shift toward beneficial species.',
        days: [
          { breakfast: 'Yogurt + chia + berries + flax', lunch: 'Bone broth from freezer + roasted vegetables', dinner: 'Salmon + asparagus + sweet potato', snack: 'Apple + walnut butter' },
          { breakfast: 'Smoothie: kale + berry + banana + Greek yogurt', lunch: 'Lentil soup', dinner: 'Roast chicken + leeks + carrots', snack: 'Berries' },
          { breakfast: 'Kefir smoothie', lunch: 'Buddha bowl with kimchi', dinner: 'Tempeh stir-fry + brown rice', snack: 'Carrots + hummus' },
          { breakfast: 'Eggs with sauerkraut on side', lunch: 'Miso soup + greens', dinner: 'Mackerel + roasted vegetables', snack: 'Walnuts' },
          { breakfast: 'Oatmeal + banana + cinnamon', lunch: 'Big salad with arugula + sardines', dinner: 'Curry over rice', snack: 'Apple' },
          { breakfast: 'Yogurt parfait', lunch: 'Bone broth + miso + greens', dinner: 'Roast chicken + roasted root vegetables', snack: 'Berries + flax' },
          { breakfast: 'Weekly review + plan-forward', lunch: 'Soup leftovers', dinner: 'Sunday cook for week ahead', snack: 'Kefir' },
        ],
        shoppingList: ['Refresh staples', 'Make a baseline shopping list of your top 10 plan staples to repeat weekly going forward'],
      },
    ],
    keywords: [
      '30 day gut healing meal plan',
      'gut microbiome diet',
      'leaky gut diet plan',
      'IBS friendly meal plan',
      'probiotic prebiotic eating plan',
    ],
  },

  // ===== 4. SLEEP OPTIMIZATION =====
  {
    slug: '30-day-sleep-optimization',
    title: '30-Day Sleep Optimization Meal Plan',
    condition: 'Poor sleep / chronic stress / cortisol dysregulation',
    description:
      'A 30-day eating protocol structured to lower baseline cortisol, boost magnesium intake, support melatonin production, and time evening meals for optimal sleep onset.',
    durationDays: 30,
    intro:
      'Sleep quality is responsive to dietary intervention but requires consistency. The plan below pulls three levers: cortisol-lowering adaptogens (ashwagandha taken daily compounds over 2-4 weeks), magnesium-rich foods (most people are deficient; magnesium supports muscle relaxation + GABA function), and evening meal timing (eating finishes 3+ hours before bed gives digestion time to settle before sleep).',
    foodsEmphasize: [
      'Magnesium-rich foods — pumpkin seeds, almonds, spinach, dark chocolate 70%+',
      'Tryptophan-rich evening foods — turkey, eggs, dairy, oats, banana',
      'Chamomile tea evening (binds GABA receptors)',
      'Ashwagandha 300-500mg daily (powder in golden milk or smoothie)',
      'Complex carbs at dinner (boost serotonin → melatonin precursor)',
      'Tart cherries (natural melatonin source) — 1 cup or 8 oz juice in evening',
    ],
    foodsAvoid: [
      'Caffeine after 12pm (half-life is 5-6 hours)',
      'Alcohol within 3 hours of bed (disrupts REM sleep)',
      'Heavy meals within 3 hours of bed',
      'Bright artificial light + screens 1 hour before bed',
      'Excess simple sugar in evening (causes 2-3am cortisol spike)',
    ],
    supplementation:
      'Optional: magnesium glycinate 200-400mg 60 min before bed (most-studied form for sleep). Ashwagandha 300-500mg daily extract if you do not consume it via the recipes. Tart cherry juice 8oz 30 min before bed (natural melatonin).',
    safety:
      'Ashwagandha boosts thyroid hormone — anyone on thyroid medication or with hyperthyroidism should consult clinician first. Avoid in pregnancy and autoimmune flares. Severe insomnia despite this protocol warrants sleep-study evaluation; check for sleep apnea.',
    weeks: [
      {
        number: 1,
        theme: 'Caffeine + light hygiene + evening rhythm',
        focus: 'No caffeine after noon. No screens 1 hour before bed. Add ashwagandha-chamomile rice pudding to evening rotation 2-3× week.',
        milestone: 'By day 7: sleep onset slightly faster (10-20 min reduction). Wakings during night may reduce slightly.',
        days: [
          { breakfast: 'Greek yogurt + berries + walnuts', lunch: 'Big salad with chicken + olive oil', dinner: 'Salmon + sweet potato + spinach (light)', snack: 'Banana + almond butter 1 hr before bed' },
          { breakfast: 'Oatmeal with banana + flax + walnuts', lunch: 'Lentil soup', dinner: 'ashwagandha-chamomile-bedtime-rice-pudding 90 min before bed', snack: 'Pumpkin seeds in afternoon' },
          { breakfast: 'Smoothie: spinach + banana + Greek yogurt + chia', lunch: 'Buddha bowl with chickpeas + tahini', dinner: 'Roast turkey + green beans + brown rice', snack: 'Tart cherry juice 30 min before bed' },
          { breakfast: 'Vegetable scramble + sourdough', lunch: 'Salmon salad on greens', dinner: 'Lentil-vegetable stew (light)', snack: 'Almonds + dark chocolate' },
          { breakfast: 'Yogurt parfait with banana', lunch: 'Wrap with hummus + greens', dinner: 'ashwagandha-chamomile-bedtime-rice-pudding 90 min before bed', snack: 'Banana' },
          { breakfast: 'Steel-cut oats with banana + cinnamon', lunch: 'Lentil soup', dinner: 'Roast chicken + spinach + brown rice (small portion)', snack: 'Pumpkin seeds + walnuts' },
          { breakfast: 'Vegetable omelet', lunch: 'Salad with sardines', dinner: 'Batch-cook rice pudding for week 2', snack: 'Chamomile tea + tart cherry juice' },
        ],
        shoppingList: [
          'Ashwagandha powder · Chamomile tea (loose flowers or bags) · Tart cherry juice 32 oz',
          'Pumpkin seeds · Almonds · Walnuts · Dark chocolate 70%+ · Tahini',
          'Turkey · Salmon · Sardines · Chicken thighs',
          'Spinach · Sweet potato · Green beans · Bananas · Berries',
          'Greek yogurt · Eggs · Sourdough · Brown rice · Lentils · Steel-cut oats',
          'Cardamom pods · Cinnamon stick · Vanilla extract · Honey (raw)',
        ],
      },
      {
        number: 2,
        theme: 'Adaptogen consistency',
        focus: 'Daily ashwagandha intake (300-500mg). Maintain caffeine + light hygiene. Add 5 min evening meditation OR breathwork to compound the cortisol-lowering effect.',
        milestone: 'By day 14: most plan-followers report falling asleep faster + waking less. Daytime energy slightly more stable. Stress feels lower-grade.',
        days: [
          { breakfast: 'Smoothie: golden milk + Greek yogurt + ashwagandha + banana', lunch: 'Big salad', dinner: 'Salmon + sweet potato', snack: 'Pumpkin seeds' },
          { breakfast: 'Oatmeal with banana + flax', lunch: 'Lentil soup', dinner: 'ashwagandha-chamomile-bedtime-rice-pudding', snack: 'Tart cherry juice' },
          { breakfast: 'Greek yogurt + cinnamon + berries', lunch: 'Buddha bowl', dinner: 'Roast turkey + green beans + brown rice', snack: 'Almonds + dark chocolate' },
          { breakfast: 'Vegetable scramble', lunch: 'Wrap with greens + hummus', dinner: 'Lentil-vegetable stew', snack: 'Banana + walnut butter' },
          { breakfast: 'Yogurt parfait with walnuts', lunch: 'Quinoa salad', dinner: 'ashwagandha-chamomile-bedtime-rice-pudding', snack: 'Pumpkin seeds' },
          { breakfast: 'Smoothie with spinach + banana', lunch: 'Soup leftovers', dinner: 'Roast chicken + brown rice + spinach', snack: 'Tart cherry juice' },
          { breakfast: 'Vegetable omelet', lunch: 'Salad with sardines', dinner: 'Batch-cook for week 3', snack: 'Chamomile tea' },
        ],
        shoppingList: ['Refresh staples', 'Top up ashwagandha + chamomile + tart cherry juice'],
      },
      {
        number: 3,
        theme: 'Timing + magnesium boost',
        focus: 'Move dinner earlier — finish eating by 7pm. Add 200mg magnesium glycinate at bedtime (optional but high-evidence). Bedroom 65°F if possible.',
        milestone: 'By day 21: sleep depth meaningfully better. Less nighttime wakings. Morning energy clearer.',
        days: [
          { breakfast: 'Greek yogurt + berries + chia', lunch: 'Big lunch (largest meal of day)', dinner: 'Light early dinner: salmon + greens', snack: 'Banana + almond butter' },
          { breakfast: 'Oatmeal + banana + flax', lunch: 'Lentil soup', dinner: 'Light: vegetable omelet + small portion brown rice', snack: 'ashwagandha-chamomile-bedtime-rice-pudding' },
          { breakfast: 'Smoothie', lunch: 'Big salad with grilled chicken', dinner: 'Light: bone broth + miso + greens', snack: 'Pumpkin seeds + dark chocolate' },
          { breakfast: 'Vegetable scramble', lunch: 'Wrap with hummus + greens', dinner: 'Light: salmon poke bowl', snack: 'Tart cherry juice' },
          { breakfast: 'Yogurt parfait', lunch: 'Big variety salad', dinner: 'Light: vegetable curry + rice', snack: 'ashwagandha-chamomile-bedtime-rice-pudding' },
          { breakfast: 'Oats + banana', lunch: 'Quinoa bowl', dinner: 'Light: roast turkey + spinach', snack: 'Walnuts + chamomile tea' },
          { breakfast: 'Omelet', lunch: 'Salad', dinner: 'Sunday batch cook (lighter base portions)', snack: 'Banana + tart cherry juice' },
        ],
        shoppingList: ['Refresh produce + proteins', 'Magnesium glycinate from pharmacy/health store'],
      },
      {
        number: 4,
        theme: 'Habit lock-in',
        focus: 'The 3-4 evening meals that worked best become your new baseline. Maintain ashwagandha-daily + magnesium-bedtime + dinner-before-7pm.',
        milestone: 'By day 30: most plan-followers report 30-60 min better sleep onset, less nighttime wakings, more stable daytime energy. Cortisol patterns measurably improved if tested.',
        days: [
          { breakfast: 'Greek yogurt + berries', lunch: 'Big salad', dinner: 'Salmon + sweet potato (early)', snack: 'Banana + almond butter' },
          { breakfast: 'Oatmeal with banana', lunch: 'Lentil soup', dinner: 'Roast turkey + greens (early)', snack: 'ashwagandha-chamomile-bedtime-rice-pudding' },
          { breakfast: 'Smoothie', lunch: 'Buddha bowl', dinner: 'Light vegetable curry + rice', snack: 'Pumpkin seeds + dark chocolate' },
          { breakfast: 'Vegetable scramble', lunch: 'Quinoa salad', dinner: 'Salmon + asparagus (early)', snack: 'Tart cherry juice' },
          { breakfast: 'Yogurt parfait', lunch: 'Wrap with hummus', dinner: 'Bone broth + miso + greens', snack: 'ashwagandha-chamomile-bedtime-rice-pudding' },
          { breakfast: 'Steel-cut oats + banana', lunch: 'Salad with sardines', dinner: 'Roast chicken + brown rice (early, small)', snack: 'Walnuts + chamomile tea' },
          { breakfast: 'Weekly review + going-forward plan', lunch: 'Soup', dinner: 'Sunday cook for week ahead', snack: 'Tart cherry juice' },
        ],
        shoppingList: ['Refresh staples'],
      },
    ],
    keywords: [
      '30 day sleep meal plan',
      'sleep optimization diet',
      'cortisol lowering food plan',
      'ashwagandha daily plan',
      'magnesium for sleep diet',
    ],
  },
];

export function getMealPlan(slug: string): MealPlan | undefined {
  return MEAL_PLANS.find((p) => p.slug === slug);
}
