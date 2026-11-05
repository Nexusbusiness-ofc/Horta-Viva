import React, { useState } from "react";
import { resolveAssetUrl } from "@/lib/utils";

// Mapping by explicit item ID (Plants, Podas, Mondas, Animals, Mushrooms) -> 3D asset in public/images/emojis3d/
export const ITEM_ID_3D_MAP = {
  // === 94 PLANTS ===
  plant_1: "fava.svg",               // Fava
  plant_2: "alecrim.svg",            // Alecrim
  plant_3: "seedling.png",           // Cebolinho
  plant_4: "beterraba.svg",          // Beterraba
  plant_5: "alho_porro.svg",         // Alho-porro
  plant_6: "figo.svg",               // Figo
  plant_7: "couve_flor.svg",         // Couve-flor
  plant_8: "red_apple.png",          // Maçã
  plant_9: "olive.png",              // Azeitona
  plant_10: "peach.png",             // Pêssego
  plant_11: "herb.png",              // Hortelã
  plant_12: "pear.png",              // Pera
  plant_13: "leafy_green.png",       // Espinafre
  plant_14: "herb.png",              // Coentros
  plant_15: "melon.png",             // Melão
  plant_16: "leafy_green.png",       // Nabiça
  plant_17: "tangerine.png",         // Laranja
  plant_18: "cherries.png",          // Cereja
  plant_19: "leafy_green.png",       // Acelga
  plant_20: "herb.png",              // Tomilho
  plant_21: "nabo.svg",              // Nabo
  plant_22: "amendoa.svg",           // Amêndoa
  plant_23: "green_salad.png",       // Rúcula
  plant_24: "leafy_green.png",       // Aipo
  plant_25: "watermelon.png",        // Melancia
  plant_26: "roma.svg",              // Romã
  plant_27: "lemon.png",             // Limão
  plant_28: "grapes.png",            // Uva
  plant_29: "leafy_green.png",       // Couve-portuguesa
  plant_30: "curgete.svg",           // Curgete
  plant_31: "leafy_green.png",       // Alface
  plant_32: "cucumber.png",          // Pepino
  plant_33: "eggplant.png",          // Beringela
  plant_34: "hot_pepper.png",        // Piri-piri
  plant_35: "corn.png",              // Milho
  plant_36: "rabanete.svg",          // Rabanete
  plant_37: "bell_pepper.png",       // Pimento
  plant_38: "herb.png",              // Salsa
  plant_39: "leafy_green.png",       // Couve
  plant_40: "beans.png",             // Feijão
  plant_41: "tomato.png",            // Tomate
  plant_42: "garlic.png",            // Alho
  plant_43: "broccoli.png",          // Brócolos
  plant_44: "herb.png",              // Manjericão
  plant_45: "carrot.png",            // Cenoura
  plant_46: "onion.png",             // Cebola
  plant_47: "pea_pod.png",           // Ervilha
  plant_48: "potato.png",            // Batata
  plant_49: "abobora.svg",           // Abóbora
  plant_50: "strawberry.png",        // Morango
  plant_51: "ameixa.svg",            // Ameixa
  plant_52: "alperce.svg",           // Alperce
  plant_53: "marmelo.svg",           // Marmelo
  plant_54: "tangerine.png",         // Tangerina
  plant_55: "chestnut.png",          // Castanha
  plant_56: "framboesa.svg",         // Framboesa
  plant_57: "blueberries.png",       // Mirtilo
  plant_58: "amora.svg",             // Amora
  plant_59: "kiwi.png",              // Kiwi
  plant_60: "diospiro.svg",          // Dióspiro
  plant_61: "nespera.svg",           // Nêspera
  plant_62: "noz.svg",               // Noz
  plant_63: "avela.svg",             // Avelã
  plant_64: "maracuja.svg",          // Maracujá
  plant_65: "avocado.png",           // Abacate
  plant_66: "groselha.svg",          // Groselha
  plant_67: "sweet_potato.png",      // Batata-doce
  plant_68: "cherovia.svg",          // Cherovia
  plant_69: "ginger.png",            // Gengibre
  plant_70: "grao_de_bico.svg",      // Grão-de-bico
  plant_71: "feijao_frade.svg",      // Feijão-frade
  plant_72: "lentilha.svg",          // Lentilha
  plant_73: "tremoco.svg",           // Tremoço
  plant_74: "peanuts.png",           // Amendoim
  plant_75: "couve_galega.svg",      // Couve-galega
  plant_76: "leafy_green.png",       // Couve-lombarda
  plant_77: "leafy_green.png",       // Couve-coração
  plant_78: "couve_roxa.svg",        // Couve-roxa
  plant_79: "chuchu.svg",            // Chuchu
  plant_80: "espargo.svg",           // Espargo
  plant_81: "alcachofra.svg",        // Alcachofra
  plant_82: "green_salad.png",       // Canónigos
  plant_83: "agriao.svg",            // Agrião
  plant_84: "leafy_green.png",       // Chicória
  plant_85: "herb.png",              // Orégãos
  plant_86: "fluttering_leaf.png",   // Louro
  plant_87: "seedling.png",          // Lúcia-lima
  plant_88: "herb.png",              // Erva-cidreira
  plant_89: "seedling.png",          // Poêjo
  plant_90: "sheaf_of_rice.png",     // Erva-príncipe
  plant_91: "herb.png",              // Funcho
  plant_92: "salva.svg",             // Salva
  plant_93: "blossom.png",           // Camomila
  plant_94: "herb.png",              // Estragão

  // === 22 PODAS ===
  poda_vinha_inverno: "grapes.png",
  poda_vinha_verde: "grapes.png",
  poda_macieira: "red_apple.png",
  poda_pereira: "pear.png",
  poda_marmeleiro: "marmelo.svg",
  poda_pessegueiro: "peach.png",
  poda_cerejeira: "cherries.png",
  poda_ameixeira: "ameixa.svg",
  poda_damasqueiro: "alperce.svg",
  poda_laranjeira: "tangerine.png",
  poda_limoeiro: "lemon.png",
  poda_clementineira: "tangerine.png",
  poda_oliveira: "olive.png",
  poda_oliveira_desladroamento: "deciduous_tree.png",
  poda_amendoeira: "amendoa.svg",
  poda_castanheiro: "chestnut.png",
  poda_figueira: "figo.svg",
  poda_framboesa: "framboesa.svg",
  poda_mirtilo: "blueberries.png",
  poda_roseira: "rose.png",
  poda_hortensia: "hyacinth.png",
  poda_lavanda: "lavanda.svg",

  // === 22 MONDAS ===
  monda_cenoura: "carrot.png",
  monda_rabanete: "rabanete.svg",
  monda_beterraba: "beterraba.svg",
  monda_nabo: "nabo.svg",
  monda_alface: "leafy_green.png",
  monda_espinafre: "fluttering_leaf.png",
  monda_rucula: "green_salad.png",
  monda_acelga: "leafy_green.png",
  monda_alho: "garlic.png",
  monda_alho_porro: "alho_porro.svg",
  monda_cebola: "onion.png",
  monda_tomateiro: "tomato.png",
  monda_pimenteiro: "bell_pepper.png",
  monda_beringela: "eggplant.png",
  monda_curgete: "curgete.svg",
  monda_abobora: "abobora.svg",
  monda_melao: "melon.png",
  monda_milho: "corn.png",
  monda_favas: "fava.svg",
  monda_couve: "broccoli.png",
  monda_salsa: "herb.png",
  monda_manjericao: "seedling.png",

  // === 33 FARM ANIMALS ===
  animal_galinhas: "chicken.png",
  animal_galo: "rooster.png",
  animal_patos: "duck.png",
  animal_gansos: "goose.png",
  animal_perus: "turkey.png",
  animal_codornizes: "codorniz.svg",
  animal_pintadas: "pintada.svg",
  animal_coelhos: "rabbit_face.png",
  animal_coelho_flandres: "rabbit.png",
  animal_coelho_anao: "rabbit_face.png",
  animal_cabras_leite: "goat.png",
  animal_cabras_anas: "goat.png",
  animal_ovelhas: "ewe.png",
  animal_carneiro: "ram.png",
  animal_porco_alentejano: "pig.png",
  animal_porco_bisaro: "pig_face.png",
  animal_vacas_leite: "cow.png",
  animal_vacas_carne: "ox.png",
  animal_burro_miranda: "donkey.png",
  animal_cavalo_lusitano: "horse.png",
  animal_garrano: "horse_face.png",
  animal_abelhas: "honeybee.png",
  animal_colmeia: "honey_pot.png",
  animal_cao_guarda: "dog.png",
  animal_gato_quinta: "cat.png",
  animal_alpaca: "llama.png",
  animal_pombos: "dove.png",
  animal_pavao: "peacock.png",
  animal_faisao: "faisao.svg",
  animal_perdiz: "perdiz.svg",
  animal_minhocas: "worm.png",
  animal_caracol: "snail.png",
  animal_carpa: "fish.png",

  // === 8 MUSHROOMS ===
  mush_tortulho: "mush_tortulho.svg",
  mush_sancha: "mush_sancha.svg",
  mush_boletus: "mush_boletus.svg",
  mush_cantarela: "mush_cantarela.svg",
  mush_morchella: "mush_morchella.svg",
  mush_miscaro: "mush_miscaro.svg",
  mush_amanita_muscaria: "mushroom.png",
  mush_amanita_phalloides: "mush_phalloides.svg"
};

