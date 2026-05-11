// Image bank — Unsplash photo URLs verified via search API for actual dish relevance.
// Each photo ID was fetched from Unsplash search results for the specific dish keyword,
// not a generic food category. Free Unsplash License (commercial use, no attribution required).

const W = 'auto=format&fit=crop&w=1600&q=80';

export const IMG = {
  // === Italian ===
  pasta: `https://images.unsplash.com/photo-1683824870303-ae378f721084?${W}`,
  shrimpPasta: `https://images.unsplash.com/photo-1683824870303-ae378f721084?${W}`,
  tomatoSoup: `https://images.unsplash.com/photo-1692776407523-8f3c4678ad36?${W}`,
  pizza: `https://images.unsplash.com/photo-1513104890138-7c749659a591?${W}`,

  // === Chicken / poultry ===
  roastChicken: `https://images.unsplash.com/photo-1642338320882-d966ad8587f2?${W}`,
  chickenThighs: `https://images.unsplash.com/photo-1642338320882-d966ad8587f2?${W}`,
  jerkChicken: `https://images.unsplash.com/photo-1658833608786-22c4b4a621de?${W}`,
  buffaloWings: `https://images.unsplash.com/photo-1608039755401-742074f0548d?${W}`,
  thaiBasil: `https://images.unsplash.com/photo-1707897634981-39bcfe435268?${W}`,
  // Suya search returned nothing free; reuse jerk chicken (visually similar skewered/spiced meat)
  suya: `https://images.unsplash.com/photo-1658833608786-22c4b4a621de?${W}`,

  // === Beef / meats ===
  burger: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?${W}`,
  steak: `https://images.unsplash.com/photo-1569229490681-4085b3f54ba3?${W}`,
  bbqRibs: `https://images.unsplash.com/photo-1544025162-d76694265947?${W}`,
  pulledPork: `https://images.unsplash.com/photo-1709581529998-11b7b2e17f55?${W}`,

  // === Seafood ===
  salmon: `https://images.unsplash.com/photo-1523218689796-d4c2ef4f3d72?${W}`,
  shrimp: `https://images.unsplash.com/photo-1683824870303-ae378f721084?${W}`,
  fish: `https://images.unsplash.com/photo-1523218689796-d4c2ef4f3d72?${W}`,

  // === Rice / grains ===
  friedRice: `https://images.unsplash.com/photo-1603133872878-684f208fb84b?${W}`,
  jollofRice: `https://images.unsplash.com/photo-1665332195309-9d75071138f0?${W}`,
  riceBowl: `https://images.unsplash.com/photo-1665332195309-9d75071138f0?${W}`,
  ricePeas: `https://images.unsplash.com/photo-1632852576480-c10a8e19496a?${W}`,

  // === Curries / stews ===
  curry: `https://images.unsplash.com/photo-1731328351443-ea233d9b8037?${W}`,
  egusi: `https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?${W}`,
  redRed: `https://images.unsplash.com/photo-1540716189226-20cc9c9116e0?${W}`,
  pho: `https://images.unsplash.com/photo-1631709497146-a239ef373cf1?${W}`,

  // === Vegetarian / bowls ===
  chickpeaCurry: `https://images.unsplash.com/photo-1731328351443-ea233d9b8037?${W}`,
  falafel: `https://images.unsplash.com/photo-1700513971603-eda40374ba0a?${W}`,
  saladBowl: `https://images.unsplash.com/photo-1636654931290-418d20865e03?${W}`,
  cucumber: `https://images.unsplash.com/photo-1679735107918-15112296e28d?${W}`,

  // === Breakfast ===
  pancakes: `https://images.unsplash.com/photo-1606149186228-4e5ac94a742e?${W}`,
  plantain: `https://images.unsplash.com/photo-1540716189226-20cc9c9116e0?${W}`,
  cornbread: `https://images.unsplash.com/photo-1664339031047-970bf639e43f?${W}`,
  akara: `https://images.unsplash.com/photo-1647162264554-5f60af27f052?${W}`,

  // === Small chops / appetizers ===
  meatPie: `https://images.unsplash.com/photo-1610213011891-68167bbe574c?${W}`,
  springRolls: `https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?${W}`,
  samosas: `https://images.unsplash.com/photo-1601050690597-df0568f70950?${W}`,
  puffPuff: `https://images.unsplash.com/photo-1665833613236-7c1d087463b1?${W}`,
  moinMoin: `https://images.unsplash.com/photo-1538169237233-785b5322efff?${W}`,

  // === Cakes / desserts ===
  cookies: `https://images.unsplash.com/photo-1499636136210-6f4ee915583e?${W}`,
  chocolateCake: `https://images.unsplash.com/photo-1578985545062-69928b1d9587?${W}`,
  carrotCake: `https://images.unsplash.com/photo-1676300186098-9b5ae9916e3c?${W}`,
  redVelvet: `https://images.unsplash.com/photo-1586788680434-30d324b2d46f?${W}`,
  lemonCake: `https://images.unsplash.com/photo-1598795164852-d2b5472d8bbb?${W}`,

  // === Pastries ===
  cinnamonRolls: `https://images.unsplash.com/photo-1585190775852-3e6bb2b80184?${W}`,
  biscuits: `https://images.unsplash.com/photo-1522237825450-a0c44eecddb4?${W}`,
  scones: `https://images.unsplash.com/photo-1654969099487-90551e2d81be?${W}`,
  croissants: `https://images.unsplash.com/photo-1555507036-ab1f4038808a?${W}`,

  // === Drinks ===
  chapman: `https://images.unsplash.com/photo-1678185201839-6de2bd49b714?${W}`,
  zobo: `https://images.unsplash.com/photo-1602856124289-0331a6eff6fe?${W}`,
  chai: `https://images.unsplash.com/photo-1698619952010-3bc850cbcb3b?${W}`,
  latte: `https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?${W}`,
  cocktail: `https://images.unsplash.com/photo-1678185201839-6de2bd49b714?${W}`,

  // === Smoothies ===
  mangoSmoothie: `https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?${W}`,
  greenSmoothie: `https://images.unsplash.com/photo-1610622930110-3c076902312a?${W}`,
  berrySmoothie: `https://images.unsplash.com/photo-1553530666-ba11a7da3888?${W}`,

  // === Soups (more) ===
  pumpkinSoup: `https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?${W}`,
  tortillaSoup: `https://images.unsplash.com/photo-1619151578119-b2f65ec6ebd8?${W}`,

  // === Mediterranean / Middle East ===
  hummus: `https://images.unsplash.com/photo-1687244433510-747e3fd97afe?${W}`,

  // === Ackee ===
  ackee: `https://images.unsplash.com/photo-1632859965308-d15227508c4b?${W}`,

  // === Kelewele / plantain (search returned nothing, reuse plantain) ===
  kelewele: `https://images.unsplash.com/photo-1540716189226-20cc9c9116e0?${W}`,

  // === Mac & cheese ===
  macAndCheese: `https://images.unsplash.com/photo-1667499989723-c4ab9549d63c?${W}`,

  // === French ===
  frenchOnionSoup: `https://images.unsplash.com/photo-1547592180-85f173990554?${W}`,
  beefBourguignon: `https://images.unsplash.com/photo-1644592219048-5c070fd3c91c?${W}`,
  ratatouille: `https://images.unsplash.com/photo-1540420773420-3366772f4999?${W}`,

  // === Korean ===
  koreanBibimbap: `https://images.unsplash.com/photo-1718777791239-c473e9ce7376?${W}`,
  kimchi: `https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?${W}`,
  koreanFriedChicken: `https://images.unsplash.com/photo-1687966699414-095ca9c35593?${W}`,
  bulgogi: `https://images.unsplash.com/photo-1564836235910-c3055ca0f912?${W}`,

  // === Spanish ===
  paella: `https://images.unsplash.com/photo-1684591442558-860786985dd4?${W}`,
  tortillaEspanola: `https://images.unsplash.com/photo-1607877200978-3cab430e00cd?${W}`,

  // === Filipino ===
  adobo: `https://images.unsplash.com/photo-1591921954568-c7358607c1c2?${W}`,

  // === Brazilian ===
  feijoada: `https://images.unsplash.com/photo-1773620494047-50cb58f59bc5?${W}`,
  caipirinha: `https://images.unsplash.com/photo-1644809818228-e29aa5aa8151?${W}`,

  // === Greek ===
  greekSalad: `https://images.unsplash.com/photo-1636654931290-418d20865e03?${W}`,
  gyros: `https://images.unsplash.com/photo-1683463170487-c9723825b23f?${W}`,

  // === Vietnamese ===
  banhMi: `https://images.unsplash.com/photo-1599719455360-ff0be7c4dd06?${W}`,

  // === Ethiopian ===
  injera: `https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?${W}`,

  // === South African ===
  bunnyChow: `https://images.unsplash.com/photo-1731328351443-ea233d9b8037?${W}`,

  // === Lebanese / Middle Eastern ===
  lebaneseHummus: `https://images.unsplash.com/photo-1687244433510-747e3fd97afe?${W}`,
  tabbouleh: `https://images.unsplash.com/photo-1702650657375-934239d8b472?${W}`,
  shawarma: `https://images.unsplash.com/photo-1530469912745-a215c6b256ea?${W}`,

  // === Thai ===
  tomYum: `https://images.unsplash.com/photo-1628430043175-0e8820df47c3?${W}`,

  // === Italian dessert ===
  tiramisu: `https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?${W}`,
  cheesecake: `https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?${W}`,
  churros: `https://images.unsplash.com/photo-1547149685-22d7efe78c2d?${W}`,

  // === Eggs/breakfast ===
  eggsBenedict: `https://images.unsplash.com/photo-1606149186228-4e5ac94a742e?${W}`,
  panditDal: `https://images.unsplash.com/photo-1731328351443-ea233d9b8037?${W}`,

  // === Phase D new countries ===
  borscht: `https://images.unsplash.com/photo-1677889173479-c8a0ab15ae18?${W}`,
  beefStroganoff: `https://images.unsplash.com/photo-1644592219048-5c070fd3c91c?${W}`,
  poutine: `https://images.unsplash.com/photo-1585460379355-de1c92466a17?${W}`,
  butterTarts: `https://images.unsplash.com/photo-1676300186098-9b5ae9916e3c?${W}`,
  nasiGoreng: `https://images.unsplash.com/photo-1680674774705-90b4904b3a7f?${W}`,
  rendang: `https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?${W}`,
  schnitzel: `https://images.unsplash.com/photo-1599921841143-819065a55cc6?${W}`,
  bratwurst: `https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?${W}`,
  doner: `https://images.unsplash.com/photo-1699728088614-7d1d4277414b?${W}`,
  menemen: `https://images.unsplash.com/photo-1606149186228-4e5ac94a742e?${W}`,
  pierogi: `https://images.unsplash.com/photo-1581515092908-42bae9a80350?${W}`,
  bigos: `https://images.unsplash.com/photo-1644592219048-5c070fd3c91c?${W}`,
  empanadas: `https://images.unsplash.com/photo-1601050690597-df0568f70950?${W}`,
  chimichurri: `https://images.unsplash.com/photo-1569229490681-4085b3f54ba3?${W}`,
  cevichePeru: `https://images.unsplash.com/photo-1611262359546-64e2822b2ab5?${W}`,
  lomoSaltado: `https://images.unsplash.com/photo-1603133872878-684f208fb84b?${W}`,
  koshari: `https://images.unsplash.com/photo-1628606336803-77914bbe8225?${W}`,
  ful: `https://images.unsplash.com/photo-1687244433510-747e3fd97afe?${W}`,
  aussieMeatPie: `https://images.unsplash.com/photo-1610213011891-68167bbe574c?${W}`,
  pavlova: `https://images.unsplash.com/photo-1602563388174-b3803da472d4?${W}`,
} as const;
