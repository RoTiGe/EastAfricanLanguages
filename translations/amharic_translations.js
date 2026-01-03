const translations = {
// ...existing code...
// (translations object continues...)


  // --- 1. BASICS & GREETINGS ---
  "hello": { "amharic": "ሀሎ", "phonetic": "hal-lo", "category": "basics" },
  "goodbye": { "amharic": "ደህና ሁን", "phonetic": "deh-na hoon", "category": "basics" },
  "thank you": { "amharic": "አመሰግናለሁ", "phonetic": "ah-meh-seg-i-nal-hu", "category": "basics" },
  "please": { "amharic": "እባክህ", "phonetic": "ebak-h", "category": "basics" },
  "sorry": { "amharic": "ይቅርታ", "phonetic": "yi-qir-ta", "category": "basics" },
  "yes": { "amharic": "አዎ", "phonetic": "a-wo", "category": "basics" },
  "no": { "amharic": "አይ", "phonetic": "ay", "category": "basics" },
  "okay": { "amharic": "እሺ", "phonetic": "eh-shi", "category": "basics" },
  "excuse me": { "amharic": "ይቅር", "phonetic": "yi-qir", "category": "basics" },
  "welcome": { "amharic": "እንኳን ደህና መጡ", "phonetic": "en-kwan deh-na met-u", "category": "basics" },

  // --- 2. FAMILY ---
  "mother": { "amharic": "እናት", "phonetic": "en-naht", "category": "family" },
  "father": { "amharic": "አባት", "phonetic": "ah-baht", "category": "family" },
  "baby": { "amharic": "ህፃን", "phonetic": "hits-an", "category": "family" },
  "sister": { "amharic": "እህት", "phonetic": "eh-hit", "category": "family" },
  "brother": { "amharic": "ወንድም", "phonetic": "wen-dim", "category": "family" },
  "uncle": { "amharic": "አጎት", "phonetic": "ah-goht", "category": "family" },
  "aunt": { "amharic": "አክስት", "phonetic": "ah-kist", "category": "family" },
  "grandmother": { "amharic": "አያት", "phonetic": "ah-yaht", "category": "family" },
  "grandfather": { "amharic": "አያት", "phonetic": "ah-yaht", "category": "family" },
  "cousin": { "amharic": "አጎቴ", "phonetic": "ah-go-tay", "category": "family" },
  "family": { "amharic": "ቤተሰብ", "phonetic": "bet-e-seb", "category": "family" },
  "child": { "amharic": "ልጅ", "phonetic": "lij", "category": "family" },
  "children": { "amharic": "ልጆች", "phonetic": "lij-och", "category": "family" },

  // --- 2a. PEOPLE ---
  "friend": { "amharic": "ጓደኛ", "phonetic": "gwah-den-yah", "category": "people" },
  "teacher": { "amharic": "መምህር", "phonetic": "mem-hir", "category": "people" },
  "doctor": { "amharic": "ሀኪም", "phonetic": "hak-im", "category": "people" },
  "student": { "amharic": "ተማሪ", "phonetic": "tem-ari", "category": "people" },

  // --- 3. BODY PARTS ---
  "head": { "amharic": "ራስ", "phonetic": "rahs", "category": "body" },
  "eyes": { "amharic": "አይን", "phonetic": "ay-in", "category": "body" },
  "nose": { "amharic": "አፍንጫ", "phonetic": "af-in-ch'a", "category": "body" },
  "mouth": { "amharic": "አፍ", "phonetic": "af", "category": "body" },
  "hands": { "amharic": "እጅ", "phonetic": "edj", "category": "body" },
  "ears": { "amharic": "ጆሮ", "phonetic": "jo-ro", "category": "body" },
  "hair": { "amharic": "ፀጉር", "phonetic": "tse-goor", "category": "body" },
  "teeth": { "amharic": "ጥርስ", "phonetic": "tirs", "category": "body" },
  "feet": { "amharic": "እግር", "phonetic": "eg-ir", "category": "body" },
  "fingers": { "amharic": "ጣት", "phonetic": "tat", "category": "body" },
  "stomach": { "amharic": "ሆድ", "phonetic": "hod", "category": "body" },
  "heart": { "amharic": "ልብ", "phonetic": "lib", "category": "body" },

  // --- 4. CLOTHING ---
  "shirt": { "amharic": "ሸሚዝ", "phonetic": "she-miz", "category": "clothing" },
  "shoes": { "amharic": "ጫማ", "phonetic": "ch'ah-ma", "category": "clothing" },
  "hat": { "amharic": "ቆብ", "phonetic": "q'ob", "category": "clothing" },
  "pants": { "amharic": "ሱሪ", "phonetic": "su-ri", "category": "clothing" },
  "dress": { "amharic": "ኮንዶ", "phonetic": "kon-do", "category": "clothing" },
  "socks": { "amharic": "ጫማ ልብስ", "phonetic": "ch'ah-ma libs", "category": "clothing" },
  "coat": { "amharic": "ኮት", "phonetic": "kot", "category": "clothing" },
  "gloves": { "amharic": "ግብፅ", "phonetic": "geb-ts", "category": "clothing" },

  // --- 5. COLORS ---
  "red": { "amharic": "ቀይ", "phonetic": "q'ey", "category": "colors" },
  "blue": { "amharic": "ሰማያዊ", "phonetic": "se-ma-ya-wi", "category": "colors" },
  "yellow": { "amharic": "ቢጫ", "phonetic": "bi-ch'ah", "category": "colors" },
  "green": { "amharic": "አረንጓዴ", "phonetic": "ah-ren-gwa-de", "category": "colors" },
  "orange": { "amharic": "ብርቱካናማ", "phonetic": "bir-tu-ka-na-ma", "category": "colors" },
  "purple": { "amharic": "ሐምራዊ", "phonetic": "ham-ra-wi", "category": "colors" },
  "pink": { "amharic": "ሮዝ", "phonetic": "roz", "category": "colors" },
  "brown": { "amharic": "ቡናዊ", "phonetic": "bu-na-wi", "category": "colors" },
  "black": { "amharic": "ጥቁር", "phonetic": "t'iqur", "category": "colors" },
  "white": { "amharic": "ነጭ", "phonetic": "nech", "category": "colors" },
  "rainbow": { "amharic": "ቀስተ ደመና", "phonetic": "q'est-e dem-ena", "category": "colors" },

  // --- 6. NUMBERS ---
  "one": { "amharic": "አንድ", "phonetic": "and", "category": "numbers" },
  "two": { "amharic": "ሁለት", "phonetic": "hu-let", "category": "numbers" },
  "three": { "amharic": "ሶስት", "phonetic": "sost", "category": "numbers" },
  "four": { "amharic": "አራት", "phonetic": "a-rat", "category": "numbers" },
  "five": { "amharic": "አምስት", "phonetic": "am-ist", "category": "numbers" },
  "six": { "amharic": "ስድስት", "phonetic": "sid-ist", "category": "numbers" },
  "seven": { "amharic": "ሰባት", "phonetic": "se-bat", "category": "numbers" },
  "eight": { "amharic": "ስምንት", "phonetic": "sim-int", "category": "numbers" },
  "nine": { "amharic": "ዘጠኝ", "phonetic": "ze-ten-y", "category": "numbers" },
  "ten": { "amharic": "አስር", "phonetic": "as-ir", "category": "numbers" },
  "zero": { "amharic": "ዜሮ", "phonetic": "ze-ro", "category": "numbers" },

  // --- 7. EMOTIONS ---
  "happy": { "amharic": "ደስተኛ", "phonetic": "des-te-nya", "category": "emotions" },
  "sad": { "amharic": "አዘንተኛ", "phonetic": "azen-te-nya", "category": "emotions" },
  "angry": { "amharic": "ተናደደ", "phonetic": "ten-a-ded-e", "category": "emotions" },
  "scared": { "amharic": "ፈራ", "phonetic": "fer-a", "category": "emotions" },
  "surprised": { "amharic": "ደነቀ", "phonetic": "den-eq-e", "category": "emotions" },
  "excited": { "amharic": "ከባድ", "phonetic": "keb-ad", "category": "emotions" },
  "tired": { "amharic": "ድካም", "phonetic": "di-kam", "category": "emotions" },

  // --- 8. SCHOOL ---
  "school": { "amharic": "ትምህርት ቤት", "phonetic": "tim-hirt bet", "category": "school" },
  "pencil": { "amharic": "እርሳስ", "phonetic": "er-sas", "category": "school" },
  "paper": { "amharic": "ወረቀት", "phonetic": "wer-e-qet", "category": "school" },
  "draw": { "amharic": "መሳል", "phonetic": "me-sal", "category": "school" },
  "write": { "amharic": "መጻፍ", "phonetic": "mets-af", "category": "school" },
  "read": { "amharic": "መንበብ", "phonetic": "men-beb", "category": "school" },
  "learn": { "amharic": "መማር", "phonetic": "me-mar", "category": "school" },

  // --- 9. TOYS & PLAY ---
  "toy": { "amharic": "መጫወቻ", "phonetic": "mech-a-wech-a", "category": "toys" },
  "ball": { "amharic": "ኳስ", "phonetic": "kwas", "category": "toys" },
  "doll": { "amharic": "አሻንጉሊት", "phonetic": "ash-an-gu-lit", "category": "toys" },
  "game": { "amharic": "ጨዋታ", "phonetic": "ch'e-wa-ta", "category": "toys" },
  "play": { "amharic": "መጫወት", "phonetic": "mech-a-wet", "category": "toys" },
  "fun": { "amharic": "ደስታ", "phonetic": "des-ta", "category": "toys" },

  // --- 10. HOUSE ---
  "house": { "amharic": "ቤት", "phonetic": "bet", "category": "house" },
  "room": { "amharic": "ክፍል", "phonetic": "kif-il", "category": "house" },
  "door": { "amharic": "በር", "phonetic": "ber", "category": "house" },
  "window": { "amharic": "መስኮት", "phonetic": "mes-kot", "category": "house" },
  "bed": { "amharic": "አልጋ", "phonetic": "al-ga", "category": "house" },
  "table": { "amharic": "ጠረጴዛ", "phonetic": "ter-e-p'e-za", "category": "house" },
  "chair": { "amharic": "ወንበር", "phonetic": "wen-ber", "category": "house" },
  "kitchen": { "amharic": "ማዕከላዊ ቤት", "phonetic": "ma-ek-e-la-wi bet", "category": "house" },

  // --- 11. FOOD ---
  "bread": { "amharic": "ዳቦ", "phonetic": "da-bo", "category": "food" },
  "milk": { "amharic": "ወተት", "phonetic": "wet-et", "category": "food" },
  "egg": { "amharic": "እንቁላል", "phonetic": "en-ku-lal", "category": "food" },
  "fruit": { "amharic": "ፍራፍሬ", "phonetic": "fir-af-ray", "category": "food" },
  "apple": { "amharic": "ፖም", "phonetic": "pom", "category": "food" },
  "banana": { "amharic": "ሙዝ", "phonetic": "muz", "category": "food" },
  "juice": { "amharic": "ጭማቂ", "phonetic": "ch'im-a-qi", "category": "food" },
  "water": { "amharic": "ውሃ", "phonetic": "wu-ha", "category": "food" },
  "breakfast": { "amharic": "ቁርስ", "phonetic": "q'oors", "category": "food" },
  "lunch": { "amharic": "ምሳ", "phonetic": "mi-sah", "category": "food" },
  "dinner": { "amharic": "እራት", "phonetic": "eh-raht", "category": "food" },
  "cake": { "amharic": "ኬክ", "phonetic": "kek", "category": "food" },
  "candy": { "amharic": "ስኳር", "phonetic": "suk-war", "category": "food" },

  // --- 12. FARM ANIMALS ---
  "cow": { "amharic": "ላም", "phonetic": "lahm", "category": "animals" },
  "sheep": { "amharic": "በግ", "phonetic": "beg", "category": "animals" },
  "chicken": { "amharic": "ዶሮ", "phonetic": "doro", "category": "animals" },
  "horse": { "amharic": "ፈረስ", "phonetic": "fer-es", "category": "animals" },
  "goat": { "amharic": "ፍየል", "phonetic": "fiyel", "category": "animals" },
  "donkey": { "amharic": "አድጊ", "phonetic": "ad-igi", "category": "animals" },
  "pig": { "amharic": "አሳማ", "phonetic": "as-ama", "category": "animals" },

  // --- 13. PETS ---
  "dog": { "amharic": "ውሻ", "phonetic": "wish-a", "category": "animals" },
  "cat": { "amharic": "ድመት", "phonetic": "dim-et", "category": "animals" },
  "bird": { "amharic": "ወፍ", "phonetic": "wef", "category": "animals" },
  "fish": { "amharic": "አሳ", "phonetic": "as-a", "category": "animals" },
  "rabbit": { "amharic": "ቀጭኔ", "phonetic": "q'ech-in-e", "category": "animals" },

  // --- 14. WILD ANIMALS ---
  "lion": { "amharic": "አንበሳ", "phonetic": "an-bes-a", "category": "animals" },
  "elephant": { "amharic": "ዝሆን", "phonetic": "zi-hon", "category": "animals" },
  "giraffe": { "amharic": "ቀጭኔ", "phonetic": "q'ech-in-e", "category": "animals" },
  "monkey": { "amharic": "ዝንጀሮ", "phonetic": "zin-je-ro", "category": "animals" },
  "zebra": { "amharic": "የበረዶ አጥቢ", "phonetic": "ye-ber-edo at'ibi", "category": "animals" },

  // --- 15. INSECTS ---
  "butterfly": { "amharic": "ቢራቢሮ", "phonetic": "bir-a-bir-o", "category": "animals" },
  "bee": { "amharic": "ንቦ", "phonetic": "nib-o", "category": "animals" },
  "spider": { "amharic": "ሸረሪት", "phonetic": "sher-er-it", "category": "animals" },

  // --- 16. NATURE & WEATHER ---
  "rain": { "amharic": "ዝናብ", "phonetic": "zi-nab", "category": "nature" },
  "cloud": { "amharic": "ደመና", "phonetic": "dem-ena", "category": "nature" },
  "mountain": { "amharic": "ተራራ", "phonetic": "ter-ara", "category": "nature" },
  "water": { "amharic": "ውሃ", "phonetic": "wu-ha", "category": "nature" },
  "sun": { "amharic": "ፀሐይ", "phonetic": "tse-hai", "category": "nature" },
  "moon": { "amharic": "ጨረቃ", "phonetic": "ch'er-eh-q'ah", "category": "nature" },
  "tree": { "amharic": "ዛፍ", "phonetic": "zahf", "category": "nature" },
  "flower": { "amharic": "አበባ", "phonetic": "ah-beh-bah", "category": "nature" },
  "world": { "amharic": "ዓለም", "phonetic": "ah-lem", "category": "nature" },
  "star": { "amharic": "ኮከብ", "phonetic": "kok-eb", "category": "nature" },
  "sky": { "amharic": "ሰማይ", "phonetic": "sem-ay", "category": "nature" },
  "river": { "amharic": "ወንዝ", "phonetic": "wen-iz", "category": "nature" },
  "lake": { "amharic": "ሐይቅ", "phonetic": "hayq", "category": "nature" },
  "sea": { "amharic": "ባሕር", "phonetic": "bah-ir", "category": "nature" },
  "wind": { "amharic": "ነፋስ", "phonetic": "ne-fas", "category": "nature" },
  "snow": { "amharic": "በረዶ", "phonetic": "ber-edo", "category": "nature" },

  // --- 17. TIME ---
  "day": { "amharic": "ቀን", "phonetic": "q'en", "category": "time" },
  "night": { "amharic": "ሌሊት", "phonetic": "lay-lit", "category": "time" },
  "morning": { "amharic": "ጠዋት", "phonetic": "t'ew-at", "category": "time" },
  "afternoon": { "amharic": "ከሰዓት በኋላ", "phonetic": "ke-se-at be-hwa-la", "category": "time" },
  "evening": { "amharic": "ማታ", "phonetic": "ma-ta", "category": "time" },
  "today": { "amharic": "ዛሬ", "phonetic": "zar-ay", "category": "time" },
  "tomorrow": { "amharic": "ነገ", "phonetic": "neg-e", "category": "time" },
  "yesterday": { "amharic": "ትላንት", "phonetic": "til-ant", "category": "time" },

  // --- 18. SEASONS ---
  "summer": { "amharic": "በጋ", "phonetic": "beg-a", "category": "seasons" },
  "winter": { "amharic": "ክረምት", "phonetic": "kiremt", "category": "seasons" },
  "spring": { "amharic": "ጸደይ", "phonetic": "tsed-ey", "category": "seasons" },
  "autumn": { "amharic": "ክረምት", "phonetic": "kiremt", "category": "seasons" },

  // --- 19. TRANSPORT ---
  "car": { "amharic": "መኪና", "phonetic": "mek-ina", "category": "transport" },
  "airplane": { "amharic": "አውሮፕላን", "phonetic": "aw-ro-plan", "category": "transport" },
  "bicycle": { "amharic": "ብስክሌት", "phonetic": "bis-ik-lait", "category": "transport" },
  "bus": { "amharic": "አውቶቡስ", "phonetic": "aw-to-bus", "category": "transport" },
  "train": { "amharic": "ባቡር", "phonetic": "ba-bur", "category": "transport" },
  "boat": { "amharic": "መርከብ", "phonetic": "mer-keb", "category": "transport" },
  "truck": { "amharic": "ጭነት መኪና", "phonetic": "ch'in-et mek-ina", "category": "transport" },

  // --- 20. PLACES ---
  "park": { "amharic": "ፓርክ", "phonetic": "park", "category": "places" },
  "store": { "amharic": "ደንበኛ", "phonetic": "den-ben-ya", "category": "places" },
  "hospital": { "amharic": "ጤና ቤት", "phonetic": "t'ay-na bet", "category": "places" },
  "church": { "amharic": "ቤተ ክርስቲያን", "phonetic": "bet-e kir-sti-yan", "category": "places" },
  "zoo": { "amharic": "የእንስሳት ማሳ", "phonetic": "ye-ins-is-at mas-a", "category": "places" },

  // --- 21. MUSIC ---
  "music": { "amharic": "ሙዚቃ", "phonetic": "muzi-qa", "category": "music" },
  "song": { "amharic": "መዝሙር", "phonetic": "mez-mur", "category": "music" },
  "dance": { "amharic": "መዝፈን", "phonetic": "mez-fen", "category": "music" },
  "sing": { "amharic": "መዝፈን", "phonetic": "mez-fen", "category": "music" },

  // --- 22. ACTION VERBS ---
  "eat": { "amharic": "መብላት", "phonetic": "meb-lat", "category": "actions" },
  "drink": { "amharic": "መጠጣት", "phonetic": "met-et-at", "category": "actions" },
  "sleep": { "amharic": "መተኛት", "phonetic": "met-en-yat", "category": "actions" },
  "run": { "amharic": "መሮጥ", "phonetic": "me-rot", "category": "actions" },
  "jump": { "amharic": "መዝለቅ", "phonetic": "mez-leq", "category": "actions" },
  "walk": { "amharic": "መጓዝ", "phonetic": "me-gwaz", "category": "actions" },
  "talk": { "amharic": "መናገር", "phonetic": "men-a-ger", "category": "actions" },
  "listen": { "amharic": "መስማት", "phonetic": "mes-mat", "category": "actions" },
  "see": { "amharic": "መስተዋት", "phonetic": "mes-te-wat", "category": "actions" },
  "touch": { "amharic": "መንካት", "phonetic": "men-kat", "category": "actions" },
  "hold": { "amharic": "መያዝ", "phonetic": "me-yaz", "category": "actions" },
  "give": { "amharic": "መስጠት", "phonetic": "mes-t'et", "category": "actions" },
  "take": { "amharic": "መውሰድ", "phonetic": "mew-sed", "category": "actions" },

  // --- 23. OBJECTS ---
  "computer": { "amharic": "ኮምፒውተር", "phonetic": "kom-pyu-ter", "category": "objects" },
  "book": { "amharic": "መጽሐፍ", "phonetic": "mets-haf", "category": "objects" },
  "phone": { "amharic": "ስልክ", "phonetic": "sil-ik", "category": "objects" },
  "key": { "amharic": "ቁልፍ", "phonetic": "q'ul-if", "category": "objects" },
  "money": { "amharic": "ገንዘብ", "phonetic": "gen-ze-b", "category": "objects" },
  "clock": { "amharic": "ሰዓት", "phonetic": "se-at", "category": "objects" },
  "light": { "amharic": "ብርሃን", "phonetic": "bir-han", "category": "objects" },
  "bag": { "amharic": "ቦርሳ", "phonetic": "bor-sa", "category": "objects" },

  // --- 24. SHAPES ---
  "circle": { "amharic": "ክብ", "phonetic": "kib", "category": "shapes" },
  "square": { "amharic": "ካሬ", "phonetic": "ka-ray", "category": "shapes" },
  "triangle": { "amharic": "ሶስት ማእዘን", "phonetic": "sost ma-e-zen", "category": "shapes" },
  "heart": { "amharic": "ልብ", "phonetic": "lib", "category": "shapes" },

  // --- 25. HOLIDAYS & CELEBRATIONS ---
  "birthday": { "amharic": "የልደት ቀን", "phonetic": "ye-led-et q'en", "category": "holidays" },
  "gift": { "amharic": "ስጦታ", "phonetic": "sit-ota", "category": "holidays" },
  "party": { "amharic": "ድግስ", "phonetic": "dig-is", "category": "holidays" },
  "Christmas": { "amharic": "ገና", "phonetic": "gen-a", "category": "holidays" },

    // Basic military terms
    "war": { "amharic": "ጦርነት", "phonetic": "tor-net", "category": "military" },
    "peace": { "amharic": "ሰላም", "phonetic": "se-lam", "category": "military" },
    "soldier": { "amharic": "ወታደር", "phonetic": "we-ta-der", "category": "military" },
    "army": { "amharic": "ሰራዊት", "phonetic": "se-ra-wit", "category": "military" },
    "battle": { "amharic": "ትግል", "phonetic": "tig-il", "category": "military" },
    
    // Weapons
    "gun": { "amharic": "ሽጉጥ", "phonetic": "shig-ut", "category": "weapons" },
    "weapon": { "amharic": "የጦር መሣርያ", "phonetic": "ye-tor me-sa-ri-ya", "category": "weapons" },
    "knife": { "amharic": "ቢላ", "phonetic": "bi-la", "category": "weapons" },
    "sword": { "amharic": "ነጭ ሰይፍ", "phonetic": "nech seyf", "category": "weapons" },
    "shield": { "amharic": "ጋሻ", "phonetic": "ga-sha", "category": "weapons" },
    
    // Actions
    "attack": { "amharic": "መምታት", "phonetic": "mem-tat", "category": "actions" },
    "defend": { "amharic": "መከላከል", "phonetic": "me-ke-la-kel", "category": "actions" },
    "fight": { "amharic": "መጋጠም", "phonetic": "me-ga-tem", "category": "actions" },
    "protect": { "amharic": "መጠበቅ", "phonetic": "met-e-beq", "category": "actions" },
    "retreat": { "amharic": "መመለስ", "phonetic": "me-me-les", "category": "actions" },
    
    // Places & units
    "camp": { "amharic": "ሰፈር", "phonetic": "se-fer", "category": "places" },
    "enemy": { "amharic": "ጠላት", "phonetic": "te-lat", "category": "people" },
    "ally": { "amharic": "አጋር", "phonetic": "a-gar", "category": "people" },
    "front line": { "amharic": "ፊት ለፊት መስመር", "phonetic": "fit le-fit mes-mer", "category": "places" },
    
    // Consequences
    "wound": { "amharic": "ጉዳት", "phonetic": "gu-dat", "category": "medical" },
    "death": { "amharic": "ሞት", "phonetic": "mot", "category": "medical" },
    "capture": { "amharic": "መማረክ", "phonetic": "me-ma-rek", "category": "actions" },
    "victory": { "amharic": "ድል", "phonetic": "dil", "category": "outcomes" },
    "defeat": { "amharic": "ሽንፈት", "phonetic": "shin-fet", "category": "outcomes" },
    
    // Traditional military terms
    "warrior": { "amharic": "ወታደር", "phonetic": "we-ta-der", "category": "people" },
    "bravery": { "amharic": "ደፋርነት", "phonetic": "de-far-net", "category": "qualities" },
    "strategy": { "amharic": "ስልት", "phonetic": "silt", "category": "tactics" },
    "courage": { "amharic": "ትዕግስት", "phonetic": "tig-ist", "category": "qualities" },
    
    // Modern terms
    "tank": { "amharic": "ታንክ", "phonetic": "tank", "category": "vehicles" },
    "helicopter": { "amharic": "ሄሊኮፕተር", "phonetic": "he-li-kop-ter", "category": "vehicles" },
    "uniform": { "amharic": "አንድ ዓይነት ልብስ", "phonetic": "and a-yi-net libs", "category": "equipment" },
    "commander": { "amharic": "ባለሥልጣን", "phonetic": "ba-le-sil-tan", "category": "people" },
    
    // Additional terms
    "invasion": { "amharic": "መስጠበቅ", "phonetic": "mes-te-beq", "category": "actions" },
    "resistance": { "amharic": "ተቃውሞ", "phonetic": "te-qaw-mo", "category": "actions" },
    "occupation": { "amharic": "ቅኝ ግዛት", "phonetic": "qin-y gizat", "category": "political" },
    "ceasefire": { "amharic": "እልፍ አድማ", "phonetic": "ilif ad-ma", "category": "military" },
    
    // Political/Military concepts
    "revolution": { "amharic": "መቃወም", "phonetic": "me-qa-wem", "category": "political" },
    "liberation": { "amharic": "ነፃ መውጣት", "phonetic": "ne-tsa mew-tat", "category": "political" },
    "independence": { "amharic": "ነፃነት", "phonetic": "ne-tsa-net", "category": "political" },
    "surrender": { "amharic": "ማስገባት", "phonetic": "mas-ge-bat", "category": "actions" }
};
window.translations = translations;