// Fallback mapping by emoji character
export const EMOJI_CHAR_3D_MAP = {
  "🍅": "tomato.png",
  "🥕": "carrot.png",
  "🌽": "corn.png",
  "🍆": "eggplant.png",
  "🥒": "cucumber.png",
  "🫑": "bell_pepper.png",
  "🌶️": "hot_pepper.png",
  "🌶": "hot_pepper.png",
  "🧄": "garlic.png",
  "🧅": "onion.png",
  "🥔": "potato.png",
  "🍠": "sweet_potato.png",
  "🥦": "broccoli.png",
  "🥬": "leafy_green.png",
  "🥜": "peanuts.png",
  "🌰": "chestnut.png",
  "🍓": "strawberry.png",
  "🍒": "cherries.png",
  "🍑": "peach.png",
  "🍐": "pear.png",
  "🍎": "red_apple.png",
  "🍊": "tangerine.png",
  "🍋": "lemon.png",
  "🍇": "grapes.png",
  "🍉": "watermelon.png",
  "🍈": "melon.png",
  "🥑": "avocado.png",
  "🥝": "kiwi.png",
  "🫒": "olive.png",
  "🫚": "ginger.png",
  "🫛": "pea_pod.png",
  "🫘": "beans.png",
  "🫐": "blueberries.png",
  "🎃": "abobora.svg",
  "🌱": "seedling.png",
  "🌿": "herb.png",
  "🍃": "fluttering_leaf.png",
  "🌾": "sheaf_of_rice.png",
  "🌼": "blossom.png",
  "🌹": "rose.png",
  "🪻": "hyacinth.png",
  "🌳": "deciduous_tree.png",
  "🪴": "potted_plant.png",
  "🥗": "green_salad.png",
  "🍄": "mushroom.png",
  "🐔": "chicken.png",
  "🐓": "rooster.png",
  "🦆": "duck.png",
  "🪿": "goose.png",
  "🦃": "turkey.png",
  "🐦": "bird.png",
  "🐰": "rabbit_face.png",
  "🐇": "rabbit.png",
  "🐐": "goat.png",
  "🐑": "ewe.png",
  "🐏": "ram.png",
  "🐖": "pig.png",
  "🐄": "cow.png",
  "🐂": "ox.png",
  "🫏": "donkey.png",
  "🐎": "horse.png",
  "🐴": "horse_face.png",
  "🐝": "honeybee.png",
  "🍯": "honey_pot.png",
  "🐕": "dog.png",
  "🐈": "cat.png",
  "🦙": "llama.png",
  "🕊️": "dove.png",
  "🕊": "dove.png",
  "🦚": "peacock.png",
  "🪱": "worm.png",
  "🐌": "snail.png",
  "🐟": "fish.png"
};

