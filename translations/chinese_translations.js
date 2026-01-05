const translations = {
  // --- 1. BASICS & GREETINGS ---
  "hello": { "chinese": "ä½ å¥½", "phonetic": "nÇ hÇŽo", "category": "basics" },
  "goodbye": { "chinese": "å†è§", "phonetic": "zÃ i jiÃ n", "category": "basics" },
  "thank you": { "chinese": "è°¢è°¢", "phonetic": "xiÃ¨ xie", "category": "basics" },
  "please": { "chinese": "è¯·", "phonetic": "qÇng", "category": "basics" },
  "sorry": { "chinese": "å¯¹ä¸èµ·", "phonetic": "duÃ¬ bu qÇ", "category": "basics" },
  "yes": { "chinese": "æ˜¯", "phonetic": "shÃ¬", "category": "basics" },
  "no": { "chinese": "ä¸", "phonetic": "bÃ¹", "category": "basics" },
  "okay": { "chinese": "å¥½çš„", "phonetic": "hÇŽo de", "category": "basics" },
  "excuse me": { "chinese": "æ‰“æ‰°ä¸€ä¸‹", "phonetic": "dÇŽ rÇŽo yÄ« xiÃ ", "category": "basics" },
  "welcome": { "chinese": "æ¬¢è¿Ž", "phonetic": "huÄn yÃ­ng", "category": "basics" },

  // --- 2. FAMILY ---
  "mother": { "chinese": "æ¯äº²", "phonetic": "mÇ” qÄ«n", "category": "family" },
  "father": { "chinese": "çˆ¶äº²", "phonetic": "fÃ¹ qÄ«n", "category": "family" },
  "baby": { "chinese": "å©´å„¿", "phonetic": "yÄ«ng Ã©r", "category": "family" },
  "sister": { "chinese": "å§å§", "phonetic": "jiÄ› jie", "category": "family" },
  "brother": { "chinese": "å“¥å“¥", "phonetic": "gÄ“ ge", "category": "family" },
  "uncle": { "chinese": "å”å”", "phonetic": "shÅ« shu", "category": "family" },
  "aunt": { "chinese": "é˜¿å§¨", "phonetic": "Ä yÃ­", "category": "family" },
  "grandmother": { "chinese": "å¥¶å¥¶", "phonetic": "nÇŽi nai", "category": "family" },
  "grandfather": { "chinese": "çˆ·çˆ·", "phonetic": "yÃ© ye", "category": "family" },
  "cousin": { "chinese": "è¡¨å…„å¼Ÿ", "phonetic": "biÇŽo xiÅng dÃ¬", "category": "family" },
  "family": { "chinese": "å®¶åº­", "phonetic": "jiÄ tÃ­ng", "category": "family" },
  "child": { "chinese": "å­©å­", "phonetic": "hÃ¡i zi", "category": "family" },
  "children": { "chinese": "å­©å­ä»¬", "phonetic": "hÃ¡i zi men", "category": "family" },

  // --- 2a. PEOPLE ---
  "friend": { "chinese": "æœ‹å‹", "phonetic": "pÃ©ng you", "category": "people" },
  "teacher": { "chinese": "è€å¸ˆ", "phonetic": "lÇŽo shÄ«", "category": "people" },
  "doctor": { "chinese": "åŒ»ç”Ÿ", "phonetic": "yÄ« shÄ“ng", "category": "people" },
  "student": { "chinese": "å­¦ç”Ÿ", "phonetic": "xuÃ© sheng", "category": "people" },

  // --- 3. BODY PARTS ---
  "head": { "chinese": "å¤´", "phonetic": "tÃ³u", "category": "body" },
  "eyes": { "chinese": "çœ¼ç›", "phonetic": "yÇŽn jing", "category": "body" },
  "nose": { "chinese": "é¼»å­", "phonetic": "bÃ­ zi", "category": "body" },
  "mouth": { "chinese": "å˜´å·´", "phonetic": "zuÇ ba", "category": "body" },
  "hands": { "chinese": "æ‰‹", "phonetic": "shÇ’u", "category": "body" },
  "ears": { "chinese": "è€³æœµ", "phonetic": "Ä›r duo", "category": "body" },
  "hair": { "chinese": "å¤´å‘", "phonetic": "tÃ³u fa", "category": "body" },
  "teeth": { "chinese": "ç‰™é½¿", "phonetic": "yÃ¡ chÇ", "category": "body" },
  "feet": { "chinese": "è„š", "phonetic": "jiÇŽo", "category": "body" },
  "fingers": { "chinese": "æ‰‹æŒ‡", "phonetic": "shÇ’u zhÇ", "category": "body" },
  "stomach": { "chinese": "èƒƒ", "phonetic": "wÃ¨i", "category": "body" },
  "heart": { "chinese": "å¿ƒ", "phonetic": "xÄ«n", "category": "body" },

  // --- 4. CLOTHING ---
  "shirt": { "chinese": "è¡¬è¡«", "phonetic": "chÃ¨n shÄn", "category": "clothing" },
  "shoes": { "chinese": "éž‹å­", "phonetic": "xiÃ© zi", "category": "clothing" },
  "hat": { "chinese": "å¸½å­", "phonetic": "mÃ o zi", "category": "clothing" },
  "pants": { "chinese": "è£¤å­", "phonetic": "kÃ¹ zi", "category": "clothing" },
  "dress": { "chinese": "è£™å­", "phonetic": "qÃºn zi", "category": "clothing" },
  "socks": { "chinese": "è¢œå­", "phonetic": "wÃ  zi", "category": "clothing" },
  "coat": { "chinese": "å¤–å¥—", "phonetic": "wÃ i tÃ o", "category": "clothing" },
  "gloves": { "chinese": "æ‰‹å¥—", "phonetic": "shÇ’u tÃ o", "category": "clothing" },

  // --- 5. COLORS ---
  "red": { "chinese": "çº¢è‰²", "phonetic": "hÃ³ng sÃ¨", "category": "colors" },
  "blue": { "chinese": "è“è‰²", "phonetic": "lÃ¡n sÃ¨", "category": "colors" },
  "yellow": { "chinese": "é»„è‰²", "phonetic": "huÃ¡ng sÃ¨", "category": "colors" },
  "green": { "chinese": "ç»¿è‰²", "phonetic": "lÇœ sÃ¨", "category": "colors" },
  "orange": { "chinese": "æ©™è‰²", "phonetic": "chÃ©ng sÃ¨", "category": "colors" },
  "purple": { "chinese": "ç´«è‰²", "phonetic": "zÇ sÃ¨", "category": "colors" },
  "pink": { "chinese": "ç²‰è‰²", "phonetic": "fÄ›n sÃ¨", "category": "colors" },
  "brown": { "chinese": "æ£•è‰²", "phonetic": "zÅng sÃ¨", "category": "colors" },
  "black": { "chinese": "é»‘è‰²", "phonetic": "hÄ“i sÃ¨", "category": "colors" },
  "white": { "chinese": "ç™½è‰²", "phonetic": "bÃ¡i sÃ¨", "category": "colors" },
  "rainbow": { "chinese": "å½©è™¹", "phonetic": "cÇŽi hÃ³ng", "category": "colors" },

  // --- 6. NUMBERS ---
  "one": { "chinese": "ä¸€", "phonetic": "yÄ«", "category": "numbers" },
  "two": { "chinese": "äºŒ", "phonetic": "Ã¨r", "category": "numbers" },
  "three": { "chinese": "ä¸‰", "phonetic": "sÄn", "category": "numbers" },
  "four": { "chinese": "å››", "phonetic": "sÃ¬", "category": "numbers" },
  "five": { "chinese": "äº”", "phonetic": "wÇ”", "category": "numbers" },
  "six": { "chinese": "å…­", "phonetic": "liÃ¹", "category": "numbers" },
  "seven": { "chinese": "ä¸ƒ", "phonetic": "qÄ«", "category": "numbers" },
  "eight": { "chinese": "å…«", "phonetic": "bÄ", "category": "numbers" },
  "nine": { "chinese": "ä¹", "phonetic": "jiÇ”", "category": "numbers" },
  "ten": { "chinese": "å", "phonetic": "shÃ­", "category": "numbers" },
  "zero": { "chinese": "é›¶", "phonetic": "lÃ­ng", "category": "numbers" },

  // --- 7. EMOTIONS ---
  "happy": { "chinese": "é«˜å…´", "phonetic": "gÄo xÃ¬ng", "category": "emotions" },
  "sad": { "chinese": "éš¾è¿‡", "phonetic": "nÃ¡n guÃ²", "category": "emotions" },
  "angry": { "chinese": "ç”Ÿæ°”", "phonetic": "shÄ“ng qÃ¬", "category": "emotions" },
  "scared": { "chinese": "å®³æ€•", "phonetic": "hÃ i pÃ ", "category": "emotions" },
  "surprised": { "chinese": "æƒŠè®¶", "phonetic": "jÄ«ng yÃ ", "category": "emotions" },
  "excited": { "chinese": "å…´å¥‹", "phonetic": "xÄ«ng fÃ¨n", "category": "emotions" },
  "tired": { "chinese": "ç´¯", "phonetic": "lÃ¨i", "category": "emotions" },

  // --- 8. SCHOOL ---
  "school": { "chinese": "å­¦æ ¡", "phonetic": "xuÃ© xiÃ o", "category": "school" },
  "pencil": { "chinese": "é“…ç¬”", "phonetic": "qiÄn bÇ", "category": "school" },
  "paper": { "chinese": "çº¸", "phonetic": "zhÇ", "category": "school" },
  "draw": { "chinese": "ç”»ç”»", "phonetic": "huÃ  huÃ ", "category": "school" },
  "write": { "chinese": "å†™", "phonetic": "xiÄ›", "category": "school" },
  "read": { "chinese": "è¯»", "phonetic": "dÃº", "category": "school" },
  "learn": { "chinese": "å­¦ä¹ ", "phonetic": "xuÃ© xÃ­", "category": "school" },

  // --- 9. TOYS & PLAY ---
  "toy": { "chinese": "çŽ©å…·", "phonetic": "wÃ¡n jÃ¹", "category": "toys" },
  "ball": { "chinese": "çƒ", "phonetic": "qiÃº", "category": "toys" },
  "doll": { "chinese": "å¨ƒå¨ƒ", "phonetic": "wÃ¡ wa", "category": "toys" },
  "game": { "chinese": "æ¸¸æˆ", "phonetic": "yÃ³u xÃ¬", "category": "toys" },
  "play": { "chinese": "çŽ©", "phonetic": "wÃ¡n", "category": "toys" },
  "fun": { "chinese": "æœ‰è¶£", "phonetic": "yÇ’u qÃ¹", "category": "toys" },

  // --- 10. HOUSE ---
  "house": { "chinese": "æˆ¿å­", "phonetic": "fÃ¡ng zi", "category": "house" },
  "room": { "chinese": "æˆ¿é—´", "phonetic": "fÃ¡ng jiÄn", "category": "house" },
  "door": { "chinese": "é—¨", "phonetic": "mÃ©n", "category": "house" },
  "window": { "chinese": "çª—æˆ·", "phonetic": "chuÄng hu", "category": "house" },
  "bed": { "chinese": "åºŠ", "phonetic": "chuÃ¡ng", "category": "house" },
  "table": { "chinese": "æ¡Œå­", "phonetic": "zhuÅ zi", "category": "house" },
  "chair": { "chinese": "æ¤…å­", "phonetic": "yÇ zi", "category": "house" },
  "kitchen": { "chinese": "åŽ¨æˆ¿", "phonetic": "chÃº fÃ¡ng", "category": "house" },

  // --- 11. FOOD ---
  "bread": { "chinese": "é¢åŒ…", "phonetic": "miÃ n bÄo", "category": "food" },
  "milk": { "chinese": "ç‰›å¥¶", "phonetic": "niÃº nÇŽi", "category": "food" },
  "egg": { "chinese": "é¸¡è›‹", "phonetic": "jÄ« dÃ n", "category": "food" },
  "fruit": { "chinese": "æ°´æžœ", "phonetic": "shuÇ guÇ’", "category": "food" },
  "apple": { "chinese": "è‹¹æžœ", "phonetic": "pÃ­ng guÇ’", "category": "food" },
  "banana": { "chinese": "é¦™è•‰", "phonetic": "xiÄng jiÄo", "category": "food" },
  "juice": { "chinese": "æžœæ±", "phonetic": "guÇ’ zhÄ«", "category": "food" },
  "water": { "chinese": "æ°´", "phonetic": "shuÇ", "category": "food" },
  "breakfast": { "chinese": "æ—©é¤", "phonetic": "zÇŽo cÄn", "category": "food" },
  "lunch": { "chinese": "åˆé¤", "phonetic": "wÇ” cÄn", "category": "food" },
  "dinner": { "chinese": "æ™šé¤", "phonetic": "wÇŽn cÄn", "category": "food" },
  "cake": { "chinese": "è›‹ç³•", "phonetic": "dÃ n gÄo", "category": "food" },
  "candy": { "chinese": "ç³–æžœ", "phonetic": "tÃ¡ng guÇ’", "category": "food" },

  // --- 12. FARM ANIMALS ---
  "cow": { "chinese": "ç‰›", "phonetic": "niÃº", "category": "animals" },
  "sheep": { "chinese": "ç¾Š", "phonetic": "yÃ¡ng", "category": "animals" },
  "chicken": { "chinese": "é¸¡", "phonetic": "jÄ«", "category": "animals" },
  "horse": { "chinese": "é©¬", "phonetic": "mÇŽ", "category": "animals" },
  "goat": { "chinese": "å±±ç¾Š", "phonetic": "shÄn yÃ¡ng", "category": "animals" },
  "donkey": { "chinese": "é©´", "phonetic": "lÇ˜", "category": "animals" },
  "pig": { "chinese": "çŒª", "phonetic": "zhÅ«", "category": "animals" },

  // --- 13. PETS ---
  "dog": { "chinese": "ç‹—", "phonetic": "gÇ’u", "category": "animals" },
  "cat": { "chinese": "çŒ«", "phonetic": "mÄo", "category": "animals" },
  "bird": { "chinese": "é¸Ÿ", "phonetic": "niÇŽo", "category": "animals" },
  "fish": { "chinese": "é±¼", "phonetic": "yÃº", "category": "animals" },
  "rabbit": { "chinese": "å…”å­", "phonetic": "tÃ¹ zi", "category": "animals" },

  // --- 14. WILD ANIMALS ---
  "lion": { "chinese": "ç‹®å­", "phonetic": "shÄ« zi", "category": "animals" },
  "elephant": { "chinese": "å¤§è±¡", "phonetic": "dÃ  xiÃ ng", "category": "animals" },
  "giraffe": { "chinese": "é•¿é¢ˆé¹¿", "phonetic": "chÃ¡ng jÇng lÃ¹", "category": "animals" },
  "monkey": { "chinese": "çŒ´å­", "phonetic": "hÃ³u zi", "category": "animals" },
  "zebra": { "chinese": "æ–‘é©¬", "phonetic": "bÄn mÇŽ", "category": "animals" },

  // --- 15. INSECTS ---
  "butterfly": { "chinese": "è´è¶", "phonetic": "hÃº diÃ©", "category": "animals" },
  "bee": { "chinese": "èœœèœ‚", "phonetic": "mÃ¬ fÄ“ng", "category": "animals" },
  "spider": { "chinese": "èœ˜è››", "phonetic": "zhÄ« zhÅ«", "category": "animals" },

  // --- 16. NATURE & WEATHER ---
  "rain": { "chinese": "é›¨", "phonetic": "yÇ”", "category": "nature" },
  "cloud": { "chinese": "äº‘", "phonetic": "yÃºn", "category": "nature" },
  "mountain": { "chinese": "å±±", "phonetic": "shÄn", "category": "nature" },
  "water": { "chinese": "æ°´", "phonetic": "shuÇ", "category": "nature" },
  "sun": { "chinese": "å¤ªé˜³", "phonetic": "tÃ i yÃ¡ng", "category": "nature" },
  "moon": { "chinese": "æœˆäº®", "phonetic": "yuÃ¨ liang", "category": "nature" },
  "tree": { "chinese": "æ ‘", "phonetic": "shÃ¹", "category": "nature" },
  "flower": { "chinese": "èŠ±", "phonetic": "huÄ", "category": "nature" },
  "world": { "chinese": "ä¸–ç•Œ", "phonetic": "shÃ¬ jiÃ¨", "category": "nature" },
  "star": { "chinese": "æ˜Ÿæ˜Ÿ", "phonetic": "xÄ«ng xing", "category": "nature" },
  "sky": { "chinese": "å¤©ç©º", "phonetic": "tiÄn kÅng", "category": "nature" },
  "river": { "chinese": "æ²³", "phonetic": "hÃ©", "category": "nature" },
  "lake": { "chinese": "æ¹–", "phonetic": "hÃº", "category": "nature" },
  "sea": { "chinese": "æµ·", "phonetic": "hÇŽi", "category": "nature" },
  "wind": { "chinese": "é£Ž", "phonetic": "fÄ“ng", "category": "nature" },
  "snow": { "chinese": "é›ª", "phonetic": "xuÄ›", "category": "nature" },

  // --- 17. TIME ---
  "day": { "chinese": "å¤©", "phonetic": "tiÄn", "category": "time" },
  "night": { "chinese": "æ™šä¸Š", "phonetic": "wÇŽn shang", "category": "time" },
  "morning": { "chinese": "æ—©ä¸Š", "phonetic": "zÇŽo shang", "category": "time" },
  "afternoon": { "chinese": "ä¸‹åˆ", "phonetic": "xiÃ  wÇ”", "category": "time" },
  "evening": { "chinese": "å‚æ™š", "phonetic": "bÃ ng wÇŽn", "category": "time" },
  "today": { "chinese": "ä»Šå¤©", "phonetic": "jÄ«n tiÄn", "category": "time" },
  "tomorrow": { "chinese": "æ˜Žå¤©", "phonetic": "mÃ­ng tiÄn", "category": "time" },
  "yesterday": { "chinese": "æ˜¨å¤©", "phonetic": "zuÃ³ tiÄn", "category": "time" },

  // --- 18. SEASONS ---
  "summer": { "chinese": "å¤å¤©", "phonetic": "xiÃ  tiÄn", "category": "seasons" },
  "winter": { "chinese": "å†¬å¤©", "phonetic": "dÅng tiÄn", "category": "seasons" },
  "spring": { "chinese": "æ˜¥å¤©", "phonetic": "chÅ«n tiÄn", "category": "seasons" },
  "autumn": { "chinese": "ç§‹å¤©", "phonetic": "qiÅ« tiÄn", "category": "seasons" },

  // --- 19. TRANSPORT ---
  "car": { "chinese": "æ±½è½¦", "phonetic": "qÃ¬ chÄ“", "category": "transport" },
  "airplane": { "chinese": "é£žæœº", "phonetic": "fÄ“i jÄ«", "category": "transport" },
  "bicycle": { "chinese": "è‡ªè¡Œè½¦", "phonetic": "zÃ¬ xÃ­ng chÄ“", "category": "transport" },
  "bus": { "chinese": "å…¬äº¤è½¦", "phonetic": "gÅng jiÄo chÄ“", "category": "transport" },
  "train": { "chinese": "ç«è½¦", "phonetic": "huÇ’ chÄ“", "category": "transport" },
  "boat": { "chinese": "èˆ¹", "phonetic": "chuÃ¡n", "category": "transport" },
  "truck": { "chinese": "å¡è½¦", "phonetic": "kÇŽ chÄ“", "category": "transport" },

  // --- 20. PLACES ---
  "park": { "chinese": "å…¬å›­", "phonetic": "gÅng yuÃ¡n", "category": "places" },
  "store": { "chinese": "å•†åº—", "phonetic": "shÄng diÃ n", "category": "places" },
  "hospital": { "chinese": "åŒ»é™¢", "phonetic": "yÄ« yuÃ n", "category": "places" },
  "church": { "chinese": "æ•™å ‚", "phonetic": "jiÃ o tÃ¡ng", "category": "places" },
  "zoo": { "chinese": "åŠ¨ç‰©å›­", "phonetic": "dÃ²ng wÃ¹ yuÃ¡n", "category": "places" },

  // --- 21. MUSIC ---
  "music": { "chinese": "éŸ³ä¹", "phonetic": "yÄ«n yuÃ¨", "category": "music" },
  "song": { "chinese": "æ­Œæ›²", "phonetic": "gÄ“ qÇ”", "category": "music" },
  "dance": { "chinese": "è·³èˆž", "phonetic": "tiÃ o wÇ”", "category": "music" },
  "sing": { "chinese": "å”±æ­Œ", "phonetic": "chÃ ng gÄ“", "category": "music" },

  // --- 22. ACTION VERBS ---
  "eat": { "chinese": "åƒ", "phonetic": "chÄ«", "category": "actions" },
  "drink": { "chinese": "å–", "phonetic": "hÄ“", "category": "actions" },
  "sleep": { "chinese": "ç¡è§‰", "phonetic": "shuÃ¬ jiÃ o", "category": "actions" },
  "run": { "chinese": "è·‘", "phonetic": "pÇŽo", "category": "actions" },
  "jump": { "chinese": "è·³", "phonetic": "tiÃ o", "category": "actions" },
  "walk": { "chinese": "èµ°", "phonetic": "zÇ’u", "category": "actions" },
  "talk": { "chinese": "è¯´è¯", "phonetic": "shuÅ huÃ ", "category": "actions" },
  "listen": { "chinese": "å¬", "phonetic": "tÄ«ng", "category": "actions" },
  "see": { "chinese": "çœ‹", "phonetic": "kÃ n", "category": "actions" },
  "touch": { "chinese": "æ‘¸", "phonetic": "mÅ", "category": "actions" },
  "hold": { "chinese": "æ‹¿", "phonetic": "nÃ¡", "category": "actions" },
  "give": { "chinese": "ç»™", "phonetic": "gÄ›i", "category": "actions" },
  "take": { "chinese": "æ‹¿", "phonetic": "nÃ¡", "category": "actions" },

  // --- 23. OBJECTS ---
  "computer": { "chinese": "ç”µè„‘", "phonetic": "diÃ n nÇŽo", "category": "objects" },
  "book": { "chinese": "ä¹¦", "phonetic": "shÅ«", "category": "objects" },
  "phone": { "chinese": "ç”µè¯", "phonetic": "diÃ n huÃ ", "category": "objects" },
  "key": { "chinese": "é’¥åŒ™", "phonetic": "yÃ o shi", "category": "objects" },
  "money": { "chinese": "é’±", "phonetic": "qiÃ¡n", "category": "objects" },
  "clock": { "chinese": "é’Ÿ", "phonetic": "zhÅng", "category": "objects" },
  "light": { "chinese": "å…‰", "phonetic": "guÄng", "category": "objects" },
  "bag": { "chinese": "åŒ…", "phonetic": "bÄo", "category": "objects" },

  // --- 24. SHAPES ---
  "circle": { "chinese": "åœ†å½¢", "phonetic": "yuÃ¡n xÃ­ng", "category": "shapes" },
  "square": { "chinese": "æ–¹å½¢", "phonetic": "fÄng xÃ­ng", "category": "shapes" },
  "triangle": { "chinese": "ä¸‰è§’å½¢", "phonetic": "sÄn jiÇŽo xÃ­ng", "category": "shapes" },
  "heart": { "chinese": "å¿ƒå½¢", "phonetic": "xÄ«n xÃ­ng", "category": "shapes" },

  // --- 25. HOLIDAYS & CELEBRATIONS ---
  "birthday": { "chinese": "ç”Ÿæ—¥", "phonetic": "shÄ“ng rÃ¬", "category": "holidays" },
  "gift": { "chinese": "ç¤¼ç‰©", "phonetic": "lÇ wÃ¹", "category": "holidays" },
  "party": { "chinese": "æ´¾å¯¹", "phonetic": "pÃ i duÃ¬", "category": "holidays" },
  "Christmas": { "chinese": "åœ£è¯žèŠ‚", "phonetic": "shÃ¨ng dÃ n jiÃ©", "category": "holidays" },

  // --- 26. MILITARY TERMS ---
  "war": { "chinese": "æˆ˜äº‰", "phonetic": "zhÃ n zhÄ“ng", "category": "military" },
  "peace": { "chinese": "å’Œå¹³", "phonetic": "hÃ© pÃ­ng", "category": "military" },
  "soldier": { "chinese": "å£«å…µ", "phonetic": "shÃ¬ bÄ«ng", "category": "military" },
  "army": { "chinese": "å†›é˜Ÿ", "phonetic": "jÅ«n duÃ¬", "category": "military" },
  "battle": { "chinese": "æˆ˜æ–—", "phonetic": "zhÃ n dÃ²u", "category": "military" },
  "gun": { "chinese": "æžª", "phonetic": "qiÄng", "category": "weapons" },
  "weapon": { "chinese": "æ­¦å™¨", "phonetic": "wÇ” qÃ¬", "category": "weapons" },
  "knife": { "chinese": "åˆ€", "phonetic": "dÄo", "category": "weapons" },
  "sword": { "chinese": "å‰‘", "phonetic": "jiÃ n", "category": "weapons" },
  "shield": { "chinese": "ç›¾", "phonetic": "dÃ¹n", "category": "weapons" },
  "attack": { "chinese": "æ”»å‡»", "phonetic": "gÅng jÄ«", "category": "actions" },
  "defend": { "chinese": "é˜²å¾¡", "phonetic": "fÃ¡ng yÃ¹", "category": "actions" },
  "fight": { "chinese": "æˆ˜æ–—", "phonetic": "zhÃ n dÃ²u", "category": "actions" },
  "protect": { "chinese": "ä¿æŠ¤", "phonetic": "bÇŽo hÃ¹", "category": "actions" },
  "retreat": { "chinese": "æ’¤é€€", "phonetic": "chÃ¨ tuÃ¬", "category": "actions" },
  "camp": { "chinese": "è¥åœ°", "phonetic": "yÃ­ng dÃ¬", "category": "places" },
  "enemy": { "chinese": "æ•Œäºº", "phonetic": "dÃ­ rÃ©n", "category": "people" },
  "ally": { "chinese": "ç›Ÿå‹", "phonetic": "mÃ©ng yÇ’u", "category": "people" },
  "front line": { "chinese": "å‰çº¿", "phonetic": "qiÃ¡n xiÃ n", "category": "places" },
  "wound": { "chinese": "ä¼¤å£", "phonetic": "shÄng kÇ’u", "category": "medical" },
  "death": { "chinese": "æ­»äº¡", "phonetic": "sÇ wÃ¡ng", "category": "medical" },
  "capture": { "chinese": "ä¿˜è™", "phonetic": "fÃº lÇ”", "category": "actions" },
  "victory": { "chinese": "èƒœåˆ©", "phonetic": "shÃ¨ng lÃ¬", "category": "outcomes" },
  "defeat": { "chinese": "å¤±è´¥", "phonetic": "shÄ« bÃ i", "category": "outcomes" },
  "warrior": { "chinese": "æˆ˜å£«", "phonetic": "zhÃ n shÃ¬", "category": "people" },
  "bravery": { "chinese": "å‹‡æ•¢", "phonetic": "yÇ’ng gÇŽn", "category": "qualities" },
  "strategy": { "chinese": "æˆ˜ç•¥", "phonetic": "zhÃ n lÃ¼Ã¨", "category": "tactics" },
  "courage": { "chinese": "å‹‡æ°”", "phonetic": "yÇ’ng qÃ¬", "category": "qualities" },
  "tank": { "chinese": "å¦å…‹", "phonetic": "tÇŽn kÃ¨", "category": "vehicles" },
  "helicopter": { "chinese": "ç›´å‡æœº", "phonetic": "zhÃ­ shÄ“ng jÄ«", "category": "vehicles" },
  "uniform": { "chinese": "åˆ¶æœ", "phonetic": "zhÃ¬ fÃº", "category": "equipment" },
  "commander": { "chinese": "æŒ‡æŒ¥å®˜", "phonetic": "zhÇ huÄ« guÄn", "category": "people" },
  "invasion": { "chinese": "å…¥ä¾µ", "phonetic": "rÃ¹ qÄ«n", "category": "actions" },
  "resistance": { "chinese": "æŠµæŠ—", "phonetic": "dÇ kÃ ng", "category": "actions" },
  "occupation": { "chinese": "å é¢†", "phonetic": "zhÃ n lÇng", "category": "political" },
  "ceasefire": { "chinese": "åœç«", "phonetic": "tÃ­ng huÇ’", "category": "military" },
  "revolution": { "chinese": "é©å‘½", "phonetic": "gÃ© mÃ¬ng", "category": "political" },
  "liberation": { "chinese": "è§£æ”¾", "phonetic": "jiÄ› fÃ ng", "category": "political" },
  "independence": { "chinese": "ç‹¬ç«‹", "phonetic": "dÃº lÃ¬", "category": "political" },
  "surrender": { "chinese": "æŠ•é™", "phonetic": "tÃ³u xiÃ¡ng", "category": "actions" }
};

// UI translations for the Chinese learning interface
const ui = {
  pageTitle: "ä¸­æ–‡å­¦ä¹ ",
  selectCategory: "é€‰æ‹©ç±»åˆ«",
  playAudio: "æ’­æ”¾éŸ³é¢‘",
  stopAudio: "åœæ­¢",
  nextPhrase: "ä¸‹ä¸€ä¸ªçŸ­è¯­",
  previousPhrase: "ä¸Šä¸€ä¸ªçŸ­è¯­",
  shuffle: "éšæœºæ’­æ”¾",
  repeat: "é‡å¤",
  progress: "è¿›åº¦"
};

module.exports = { translations, ui };
