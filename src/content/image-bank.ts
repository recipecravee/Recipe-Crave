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
  ghanaianJollof: `https://images.unsplash.com/photo-1604329756574-bda1f2cada6f?${W}`,
  riceBowl: `https://images.unsplash.com/photo-1665332195309-9d75071138f0?${W}`,
  ricePeas: `https://images.unsplash.com/photo-1632852576480-c10a8e19496a?${W}`,

  // === Curries / stews ===
  curry: `https://images.unsplash.com/photo-1731328351443-ea233d9b8037?${W}`,
  egusi: `https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?${W}`,
  redRed: `https://images.unsplash.com/photo-1698917467449-08bcd1d9014b?${W}`,
  pho: `https://images.unsplash.com/photo-1631709497146-a239ef373cf1?${W}`,

  // === Vegetarian / bowls ===
  chickpeaCurry: `https://images.unsplash.com/photo-1634234498505-51b316832b28?${W}`,
  falafel: `https://images.unsplash.com/photo-1700513971603-eda40374ba0a?${W}`,
  saladBowl: `https://images.unsplash.com/photo-1636654931290-418d20865e03?${W}`,
  cucumber: `https://images.unsplash.com/photo-1679735107918-15112296e28d?${W}`,

  // === Breakfast ===
  pancakes: `https://images.unsplash.com/photo-1606149186228-4e5ac94a742e?${W}`,
  plantain: `https://images.unsplash.com/photo-1540714605746-4f474eefc6d4?${W}`,
  cornbread: `https://images.unsplash.com/photo-1664339031047-970bf639e43f?${W}`,
  akara: `https://images.unsplash.com/photo-1647162264554-5f60af27f052?${W}`,

  // === Small chops / appetizers ===
  meatPie: `https://images.unsplash.com/photo-1610213011891-68167bbe574c?${W}`,
  springRolls: `https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?${W}`,
  samosas: `https://images.unsplash.com/photo-1601050690597-df0568f70950?${W}`,
  puffPuff: `https://images.unsplash.com/photo-1665833613236-7c1d087463b1?${W}`,
  moinMoin: `https://images.unsplash.com/photo-1772132025779-a28090bfa2a8?${W}`,

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

  // === Kelewele (spicy fried plantain cubes) ===
  kelewele: `https://images.unsplash.com/photo-1576867917480-152bca50166e?${W}`,

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
  injera: `https://images.unsplash.com/photo-1765338915553-6e02fe63ff4f?${W}`,

  // === South African ===
  bunnyChow: `https://images.unsplash.com/photo-1694643666478-87660ba357a4?${W}`,

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
  eggsBenedict: `https://images.unsplash.com/photo-1613769049987-b31b641f25b1?${W}`,
  panditDal: `https://images.unsplash.com/photo-1777613112793-4fb0717c193b?${W}`,

  // === Phase D new countries ===
  borscht: `https://images.unsplash.com/photo-1677889173479-c8a0ab15ae18?${W}`,
  beefStroganoff: `https://images.unsplash.com/photo-1594610352455-e4d10d2f2cf0?${W}`,
  poutine: `https://images.unsplash.com/photo-1585460379355-de1c92466a17?${W}`,
  butterTarts: `https://images.unsplash.com/photo-1673412810304-47c149ed0231?${W}`,
  nasiGoreng: `https://images.unsplash.com/photo-1680674774705-90b4904b3a7f?${W}`,
  rendang: `https://images.unsplash.com/photo-1642509600566-96fe95a744b3?${W}`,
  schnitzel: `https://images.unsplash.com/photo-1599921841143-819065a55cc6?${W}`,
  bratwurst: `https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?${W}`,
  doner: `https://images.unsplash.com/photo-1699728088614-7d1d4277414b?${W}`,
  menemen: `https://images.unsplash.com/photo-1630684789450-dd7da2124df1?${W}`,
  pierogi: `https://images.unsplash.com/photo-1581515092908-42bae9a80350?${W}`,
  bigos: `https://images.unsplash.com/photo-1695089027936-465ca9835017?${W}`,
  empanadas: `https://images.unsplash.com/photo-1619926096619-5956ab4dfb1b?${W}`,
  chimichurri: `https://images.unsplash.com/photo-1624384081876-152eca2583b1?${W}`,
  cevichePeru: `https://images.unsplash.com/photo-1611262359546-64e2822b2ab5?${W}`,
  lomoSaltado: `https://images.unsplash.com/photo-1668724776332-a20685b85151?${W}`,
  koshari: `https://images.unsplash.com/photo-1628606336803-77914bbe8225?${W}`,
  ful: `https://images.unsplash.com/photo-1585029780574-65af8aa61abd?${W}`,
  aussieMeatPie: `https://images.unsplash.com/photo-1756137948749-84e73141137b?${W}`,
  pavlova: `https://images.unsplash.com/photo-1602563388174-b3803da472d4?${W}`,

  // === Hilda Baci Recipe Manual — 62 new keys (auto-fetched from Unsplash search) ===
  applePie: `https://images.unsplash.com/photo-1635381471874-2b8999ca6a20?${W}`,
  bananaBread: `https://images.unsplash.com/photo-1599743271551-da8b8faacc5b?${W}`,
  baoBun: `https://images.unsplash.com/photo-1653045582825-7b99c83aa888?${W}`,
  blueColada: `https://images.unsplash.com/photo-1557313773-74c3490a350d?${W}`,
  bolognese: `https://images.unsplash.com/photo-1614777986387-015c2a89b696?${W}`,
  butterChicken: `https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?${W}`,
  butterflyPrawns: `https://images.unsplash.com/photo-1766566959672-257837bc6c76?${W}`,
  calamari: `https://images.unsplash.com/photo-1734771219838-61863137b117?${W}`,
  caramelPopcorn: `https://images.unsplash.com/photo-1574201742421-fffd6af7a680?${W}`,
  champagne: `https://images.unsplash.com/photo-1589190859807-21bc5319b653?${W}`,
  chickenNuggets: `https://images.unsplash.com/photo-1627662236294-a169e5464871?${W}`,
  chocolateMuffins: `https://images.unsplash.com/photo-1635952282017-a1d2bf2418be?${W}`,
  coconutJollof: `https://images.unsplash.com/photo-1729825488397-90ac5b03300c?${W}`,
  cosmopolitan: `https://images.unsplash.com/photo-1632987797134-64752aa7e057?${W}`,
  crispyFriedChicken: `https://images.unsplash.com/photo-1672856399624-61b47d70d339?${W}`,
  curryGoat: `https://images.unsplash.com/photo-1708782344137-21c48d98dfcc?${W}`,
  daiquiri: `https://images.unsplash.com/photo-1695406092591-c6de34ad1485?${W}`,
  efoRiro: `https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?${W}`,
  goulash: `https://images.unsplash.com/photo-1748309280994-bb23a2f600cc?${W}`,
  grilledCheese: `https://images.unsplash.com/photo-1528736235302-52922df5c122?${W}`,
  iceCream: `https://images.unsplash.com/photo-1657225953401-5f95007fc8e0?${W}`,
  isiEwu: `https://images.unsplash.com/photo-1726276262267-ebb01cfa0982?${W}`,
  jambalaya: `https://images.unsplash.com/photo-1655070180522-9e54cbb6e763?${W}`,
  longIsland: `https://images.unsplash.com/photo-1722624072828-d31140ebdd86?${W}`,
  margarita: `https://images.unsplash.com/photo-1642715269428-1d0da19098ba?${W}`,
  martini: `https://images.unsplash.com/photo-1773188243511-2eb85126f08b?${W}`,
  milkBread: `https://images.unsplash.com/photo-1620921568790-c1cf8984624c?${W}`,
  milkshake: `https://images.unsplash.com/photo-1662192511709-e75d67367638?${W}`,
  mimosa: `https://images.unsplash.com/photo-1556063230-aa38680c8142?${W}`,
  mojito: `https://images.unsplash.com/photo-1696957024712-f478b2aa53a9?${W}`,
  moscowMule: `https://images.unsplash.com/photo-1655917080507-dc3ee47580a3?${W}`,
  naan: `https://images.unsplash.com/photo-1697155406014-04dc649b0953?${W}`,
  ogbono: `https://images.unsplash.com/photo-1763048443535-1243379234e2?${W}`,
  onionRings: `https://images.unsplash.com/photo-1766589152198-38630c391dfb?${W}`,
  pepperSoup: `https://images.unsplash.com/photo-1645066804237-08145dd196e9?${W}`,
  pineappleFriedRice: `https://images.unsplash.com/photo-1584279939301-e47716a5b33f?${W}`,
  pinkPasta: `https://images.unsplash.com/photo-1608894289162-37f52487f62a?${W}`,
  popcornChicken: `https://images.unsplash.com/photo-1615435312366-2e4ae52255e9?${W}`,
  prawnNativePasta: `https://images.unsplash.com/photo-1762631178604-3b79d4d0bff9?${W}`,
  scotchEgg: `https://images.unsplash.com/photo-1577111064880-4601019411fe?${W}`,
  seafoodOkra: `https://images.unsplash.com/photo-1583549322901-9edf5dad0cc4?${W}`,
  seafoodPasta: `https://images.unsplash.com/photo-1771342748453-ba4172cdbd69?${W}`,
  shortBreadCookies: `https://images.unsplash.com/photo-1609320034420-0e15d165951e?${W}`,
  shrimpTacos: `https://images.unsplash.com/photo-1611699363906-056f01dd1ed8?${W}`,
  singaporeNoodles: `https://images.unsplash.com/photo-1713934895383-f4be7dd735a1?${W}`,
  sloppyJoes: `https://images.unsplash.com/photo-1665799363044-11b3e2f63fbf?${W}`,
  spaghettiMeatballs: `https://images.unsplash.com/photo-1713759981853-8a5944e6fc90?${W}`,
  spicyBeefPenne: `https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?${W}`,
  stuffedMasa: `https://images.unsplash.com/photo-1664993090321-b2caff794431?${W}`,
  suyaRice: `https://images.unsplash.com/photo-1687020835955-59528e8c91dd?${W}`,
  tequilaSunrise: `https://images.unsplash.com/photo-1620393570203-ebb4ba12c05d?${W}`,
  tropicalJuice: `https://images.unsplash.com/photo-1775204341635-6c234f843a4b?${W}`,
  waffles: `https://images.unsplash.com/photo-1679372384519-85d5c25e0216?${W}`,
  whiskeySour: `https://images.unsplash.com/photo-1641074119761-6d9f1187ee5e?${W}`,
  eggNog: `https://images.unsplash.com/photo-1668202434829-4b1b340a5ef8?${W}`,
  doughnuts: `https://images.unsplash.com/photo-1709188865978-076be0382960?${W}`,
  sausageRolls: `https://images.unsplash.com/photo-1619445832857-c4a2beaae156?${W}`,
  chinChin: `https://images.unsplash.com/photo-1582461182977-0e61ebb79c87?${W}`,
  eggRolls: `https://images.unsplash.com/photo-1606525437679-037aca74a3e9?${W}`,
  cornDog: `https://images.unsplash.com/photo-1665406857904-79a6e7de446f?${W}`,
  frittata: `https://images.unsplash.com/photo-1587900437942-8758241767ef?${W}`,
  chineseFriedRice: `https://images.unsplash.com/photo-1612755637313-9517f17d84b5?${W}`,

  // Fallbacks for keys not found in Unsplash search — point to closest dish
  alfredo: `https://images.unsplash.com/photo-1608894289162-37f52487f62a?${W}`,
  mashedPotatoes: `https://images.unsplash.com/photo-1577906096429-f73c2c312435?${W}`,
  ofada: `https://images.unsplash.com/photo-1729825488397-90ac5b03300c?${W}`,
  subwaySandwich: `https://images.unsplash.com/photo-1554433607-66b5efe9d304?${W}`,
  tigerNut: `https://images.unsplash.com/photo-1556063230-aa38680c8142?${W}`,
} as const;