export function resolve3DEmojiAsset(itemOrEmoji, explicitEmoji) {
  if (itemOrEmoji && typeof itemOrEmoji === "object") {
    const id = itemOrEmoji.id;
    if (id && ITEM_ID_3D_MAP[id]) {
      return resolveAssetUrl(`./images/emojis3d/${ITEM_ID_3D_MAP[id]}`);
    }
    const name = (itemOrEmoji.name || "").toLowerCase();
    if (name.includes("feijão-frade") || name.includes("feijao-frade")) return resolveAssetUrl("./images/emojis3d/feijao_frade.svg");
    if (name.includes("tremoço") || name.includes("tremoco")) return resolveAssetUrl("./images/emojis3d/tremoco.svg");
    if (name.includes("couve-galega")) return resolveAssetUrl("./images/emojis3d/couve_galega.svg");
    if (name.includes("couve-roxa")) return resolveAssetUrl("./images/emojis3d/couve_roxa.svg");
    if (name.includes("couve-flor")) return resolveAssetUrl("./images/emojis3d/couve_flor.svg");
    if (name.includes("agrião") || name.includes("agriao")) return resolveAssetUrl("./images/emojis3d/agriao.svg");
    if (name.includes("salva")) return resolveAssetUrl("./images/emojis3d/salva.svg");
    if (name.includes("beterraba")) return resolveAssetUrl("./images/emojis3d/beterraba.svg");
    if (name.includes("rabanete")) return resolveAssetUrl("./images/emojis3d/rabanete.svg");
    if (name.includes("alho-porro") || name.includes("alho-francês")) return resolveAssetUrl("./images/emojis3d/alho_porro.svg");
    if (name.includes("figo") || name.includes("figueira")) return resolveAssetUrl("./images/emojis3d/figo.svg");
    if (name.includes("romã") || name.includes("roma")) return resolveAssetUrl("./images/emojis3d/roma.svg");
    if (name.includes("ameixa") || name.includes("ameixeira")) return resolveAssetUrl("./images/emojis3d/ameixa.svg");
    if (name.includes("alperce") || name.includes("damasqueiro")) return resolveAssetUrl("./images/emojis3d/alperce.svg");
    if (name.includes("marmelo") || name.includes("marmeleiro")) return resolveAssetUrl("./images/emojis3d/marmelo.svg");
    if (name.includes("dióspiro") || name.includes("diospiro")) return resolveAssetUrl("./images/emojis3d/diospiro.svg");
    if (name.includes("nêspera") || name.includes("nespera")) return resolveAssetUrl("./images/emojis3d/nespera.svg");
    if (name.includes("framboesa") || name.includes("framboeseiro")) return resolveAssetUrl("./images/emojis3d/framboesa.svg");
    if (name.includes("amora")) return resolveAssetUrl("./images/emojis3d/amora.svg");
    if (name.includes("lavanda") || name.includes("alfazema")) return resolveAssetUrl("./images/emojis3d/lavanda.svg");

    const em = (explicitEmoji || itemOrEmoji.emoji || "").trim();
    if (em && EMOJI_CHAR_3D_MAP[em]) {
      return resolveAssetUrl(`./images/emojis3d/${EMOJI_CHAR_3D_MAP[em]}`);
    }
    return null;
  }

  const emStr = typeof itemOrEmoji === "string" ? itemOrEmoji.trim() : "";
  if (ITEM_ID_3D_MAP[emStr]) {
    return resolveAssetUrl(`./images/emojis3d/${ITEM_ID_3D_MAP[emStr]}`);
  }
  if (EMOJI_CHAR_3D_MAP[emStr]) {
    return resolveAssetUrl(`./images/emojis3d/${EMOJI_CHAR_3D_MAP[emStr]}`);
  }
  return null;
}

