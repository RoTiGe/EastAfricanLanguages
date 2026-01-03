const translations = {
// ...existing code...

  // --- 1. BASICS & GREETINGS ---
  "hello": { "spanish": "Hola", "phonetic": "o-la", "category": "basics" },
  "goodbye": { "spanish": "Adiós", "phonetic": "a-dyos", "category": "basics" },
  "thank you": { "spanish": "Gracias", "phonetic": "gra-syas", "category": "basics" },
  "please": { "spanish": "Por favor", "phonetic": "por fa-vor", "category": "basics" },
  "sorry": { "spanish": "Lo siento", "phonetic": "lo syen-to", "category": "basics" },
  "yes": { "spanish": "Sí", "phonetic": "si", "category": "basics" },
  "no": { "spanish": "No", "phonetic": "no", "category": "basics" },
  "okay": { "spanish": "Está bien", "phonetic": "es-ta byen", "category": "basics" },
  "excuse me": { "spanish": "Perdón", "phonetic": "per-don", "category": "basics" },
  "welcome": { "spanish": "Bienvenido", "phonetic": "byen-ve-ni-do", "category": "basics" },

  // --- 2. FAMILY ---
  "mother": { "spanish": "Madre", "phonetic": "ma-dre", "category": "family" },
  "father": { "spanish": "Padre", "phonetic": "pa-dre", "category": "family" },
  "baby": { "spanish": "Bebé", "phonetic": "be-be", "category": "family" },
  "sister": { "spanish": "Hermana", "phonetic": "er-ma-na", "category": "family" },
  "brother": { "spanish": "Hermano", "phonetic": "er-ma-no", "category": "family" },
  "uncle": { "spanish": "Tío", "phonetic": "ti-o", "category": "family" },
  "aunt": { "spanish": "Tía", "phonetic": "ti-a", "category": "family" },
  "grandmother": { "spanish": "Abuela", "phonetic": "a-bwe-la", "category": "family" },
  "grandfather": { "spanish": "Abuelo", "phonetic": "a-bwe-lo", "category": "family" },
  "cousin": { "spanish": "Primo/Prima", "phonetic": "pri-mo / pri-ma", "category": "family" },
  "family": { "spanish": "Familia", "phonetic": "fa-mi-lya", "category": "family" },
  "child": { "spanish": "Niño/Niña", "phonetic": "ni-nyo / ni-nya", "category": "family" },
  "children": { "spanish": "Niños", "phonetic": "ni-nyos", "category": "family" },

  // --- 3. PEOPLE ---
  "friend": { "spanish": "Amigo/Amiga", "phonetic": "a-mi-go / a-mi-ga", "category": "people" },
  "teacher": { "spanish": "Maestro/Maestra", "phonetic": "ma-es-tro / ma-es-tra", "category": "people" },
  "doctor": { "spanish": "Doctor/Doctora", "phonetic": "dok-tor / dok-to-ra", "category": "people" },
  "student": { "spanish": "Estudiante", "phonetic": "es-tu-dyan-te", "category": "people" },

  // --- 4. BODY PARTS ---
  "head": { "spanish": "Cabeza", "phonetic": "ka-be-sa", "category": "body" },
  "eyes": { "spanish": "Ojos", "phonetic": "o-hos", "category": "body" },
  "nose": { "spanish": "Nariz", "phonetic": "na-ris", "category": "body" },
  "mouth": { "spanish": "Boca", "phonetic": "bo-ka", "category": "body" },
  "hands": { "spanish": "Manos", "phonetic": "ma-nos", "category": "body" },
  "ears": { "spanish": "Oídos", "phonetic": "o-i-dos", "category": "body" },
  "hair": { "spanish": "Pelo", "phonetic": "pe-lo", "category": "body" },
  "teeth": { "spanish": "Dientes", "phonetic": "dyen-tes", "category": "body" },
  "feet": { "spanish": "Pies", "phonetic": "pyes", "category": "body" },
  "fingers": { "spanish": "Dedos", "phonetic": "de-dos", "category": "body" },
  "stomach": { "spanish": "Estómago", "phonetic": "es-to-ma-go", "category": "body" },
  "heart": { "spanish": "Corazón", "phonetic": "ko-ra-son", "category": "body" },

  // --- 5. CLOTHING ---
  "shirt": { "spanish": "Camisa", "phonetic": "ka-mi-sa", "category": "clothing" },
  "shoes": { "spanish": "Zapatos", "phonetic": "sa-pa-tos", "category": "clothing" },
  "hat": { "spanish": "Sombrero", "phonetic": "som-bre-ro", "category": "clothing" },
  "pants": { "spanish": "Pantalones", "phonetic": "pan-ta-lo-nes", "category": "clothing" },
  "dress": { "spanish": "Vestido", "phonetic": "ves-ti-do", "category": "clothing" },
  "socks": { "spanish": "Calcetines", "phonetic": "kal-se-ti-nes", "category": "clothing" },
  "coat": { "spanish": "Abrigo", "phonetic": "a-bri-go", "category": "clothing" },
  "gloves": { "spanish": "Guantes", "phonetic": "gwan-tes", "category": "clothing" },

  // --- 6. COLORS ---
  "red": { "spanish": "Rojo", "phonetic": "ro-ho", "category": "colors" },
  "blue": { "spanish": "Azul", "phonetic": "a-sul", "category": "colors" },
  "yellow": { "spanish": "Amarillo", "phonetic": "a-ma-ri-yo", "category": "colors" },
  "green": { "spanish": "Verde", "phonetic": "ver-de", "category": "colors" },
  "orange": { "spanish": "Naranja", "phonetic": "na-ran-ha", "category": "colors" },
  "purple": { "spanish": "Morado", "phonetic": "mo-ra-do", "category": "colors" },
  "pink": { "spanish": "Rosado", "phonetic": "ro-sa-do", "category": "colors" },
  "brown": { "spanish": "Marrón", "phonetic": "ma-rron", "category": "colors" },
  "black": { "spanish": "Negro", "phonetic": "ne-gro", "category": "colors" },
  "white": { "spanish": "Blanco", "phonetic": "blan-ko", "category": "colors" },
  "rainbow": { "spanish": "Arcoíris", "phonetic": "ar-ko-i-ris", "category": "colors" },

  // --- 7. NUMBERS ---
  "one": { "spanish": "Uno", "phonetic": "u-no", "category": "numbers" },
  "two": { "spanish": "Dos", "phonetic": "dos", "category": "numbers" },
  "three": { "spanish": "Tres", "phonetic": "tres", "category": "numbers" },
  "four": { "spanish": "Cuatro", "phonetic": "kwa-tro", "category": "numbers" },
  "five": { "spanish": "Cinco", "phonetic": "sin-ko", "category": "numbers" },
  "six": { "spanish": "Seis", "phonetic": "seis", "category": "numbers" },
  "seven": { "spanish": "Siete", "phonetic": "sye-te", "category": "numbers" },
  "eight": { "spanish": "Ocho", "phonetic": "o-cho", "category": "numbers" },
  "nine": { "spanish": "Nueve", "phonetic": "nwe-ve", "category": "numbers" },
  "ten": { "spanish": "Diez", "phonetic": "dyes", "category": "numbers" },
  "zero": { "spanish": "Cero", "phonetic": "se-ro", "category": "numbers" },

  // --- 8. EMOTIONS ---
  "happy": { "spanish": "Feliz", "phonetic": "fe-lis", "category": "emotions" },
  "sad": { "spanish": "Triste", "phonetic": "tris-te", "category": "emotions" },
  "angry": { "spanish": "Enojado", "phonetic": "e-no-ha-do", "category": "emotions" },
  "scared": { "spanish": "Asustado", "phonetic": "a-sus-ta-do", "category": "emotions" },
  "surprised": { "spanish": "Sorprendido", "phonetic": "sor-pren-di-do", "category": "emotions" },
  "excited": { "spanish": "Emocionado", "phonetic": "e-mo-syo-na-do", "category": "emotions" },
  "tired": { "spanish": "Cansado", "phonetic": "kan-sa-do", "category": "emotions" },

  // --- 9. SCHOOL ---
  "school": { "spanish": "Escuela", "phonetic": "es-kwe-la", "category": "school" },
  "pencil": { "spanish": "Lápiz", "phonetic": "la-pis", "category": "school" },
  "paper": { "spanish": "Papel", "phonetic": "pa-pel", "category": "school" },
  "draw": { "spanish": "Dibujar", "phonetic": "di-bu-har", "category": "school" },
  "write": { "spanish": "Escribir", "phonetic": "es-kri-bir", "category": "school" },
  "read": { "spanish": "Leer", "phonetic": "le-er", "category": "school" },
  "learn": { "spanish": "Aprender", "phonetic": "a-pren-der", "category": "school" },

  // --- 10. TOYS & PLAY ---
  "toy": { "spanish": "Juguete", "phonetic": "hu-ge-te", "category": "toys" },
  "ball": { "spanish": "Pelota", "phonetic": "pe-lo-ta", "category": "toys" },
  "doll": { "spanish": "Muñeca", "phonetic": "mu-nye-ka", "category": "toys" },
  "game": { "spanish": "Juego", "phonetic": "hwe-go", "category": "toys" },
  "play": { "spanish": "Jugar", "phonetic": "hu-gar", "category": "toys" },
  "fun": { "spanish": "Diversión", "phonetic": "di-ver-syon", "category": "toys" },

  // --- 11. HOUSE ---
  "house": { "spanish": "Casa", "phonetic": "ka-sa", "category": "house" },
  "room": { "spanish": "Cuarto", "phonetic": "kwar-to", "category": "house" },
  "door": { "spanish": "Puerta", "phonetic": "pwer-ta", "category": "house" },
  "window": { "spanish": "Ventana", "phonetic": "ven-ta-na", "category": "house" },
  "bed": { "spanish": "Cama", "phonetic": "ka-ma", "category": "house" },
  "table": { "spanish": "Mesa", "phonetic": "me-sa", "category": "house" },
  "chair": { "spanish": "Silla", "phonetic": "si-ya", "category": "house" },
  "kitchen": { "spanish": "Cocina", "phonetic": "ko-si-na", "category": "house" },

  // --- 12. FOOD ---
  "bread": { "spanish": "Pan", "phonetic": "pan", "category": "food" },
  "milk": { "spanish": "Leche", "phonetic": "le-che", "category": "food" },
  "egg": { "spanish": "Huevo", "phonetic": "we-vo", "category": "food" },
  "fruit": { "spanish": "Fruta", "phonetic": "fru-ta", "category": "food" },
  "apple": { "spanish": "Manzana", "phonetic": "man-sa-na", "category": "food" },
  "banana": { "spanish": "Plátano", "phonetic": "pla-ta-no", "category": "food" },
  "juice": { "spanish": "Jugo", "phonetic": "hu-go", "category": "food" },
  "water": { "spanish": "Agua", "phonetic": "a-gwa", "category": "food" },
  "breakfast": { "spanish": "Desayuno", "phonetic": "de-sa-yu-no", "category": "food" },
  "lunch": { "spanish": "Almuerzo", "phonetic": "al-mwer-so", "category": "food" },
  "dinner": { "spanish": "Cena", "phonetic": "se-na", "category": "food" },
  "cake": { "spanish": "Pastel", "phonetic": "pas-tel", "category": "food" },
  "candy": { "spanish": "Caramelo", "phonetic": "ka-ra-me-lo", "category": "food" },

  // --- 13. ANIMALS (FARM) ---
  "cow": { "spanish": "Vaca", "phonetic": "ba-ka", "category": "animals" },
  "sheep": { "spanish": "Oveja", "phonetic": "o-be-ha", "category": "animals" },
  "chicken": { "spanish": "Pollo", "phonetic": "po-yo", "category": "animals" },
  "horse": { "spanish": "Caballo", "phonetic": "ka-ba-yo", "category": "animals" },
  "goat": { "spanish": "Cabra", "phonetic": "ka-bra", "category": "animals" },
  "donkey": { "spanish": "Burro", "phonetic": "bu-rro", "category": "animals" },
  "pig": { "spanish": "Cerdo", "phonetic": "ser-do", "category": "animals" },

  // --- 14. PETS ---
  "dog": { "spanish": "Perro", "phonetic": "pe-rro", "category": "animals" },
  "cat": { "spanish": "Gato", "phonetic": "ga-to", "category": "animals" },
  "bird": { "spanish": "Pájaro", "phonetic": "pa-ha-ro", "category": "animals" },
  "fish": { "spanish": "Pez", "phonetic": "pes", "category": "animals" },
  "rabbit": { "spanish": "Conejo", "phonetic": "ko-ne-ho", "category": "animals" },

  // --- 15. WILD ANIMALS ---
  "lion": { "spanish": "León", "phonetic": "le-on", "category": "animals" },
  "elephant": { "spanish": "Elefante", "phonetic": "e-le-fan-te", "category": "animals" },
  "giraffe": { "spanish": "Jirafa", "phonetic": "hi-ra-fa", "category": "animals" },
  "monkey": { "spanish": "Mono", "phonetic": "mo-no", "category": "animals" },
  "zebra": { "spanish": "Cebra", "phonetic": "se-bra", "category": "animals" },

  // --- 16. INSECTS ---
  "butterfly": { "spanish": "Mariposa", "phonetic": "ma-ri-po-sa", "category": "animals" },
  "bee": { "spanish": "Abeja", "phonetic": "a-be-ha", "category": "animals" },
  "spider": { "spanish": "Araña", "phonetic": "a-ra-nya", "category": "animals" },

  // --- 17. NATURE ---
  "rain": { "spanish": "Lluvia", "phonetic": "yu-vya", "category": "nature" },
  "cloud": { "spanish": "Nube", "phonetic": "nu-be", "category": "nature" },
  "mountain": { "spanish": "Montaña", "phonetic": "mon-ta-nya", "category": "nature" },
  "water": { "spanish": "Agua", "phonetic": "a-gwa", "category": "nature" },
  "sun": { "spanish": "Sol", "phonetic": "sol", "category": "nature" },
  "moon": { "spanish": "Luna", "phonetic": "lu-na", "category": "nature" },
  "tree": { "spanish": "Árbol", "phonetic": "ar-bol", "category": "nature" },
  "flower": { "spanish": "Flor", "phonetic": "flor", "category": "nature" },
  "world": { "spanish": "Mundo", "phonetic": "mun-do", "category": "nature" },
  "star": { "spanish": "Estrella", "phonetic": "es-tre-ya", "category": "nature" },
  "sky": { "spanish": "Cielo", "phonetic": "sye-lo", "category": "nature" },
  "river": { "spanish": "Río", "phonetic": "ri-o", "category": "nature" },
  "lake": { "spanish": "Lago", "phonetic": "la-go", "category": "nature" },
  "sea": { "spanish": "Mar", "phonetic": "mar", "category": "nature" },
  "wind": { "spanish": "Viento", "phonetic": "byen-to", "category": "nature" },
  "snow": { "spanish": "Nieve", "phonetic": "nye-ve", "category": "nature" },

  // --- 18. TIME ---
  "day": { "spanish": "Día", "phonetic": "di-a", "category": "time" },
  "night": { "spanish": "Noche", "phonetic": "no-che", "category": "time" },
  "morning": { "spanish": "Mañana", "phonetic": "ma-nya-na", "category": "time" },
  "afternoon": { "spanish": "Tarde", "phonetic": "tar-de", "category": "time" },
  "evening": { "spanish": "Noche", "phonetic": "no-che", "category": "time" },
  "today": { "spanish": "Hoy", "phonetic": "oy", "category": "time" },
  "tomorrow": { "spanish": "Mañana", "phonetic": "ma-nya-na", "category": "time" },
  "yesterday": { "spanish": "Ayer", "phonetic": "a-yer", "category": "time" },

  // --- 19. SEASONS ---
  "summer": { "spanish": "Verano", "phonetic": "ve-ra-no", "category": "seasons" },
  "winter": { "spanish": "Invierno", "phonetic": "in-vyer-no", "category": "seasons" },
  "spring": { "spanish": "Primavera", "phonetic": "pri-ma-ve-ra", "category": "seasons" },
  "autumn": { "spanish": "Otoño", "phonetic": "o-to-nyo", "category": "seasons" },

  // --- 20. TRANSPORT ---
  "car": { "spanish": "Coche", "phonetic": "ko-che", "category": "transport" },
  "airplane": { "spanish": "Avión", "phonetic": "a-vyon", "category": "transport" },
  "bicycle": { "spanish": "Bicicleta", "phonetic": "bi-si-kle-ta", "category": "transport" },
  "bus": { "spanish": "Autobús", "phonetic": "au-to-bus", "category": "transport" },
  "train": { "spanish": "Tren", "phonetic": "tren", "category": "transport" },
  "boat": { "spanish": "Barco", "phonetic": "bar-ko", "category": "transport" },
  "truck": { "spanish": "Camión", "phonetic": "ka-myon", "category": "transport" },

  // --- 21. PLACES ---
  "park": { "spanish": "Parque", "phonetic": "par-ke", "category": "places" },
  "store": { "spanish": "Tienda", "phonetic": "tyen-da", "category": "places" },
  "hospital": { "spanish": "Hospital", "phonetic": "os-pi-tal", "category": "places" },
  "church": { "spanish": "Iglesia", "phonetic": "i-gle-sya", "category": "places" },
  "zoo": { "spanish": "Zoológico", "phonetic": "so-o-lo-hi-ko", "category": "places" },

  // --- 22. MUSIC ---
  "music": { "spanish": "Música", "phonetic": "mu-si-ka", "category": "music" },
  "song": { "spanish": "Canción", "phonetic": "kan-syon", "category": "music" },
  "dance": { "spanish": "Bailar", "phonetic": "bai-lar", "category": "music" },
  "sing": { "spanish": "Cantar", "phonetic": "kan-tar", "category": "music" },

  // --- 23. ACTIONS ---
  "eat": { "spanish": "Comer", "phonetic": "ko-mer", "category": "actions" },
  "drink": { "spanish": "Beber", "phonetic": "be-ber", "category": "actions" },
  "sleep": { "spanish": "Dormir", "phonetic": "dor-mir", "category": "actions" },
  "run": { "spanish": "Correr", "phonetic": "ko-rrer", "category": "actions" },
  "jump": { "spanish": "Saltar", "phonetic": "sal-tar", "category": "actions" },
  "walk": { "spanish": "Caminar", "phonetic": "ka-mi-nar", "category": "actions" },
  "talk": { "spanish": "Hablar", "phonetic": "a-blar", "category": "actions" },
  "listen": { "spanish": "Escuchar", "phonetic": "es-ku-char", "category": "actions" },
  "see": { "spanish": "Ver", "phonetic": "ver", "category": "actions" },
  "touch": { "spanish": "Tocar", "phonetic": "to-kar", "category": "actions" },
  "hold": { "spanish": "Sostener", "phonetic": "sos-te-ner", "category": "actions" },
  "give": { "spanish": "Dar", "phonetic": "dar", "category": "actions" },
  "take": { "spanish": "Tomar", "phonetic": "to-mar", "category": "actions" },

  // --- 24. OBJECTS ---
  "computer": { "spanish": "Computadora", "phonetic": "kom-pu-ta-do-ra", "category": "objects" },
  "book": { "spanish": "Libro", "phonetic": "li-bro", "category": "objects" },
  "phone": { "spanish": "Teléfono", "phonetic": "te-le-fo-no", "category": "objects" },
  "key": { "spanish": "Llave", "phonetic": "ya-ve", "category": "objects" },
  "money": { "spanish": "Dinero", "phonetic": "di-ne-ro", "category": "objects" },
  "clock": { "spanish": "Reloj", "phonetic": "re-loh", "category": "objects" },
  "light": { "spanish": "Luz", "phonetic": "lus", "category": "objects" },
  "bag": { "spanish": "Bolsa", "phonetic": "bol-sa", "category": "objects" },

  // --- 25. SHAPES ---
  "circle": { "spanish": "Círculo", "phonetic": "sir-ku-lo", "category": "shapes" },
  "square": { "spanish": "Cuadrado", "phonetic": "kwa-dra-do", "category": "shapes" },
  "triangle": { "spanish": "Triángulo", "phonetic": "tryan-gu-lo", "category": "shapes" },
  "heart": { "spanish": "Corazón", "phonetic": "ko-ra-son", "category": "shapes" },

  // --- 26. HOLIDAYS ---
  "birthday": { "spanish": "Cumpleaños", "phonetic": "kum-ple-a-nyos", "category": "holidays" },
  "gift": { "spanish": "Regalo", "phonetic": "re-ga-lo", "category": "holidays" },
  "party": { "spanish": "Fiesta", "phonetic": "fyes-ta", "category": "holidays" },
  "Christmas": { "spanish": "Navidad", "phonetic": "na-vi-dad", "category": "holidays" },

  // --- 27. BATHROOM ---
  "bath": { "spanish": "Baño", "phonetic": "ba-nyo", "category": "house" },
  "soap": { "spanish": "Jabón", "phonetic": "ha-bon", "category": "house" },
  "toothbrush": { "spanish": "Cepillo de dientes", "phonetic": "se-pi-yo de dyen-tes", "category": "house" },

  // --- 28. WEATHER ---
  "hot": { "spanish": "Calor", "phonetic": "ka-lor", "category": "weather" },
  "cold": { "spanish": "Frío", "phonetic": "fri-o", "category": "weather" },
  "sunny": { "spanish": "Soleado", "phonetic": "so-le-a-do", "category": "weather" },

  // --- 29. QUESTIONS ---
  "what": { "spanish": "Qué", "phonetic": "ke", "category": "basics" },
  "where": { "spanish": "Dónde", "phonetic": "don-de", "category": "basics" },
  "when": { "spanish": "Cuándo", "phonetic": "kwan-do", "category": "basics" },
  "why": { "spanish": "Por qué", "phonetic": "por ke", "category": "basics" },
  "how": { "spanish": "Cómo", "phonetic": "ko-mo", "category": "basics" },

  // --- 30. DESCRIPTIVE WORDS ---
  "big": { "spanish": "Grande", "phonetic": "gran-de", "category": "descriptive" },
  "small": { "spanish": "Pequeño", "phonetic": "pe-ke-nyo", "category": "descriptive" },
  "fast": { "spanish": "Rápido", "phonetic": "ra-pi-do", "category": "descriptive" },
  "slow": { "spanish": "Lento", "phonetic": "len-to", "category": "descriptive" },
  "clean": { "spanish": "Limpio", "phonetic": "lim-pyo", "category": "descriptive" },
  "dirty": { "spanish": "Sucio", "phonetic": "su-syo", "category": "descriptive" },

  // --- 31. ADDITIONAL WORDS ---
  "love": { "spanish": "Amor", "phonetic": "a-mor", "category": "emotions" },
  "home": { "spanish": "Hogar", "phonetic": "o-gar", "category": "house" },
  "food": { "spanish": "Comida", "phonetic": "ko-mi-da", "category": "food" },
  "time": { "spanish": "Tiempo", "phonetic": "tyem-po", "category": "time" },
  "name": { "spanish": "Nombre", "phonetic": "nom-bre", "category": "basics" },
  "help": { "spanish": "Ayuda", "phonetic": "a-yu-da", "category": "basics" },
  "stop": { "spanish": "Parar", "phonetic": "pa-rar", "category": "actions" },
  "go": { "spanish": "Ir", "phonetic": "ir", "category": "actions" },
  "come": { "spanish": "Venir", "phonetic": "ve-nir", "category": "actions" },
  "wait": { "spanish": "Esperar", "phonetic": "es-pe-rar", "category": "actions" }
, // Basic military terms
    "war": { "spanish": "Guerra", "phonetic": "ge-rra", "category": "military" },
    "peace": { "spanish": "Paz", "phonetic": "pas", "category": "military" },
    "soldier": { "spanish": "Soldado", "phonetic": "sol-da-do", "category": "military" },
    "army": { "spanish": "Ejército", "phonetic": "e-her-si-to", "category": "military" },
    "battle": { "spanish": "Batalla", "phonetic": "ba-ta-ya", "category": "military" },
    
    // Weapons
    "gun": { "spanish": "Arma", "phonetic": "ar-ma", "category": "weapons" },
    "weapon": { "spanish": "Arma", "phonetic": "ar-ma", "category": "weapons" },
    "knife": { "spanish": "Cuchillo", "phonetic": "ku-chi-yo", "category": "weapons" },
    "sword": { "spanish": "Espada", "phonetic": "es-pa-da", "category": "weapons" },
    "shield": { "spanish": "Escudo", "phonetic": "es-ku-do", "category": "weapons" },
    
    // Actions
    "attack": { "spanish": "Atacar", "phonetic": "a-ta-kar", "category": "actions" },
    "defend": { "spanish": "Defender", "phonetic": "de-fen-der", "category": "actions" },
    "fight": { "spanish": "Luchar", "phonetic": "lu-char", "category": "actions" },
    "protect": { "spanish": "Proteger", "phonetic": "pro-te-her", "category": "actions" },
    "retreat": { "spanish": "Retirarse", "phonetic": "re-ti-rar-se", "category": "actions" },
    
    // Places & units
    "camp": { "spanish": "Campamento", "phonetic": "kam-pa-men-to", "category": "places" },
    "enemy": { "spanish": "Enemigo", "phonetic": "e-ne-mi-go", "category": "people" },
    "ally": { "spanish": "Aliado", "phonetic": "a-lya-do", "category": "people" },
    "front line": { "spanish": "Línea del frente", "phonetic": "li-ne-a del fren-te", "category": "places" },
    
    // Consequences
    "wound": { "spanish": "Herida", "phonetic": "e-ri-da", "category": "medical" },
    "death": { "spanish": "Muerte", "phonetic": "mwer-te", "category": "medical" },
    "capture": { "spanish": "Capturar", "phonetic": "kap-tu-rar", "category": "actions" },
    "victory": { "spanish": "Victoria", "phonetic": "vik-to-rya", "category": "outcomes" },
    "defeat": { "spanish": "Derrota", "phonetic": "de-rro-ta", "category": "outcomes" },
    
    // Traditional military terms
    "warrior": { "spanish": "Guerrero", "phonetic": "ge-rre-ro", "category": "people" },
    "bravery": { "spanish": "Valentía", "phonetic": "va-len-ti-a", "category": "qualities" },
    "strategy": { "spanish": "Estrategia", "phonetic": "es-tra-te-hya", "category": "tactics" },
    "courage": { "spanish": "Coraje", "phonetic": "ko-ra-he", "category": "qualities" },
    
    // Modern terms
    "tank": { "spanish": "Tanque", "phonetic": "tan-ke", "category": "vehicles" },
    "helicopter": { "spanish": "Helicóptero", "phonetic": "e-li-kop-te-ro", "category": "vehicles" },
    "uniform": { "spanish": "Uniforme", "phonetic": "u-ni-for-me", "category": "equipment" },
    "commander": { "spanish": "Comandante", "phonetic": "ko-man-dan-te", "category": "people" },
    
    // Additional terms
    "invasion": { "spanish": "Invasión", "phonetic": "in-va-syon", "category": "actions" },
    "resistance": { "spanish": "Resistencia", "phonetic": "re-sis-ten-sya", "category": "actions" },
    "occupation": { "spanish": "Ocupación", "phonetic": "o-ku-pa-syon", "category": "political" },
    "ceasefire": { "spanish": "Alto el fuego", "phonetic": "al-to el fwe-go", "category": "military" },
    
    // Political/Military concepts
    "revolution": { "spanish": "Revolución", "phonetic": "re-vo-lu-syon", "category": "political" },
    "liberation": { "spanish": "Liberación", "phonetic": "li-be-ra-syon", "category": "political" },
    "independence": { "spanish": "Independencia", "phonetic": "in-de-pen-den-sya", "category": "political" },
    "surrender": { "spanish": "Rendición", "phonetic": "ren-di-syon", "category": "actions" }
};

window.translations = translations;