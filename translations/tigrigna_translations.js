const translations = {
// ...existing code...

  // --- 1. BASICS & GREETINGS ---
  "hello": { "tigrinya": "ሰላም", "phonetic": "se-lam", "category": "basics" },
  "goodbye": { "tigrinya": "ደሓን ኩን", "phonetic": "de-han koon", "category": "basics" },
  "thank you": { "tigrinya": "የቐንየለይ", "phonetic": "ye-q'en-yel-ey", "category": "basics" },
  "please": { "tigrinya": "በጃኻ", "phonetic": "be-ja-ka", "category": "basics" },
  "sorry": { "tigrinya": "ይቕረታ", "phonetic": "yi-q're-ta", "category": "basics" },
  "yes": { "tigrinya": "እወ", "phonetic": "e-we", "category": "basics" },
  "no": { "tigrinya": "ኣይፋል", "phonetic": "ay-fal", "category": "basics" },
  "okay": { "tigrinya": "ተስማማዕ", "phonetic": "tes-ma-ma", "category": "basics" },
  "excuse me": { "tigrinya": "ይቕረ", "phonetic": "yi-q're", "category": "basics" },
  "welcome": { "tigrinya": "እንቋዕ ብደሓን መጻእኩም", "phonetic": "en-qwa ba-de-han me-tsa-koom", "category": "basics" },

  // --- 2. FAMILY ---
  "mother": { "tigrinya": "ኣደ", "phonetic": "a-de", "category": "family" },
  "father": { "tigrinya": "ኣቦ", "phonetic": "a-bo", "category": "family" },
  "baby": { "tigrinya": "ህጻን", "phonetic": "hit-san", "category": "family" },
  "sister": { "tigrinya": "ሓተት", "phonetic": "ha-tet", "category": "family" },
  "brother": { "tigrinya": "ሓወ", "phonetic": "ha-we", "category": "family" },
  "uncle": { "tigrinya": "ኣጎ", "phonetic": "a-go", "category": "family" },
  "aunt": { "tigrinya": "ኣኼ", "phonetic": "a-khe", "category": "family" },
  "grandmother": { "tigrinya": "ሓሊ", "phonetic": "ha-li", "category": "family" },
  "grandfather": { "tigrinya": "ኣያ", "phonetic": "a-ya", "category": "family" },
  "cousin": { "tigrinya": "ወዲ ኣጎ", "phonetic": "wed-i a-go", "category": "family" },
  "family": { "tigrinya": "ስድራ", "phonetic": "sid-ra", "category": "family" },
  "child": { "tigrinya": "ቈልዓ", "phonetic": "qwel-a", "category": "family" },
  "children": { "tigrinya": "ቈልዑ", "phonetic": "qwel-u", "category": "family" },

  // --- 3. PEOPLE ---
  "friend": { "tigrinya": "መሓዛ", "phonetic": "me-ha-za", "category": "people" },
  "teacher": { "tigrinya": "መምህር", "phonetic": "mem-hir", "category": "people" },
  "doctor": { "tigrinya": "ሓኪም", "phonetic": "ha-kim", "category": "people" },
  "student": { "tigrinya": "ተማሃራይ", "phonetic": "te-ma-ha-ray", "category": "people" },

  // --- 4. BODY PARTS ---
  "head": { "tigrinya": "ርእሲ", "phonetic": "re-si", "category": "body" },
  "eyes": { "tigrinya": "ኣዒንቲ", "phonetic": "a-in-ti", "category": "body" },
  "nose": { "tigrinya": "ኣፍንጫ", "phonetic": "af-in-cha", "category": "body" },
  "mouth": { "tigrinya": "ኣፍ", "phonetic": "af", "category": "body" },
  "hands": { "tigrinya": "ኢድ", "phonetic": "eed", "category": "body" },
  "ears": { "tigrinya": "እዝኒ", "phonetic": "ez-ni", "category": "body" },
  "hair": { "tigrinya": "ጸጉሪ", "phonetic": "tse-gu-ri", "category": "body" },
  "teeth": { "tigrinya": "ስኒ", "phonetic": "sin-i", "category": "body" },
  "feet": { "tigrinya": "እግሪ", "phonetic": "eg-ri", "category": "body" },
  "fingers": { "tigrinya": "ጣቕቲ", "phonetic": "taq-ti", "category": "body" },
  "stomach": { "tigrinya": "ከብዲ", "phonetic": "keb-di", "category": "body" },
  "heart": { "tigrinya": "ልቢ", "phonetic": "lib-i", "category": "body" },

  // --- 5. CLOTHING ---
  "shirt": { "tigrinya": "ሸሚዝ", "phonetic": "she-miz", "category": "clothing" },
  "shoes": { "tigrinya": "ሳእኒ", "phonetic": "sa-ni", "category": "clothing" },
  "hat": { "tigrinya": "በረንዳ", "phonetic": "be-ren-da", "category": "clothing" },
  "pants": { "tigrinya": "ሱራት", "phonetic": "su-rat", "category": "clothing" },
  "dress": { "tigrinya": "ኮፍያ", "phonetic": "kof-ya", "category": "clothing" },
  "socks": { "tigrinya": "ካልሲ", "phonetic": "kal-si", "category": "clothing" },
  "coat": { "tigrinya": "ኮት", "phonetic": "kot", "category": "clothing" },
  "gloves": { "tigrinya": "ግዕዝ", "phonetic": "gez", "category": "clothing" },

  // --- 6. COLORS ---
  "red": { "tigrinya": "ቀይሕ", "phonetic": "qey-h", "category": "colors" },
  "blue": { "tigrinya": "ሰማያዊ", "phonetic": "se-ma-ya-wi", "category": "colors" },
  "yellow": { "tigrinya": "ቢጫ", "phonetic": "bi-cha", "category": "colors" },
  "green": { "tigrinya": "ሓምሊ", "phonetic": "ham-li", "category": "colors" },
  "orange": { "tigrinya": "ብርቱካናዊ", "phonetic": "bir-tu-ka-na-wi", "category": "colors" },
  "purple": { "tigrinya": "ሐምራዊ", "phonetic": "ham-ra-wi", "category": "colors" },
  "pink": { "tigrinya": "ሮዝ", "phonetic": "roz", "category": "colors" },
  "brown": { "tigrinya": "ቡናዊ", "phonetic": "bu-na-wi", "category": "colors" },
  "black": { "tigrinya": "ጸሊም", "phonetic": "tse-lim", "category": "colors" },
  "white": { "tigrinya": "ጻዕዳ", "phonetic": "tsa-da", "category": "colors" },
  "rainbow": { "tigrinya": "ቀስተ ደበና", "phonetic": "qes-te de-be-na", "category": "colors" },

  // --- 7. NUMBERS ---
  "one": { "tigrinya": "ሓደ", "phonetic": "ha-de", "category": "numbers" },
  "two": { "tigrinya": "ክልተ", "phonetic": "kil-te", "category": "numbers" },
  "three": { "tigrinya": "ሰለስተ", "phonetic": "se-les-te", "category": "numbers" },
  "four": { "tigrinya": "ኣርባዕተ", "phonetic": "ar-ba-te", "category": "numbers" },
  "five": { "tigrinya": "ሓሙሽተ", "phonetic": "ha-mush-te", "category": "numbers" },
  "six": { "tigrinya": "ሽድሽተ", "phonetic": "shid-shit-te", "category": "numbers" },
  "seven": { "tigrinya": "ሸውዓተ", "phonetic": "shew-a-te", "category": "numbers" },
  "eight": { "tigrinya": "ሸሞንተ", "phonetic": "she-mon-te", "category": "numbers" },
  "nine": { "tigrinya": "ትሽዓተ", "phonetic": "tish-a-te", "category": "numbers" },
  "ten": { "tigrinya": "ዓሰርተ", "phonetic": "as-er-te", "category": "numbers" },
  "zero": { "tigrinya": "ዜሮ", "phonetic": "ze-ro", "category": "numbers" },

  // --- 8. EMOTIONS ---
  "happy": { "tigrinya": "ሕጉስ", "phonetic": "hi-gus", "category": "emotions" },
  "sad": { "tigrinya": "ደንጎል", "phonetic": "den-gol", "category": "emotions" },
  "angry": { "tigrinya": "ሓሪኹ", "phonetic": "ha-ri-ku", "category": "emotions" },
  "scared": { "tigrinya": "ፈሪሁ", "phonetic": "fe-ri-hu", "category": "emotions" },
  "surprised": { "tigrinya": "ተደናገረ", "phonetic": "te-de-na-ge-re", "category": "emotions" },
  "excited": { "tigrinya": "ተለዓለ", "phonetic": "te-le-a-le", "category": "emotions" },
  "tired": { "tigrinya": "ድኻም", "phonetic": "di-kam", "category": "emotions" },

  // --- 9. SCHOOL ---
  "school": { "tigrinya": "ቤት ትምህርቲ", "phonetic": "bet tim-hir-ti", "category": "school" },
  "pencil": { "tigrinya": "ርሳስ", "phonetic": "ri-sas", "category": "school" },
  "paper": { "tigrinya": "ወረቐት", "phonetic": "we-re-qet", "category": "school" },
  "draw": { "tigrinya": "ስእል", "phonetic": "sil", "category": "school" },
  "write": { "tigrinya": "ጽሕፍ", "phonetic": "tsihf", "category": "school" },
  "read": { "tigrinya": "ንበብ", "phonetic": "ni-beb", "category": "school" },
  "learn": { "tigrinya": "ተማሃር", "phonetic": "te-ma-har", "category": "school" },

  // --- 10. TOYS & PLAY ---
  "toy": { "tigrinya": "መጻወቲ", "phonetic": "me-tsa-we-ti", "category": "toys" },
  "ball": { "tigrinya": "ኩዕሶ", "phonetic": "ku-so", "category": "toys" },
  "doll": { "tigrinya": "ኣሻንጉሊት", "phonetic": "a-shan-gu-lit", "category": "toys" },
  "game": { "tigrinya": "ጸወታ", "phonetic": "tse-we-ta", "category": "toys" },
  "play": { "tigrinya": "ጻወት", "phonetic": "tsa-wet", "category": "toys" },
  "fun": { "tigrinya": "ሓጎስ", "phonetic": "ha-gos", "category": "toys" },

  // --- 11. HOUSE ---
  "house": { "tigrinya": "ቤት", "phonetic": "bet", "category": "house" },
  "room": { "tigrinya": "ዋዒ", "phonetic": "wa-i", "category": "house" },
  "door": { "tigrinya": "ደጃፍ", "phonetic": "de-jaf", "category": "house" },
  "window": { "tigrinya": "መስኮት", "phonetic": "mes-kot", "category": "house" },
  "bed": { "tigrinya": "ዓራት", "phonetic": "a-rat", "category": "house" },
  "table": { "tigrinya": "መኣዲ", "phonetic": "me-a-di", "category": "house" },
  "chair": { "tigrinya": "ኮሻ", "phonetic": "ko-sha", "category": "house" },
  "kitchen": { "tigrinya": "መግቢ ቤት", "phonetic": "meg-bi bet", "category": "house" },

  // --- 12. FOOD ---
  "bread": { "tigrinya": "ባኒ", "phonetic": "ba-ni", "category": "food" },
  "milk": { "tigrinya": "ጸላም", "phonetic": "tse-lam", "category": "food" },
  "egg": { "tigrinya": "እንቋቑሖ", "phonetic": "en-qwa-qu-ho", "category": "food" },
  "fruit": { "tigrinya": "ፍረ", "phonetic": "fir-e", "category": "food" },
  "apple": { "tigrinya": "ፖም", "phonetic": "pom", "category": "food" },
  "banana": { "tigrinya": "ሙዝ", "phonetic": "muz", "category": "food" },
  "juice": { "tigrinya": "ማይ ፍረ", "phonetic": "may fir-e", "category": "food" },
  "water": { "tigrinya": "ማይ", "phonetic": "may", "category": "food" },
  "breakfast": { "tigrinya": "ቁርሲ", "phonetic": "qur-si", "category": "food" },
  "lunch": { "tigrinya": "ምሳ", "phonetic": "mi-sa", "category": "food" },
  "dinner": { "tigrinya": "ድራር", "phonetic": "di-rar", "category": "food" },
  "cake": { "tigrinya": "ኬክ", "phonetic": "kek", "category": "food" },
  "candy": { "tigrinya": "ሽኮር", "phonetic": "shikor", "category": "food" },

  // --- 13. ANIMALS (FARM) ---
  "cow": { "tigrinya": "በጊ", "phonetic": "be-gi", "category": "animals" },
  "sheep": { "tigrinya": "በጊ", "phonetic": "be-gi", "category": "animals" },
  "chicken": { "tigrinya": "ደርሆ", "phonetic": "der-ho", "category": "animals" },
  "horse": { "tigrinya": "ፈረስ", "phonetic": "fe-res", "category": "animals" },
  "goat": { "tigrinya": "ፍየል", "phonetic": "fiyel", "category": "animals" },
  "donkey": { "tigrinya": "ኣድጊ", "phonetic": "a-dig-i", "category": "animals" },
  "pig": { "tigrinya": "ሓንሳእ", "phonetic": "han-sa", "category": "animals" },

  // --- 14. PETS ---
  "dog": { "tigrinya": "ከልቢ", "phonetic": "kel-bi", "category": "animals" },
  "cat": { "tigrinya": "ድሙ", "phonetic": "dim-u", "category": "animals" },
  "bird": { "tigrinya": "ዑፍ", "phonetic": "uf", "category": "animals" },
  "fish": { "tigrinya": "ኣሳ", "phonetic": "a-sa", "category": "animals" },
  "rabbit": { "tigrinya": "ሓንበር", "phonetic": "han-ber", "category": "animals" },

  // --- 15. WILD ANIMALS ---
  "lion": { "tigrinya": "ኣንበሳ", "phonetic": "an-be-sa", "category": "animals" },
  "elephant": { "tigrinya": "ሓርማዝ", "phonetic": "har-maz", "category": "animals" },
  "giraffe": { "tigrinya": "ቀጭኒ", "phonetic": "qech-ni", "category": "animals" },
  "monkey": { "tigrinya": "ዝወራዕ", "phonetic": "zi-we-ra", "category": "animals" },
  "zebra": { "tigrinya": "ዘብራ", "phonetic": "zeb-ra", "category": "animals" },

  // --- 16. INSECTS ---
  "butterfly": { "tigrinya": "ፍሊወር", "phonetic": "fli-wer", "category": "animals" },
  "bee": { "tigrinya": "ንህቢ", "phonetic": "nih-bi", "category": "animals" },
  "spider": { "tigrinya": "ሰርሖ", "phonetic": "ser-ho", "category": "animals" },

  // --- 17. NATURE ---
  "rain": { "tigrinya": "ዝናብ", "phonetic": "zin-ab", "category": "nature" },
  "cloud": { "tigrinya": "ደበና", "phonetic": "de-be-na", "category": "nature" },
  "mountain": { "tigrinya": "እምባ", "phonetic": "em-ba", "category": "nature" },
  "water": { "tigrinya": "ማይ", "phonetic": "may", "category": "nature" },
  "sun": { "tigrinya": "ፀሐይ", "phonetic": "tse-hay", "category": "nature" },
  "moon": { "tigrinya": "ወርሒ", "phonetic": "wer-hi", "category": "nature" },
  "tree": { "tigrinya": "ገረብ", "phonetic": "ge-reb", "category": "nature" },
  "flower": { "tigrinya": "ኣዕባ", "phonetic": "a-ba", "category": "nature" },
  "world": { "tigrinya": "ዓለም", "phonetic": "a-lem", "category": "nature" },
  "star": { "tigrinya": "ኮኾብ", "phonetic": "ko-hob", "category": "nature" },
  "sky": { "tigrinya": "ሰማይ", "phonetic": "se-may", "category": "nature" },
  "river": { "tigrinya": "ፈለግ", "phonetic": "fe-leg", "category": "nature" },
  "lake": { "tigrinya": "ቀላይ", "phonetic": "qe-lay", "category": "nature" },
  "sea": { "tigrinya": "ባሕሪ", "phonetic": "bah-ri", "category": "nature" },
  "wind": { "tigrinya": "ንፋስ", "phonetic": "ni-fas", "category": "nature" },
  "snow": { "tigrinya": "በረድ", "phonetic": "be-red", "category": "nature" },

  // --- 18. TIME ---
  "day": { "tigrinya": "መዓልቲ", "phonetic": "me-al-ti", "category": "time" },
  "night": { "tigrinya": "ለይቲ", "phonetic": "ley-ti", "category": "time" },
  "morning": { "tigrinya": "ንግሆ", "phonetic": "nig-ho", "category": "time" },
  "afternoon": { "tigrinya": "ድሕሪ ቀትሪ", "phonetic": "di-hri qet-ri", "category": "time" },
  "evening": { "tigrinya": "ማለዶ", "phonetic": "ma-le-do", "category": "time" },
  "today": { "tigrinya": "ሎሚ", "phonetic": "lo-mi", "category": "time" },
  "tomorrow": { "tigrinya": "ጽባሕ", "phonetic": "tsi-bah", "category": "time" },
  "yesterday": { "tigrinya": "ትማሊ", "phonetic": "ti-ma-li", "category": "time" },

  // --- 19. SEASONS ---
  "summer": { "tigrinya": "ጸወዳ", "phonetic": "tse-we-da", "category": "seasons" },
  "winter": { "tigrinya": "ክረምቲ", "phonetic": "ki-rem-ti", "category": "seasons" },
  "spring": { "tigrinya": "ጽባሕ", "phonetic": "tsi-bah", "category": "seasons" },
  "autumn": { "tigrinya": "ሓጋይ", "phonetic": "ha-gay", "category": "seasons" },

  // --- 20. TRANSPORT ---
  "car": { "tigrinya": "መኪና", "phonetic": "me-ki-na", "category": "transport" },
  "airplane": { "tigrinya": "ነይሮፕላን", "phonetic": "ney-ro-plan", "category": "transport" },
  "bicycle": { "tigrinya": "ብስክሌት", "phonetic": "bis-klet", "category": "transport" },
  "bus": { "tigrinya": "ኣውቶቡስ", "phonetic": "aw-to-bus", "category": "transport" },
  "train": { "tigrinya": "ባቡር", "phonetic": "ba-bur", "category": "transport" },
  "boat": { "tigrinya": "መርከብ", "phonetic": "mer-keb", "category": "transport" },
  "truck": { "tigrinya": "ጽዕነት መኪና", "phonetic": "tsi-net me-ki-na", "category": "transport" },

  // --- 21. PLACES ---
  "park": { "tigrinya": "ፓርክ", "phonetic": "park", "category": "places" },
  "store": { "tigrinya": "ድኳን", "phonetic": "di-kwan", "category": "places" },
  "hospital": { "tigrinya": "ሆስፒታል", "phonetic": "hos-pi-tal", "category": "places" },
  "church": { "tigrinya": "ቤተ ክርስትያን", "phonetic": "bet-e kir-sti-yan", "category": "places" },
  "zoo": { "tigrinya": "የእንስሳት ቤት", "phonetic": "ye-ins-is-at bet", "category": "places" },

  // --- 22. MUSIC ---
  "music": { "tigrinya": "ሙዚቃ", "phonetic": "muzi-qa", "category": "music" },
  "song": { "tigrinya": "መዝሙር", "phonetic": "mez-mur", "category": "music" },
  "dance": { "tigrinya": "ጸወታ", "phonetic": "tse-we-ta", "category": "music" },
  "sing": { "tigrinya": "ዘምር", "phonetic": "zem-ir", "category": "music" },

  // --- 23. ACTIONS ---
  "eat": { "tigrinya": "በልዕ", "phonetic": "bel", "category": "actions" },
  "drink": { "tigrinya": "ሰቲ", "phonetic": "se-ti", "category": "actions" },
  "sleep": { "tigrinya": "ንድር", "phonetic": "nid-ir", "category": "actions" },
  "run": { "tigrinya": "ሃደመ", "phonetic": "ha-de-me", "category": "actions" },
  "jump": { "tigrinya": "ዘረገ", "phonetic": "ze-re-ge", "category": "actions" },
  "walk": { "tigrinya": "መንበር", "phonetic": "men-ber", "category": "actions" },
  "talk": { "tigrinya": "ዘረባ", "phonetic": "ze-re-ba", "category": "actions" },
  "listen": { "tigrinya": "ስማዕ", "phonetic": "sim-a", "category": "actions" },
  "see": { "tigrinya": "ርኢ", "phonetic": "ri-i", "category": "actions" },
  "touch": { "tigrinya": "ተንከፍ", "phonetic": "ten-kef", "category": "actions" },
  "hold": { "tigrinya": "ሓዝ", "phonetic": "haz", "category": "actions" },
  "give": { "tigrinya": "ሃብ", "phonetic": "hab", "category": "actions" },
  "take": { "tigrinya": "ወሰድ", "phonetic": "we-sed", "category": "actions" },

  // --- 24. OBJECTS ---
  "computer": { "tigrinya": "ኮምፒዩተር", "phonetic": "kom-pyu-ter", "category": "objects" },
  "book": { "tigrinya": "መጽሓፍ", "phonetic": "mets-haf", "category": "objects" },
  "phone": { "tigrinya": "ተሌፎን", "phonetic": "te-le-fon", "category": "objects" },
  "key": { "tigrinya": "መፍትሕ", "phonetic": "mef-tih", "category": "objects" },
  "money": { "tigrinya": "ገንዘብ", "phonetic": "gen-zeb", "category": "objects" },
  "clock": { "tigrinya": "ሰዓት", "phonetic": "se-at", "category": "objects" },
  "light": { "tigrinya": "ብርሃን", "phonetic": "bir-han", "category": "objects" },
  "bag": { "tigrinya": "ቦርሳ", "phonetic": "bor-sa", "category": "objects" },

  // --- 25. SHAPES ---
  "circle": { "tigrinya": "ክብ", "phonetic": "kib", "category": "shapes" },
  "square": { "tigrinya": "ርቡዕ", "phonetic": "ri-bu", "category": "shapes" },
  "triangle": { "tigrinya": "ሰለስተ ክፍሊ", "phonetic": "se-les-te kif-li", "category": "shapes" },
  "heart": { "tigrinya": "ልቢ", "phonetic": "lib-i", "category": "shapes" },

  // --- 26. HOLIDAYS ---
  "birthday": { "tigrinya": "ውላድ መዓልቲ", "phonetic": "wi-lad me-al-ti", "category": "holidays" },
  "gift": { "tigrinya": "ህያብ", "phonetic": "hi-yab", "category": "holidays" },
  "party": { "tigrinya": "ድግስ", "phonetic": "dig-is", "category": "holidays" },
  "Christmas": { "tigrinya": "ገና", "phonetic": "ge-na", "category": "holidays" },

  // --- 27. BATHROOM ---
  "bath": { "tigrinya": "ሓጺብ", "phonetic": "ha-sib", "category": "house" },
  "soap": { "tigrinya": "ሳሙና", "phonetic": "sa-mu-na", "category": "house" },
  "toothbrush": { "tigrinya": "መጽሓፍ ስኒ", "phonetic": "mets-haf sin-i", "category": "house" },

  // --- 28. WEATHER ---
  "hot": { "tigrinya": "ሙቐት", "phonetic": "mu-qet", "category": "weather" },
  "cold": { "tigrinya": "ጽልዋ", "phonetic": "tsil-wa", "category": "weather" },
  "sunny": { "tigrinya": "ፀሐያዊ", "phonetic": "tse-hay-a-wi", "category": "weather" },

  // --- 29. QUESTIONS ---
  "what": { "tigrinya": "እንታይ", "phonetic": "en-tay", "category": "basics" },
  "where": { "tigrinya": "ኣበይ", "phonetic": "a-bey", "category": "basics" },
  "when": { "tigrinya": "መዓስ", "phonetic": "me-as", "category": "basics" },
  "why": { "tigrinya": "ስለምንታይ", "phonetic": "silem-in-tay", "category": "basics" },
  "how": { "tigrinya": "ከመይ", "phonetic": "ke-mey", "category": "basics" },

  // --- 30. DESCRIPTIVE WORDS ---
  "big": { "tigrinya": "ዓቢ", "phonetic": "a-bi", "category": "descriptive" },
  "small": { "tigrinya": "ንእሽቶ", "phonetic": "ni-sh-to", "category": "descriptive" },
  "fast": { "tigrinya": "ቅልጡፍ", "phonetic": "qil-tuf", "category": "descriptive" },
  "slow": { "tigrinya": "ደንጉዝ", "phonetic": "den-guz", "category": "descriptive" },
  "clean": { "tigrinya": "ንጹህ", "phonetic": "ni-tsuh", "category": "descriptive" },
  "dirty": { "tigrinya": "ጭላንጭል", "phonetic": "chil-an-chil", "category": "descriptive" },
   // Basic military terms
    "war": { "tigrinya": "ውግእ", "phonetic": "wig-e", "category": "military" },
    "peace": { "tigrinya": "ሰላም", "phonetic": "se-lam", "category": "military" },
    "soldier": { "tigrinya": "ወተሃደር", "phonetic": "we-te-ha-der", "category": "military" },
    "army": { "tigrinya": "ሰንደቅ ዕላማ", "phonetic": "sen-deq e-la-ma", "category": "military" },
    "battle": { "tigrinya": "ግጭት", "phonetic": "gich-it", "category": "military" },
    
    // Weapons
    "gun": { "tigrinya": "ሽጉጥ", "phonetic": "shig-ut", "category": "weapons" },
    "weapon": { "tigrinya": "መሳርያ", "phonetic": "me-sar-ya", "category": "weapons" },
    "knife": { "tigrinya": "ቸንጎ", "phonetic": "chen-go", "category": "weapons" },
    "sword": { "tigrinya": "ሰይፍ", "phonetic": "seyf", "category": "weapons" },
    "shield": { "tigrinya": "ኽፍል", "phonetic": "khif-il", "category": "weapons" },
    
    // Actions
    "attack": { "tigrinya": "መምታት", "phonetic": "mem-tat", "category": "actions" },
    "defend": { "tigrinya": "ምክልኻል", "phonetic": "mik-l-khal", "category": "actions" },
    "fight": { "tigrinya": "ምትሕግጋዝ", "phonetic": "mit-hig-gaz", "category": "actions" },
    "protect": { "tigrinya": "ምሕላው", "phonetic": "mih-law", "category": "actions" },
    "retreat": { "tigrinya": "ምግባር ድሕሪ", "phonetic": "mig-bar di-hri", "category": "actions" },
    
    // Places & units
    "camp": { "tigrinya": "መደበር", "phonetic": "me-de-ber", "category": "places" },
    "enemy": { "tigrinya": "ጸላኢ", "phonetic": "tse-la-i", "category": "people" },
    "ally": { "tigrinya": "ተሓጋጊ", "phonetic": "te-ha-ga-gi", "category": "people" },
    "front line": { "tigrinya": "ፊት መስመር", "phonetic": "fit mes-mer", "category": "places" },
    
    // Consequences
    "wound": { "tigrinya": "ቁስሊ", "phonetic": "qus-li", "category": "medical" },
    "death": { "tigrinya": "ሞት", "phonetic": "mot", "category": "medical" },
    "capture": { "tigrinya": "ምርካብ", "phonetic": "mir-kab", "category": "actions" },
    "victory": { "tigrinya": "ዓወት", "phonetic": "a-wet", "category": "outcomes" },
    "defeat": { "tigrinya": "ስዕረት", "phonetic": "si-ret", "category": "outcomes" },
    
    // Traditional Tigrinya military terms
    "warrior": { "tigrinya": "ተመራመርቲ", "phonetic": "te-me-ra-mer-ti", "category": "people" },
    "bravery": { "tigrinya": "ተባዕታይ", "phonetic": "te-ba-ta-y", "category": "qualities" },
    "strategy": { "tigrinya": "ስልቲ", "phonetic": "sil-ti", "category": "tactics" },
    "courage": { "tigrinya": "ህያውነት", "phonetic": "hi-ya-wi-net", "category": "qualities" },
    
    // Modern terms
    "tank": { "tigrinya": "ታንኪ", "phonetic": "tan-ki", "category": "vehicles" },
    "helicopter": { "tigrinya": "ሄሊኮፕተር", "phonetic": "he-li-kop-ter", "category": "vehicles" },
    "uniform": { "tigrinya": "ዩኒፎርም", "phonetic": "yu-ni-form", "category": "equipment" },
    "commander": { "tigrinya": "ቃዋሚ", "phonetic": "qa-wa-mi", "category": "people" },
    
    // Additional Eritrean/Ethiopian specific terms
    "freedom fighter": { "tigrinya": "ተጋዳላይ", "phonetic": "te-ga-da-lay", "category": "people" },
    "independence": { "tigrinya": "ናጽነት", "phonetic": "na-tsi-net", "category": "political" },
    "liberation": { "tigrinya": "ሓራይ", "phonetic": "ha-ray", "category": "political" },
    "revolution": { "tigrinya": "ዕቈባ", "phonetic": "e-qwe-ba", "category": "political" }

};
window.translations = translations;