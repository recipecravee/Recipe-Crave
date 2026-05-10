// Image bank — curated stable Unsplash photo URLs by category.
// All images are licensed for commercial use under Unsplash License (free, no attribution required).
// Format: https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w={W}&q=80
// Cards reference these via the helper at the bottom. Fallback to brand gradient if any URL 404s.

const W = 'auto=format&fit=crop&w=1600&q=80';

export const IMG = {
  // Pasta / Italian
  pasta: `https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?${W}`,
  shrimpPasta: `https://images.unsplash.com/photo-1473093226795-af9932fe5856?${W}`,
  tomatoSoup: `https://images.unsplash.com/photo-1547592180-85f173990554?${W}`,
  pizza: `https://images.unsplash.com/photo-1513104890138-7c749659a591?${W}`,

  // Chicken / poultry
  roastChicken: `https://images.unsplash.com/photo-1598103442097-8b74394b95c6?${W}`,
  chickenThighs: `https://images.unsplash.com/photo-1532550907401-a500c9a57435?${W}`,
  jerkChicken: `https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?${W}`,
  buffaloWings: `https://images.unsplash.com/photo-1608039755401-742074f0548d?${W}`,
  thaiBasil: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?${W}`,
  suya: `https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?${W}`,

  // Beef / meats
  burger: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?${W}`,
  steak: `https://images.unsplash.com/photo-1546964124-0cce460f38ef?${W}`,
  bbqRibs: `https://images.unsplash.com/photo-1544025162-d76694265947?${W}`,
  pulledPork: `https://images.unsplash.com/photo-1606755962773-d324e0a13086?${W}`,

  // Seafood
  salmon: `https://images.unsplash.com/photo-1467003909585-2f8a72700288?${W}`,
  shrimp: `https://images.unsplash.com/photo-1633504581786-316c8002b1b9?${W}`,
  fish: `https://images.unsplash.com/photo-1485921325833-c519f76c4927?${W}`,

  // Rice / grains
  friedRice: `https://images.unsplash.com/photo-1603133872878-684f208fb84b?${W}`,
  jollofRice: `https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?${W}`,
  riceBowl: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?${W}`,
  ricePeas: `https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?${W}`,

  // Curries / stews
  curry: `https://images.unsplash.com/photo-1565557623262-b51c2513a641?${W}`,
  egusi: `https://images.unsplash.com/photo-1505253758473-96b7015fcd40?${W}`,
  redRed: `https://images.unsplash.com/photo-1574484284002-952d92456975?${W}`,
  pho: `https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?${W}`,
  ramen: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?${W}`,

  // Vegetarian / bowls
  chickpeaCurry: `https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?${W}`,
  falafel: `https://images.unsplash.com/photo-1540420773420-3366772f4999?${W}`,
  saladBowl: `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?${W}`,
  cucumber: `https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?${W}`,

  // Breakfast
  pancakes: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?${W}`,
  plantain: `https://images.unsplash.com/photo-1574484284002-952d92456975?${W}`,
  cornbread: `https://images.unsplash.com/photo-1612203985729-70726954388c?${W}`,
  akara: `https://images.unsplash.com/photo-1559561853-08451507cbe7?${W}`,

  // Small chops / appetizers
  meatPie: `https://images.unsplash.com/photo-1621241441637-ea2d3f59db32?${W}`,
  springRolls: `https://images.unsplash.com/photo-1606471191009-63994c53433b?${W}`,
  samosas: `https://images.unsplash.com/photo-1601050690597-df0568f70950?${W}`,
  puffPuff: `https://images.unsplash.com/photo-1606471191009-63994c53433b?${W}`,
  moinMoin: `https://images.unsplash.com/photo-1574484284002-952d92456975?${W}`,

  // Cakes / desserts
  cookies: `https://images.unsplash.com/photo-1499636136210-6f4ee915583e?${W}`,
  chocolateCake: `https://images.unsplash.com/photo-1578985545062-69928b1d9587?${W}`,
  carrotCake: `https://images.unsplash.com/photo-1571115177098-24ec42ed204d?${W}`,
  redVelvet: `https://images.unsplash.com/photo-1586788680434-30d324b2d46f?${W}`,
  lemonCake: `https://images.unsplash.com/photo-1519869325930-281384150729?${W}`,

  // Pastries
  cinnamonRolls: `https://images.unsplash.com/photo-1509365465985-25d11c17e812?${W}`,
  biscuits: `https://images.unsplash.com/photo-1571115177098-24ec42ed204d?${W}`,
  scones: `https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?${W}`,
  croissants: `https://images.unsplash.com/photo-1555507036-ab1f4038808a?${W}`,

  // Drinks
  chapman: `https://images.unsplash.com/photo-1551024506-0bccd828d307?${W}`,
  zobo: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?${W}`,
  chai: `https://images.unsplash.com/photo-1571934811356-5cc061b6821f?${W}`,
  latte: `https://images.unsplash.com/photo-1572442388796-11668a67e53d?${W}`,
  cocktail: `https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?${W}`,

  // Smoothies
  mangoSmoothie: `https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?${W}`,
  greenSmoothie: `https://images.unsplash.com/photo-1610970881699-44a5587cabec?${W}`,
  berrySmoothie: `https://images.unsplash.com/photo-1502741224143-90386d7f8c82?${W}`,

  // Soups (more)
  pumpkinSoup: `https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?${W}`,
  tortillaSoup: `https://images.unsplash.com/photo-1547592180-85f173990554?${W}`,

  // Mediterranean / Middle East
  hummus: `https://images.unsplash.com/photo-1571197119282-7c4e6517f8c1?${W}`,

  // Ackee
  ackee: `https://images.unsplash.com/photo-1574484284002-952d92456975?${W}`,

  // Kelewele / plantain
  kelewele: `https://images.unsplash.com/photo-1606471191009-63994c53433b?${W}`,

  // Mac & cheese
  macAndCheese: `https://images.unsplash.com/photo-1543339308-43e59d6b73a6?${W}`,

  // === Phase D additions ===
  frenchOnionSoup: `https://images.unsplash.com/photo-1574484284002-952d92456975?${W}`,
  beefBourguignon: `https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?${W}`,
  ratatouille: `https://images.unsplash.com/photo-1540420773420-3366772f4999?${W}`,
  koreanBibimbap: `https://images.unsplash.com/photo-1553163147-622ab57be1c7?${W}`,
  kimchi: `https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?${W}`,
  koreanFriedChicken: `https://images.unsplash.com/photo-1626804475297-41608ea09aeb?${W}`,
  bulgogi: `https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?${W}`,
  paella: `https://images.unsplash.com/photo-1534080564583-6be75777b70a?${W}`,
  tortillaEspanola: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?${W}`,
  adobo: `https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?${W}`,
  feijoada: `https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?${W}`,
  caipirinha: `https://images.unsplash.com/photo-1551024506-0bccd828d307?${W}`,
  greekSalad: `https://images.unsplash.com/photo-1540420773420-3366772f4999?${W}`,
  gyros: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?${W}`,
  banhMi: `https://images.unsplash.com/photo-1558030006-450675393462?${W}`,
  injera: `https://images.unsplash.com/photo-1574484284002-952d92456975?${W}`,
  bunnyChow: `https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?${W}`,
  lebaneseHummus: `https://images.unsplash.com/photo-1540420773420-3366772f4999?${W}`,
  tabbouleh: `https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?${W}`,
  shawarma: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?${W}`,
  tomYum: `https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?${W}`,
  tiramisu: `https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?${W}`,
  cheesecake: `https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?${W}`,
  churros: `https://images.unsplash.com/photo-1551782450-a2132b4ba21d?${W}`,
  eggsBenedict: `https://images.unsplash.com/photo-1565299507177-b0ac66763828?${W}`,
  panditDal: `https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?${W}`,
} as const;
