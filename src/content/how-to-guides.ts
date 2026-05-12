// How-to technique guides. Long-form articles teaching one skill each.
// Same shape as blog posts so they share the markdown-lite renderer.

export type HowToGuide = {
  slug: string;
  title: string;
  description: string;
  readingTimeMin: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  excerpt: string;
  body: string;
  keywords: string[];
  relatedRecipes?: string[];
};

export const HOW_TO_GUIDES: HowToGuide[] = [
  {
    slug: 'how-to-poach-an-egg',
    title: 'How to Poach an Egg — Perfect Whites, Runny Yolk, Every Time',
    description:
      'The complete technique for poaching an egg. Vinegar ratio, water temperature, the vortex method, and why fresh eggs matter. Plus three professional variations.',
    readingTimeMin: 5,
    difficulty: 'beginner',
    tags: ['eggs', 'breakfast', 'technique'],
    excerpt:
      'A poached egg looks intimidating and is actually one of the easiest hot preparations once you understand the three variables: egg freshness, water temperature, and acid level.',
    body:
      `A poached egg is the cleanest expression of an egg there is. No fat, no flavor masking, no shell flakes. Just whites that hold their shape, yolk that bursts golden when you cut into it. Eggs Benedict's foundation. The garnish that turns a plain soup into something restaurant-worthy.

## The three variables

**1. Freshness.** Fresh eggs (within 2 weeks of lay) hold their whites tightly. Older eggs (closer to expiry) have thinner whites that scatter the moment they hit water. If you can choose, use the freshest eggs you have. Test: float in water — fresh sinks flat, week-old sinks but tilts, old floats.

**2. Water temperature.** Boiling water turns whites into rags. Cold water gives nothing to coagulate against. The window is 180-190°F (82-88°C) — a "bare simmer" where bubbles form at the bottom but don't rise. If your kitchen has a thermometer use it; if not, simmer until you see 2-3 small bubbles per second at the bottom and the surface is steaming but flat.

**3. Acid level.** 1 tablespoon white vinegar (or rice vinegar) per 4 cups water. The acid speeds up protein coagulation at the egg surface so the white sets before it spreads. Skip the salt — salt actually does the opposite, slowing coagulation.

## The technique

1. Fill a wide saucepan or skillet with 3 inches of water.
2. Add 1 tablespoon white vinegar per 4 cups water. Do NOT add salt.
3. Bring to a bare simmer (180-190°F). Reduce heat to keep it steady.
4. Crack each egg into a small ramekin or cup (one at a time). This way you can slide the egg in gently and rescue any with broken yolks before they hit water.
5. With a spoon, stir the water briskly in one direction to create a vortex.
6. Hold the ramekin lip just at water surface in the center of the vortex. Tip the egg in.
7. The vortex wraps the white around the yolk. Stop stirring.
8. Cook 3 minutes for soft-poached (runny yolk, set white). 4 minutes for medium. 5+ minutes for firm (most yolks are set hard by 5 min).
9. Lift out with a slotted spoon. Pat the spoon on a folded paper towel to absorb the cooking water (this is the step most home cooks skip — wet poached eggs ruin toast and salad alike).
10. Serve immediately.

## Common mistakes

- **Boiling water** — the #1 issue. White spreads into rags. Lower the heat.
- **Salt in water** — slows coagulation. White spreads.
- **Cracking egg directly into water** — you cannot rescue broken yolks mid-air. Always pre-crack into a ramekin.
- **Not patting dry** — water clings to the white. Drip-water makes salad limp and toast soggy.
- **Cooking multiple at once on first try** — pratice with one egg. When confident, do two at a time (and remove the first one when its 3-4 min are up — eggs don't go in at exactly the same moment).

## Make ahead

You can poach eggs up to 24 hours in advance. After cooking, drop them into an ice bath. Refrigerate in cold water. When ready to serve, reheat by slipping them into 165°F water for 60 seconds. Perfect texture, hot-to-serve.

## Variations

**Eggs Benedict** — toasted English muffin + Canadian bacon + poached egg + hollandaise. The classic application; hollandaise recipe in our sauces collection.

**Asian poached egg over noodles** — poach in a mix of soy + vinegar + scallions. Lift out, serve over rice noodles with broth.

**Shakshuka-style** — crack eggs directly into a simmering tomato sauce instead of water. Cover the pan for 4-5 min. Different technique, same idea.`,
    keywords: [
      'how to poach an egg', 'perfect poached egg', 'poaching egg technique',
      'poached egg vinegar ratio', 'poached egg water temperature',
      'eggs benedict base',
    ],
    relatedRecipes: [],
  },
  {
    slug: 'how-to-julienne-vegetables',
    title: 'How to Julienne Vegetables — The Knife Cut Every Cook Should Master',
    description:
      'Julienne cuts vegetables into uniform matchsticks. Used in stir-fries, salads, garnishes. The technique takes 2 minutes to learn and 30 minutes to make automatic.',
    readingTimeMin: 4,
    difficulty: 'beginner',
    tags: ['knife-skills', 'technique', 'vegetables'],
    excerpt:
      'Julienne is a knife cut producing uniform matchsticks roughly 1/8 inch thick by 2 inches long. It looks like restaurant work; it takes 2 minutes to learn.',
    body:
      `Julienne is one of the foundational knife cuts. Same vegetable, three different shapes, three different dishes. Carrot batons go in beef stew. Brunoise dice go in a salsa. Julienne goes in stir-fry, slaw, garnish for soup.

The technique:

## Equipment you need

- Sharp chef's knife (8-10 inch blade)
- Cutting board with a non-slip mat or damp towel underneath
- The vegetable

The blade has to be sharp. A dull knife crushes rather than cuts and turns julienne into mush. Sharpen monthly with a honing rod; full sharpen quarterly with a stone or send to a sharpening service.

## The cut

1. **Square the vegetable.** Cut off rounded ends. Square the sides so you have a rectangular block — this gives stable contact with the board. Trim sparingly; squared sides only need to be flat enough that the vegetable doesn't roll.
2. **Plank (slice lengthwise into flat sheets).** Cut into planks 1/8 inch thick. For a carrot: lay it on its widest squared face, slice down the length into 4-6 planks.
3. **Stack 2-3 planks.** Don't stack more — taller stacks slip.
4. **Slice the stack lengthwise into matchsticks 1/8 inch wide.** This is the julienne cut. Maintain a steady rocking motion: tip stays on board, heel comes up and down.
5. **Cut crosswise to standard length.** Julienne is typically 2 inches long; cut the matchsticks to length once you have them.

## Which vegetables julienne well

- **Carrots** — classic. Hold up to stir-fries, salads, garnish.
- **Daikon radish** — for kimbap and many Asian dishes.
- **Zucchini** — quick julienne, use raw or briefly sauté.
- **Bell peppers** — slice into planks, then matchsticks.
- **Cucumbers** — seedless variety, otherwise scoop seeds first.
- **Apples** — for slaws and Waldorf-style salads.

## Common mistakes

- **Vegetable not squared first** — rounded sides roll on the board, knife slips, fingers at risk.
- **Stack too tall** — 4+ planks slip mid-cut.
- **Inconsistent thickness** — uneven cooking. Aim for visible uniformity; if a piece is twice as thick as its neighbors, recut.
- **Curled fingers not curled** — the holding hand should curl knuckles forward, fingertips tucked back. Knife rides against the second knuckle.

## Speed

After 20 cuts you'll be twice as fast as the first cut. After 100, you'll feel competent. After a year of regular cooking, you'll julienne a carrot in 90 seconds without thinking. Treat the first few sessions as practice — the speed comes.

## Tools that skip the work

A mandoline with a julienne attachment cuts perfectly uniform julienne in 30 seconds. Recommended for: large-volume cooking (slaws for 8+), perfect garnish presentation, or anyone with limited knife skills. Always use the hand guard — mandoline injuries are common and severe.`,
    keywords: [
      'how to julienne', 'julienne vegetables', 'julienne carrots',
      'knife skills julienne', 'matchstick cut vegetables', 'julienne technique',
    ],
    relatedRecipes: [],
  },
  {
    slug: 'how-to-make-a-roux',
    title: 'How to Make a Roux — Three Levels of Brown, Three Different Dishes',
    description:
      'A roux is equal parts flour and fat cooked together. The color determines the dish. Blonde for béchamel, light brown for chowder, dark brown for gumbo. Here is each one.',
    readingTimeMin: 6,
    difficulty: 'beginner',
    tags: ['technique', 'sauces', 'french-foundations'],
    excerpt:
      'Three minutes of stirring creates blonde roux for sauces. Twenty minutes of stirring creates the dark roux that defines gumbo. Same two ingredients, three radically different dishes.',
    body:
      `A roux is the simplest thickener in cooking. Equal-weight flour and fat (butter for European cuisines; oil for Cajun) cooked together to dissolve the raw-flour taste and form a starch-and-fat paste that thickens liquid into sauce.

The color matters. Blonde roux thickens béchamel and velouté. Light brown roux thickens chowders. Dark brown roux is the foundation of gumbo — it has minimal thickening power but massive flavor depth.

## The basic 1:1 ratio

Equal parts by weight. For most home cooking: 2 tablespoons butter (28g) + 2 tablespoons flour (15g). That's roughly close to equal weight. For exact: weigh both. The slight ratio difference doesn't matter much.

## Method (blonde roux — for béchamel/cream sauces)

1. Melt 2 tablespoons butter in a saucepan over medium heat.
2. Once butter foams and the foam dies down, sprinkle in 2 tablespoons flour while whisking.
3. Whisk continuously for 60-90 seconds. The mixture should foam, then smell faintly nutty.
4. The roux is "blonde" — pale gold, not yet darkening.
5. Slowly whisk in 2 cups warm milk (cold milk shocks the roux and lumps it). Whisk constantly until smooth.
6. Cook 5-8 minutes more, whisking often, until thickened. Salt + nutmeg.

This is béchamel — base for mac and cheese, lasagna sauce, croque monsieur.

## Light brown roux (3-4 minutes total cook before liquid)

Same start. After 60-90 seconds at blonde stage, keep whisking 2 more minutes. The roux turns the color of peanut butter. Add hot stock (chicken, fish, vegetable) instead of milk. Cook 10-15 minutes. This is the base for **chowders and the velouté family of sauces**.

## Dark brown roux (20-30 minutes — the gumbo roux)

This is a different recipe. Use oil, not butter — butter burns at the high temperatures and long cook this requires.

1. Heat 1/2 cup neutral oil (canola, vegetable) in a heavy-bottomed cast-iron skillet over medium heat.
2. Whisk in 1/2 cup flour.
3. Stir constantly with a wooden spoon. Do not stop. The flour will turn beige, then peanut butter, then milk chocolate, then dark chocolate.
4. The whole process takes 20-30 minutes. Patience is the only skill required.
5. The roux is done at "milk chocolate to dark chocolate" — depending on the dish. Lighter for chicken gumbo; darker for seafood gumbo.
6. The moment you stop stirring, the roux will burn within seconds. If you smell anything acrid, throw it out and start over.
7. Once dark, stir in the holy trinity (chopped onion + celery + bell pepper) directly into the hot roux — they will sizzle and stop the cooking.

## Storage

Blonde and light brown roux can be made in batches and refrigerated for 1 week or frozen for 3 months. Portion into ice-cube tray (each cube ≈ 1 tablespoon) and use straight from frozen — drop into simmering liquid and whisk.

Dark brown roux loses some flavor on storage but still works. Make in 1-pound batches if you cook gumbo regularly.

## Common mistakes

- **Adding cold liquid** — lumps. Always warm the milk/stock first.
- **Stopping stirring on dark roux** — burns in seconds. Don't take a phone call.
- **Wrong fat for dark roux** — butter burns past 250°F. Use oil.
- **Skimping on time** — undercooked roux tastes floury. Cook long enough that the raw-flour taste disappears, then a bit more.`,
    keywords: [
      'how to make a roux', 'blonde roux', 'dark roux gumbo',
      'roux recipe', 'flour butter sauce base',
      'bechamel roux', 'roux for gumbo',
    ],
    relatedRecipes: [],
  },
  {
    slug: 'how-to-temper-chocolate',
    title: 'How to Temper Chocolate — Glossy Snap Without a Tempering Machine',
    description:
      'Tempering chocolate is the technique that gives commercial chocolate its glossy shine and clean snap. Here is the home-cook seeding method that works without a thermometer.',
    readingTimeMin: 7,
    difficulty: 'intermediate',
    tags: ['technique', 'chocolate', 'desserts'],
    excerpt:
      'Untempered chocolate looks dull and breaks softly. Tempered chocolate is glossy and snaps cleanly. The difference is controlled crystal formation. Here is the simplest reliable method.',
    body:
      `Chocolate is mostly cocoa butter — and cocoa butter forms six different crystal structures when it cools, only one of which (called Form V or beta crystals) gives the desirable shine + snap + room-temperature stability. Tempering is the process of controlling which crystals form.

You cannot tell tempered from untempered chocolate when it's melted. You can tell when it cools: tempered chocolate sets in 5-10 minutes with a glossy surface and snaps when broken. Untempered chocolate stays sticky, takes hours to set, and has a dull or streaky surface (called "bloom").

## When you need to temper

- Chocolate-covered strawberries
- Truffles with a chocolate shell
- Bark / dipped candies
- Any application where the chocolate is on the outside and visible

You don't need to temper when:
- Chocolate is melted into a ganache (cream cuts the crystal issue)
- Chocolate is baked into cookies, cakes, brownies (heat alters everything)
- Chocolate is being used as a sauce
- You're making hot chocolate or hot mocha

## The simplest method — seeding

Best for home cooks. Requires only a microwave and a kitchen thermometer (or careful timing).

1. **Chop 12 ounces (340g) good chocolate.** Use chocolate that's already tempered — like a Lindt or Valrhona block. Skip chips; they have stabilizers that interfere.
2. **Set aside 1/3 (4 ounces / 113g) as your "seed".**
3. **Melt the other 2/3 (8 ounces / 227g)** in a microwave-safe bowl. 30 seconds at 50% power, stir, repeat until almost fully melted. Stir until smooth — residual heat finishes the melt.
4. **Check temperature**: should be 110-115°F (43-46°C). Too hot and you'll have to start over.
5. **Drop the seed (4 oz cold chocolate chunks) into the melted chocolate.** Stir gently and constantly. The seed slowly melts and seeds Form V crystals into the rest.
6. **Watch temperature drop.** When the mixture reaches 88-90°F (31-32°C) for dark chocolate (or 86-88°F for milk/white), the chocolate is tempered.
7. **Remove any unmelted seed chunks** with a fork.
8. **Test temper**: dab a small amount on parchment paper. It should set in 5 min with shine and snap. If it sets dull or streaky, you're slightly out of temper — reheat to 95°F and add more seed.

## How to maintain temper while working

Tempered chocolate cools quickly. To keep it workable for dipping/coating:

- Set the bowl over a separate bowl of warm (95-100°F) water — not hot. The bain-marie keeps the chocolate at 90°F.
- Stir every 60 seconds.
- If the chocolate starts thickening, remove from the warm water briefly and stir vigorously to redistribute heat. Don't return to high heat — overheating breaks temper.

## Storage of tempered chocolate

Once cool and set, tempered chocolate keeps 6-12 months at room temperature in a cool, dry place. Avoid the fridge — humidity causes sugar bloom (a white frost on the surface). Lower than 65°F is ideal; under 70% humidity.

## Common mistakes

- **Overheating** — past 120°F destroys all crystals, even the ones in your seed. Must start over.
- **Using chocolate chips** — stabilizers (lecithin, vegetable oils) interfere with crystal formation.
- **Stirring too fast/aggressively** — incorporates air, which then leaves bubbles in the final chocolate. Stir slowly.
- **Not testing the temper** — always dab a tiny amount on parchment + wait 5 min before committing to a whole batch.`,
    keywords: [
      'how to temper chocolate', 'tempering chocolate at home',
      'seeding method tempered chocolate', 'chocolate temper',
      'glossy chocolate technique', 'chocolate bloom prevention',
    ],
    relatedRecipes: [],
  },
  {
    slug: 'how-to-cook-perfect-rice',
    title: 'How to Cook Perfect Rice — Every Time, Without a Rice Cooker',
    description:
      'The water ratio. The rinse. The rest. Why you should not lift the lid. A complete guide to perfect rice — covered for long-grain white, brown, basmati, jasmine, and sushi rice.',
    readingTimeMin: 6,
    difficulty: 'beginner',
    tags: ['rice', 'grains', 'technique'],
    excerpt:
      'Rice is unforgiving in three ways: ratio, heat, and the moment you stop lifting the lid. Get those three right and rice is foolproof. Get one wrong and rice is gummy or burnt.',
    body:
      `Rice is the most-cooked grain on Earth and the most-frequently-mistreated in Western kitchens. The technique is simple. The mistakes are predictable.

## The three rules

**1. Rinse until clear.** Most rice carries surface starch from milling. That starch is what makes finished rice gummy. Place rice in a bowl, fill with cold water, swirl with your hand, drain. Repeat 3-4 times until water runs nearly clear. For sushi rice or risotto rice, skip this — those dishes want the starch.

**2. Correct water ratio.** Different rice = different ratio:
- **Long-grain white** (American long-grain, basmati, jasmine): 1 cup rice + 1.5 cups water + 0.5 tsp salt
- **Medium-grain white** (arborio, Calrose): 1 cup rice + 1.25 cups water
- **Short-grain white** (sushi rice, Japanese rice): 1 cup rice + 1.1 cups water
- **Brown rice**: 1 cup + 2.25 cups water (longer cook means more water absorbed and lost to steam)
- **Wild rice**: 1 cup + 3 cups water (wild rice is more grain hull, less starch core)

**3. Lid stays on.** Once you bring rice to a simmer and cover the pot, do not lift the lid until the timer goes off. Lifting releases steam and disrupts the cooking process. Trust the timer.

## Method (long-grain white rice — the most common)

1. Rinse 1 cup rice in cold water until water runs nearly clear.
2. Combine rinsed rice + 1.5 cups water + 0.5 tsp salt in a heavy-bottomed saucepan with a tight-fitting lid.
3. Optional: add 1 tablespoon butter or olive oil for richness.
4. Bring to a boil over high heat with the lid OFF. The moment it hits a boil, reduce heat to lowest setting.
5. Cover the pot. Cook 15 minutes (long-grain), 18 minutes (brown rice would need 45 min; this is just for white).
6. Remove pot from heat. **Do not lift the lid.** Let rest 10 minutes off heat with lid on. This is the crucial step most home cooks skip — the residual moisture redistributes from the bottom (where extra liquid pools) to the top.
7. Fluff with a fork. Serve.

## Brown rice variation

Same method, but: 1 cup rice + 2.25 cups water, cook 35-40 minutes, rest 10 minutes.

## Sushi rice variation

1 cup short-grain Japanese rice + 1.1 cups water. NO salt during cook. After resting 10 min, fold in a seasoning of 2 tablespoons rice vinegar + 1 tablespoon sugar + 1/2 teaspoon salt while still warm.

## Common mistakes

- **Not rinsing** — surface starch makes finished rice gummy. (Skip rinse only for sushi rice + risotto.)
- **Wrong ratio** — sticking to 1:2 for everything produces wet long-grain. Match ratio to rice type.
- **Lifting the lid** — every peek loses ~3 minutes worth of steam. The lid stays shut.
- **Skipping the rest** — straight-from-heat rice has wet patches and dry patches. The 10-minute rest evens it out.
- **Salt timing** — salt before cooking for white rice. For brown rice, salt after cooking (the long cook over-concentrates salt added at start).

## The pot matters

A heavy-bottomed pot with a tight-fitting glass lid is the ideal home setup. The heavy bottom prevents scorching at low heat. The tight lid keeps steam in.

A rice cooker handles all of this automatically and is worth buying if you eat rice regularly. Zojirushi and Tiger are the gold standard. A cheap rice cooker still beats most home stovetops because it uses precise heat-and-rest timing.`,
    keywords: [
      'how to cook perfect rice', 'rice water ratio',
      'fluffy rice technique', 'rice cooking method',
      'long grain rice cooking', 'sushi rice recipe',
    ],
    relatedRecipes: [],
  },
  {
    slug: 'how-to-brown-butter',
    title: 'How to Brown Butter — The 3-Minute Transformation Every Cook Should Know',
    description:
      'Brown butter is butter cooked until the milk solids toast to a deep amber, adding nutty caramelized depth to anything it touches. It transforms cookies, vegetables, fish, and pasta in 3 minutes.',
    readingTimeMin: 4,
    difficulty: 'beginner',
    tags: ['technique', 'butter', 'fundamentals'],
    excerpt:
      'Plain butter is fat + water + milk solids. Brown butter is butter cooked until the milk solids toast to amber and the kitchen smells of caramel. Three minutes of stirring transforms anything it touches.',
    body:
      `Brown butter is one of the highest-impact-per-minute techniques in cooking. The transformation: butter melts → water evaporates → milk solids brown (Maillard reaction) → the resulting liquid has caramelized, nutty depth far beyond plain butter.

French chefs call it "beurre noisette" — hazelnut butter, because of the smell. Used in everything from sage-brown-butter pasta to brown-butter chocolate chip cookies (cookies which, every blind test, beat plain-butter cookies).

## Method

1. **Use unsalted butter.** Salted butter foams less reliably and the salt content is variable. Use at least 4 tablespoons (60g) — small batches burn quickly. 1 stick (115g) is a comfortable working size.
2. **Cube the butter.** Even melting; smaller pieces brown together.
3. **Heat a light-colored saucepan over medium heat.** Light color matters because you need to see the browning. Stainless steel or enameled cast iron is ideal; black non-stick obscures the color change.
4. **Add butter. Stir gently and constantly with a heat-safe spatula or wooden spoon.**
5. **Butter melts. Then bubbles vigorously** as water evaporates (about 60 seconds).
6. **Foam rises, then subsides.** Pause and listen — the sound goes from violent fizzling to a gentler crackle.
7. **Look at the bottom of the pan as you stir.** You'll see small light-brown specks (the milk solids) appearing in the foam. Smell: nutty, caramel, popcorn.
8. **Pull off heat the moment the specks are amber.** Not dark brown — burnt butter is bitter. Total time: 3-5 minutes from cold.
9. **Pour into a heat-safe bowl immediately.** The hot pan continues cooking even off heat; transferring stops the carryover.

## Storage

Brown butter solidifies as it cools. Refrigerate up to 3 weeks. Re-melts cleanly. Tastes even better after a day in the fridge — the flavor compounds settle.

## What to do with it

- **Brown butter pasta with sage** — fastest impressive dinner. Cook pasta. Drain. Toss with brown butter, fresh sage leaves, grated parmesan, black pepper.
- **Brown butter chocolate chip cookies** — replace some/all melted butter in any cookie recipe with brown butter. Game-changer.
- **Brown butter on vegetables** — drizzle on roasted carrots, asparagus, brussels sprouts, butternut squash.
- **Brown butter on fish** — pan-seared white fish + brown butter + capers + lemon = sole meunière, one of French cooking's classics.
- **Brown butter buttercream frosting** — replace plain butter in any buttercream with cooled-but-still-soft brown butter.

## Common mistakes

- **Walking away** — the window from "perfect" to "burnt" is 30-45 seconds. Do not leave the pan.
- **Black non-stick pan** — you can't see the browning. Use a light-colored pan.
- **Too small a quantity** — 1-2 tablespoons brown in 60 seconds and you'll miss it. 4+ tablespoons gives a workable window.
- **Pouring back into the same pan** — residual heat keeps cooking. Transfer to a clean cold bowl.
- **Using clarified butter** — clarified butter has no milk solids and cannot brown. You need whole butter with all components intact.

## The science

Butter is roughly 80% fat, 15% water, 5% milk solids (proteins + lactose). On heating: water evaporates first (the bubbling stage). Once water is gone, the milk solids (proteins + sugars) Maillard-react. That's the browning — and it's the same reaction that makes seared meat, toasted bread, and brewed coffee taste like they do.`,
    keywords: [
      'how to brown butter', 'brown butter technique',
      'beurre noisette', 'browned butter cookies',
      'brown butter pasta sage', 'maillard browning butter',
    ],
    relatedRecipes: [],
  },
];

export function getHowToGuide(slug: string): HowToGuide | undefined {
  return HOW_TO_GUIDES.find((g) => g.slug === slug);
}
