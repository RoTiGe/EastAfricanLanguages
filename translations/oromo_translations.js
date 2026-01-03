const translations = {
// ...existing code...

  // --- 1. BASICS & GREETINGS ---
  "hello": { "oromo": "Akkam", "phonetic": "ak-kam", "category": "basics" },
  "goodbye": { "oromo": "Nagaatti", "phonetic": "na-gaat-ti", "category": "basics" },
  "thank you": { "oromo": "Galatoomi", "phonetic": "ga-la-too-mi", "category": "basics" },
  "please": { "oromo": "Mee", "phonetic": "mee", "category": "basics" },
  "sorry": { "oromo": "Dhiifama", "phonetic": "dhee-fa-ma", "category": "basics" },
  "yes": { "oromo": "Eeyyee", "phonetic": "ey-yee", "category": "basics" },
  "no": { "oromo": "Lakki", "phonetic": "lak-ki", "category": "basics" },
  "okay": { "oromo": "Tole", "phonetic": "to-le", "category": "basics" },
  "excuse me": { "oromo": "Dhiifama", "phonetic": "dhee-fa-ma", "category": "basics" },
  "welcome": { "oromo": "Baga nagaan dhufte", "phonetic": "ba-ga na-gaan dhuft-e", "category": "basics" },

  // --- 2. FAMILY ---
  "mother": { "oromo": "Haadha", "phonetic": "haa-dha", "category": "family" },
  "father": { "oromo": "Abaa", "phonetic": "a-baa", "category": "family" },
  "baby": { "oromo": "Da'a", "phonetic": "da-a", "category": "family" },
  "sister": { "oromo": "Obboleettii", "phonetic": "ob-bo-leet-tii", "category": "family" },
  "brother": { "oromo": "Obboleessa", "phonetic": "ob-bo-lees-sa", "category": "family" },
  "uncle": { "oromo": "Eessuma", "phonetic": "ees-su-ma", "category": "family" },
  "aunt": { "oromo": "Adaadaa", "phonetic": "a-daa-daa", "category": "family" },
  "grandmother": { "oromo": "Akkokko", "phonetic": "ak-kok-ko", "category": "family" },
  "grandfather": { "oromo": "Akaakayyuu", "phonetic": "a-kaa-kay-yuu", "category": "family" },
  "cousin": { "oromo": "Ilma eessumaa", "phonetic": "il-ma ees-su-maa", "category": "family" },
  "family": { "oromo": "Maatii", "phonetic": "maa-tii", "category": "family" },
  "child": { "oromo": "Da'a", "phonetic": "da-a", "category": "family" },
  "children": { "oromo": "Da'oota", "phonetic": "da-oo-ta", "category": "family" },

  // --- 3. PEOPLE ---
  "friend": { "oromo": "Hiriyaa", "phonetic": "hi-ri-yaa", "category": "people" },
  "teacher": { "oromo": "Barsiisaa", "phonetic": "bar-siis-saa", "category": "people" },
  "doctor": { "oromo": "Doktara", "phonetic": "dok-ta-ra", "category": "people" },
  "student": { "oromo": "Barataa", "phonetic": "ba-ra-taa", "category": "people" },

  // --- 4. BODY PARTS ---
  "head": { "oromo": "Mataa", "phonetic": "ma-taa", "category": "body" },
  "eyes": { "oromo": "Ija", "phonetic": "i-ja", "category": "body" },
  "nose": { "oromo": "Funyaan", "phonetic": "fun-yaan", "category": "body" },
  "mouth": { "oromo": "Afaan", "phonetic": "a-faan", "category": "body" },
  "hands": { "oromo": "Harka", "phonetic": "har-ka", "category": "body" },
  "ears": { "oromo": "Gurra", "phonetic": "gur-ra", "category": "body" },
  "hair": { "oromo": "Rifeensa", "phonetic": "ri-feens-sa", "category": "body" },
  "teeth": { "oromo": "Ilkaan", "phonetic": "il-kaan", "category": "body" },
  "feet": { "oromo": "Miila", "phonetic": "mii-la", "category": "body" },
  "fingers": { "oromo": "Quba", "phonetic": "qu-ba", "category": "body" },
  "stomach": { "oromo": "Garaacha", "phonetic": "ga-raa-cha", "category": "body" },
  "heart": { "oromo": "Onnee", "phonetic": "on-nee", "category": "body" },

  // --- 5. CLOTHING ---
  "shirt": { "oromo": "Hamacca", "phonetic": "ha-mac-ca", "category": "clothing" },
  "shoes": { "oromo": "Kobxii", "phonetic": "kob-xii", "category": "clothing" },
  "hat": { "oromo": "Faaruu", "phonetic": "faa-ruu", "category": "clothing" },
  "pants": { "oromo": "Surree", "phonetic": "sur-ree", "category": "clothing" },
  "dress": { "oromo": "Diresii", "phonetic": "di-re-sii", "category": "clothing" },
  "socks": { "oromo": "Sokisii", "phonetic": "so-ki-sii", "category": "clothing" },
  "coat": { "oromo": "Koochii", "phonetic": "koo-chii", "category": "clothing" },
  "gloves": { "oromo": "Gulufii", "phonetic": "gu-lu-fii", "category": "clothing" },

  // --- 6. COLORS ---
  "red": { "oromo": "Diimaa", "phonetic": "dii-maa", "category": "colors" },
  "blue": { "oromo": "Doogii", "phonetic": "doo-gii", "category": "colors" },
  "yellow": { "oromo": "Kelloo", "phonetic": "kel-loo", "category": "colors" },
  "green": { "oromo": "Magariisa", "phonetic": "ma-ga-rii-sa", "category": "colors" },
  "orange": { "oromo": "Burtukaanaa", "phonetic": "bur-tu-kaa-naa", "category": "colors" },
  "purple": { "oromo": "Bisiniilaa", "phonetic": "bi-si-nii-laa", "category": "colors" },
  "pink": { "oromo": "Roozii", "phonetic": "roo-zii", "category": "colors" },
  "brown": { "oromo": "Bunaawaa", "phonetic": "bu-naa-waa", "category": "colors" },
  "black": { "oromo": "Gurraacha", "phonetic": "gur-raa-cha", "category": "colors" },
  "white": { "oromo": "Adii", "phonetic": "a-dii", "category": "colors" },
  "rainbow": { "oromo": "Simbiraa bokkaa", "phonetic": "sim-bi-raa bok-kaa", "category": "colors" },

  // --- 7. NUMBERS ---
  "one": { "oromo": "Tokko", "phonetic": "tok-ko", "category": "numbers" },
  "two": { "oromo": "Lama", "phonetic": "la-ma", "category": "numbers" },
  "three": { "oromo": "Sadi", "phonetic": "sa-di", "category": "numbers" },
  "four": { "oromo": "Afur", "phonetic": "a-fur", "category": "numbers" },
  "five": { "oromo": "Shan", "phonetic": "shan", "category": "numbers" },
  "six": { "oromo": "Jaha", "phonetic": "ja-ha", "category": "numbers" },
  "seven": { "oromo": "Torba", "phonetic": "tor-ba", "category": "numbers" },
  "eight": { "oromo": "Saddeet", "phonetic": "sad-deet", "category": "numbers" },
  "nine": { "oromo": "Sagal", "phonetic": "sa-gal", "category": "numbers" },
  "ten": { "oromo": "Kudhan", "phonetic": "kud-han", "category": "numbers" },
  "zero": { "oromo": "Zeeroo", "phonetic": "zee-roo", "category": "numbers" },

  // --- 8. EMOTIONS ---
  "happy": { "oromo": "Gammadaa", "phonetic": "gam-ma-daa", "category": "emotions" },
  "sad": { "oromo": "Yaaddoo", "phonetic": "yaad-doo", "category": "emotions" },
  "angry": { "oromo": "Aarii", "phonetic": "aa-rii", "category": "emotions" },
  "scared": { "oromo": "Sodaa", "phonetic": "so-daa", "category": "emotions" },
  "surprised": { "oromo": "Dinquu", "phonetic": "din-quu", "category": "emotions" },
  "excited": { "oromo": "Bareedaa", "phonetic": "ba-ree-daa", "category": "emotions" },
  "tired": { "oromo": "Ga'ee", "phonetic": "ga-ee", "category": "emotions" },

  // --- 9. SCHOOL ---
  "school": { "oromo": "Mana barumsaa", "phonetic": "ma-na ba-rum-saa", "category": "school" },
  "pencil": { "oromo": "Qalama", "phonetic": "qa-la-ma", "category": "school" },
  "paper": { "oromo": "Xalayaa", "phonetic": "xa-la-yaa", "category": "school" },
  "draw": { "oromo": "Fakkasuu", "phonetic": "fak-ka-suu", "category": "school" },
  "write": { "oromo": "Barreessuu", "phonetic": "bar-rees-suu", "category": "school" },
  "read": { "oromo": "Dubbisuu", "phonetic": "dub-bi-suu", "category": "school" },
  "learn": { "oromo": "Baruu", "phonetic": "ba-ruu", "category": "school" },

  // --- 10. TOYS & PLAY ---
  "toy": { "oromo": "Meeshaa taphaa", "phonetic": "mee-shaa tap-haa", "category": "toys" },
  "ball": { "oromo": "Kubbaa", "phonetic": "kub-baa", "category": "toys" },
  "doll": { "oromo": "Qalamaa", "phonetic": "qa-la-maa", "category": "toys" },
  "game": { "oromo": "Tapha", "phonetic": "tap-ha", "category": "toys" },
  "play": { "oromo": "Taphachuu", "phonetic": "tap-ha-chuu", "category": "toys" },
  "fun": { "oromo": "Gammachuu", "phonetic": "gam-ma-chuu", "category": "toys" },

  // --- 11. HOUSE ---
  "house": { "oromo": "Mana", "phonetic": "ma-na", "category": "house" },
  "room": { "oromo": "Kutaa", "phonetic": "ku-taa", "category": "house" },
  "door": { "oromo": "Balbala", "phonetic": "bal-ba-la", "category": "house" },
  "window": { "oromo": "Fadensa", "phonetic": "fa-den-sa", "category": "house" },
  "bed": { "oromo": "Siree", "phonetic": "si-ree", "category": "house" },
  "table": { "oromo": "Miseensa", "phonetic": "mi-seens-sa", "category": "house" },
  "chair": { "oromo": "Barcumaa", "phonetic": "bar-cu-maa", "category": "house" },
  "kitchen": { "oromo": "Mana nyaataa", "phonetic": "ma-na nyaa-taa", "category": "house" },

  // --- 12. FOOD ---
  "bread": { "oromo": "Daabboo", "phonetic": "daab-boo", "category": "food" },
  "milk": { "oromo": "Anaan", "phonetic": "a-naan", "category": "food" },
  "egg": { "oromo": "Hanqaaquu", "phonetic": "han-qa-a-quu", "category": "food" },
  "fruit": { "oromo": "Fuduraa", "phonetic": "fu-du-raa", "category": "food" },
  "apple": { "oromo": "Aapilii", "phonetic": "aa-pi-lii", "category": "food" },
  "banana": { "oromo": "Muuzii", "phonetic": "muu-zii", "category": "food" },
  "juice": { "oromo": "Juusii", "phonetic": "juu-sii", "category": "food" },
  "water": { "oromo": "Bishaan", "phonetic": "bish-aan", "category": "food" },
  "breakfast": { "oromo": "Ciree", "phonetic": "ci-ree", "category": "food" },
  "lunch": { "oromo": "Waraabessaa", "phonetic": "wa-raa-bes-saa", "category": "food" },
  "dinner": { "oromo": "Dhaabata", "phonetic": "dhaa-ba-ta", "category": "food" },
  "cake": { "oromo": "Keekii", "phonetic": "kee-kii", "category": "food" },
  "candy": { "oromo": "Sukaraa", "phonetic": "su-ka-raa", "category": "food" },

  // --- 13. ANIMALS (FARM) ---
  "cow": { "oromo": "Sa'a", "phonetic": "sa-a", "category": "animals" },
  "sheep": { "oromo": "Hoolaa", "phonetic": "hoo-laa", "category": "animals" },
  "chicken": { "oromo": "Lukkuu", "phonetic": "luk-kuu", "category": "animals" },
  "horse": { "oromo": "Farda", "phonetic": "far-da", "category": "animals" },
  "goat": { "oromo": "Re'ee", "phonetic": "re-ee", "category": "animals" },
  "donkey": { "oromo": "Harree", "phonetic": "har-ree", "category": "animals" },
  "pig": { "oromo": "Booyyee", "phonetic": "booy-yee", "category": "animals" },

  // --- 14. PETS ---
  "dog": { "oromo": "Saree", "phonetic": "sa-ree", "category": "animals" },
  "cat": { "oromo": "Adurree", "phonetic": "a-dur-ree", "category": "animals" },
  "bird": { "oromo": "Simbirroo", "phonetic": "sim-bir-roo", "category": "animals" },
  "fish": { "oromo": "Qurxummii", "phonetic": "qur-xum-mii", "category": "animals" },
  "rabbit": { "oromo": "Haree", "phonetic": "ha-ree", "category": "animals" },

  // --- 15. WILD ANIMALS ---
  "lion": { "oromo": "Leenca", "phonetic": "leen-ca", "category": "animals" },
  "elephant": { "oromo": "Arba", "phonetic": "ar-ba", "category": "animals" },
  "giraffe": { "oromo": "Sigaalaa", "phonetic": "si-gaa-laa", "category": "animals" },
  "monkey": { "oromo": "Jaldeessa", "phonetic": "jal-dees-sa", "category": "animals" },
  "zebra": { "oromo": "Zebiraa", "phonetic": "ze-bi-raa", "category": "animals" },

  // --- 16. INSECTS ---
  "butterfly": { "oromo": "Bilbilaa", "phonetic": "bil-bi-laa", "category": "animals" },
  "bee": { "oromo": "Kannisa", "phonetic": "kan-ni-sa", "category": "animals" },
  "spider": { "oromo": "Sarmuu", "phonetic": "sar-muu", "category": "animals" },

  // --- 17. NATURE ---
  "rain": { "oromo": "Rooba", "phonetic": "roo-ba", "category": "nature" },
  "cloud": { "oromo": "Duumessa", "phonetic": "duu-mes-sa", "category": "nature" },
  "mountain": { "oromo": "Tulluu", "phonetic": "tul-luu", "category": "nature" },
  "water": { "oromo": "Bishaan", "phonetic": "bish-aan", "category": "nature" },
  "sun": { "oromo": "Biiftuu", "phonetic": "biif-tuu", "category": "nature" },
  "moon": { "oromo": "Ji'a", "phonetic": "ji-a", "category": "nature" },
  "tree": { "oromo": "Muka", "phonetic": "mu-ka", "category": "nature" },
  "flower": { "oromo": "Ababaa", "phonetic": "a-ba-baa", "category": "nature" },
  "world": { "oromo": "Aduu", "phonetic": "a-duu", "category": "nature" },
  "star": { "oromo": "Urjii", "phonetic": "ur-jii", "category": "nature" },
  "sky": { "oromo": "Waaqa", "phonetic": "waa-qa", "category": "nature" },
  "river": { "oromo": "Laga", "phonetic": "la-ga", "category": "nature" },
  "lake": { "oromo": "Haroo", "phonetic": "ha-roo", "category": "nature" },
  "sea": { "oromo": "Galaana", "phonetic": "ga-laa-na", "category": "nature" },
  "wind": { "oromo": "Bubbee", "phonetic": "bub-bee", "category": "nature" },
  "snow": { "oromo": "Rooba ciciyaa", "phonetic": "roo-ba ci-ci-yaa", "category": "nature" },

  // --- 18. TIME ---
  "day": { "oromo": "Guyyaa", "phonetic": "guy-yaa", "category": "time" },
  "night": { "oromo": "Halkan", "phonetic": "hal-kan", "category": "time" },
  "morning": { "oromo": "Ganama", "phonetic": "ga-na-ma", "category": "time" },
  "afternoon": { "oromo": "Waaree booda", "phonetic": "waa-ree boo-da", "category": "time" },
  "evening": { "oromo": "Galgalama", "phonetic": "gal-ga-la-ma", "category": "time" },
  "today": { "oromo": "Har'a", "phonetic": "har-a", "category": "time" },
  "tomorrow": { "oromo": "Boru", "phonetic": "bo-ru", "category": "time" },
  "yesterday": { "oromo": "Kaleessa", "phonetic": "ka-lees-sa", "category": "time" },

  // --- 19. SEASONS ---
  "summer": { "oromo": "Bona", "phonetic": "bo-na", "category": "seasons" },
  "winter": { "oromo": "Ganna", "phonetic": "gan-na", "category": "seasons" },
  "spring": { "oromo": "Arfaasaa", "phonetic": "ar-faa-saa", "category": "seasons" },
  "autumn": { "oromo": "Birraa", "phonetic": "bir-raa", "category": "seasons" },

  // --- 20. TRANSPORT ---
  "car": { "oromo": "Makiinaa", "phonetic": "ma-kii-naa", "category": "transport" },
  "airplane": { "oromo": "Xiyyaara", "phonetic": "xiy-yaa-ra", "category": "transport" },
  "bicycle": { "oromo": "Baaskiilii", "phonetic": "baas-kii-lii", "category": "transport" },
  "bus": { "oromo": "Baasi", "phonetic": "baa-si", "category": "transport" },
  "train": { "oromo": "Tireenii", "phonetic": "ti-ree-nii", "category": "transport" },
  "boat": { "oromo": "Doonii", "phonetic": "doo-nii", "category": "transport" },
  "truck": { "oromo": "Tarakii", "phonetic": "ta-ra-kii", "category": "transport" },

  // --- 21. PLACES ---
  "park": { "oromo": "Paarkii", "phonetic": "paar-kii", "category": "places" },
  "store": { "oromo": "Maallaqaa", "phonetic": "maal-la-qaa", "category": "places" },
  "hospital": { "oromo": "Ospitaala", "phonetic": "os-pi-taa-la", "category": "places" },
  "church": { "oromo": "Mana hayyootaa", "phonetic": "ma-na hay-yoo-taa", "category": "places" },
  "zoo": { "oromo": "Mana beyladaa", "phonetic": "ma-na bey-la-daa", "category": "places" },

  // --- 22. MUSIC ---
  "music": { "oromo": "Muuziqaa", "phonetic": "muu-zi-qaa", "category": "music" },
  "song": { "oromo": "Weellisa", "phonetic": "weel-li-sa", "category": "music" },
  "dance": { "oromo": "Shaggyyee", "phonetic": "shag-gyyee", "category": "music" },
  "sing": { "oromo": "Weellisuu", "phonetic": "weel-li-suu", "category": "music" },

  // --- 23. ACTIONS ---
  "eat": { "oromo": "Nyachuu", "phonetic": "nya-chuu", "category": "actions" },
  "drink": { "oromo": "Dhuguu", "phonetic": "dhu-guu", "category": "actions" },
  "sleep": { "oromo": "Rafuu", "phonetic": "ra-fuu", "category": "actions" },
  "run": { "oromo": "Fiiguu", "phonetic": "fii-guu", "category": "actions" },
  "jump": { "oromo": "Dhaabbachuu", "phonetic": "dhaab-ba-chuu", "category": "actions" },
  "walk": { "oromo": "Dee'imuu", "phonetic": "dee-i-muu", "category": "actions" },
  "talk": { "oromo": "Haasawuu", "phonetic": "haa-sa-wuu", "category": "actions" },
  "listen": { "oromo": "Dhageeffachuu", "phonetic": "dha-geef-fa-chuu", "category": "actions" },
  "see": { "oromo": "Ilaaluu", "phonetic": "i-laa-luu", "category": "actions" },
  "touch": { "oromo": "Tuquu", "phonetic": "tu-quu", "category": "actions" },
  "hold": { "oromo": "Qabuu", "phonetic": "qa-buu", "category": "actions" },
  "give": { "oromo": "Kennuu", "phonetic": "ken-nuu", "category": "actions" },
  "take": { "oromo": "Fuudhuu", "phonetic": "fuud-huu", "category": "actions" },

  // --- 24. OBJECTS ---
  "computer": { "oromo": "Kompiitaraa", "phonetic": "kom-pii-ta-raa", "category": "objects" },
  "book": { "oromo": "Kitaaba", "phonetic": "ki-taa-ba", "category": "objects" },
  "phone": { "oromo": "Bilbila", "phonetic": "bil-bi-la", "category": "objects" },
  "key": { "oromo": "Funyaan", "phonetic": "fun-yaan", "category": "objects" },
  "money": { "oromo": "Qarshii", "phonetic": "qar-shii", "category": "objects" },
  "clock": { "oromo": "Sa'aatii", "phonetic": "sa-aa-tii", "category": "objects" },
  "light": { "oromo": "Ifaa", "phonetic": "i-faa", "category": "objects" },
  "bag": { "oromo": "Shakilla", "phonetic": "sha-kil-la", "category": "objects" },

  // --- 25. SHAPES ---
  "circle": { "oromo": "Gola", "phonetic": "go-la", "category": "shapes" },
  "square": { "oromo": "Kaabaa", "phonetic": "kaa-baa", "category": "shapes" },
  "triangle": { "oromo": "Sadeen", "phonetic": "sa-deen", "category": "shapes" },
  "heart": { "oromo": "Onnee", "phonetic": "on-nee", "category": "shapes" },

  // --- 26. HOLIDAYS ---
  "birthday": { "oromo": "Guyyaa dhalootaa", "phonetic": "guy-yaa dha-loo-taa", "category": "holidays" },
  "gift": { "oromo": "Kennaa", "phonetic": "ken-naa", "category": "holidays" },
  "party": { "oromo": "Poolisii", "phonetic": "poo-li-sii", "category": "holidays" },
  "Christmas": { "oromo": "Ayyaana Geezii", "phonetic": "ay-yaa-na gee-zii", "category": "holidays" },

  // --- 27. BATHROOM ---
  "bath": { "oromo": "Dhiignuu", "phonetic": "dhiig-nuu", "category": "house" },
  "soap": { "oromo": "Saqiiqqii", "phonetic": "sa-qiiq-qii", "category": "house" },
  "toothbrush": { "oromo": "Boorsaa ilkaa", "phonetic": "boor-saa il-kaa", "category": "house" },

  // --- 28. WEATHER ---
  "hot": { "oromo": "Ho'aa", "phonetic": "ho-aa", "category": "weather" },
  "cold": { "oromo": "Qabaa", "phonetic": "qa-baa", "category": "weather" },
  "sunny": { "oromo": "Biiftuu", "phonetic": "biif-tuu", "category": "weather" },

  // --- 29. QUESTIONS ---
  "what": { "oromo": "Maal", "phonetic": "maal", "category": "basics" },
  "where": { "oromo": "Eessa", "phonetic": "ees-sa", "category": "basics" },
  "when": { "oromo": "Yoom", "phonetic": "yoom", "category": "basics" },
  "why": { "oromo": "Maaliif", "phonetic": "maa-liif", "category": "basics" },
  "how": { "oromo": "Akkam", "phonetic": "ak-kam", "category": "basics" },

  // --- 30. DESCRIPTIVE WORDS ---
  "big": { "oromo": "Guddaa", "phonetic": "gud-daa", "category": "descriptive" },
  "small": { "oromo": "Xiqqaa", "phonetic": "xiq-qaa", "category": "descriptive" },
  "fast": { "oromo": "Saffisa", "phonetic": "saf-fi-sa", "category": "descriptive" },
  "slow": { "oromo": "Daddafaa", "phonetic": "dad-da-faa", "category": "descriptive" },
  "clean": { "oromo": "Qulqulluu", "phonetic": "qul-qul-luu", "category": "descriptive" },
  "dirty": { "oromo": "Dhoqqee", "phonetic": "dhoq-qee", "category": "descriptive" },

  // --- 31. ADDITIONAL FOOD ITEMS ---
  "rice": { "oromo": "Ruuzii", "phonetic": "ruu-zii", "category": "food" },
  "meat": { "oromo": "Foon", "phonetic": "foon", "category": "food" },
  "vegetable": { "oromo": "Baala", "phonetic": "baa-la", "category": "food" },
  "soup": { "oromo": "Marqaa", "phonetic": "mar-qaa", "category": "food" },
  "tea": { "oromo": "Shaahii", "phonetic": "shaa-hii", "category": "food" },
  "coffee": { "oromo": "Buna", "phonetic": "bu-na", "category": "food" },

  // --- 32. GAMES ---
  "hide": { "oromo": "Dhoksuu", "phonetic": "dhok-suu", "category": "toys" },
  "seek": { "oromo": "Barbaachuu", "phonetic": "bar-baa-chuu", "category": "toys" },
  "win": { "oromo": "Moo'uu", "phonetic": "moo-uu", "category": "toys" },
  "lose": { "oromo": "Haphuu", "phonetic": "hap-huu", "category": "toys" },

  // --- 33. DIRECTIONS ---
  "up": { "oromo": "Ol", "phonetic": "ol", "category": "descriptive" },
  "down": { "oromo": "Gadi", "phonetic": "ga-di", "category": "descriptive" },
  "left": { "oromo": "Bitaa", "phonetic": "bi-taa", "category": "descriptive" },
  "right": { "oromo": "Mirga", "phonetic": "mir-ga", "category": "descriptive" },

  // --- 34. BEDTIME ---
  "dream": { "oromo": "Abjuu", "phonetic": "ab-juu", "category": "house" },
  "pillow": { "oromo": "Barcuma siree", "phonetic": "bar-cu-ma si-ree", "category": "house" },
  "blanket": { "oromo": "Uffata siree", "phonetic": "uf-fa-ta si-ree", "category": "house" }
,// Basic military terms
    "war": { "oromo": "Lola", "phonetic": "lo-la", "category": "military" },
    "peace": { "oromo": "Naga", "phonetic": "na-ga", "category": "military" },
    "soldier": { "oromo": "Waraana", "phonetic": "wa-raa-na", "category": "military" },
    "army": { "oromo": "Waraana", "phonetic": "wa-raa-na", "category": "military" },
    "battle": { "oromo": "Wal'itii", "phonetic": "wal-i-tii", "category": "military" },
    
    // Weapons
    "gun": { "oromo": "Qawwee", "phonetic": "qaw-wee", "category": "weapons" },
    "weapon": { "oromo": "Meeshaa waraanaa", "phonetic": "mee-shaa wa-raa-naa", "category": "weapons" },
    "knife": { "oromo": "Haaduu", "phonetic": "haa-duu", "category": "weapons" },
    "sword": { "oromo": "Safara", "phonetic": "sa-fa-ra", "category": "weapons" },
    "shield": { "oromo": "Gaachana", "phonetic": "gaa-cha-na", "category": "weapons" },
    
    // Actions
    "attack": { "oromo": "Meechuu", "phonetic": "mee-chuu", "category": "actions" },
    "defend": { "oromo": "Itti gaafatamuu", "phonetic": "it-ti gaa-fa-ta-muu", "category": "actions" },
    "fight": { "oromo": "Loluu", "phonetic": "lo-luu", "category": "actions" },
    "protect": { "oromo": "Tiksuu", "phonetic": "tik-suu", "category": "actions" },
    "retreat": { "oromo": "Deebi'uu", "phonetic": "dee-bi-uu", "category": "actions" },
    
    // Places & units
    "camp": { "oromo": "Buufata", "phonetic": "buu-fa-ta", "category": "places" },
    "enemy": { "oromo": "Diina", "phonetic": "dii-na", "category": "people" },
    "ally": { "oromo": "Hiriyyaa", "phonetic": "hi-riy-yaa", "category": "people" },
    "front line": { "oromo": "Fuula duraa", "phonetic": "fuu-la du-raa", "category": "places" },
    
    // Consequences
    "wound": { "oromo": "Rukkisa", "phonetic": "ruk-ki-sa", "category": "medical" },
    "death": { "oromo": "Du'aa", "phonetic": "du-aa", "category": "medical" },
    "capture": { "oromo": "Bittaa", "phonetic": "bit-taa", "category": "actions" },
    "victory": { "oromo": "Moo'ummaa", "phonetic": "moo-um-maa", "category": "outcomes" },
    "defeat": { "oromo": "Haphuu", "phonetic": "hap-huu", "category": "outcomes" },
    
    // Traditional Oromo military terms
    "warrior": { "oromo": "Abbaa Duulaa", "phonetic": "ab-baa duu-laa", "category": "people" },
    "bravery": { "oromo": "Jabeenya", "phonetic": "ja-bee-nya", "category": "qualities" },
    "strategy": { "oromo": "Haala ittiin bulma", "phonetic": "haa-la it-tiin bul-ma", "category": "tactics" },
    "courage": { "oromo": "Sobbaa", "phonetic": "sob-baa", "category": "qualities" },
    
    // Modern terms
    "tank": { "oromo": "Taankii", "phonetic": "taan-kii", "category": "vehicles" },
    "helicopter": { "oromo": "Hilikoptaarii", "phonetic": "hi-li-kop-taa-rii", "category": "vehicles" },
    "uniform": { "oromo": "Yuunifoormii", "phonetic": "yuu-ni-foor-mii", "category": "equipment" },
    "commander": { "oromo": "Komandaaraa", "phonetic": "ko-man-daa-raa", "category": "people" }
};
window.translations = translations;