export default function Emoji3D({
  item,
  emoji,
  size = "md",
  badge = false,
  className = "",
  alt = ""
}) {
  const [failed, setFailed] = useState(false);
  const src = resolve3DEmojiAsset(item || emoji, emoji);
  const fallbackEmoji = emoji || (item && item.emoji) || "🌱";

  const sizeMap = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16"
  };

  const badgeSizeMap = {
    xs: "w-6 h-6 p-1 rounded-lg",
    sm: "w-7 h-7 p-1 rounded-xl",
    md: "w-9 h-9 p-1.5 rounded-2xl",
    lg: "w-11 h-11 p-1.5 rounded-2xl",
    xl: "w-14 h-14 p-2 rounded-3xl",
    "2xl": "w-20 h-20 p-2.5 rounded-3xl"
  };

  if (!src || failed) {
    return (
      <span className={`inline-flex items-center justify-center select-none ${className}`}>
        {fallbackEmoji}
      </span>
    );
  }

  if (badge) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 select-none bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_6px_16px_-3px_rgba(0,0,0,0.28),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-transform duration-300 group-hover:scale-110 ${
          badgeSizeMap[size] || badgeSizeMap.md
        } ${className}`}
      >
        <img
          src={src}
          alt={alt || (item && item.name) || fallbackEmoji}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.22)]"
        />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt || (item && item.name) || fallbackEmoji}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`inline-block object-contain shrink-0 select-none drop-shadow-[0_3px_5px_rgba(0,0,0,0.28)] transition-transform duration-300 group-hover:scale-110 ${
        sizeMap[size] || sizeMap.md
      } ${className}`}
    />
  );
}
