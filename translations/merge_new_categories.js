/**
 * Merges kitchen_plants.json, kitchen_utensils.json, restaurant_food.json
 * into all_languages.json — both the "categories" data and each language's "categoryNames".
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;

// ── Category display names per language ──────────────────────────────────────
const CATEGORY_NAMES = {
  kitchen_plants: {
    spanish:     ["Hierbas y Plantas de Cocina",   "yer-bas i plan-tas de ko-see-na"],
    english:     ["Kitchen Herbs & Plants",         "ki-chen herbz & plants"],
    french:      ["Herbes et Plantes de Cuisine",   "erb e plant de kwee-zeen"],
    italian:     ["Erbe e Piante da Cucina",        "er-be e pyan-te da ku-chee-na"],
    chinese:     ["厨房香草植物",                     "chú fáng xiāng cǎo zhí wù"],
    arabic:      ["أعشاب ونباتات المطبخ",            "a-shaab wa-na-ba-taat al-mat-bakh"],
    amharic:     ["የወጥ ቤት ቅጠላቅጠሎች",               "ye-wet bet qi-te-la-qi-te-loch"],
    oromo:       ["Kuduraa Mana Buddeenaa",          "ku-du-raa ma-na bud-dee-naa"],
    somali:      ["Dhirta Jikada",                  "dhir-ta ji-ka-da"],
    swahili:     ["Mimea ya Jikoni",                "mi-me-a ya ji-ko-ni"],
    tigrinya:    ["ናይ ክሽነ ዕምባባታት",                "na-yi ki-she-ne em-ba-ba-tat"],
    kinyarwanda: ["Ibimera byo mu Jiko",            "i-bi-me-ra byo mu ji-ko"],
    kirundi:     ["Ibimera vyo mu Jiko",            "i-bi-me-ra vyo mu ji-ko"],
    luganda:     ["Ebirimba by'eKitchen",           "e-bi-rim-ba by'e-ki-chen"],
    dinka:       ["Kitchen Plants",                 "ki-chen plants"],
    nuer:        ["Kitchen Plants",                 "ki-chen plants"],
    luo:         ["Yien Jiko",                      "yi-en ji-ko"],
    korean:      ["주방 허브",                        "ju-bang heo-beu"],
    hindi:       ["रसोई जड़ी-बूटियाँ",               "ra-so-ee ja-dee-boo-tee-yaan"],
    bengali:     ["রান্নাঘরের গাছপালা",              "ran-na-gha-rer gach-pa-la"],
    telugu:      ["వంటింటి మొక్కలు",                 "van-tin-ti mok-ka-lu"],
    kurdish:     ["Riwekên Mitbaxê",                "ri-we-ken mit-ba-xe"],
    farsi:       ["گیاهان آشپزخانه",                 "gi-yaa-haan aash-paz-kha-ne"],
    bantu:       ["Mimea ya Jikoni",                "mi-me-a ya ji-ko-ni"],
    german:      ["Küchenkräuter",                  "kü-chen-kroy-ter"],
    hadiyaa:     ["Kitchen Plants",                 "kitchen plants"],
    wolyitta:    ["Kitchen Plants",                 "kitchen plants"],
    afar:        ["Kitchen Plants",                 "kitchen plants"],
    gamo:        ["Kitchen Plants",                 "kitchen plants"],
  },
  kitchen_utensils: {
    spanish:     ["Utensilios de Cocina",           "u-ten-si-lyos de ko-see-na"],
    english:     ["Kitchen Utensils",               "ki-chen yoo-ten-silz"],
    french:      ["Ustensiles de Cuisine",          "us-tan-seel de kwee-zeen"],
    italian:     ["Utensili da Cucina",             "u-ten-si-li da ku-chee-na"],
    chinese:     ["厨房用具",                         "chú fáng yòng jù"],
    arabic:      ["أدوات المطبخ",                   "a-da-waat al-mat-bakh"],
    amharic:     ["የወጥ ቤት እቃዎች",                   "ye-wet bet i-qa-woch"],
    oromo:       ["Meeshaalee Mana Buddeenaa",      "mee-shaa-lee ma-na bud-dee-naa"],
    somali:      ["Qalabka Jikada",                 "qa-lab-ka ji-ka-da"],
    swahili:     ["Vyombo vya Jikoni",              "vyo-mbo vya ji-ko-ni"],
    tigrinya:    ["ናይ ክሽነ ኣቑሑት",                   "na-yi ki-she-ne a-qu-hut"],
    kinyarwanda: ["Ibikoresho byo mu Jiko",         "i-bi-ko-re-sho byo mu ji-ko"],
    kirundi:     ["Ibikoresho vyo mu Jiko",         "i-bi-ko-re-sho vyo mu ji-ko"],
    luganda:     ["Ebikozesebwa mu Kkomera",        "e-bi-ko-ze-seb-wa mu ko-me-ra"],
    dinka:       ["Kitchen Utensils",               "ki-chen yoo-ten-silz"],
    nuer:        ["Kitchen Utensils",               "ki-chen yoo-ten-silz"],
    luo:         ["Gige Jiko",                      "gi-ge ji-ko"],
    korean:      ["주방 도구",                        "ju-bang do-gu"],
    hindi:       ["रसोई के बर्तन",                   "ra-so-ee ke bar-tan"],
    bengali:     ["রান্নাঘরের পাত্র",                "ran-na-gha-rer pa-tra"],
    telugu:      ["వంటింటి పాత్రలు",                 "van-tin-ti paa-tra-lu"],
    kurdish:     ["Amûrên Mitbaxê",                 "a-moo-ren mit-ba-xe"],
    farsi:       ["ظروف آشپزخانه",                  "zo-ruf aash-paz-kha-ne"],
    bantu:       ["Vyombo vya Jikoni",              "vyo-mbo vya ji-ko-ni"],
    german:      ["Küchenutensilien",               "kü-chen-u-ten-zi-lyen"],
    hadiyaa:     ["Kitchen Utensils",               "kitchen utensils"],
    wolyitta:    ["Kitchen Utensils",               "kitchen utensils"],
    afar:        ["Kitchen Utensils",               "kitchen utensils"],
    gamo:        ["Kitchen Utensils",               "kitchen utensils"],
  },
  restaurant_food: {
    spanish:     ["Restaurante y Comida",           "res-tau-ran-te i ko-mi-da"],
    english:     ["Restaurant & Dining",            "res-tuh-rant & dy-ning"],
    french:      ["Restaurant et Repas",            "res-to-rahn e re-pah"],
    italian:     ["Ristorante e Pasti",             "ris-to-ran-te e pas-ti"],
    chinese:     ["餐厅与饮食",                       "cān tīng yǔ yǐn shí"],
    arabic:      ["المطعم والطعام",                  "al-mat-am wal-ta-aam"],
    amharic:     ["ምግብ ቤትና ምግብ",                    "migb bet-na migb"],
    oromo:       ["Mana Nyaataa fi Nyaata",         "ma-na nyaa-taa fi nyaa-ta"],
    somali:      ["Makhaayadda iyo Cuntada",        "ma-khaa-yad-da i-yo cun-ta-da"],
    swahili:     ["Mkahawa na Chakula",             "m-ka-ha-wa na cha-ku-la"],
    tigrinya:    ["ምግቢ ቤትን መግቢ",                   "mig-bi be-ten meg-bi"],
    kinyarwanda: ["Restoranti n'Ibyokurya",         "res-to-ran-ti n'i-byo-ku-rya"],
    kirundi:     ["Restoranti n'Ibyokurya",         "res-to-ran-ti n'i-byo-ku-rya"],
    luganda:     ["Resitaurant n'Emmere",           "re-si-tau-rant n'em-me-re"],
    dinka:       ["Restaurant Food",                "res-tuh-rant food"],
    nuer:        ["Restaurant Food",                "res-tuh-rant food"],
    luo:         ["Chiemo mar Hoteli",              "chie-mo mar ho-te-li"],
    korean:      ["레스토랑 음식",                     "re-seu-to-rang eum-sik"],
    hindi:       ["रेस्तरां का खाना",                "res-ta-raan ka khaa-na"],
    bengali:     ["রেস্তোরাঁর খাবার",                "res-to-raar kha-bar"],
    telugu:      ["రెస్టారెంట్ ఆహారం",               "res-taa-rent aa-haa-ram"],
    kurdish:     ["Xwarina Restoranê",              "xwa-ree-na res-to-ra-ne"],
    farsi:       ["غذای رستوران",                   "gha-zaa-ye res-to-raan"],
    bantu:       ["Mkahawa na Chakula",             "m-ka-ha-wa na cha-ku-la"],
    german:      ["Restaurant und Speisen",         "res-to-rahn unt shpy-zen"],
    hadiyaa:     ["Restaurant Food",               "restaurant food"],
    wolyitta:    ["Restaurant Food",               "restaurant food"],
    afar:        ["Restaurant Food",               "restaurant food"],
    gamo:        ["Restaurant Food",               "restaurant food"],
  },
};

// ── Helper: parse a fragment file like  "key": [...]  ───────────────────────
function parseFragment(filename) {
  const raw = fs.readFileSync(path.join(DIR, filename), 'utf8').trimEnd();
  // Remove trailing comma if present, then wrap in {}
  const clean = raw.endsWith(',') ? raw.slice(0, -1) : raw;
  return JSON.parse(`{${clean}}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
const allLangs = JSON.parse(fs.readFileSync(path.join(DIR, 'all_languages.json'), 'utf8'));

// 1. Load and merge the three new category arrays
const newCategories = {
  ...parseFragment('kitchen_plants.json'),
  ...parseFragment('kitchen_utensils.json'),
  ...parseFragment('restaurant_food.json'),
};

for (const [catKey, catArray] of Object.entries(newCategories)) {
  if (allLangs.categories[catKey]) {
    console.log(`  ⚠️  Category "${catKey}" already exists — skipping.`);
  } else {
    allLangs.categories[catKey] = catArray;
    console.log(`  ✓ Added category "${catKey}" (${catArray.length} items)`);
  }
}

// 2. Add categoryNames entries to every language block
const NEW_CATS = Object.keys(CATEGORY_NAMES);
let langsUpdated = 0;

for (const [langKey, langData] of Object.entries(allLangs)) {
  if (langKey === 'categories') continue;
  if (!langData.categoryNames) continue;

  for (const catKey of NEW_CATS) {
    if (langData.categoryNames[catKey]) {
      console.log(`  ⚠️  ${langKey}.categoryNames.${catKey} already exists — skipping.`);
      continue;
    }
    const names = CATEGORY_NAMES[catKey][langKey];
    if (names) {
      langData.categoryNames[catKey]           = names[0];
      langData.categoryNames[`${catKey}_phonetic`] = names[1];
    } else {
      // Fallback to English
      const en = CATEGORY_NAMES[catKey]['english'];
      langData.categoryNames[catKey]           = en[0];
      langData.categoryNames[`${catKey}_phonetic`] = en[1];
      console.log(`  ℹ️  ${langKey}: no translation for "${catKey}", used English fallback.`);
    }
  }
  langsUpdated++;
}

// 3. Write result
const outPath = path.join(DIR, 'all_languages.json');
fs.writeFileSync(outPath, JSON.stringify(allLangs, null, 2), 'utf8');

console.log(`\n✅ Done! ${langsUpdated} language blocks updated.`);
console.log(`   Output: ${outPath}`);

