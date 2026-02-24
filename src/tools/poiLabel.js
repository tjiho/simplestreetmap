/**
 * getLabel(tags) → string
 *
 * Prend les propriétés d'un POI OpenStreetMap et retourne
 * un label lisible en français, ex: "Restaurant · Japonaise"
 *
 * Dépend de TAGS (tags.js) pour les traductions de base.
 */


// — Ordre de priorité des clés principales —
// La première clé trouvée dans cet ordre devient la base du label.
const KEY_PRIORITY = [
  "tourism",
  "amenity",
  "shop",
  "leisure",
  "healthcare",
  "craft",
  "office",
  "club",
  "historic",
  "man_made",
  "emergency",
];


// — Overrides pour vending machines —
// amenity=vending_machine + vending=X → label dédié
const VENDING_LABELS = {
  parking_tickets:           "Horodateur",
  excrement_bags:            "Distributeur · Sacs canins",
  public_transport_tickets:  "Distributeur · Titres de transport",
  condoms:                   "Distributeur · Préservatifs",
  feminine_hygiene:          "Distributeur · Hygiène féminine",
  drinks:                    "Distributeur · Boissons",
  sweets:                    "Distributeur · Confiseries",
  cigarettes:                "Distributeur · Cigarettes",
  coffee:                    "Distributeur · Café",
  bicycle_tube:              "Distributeur · Chambre à air",
  stamps:                    "Distributeur · Timbres",
  fuel:                      "Distributeur · Carburant",
};


// — Overrides pour tourism=information —
// tourism=information + information=X → label dédié
const INFO_LABELS = {
  guidepost:      "Panneau indicateur",
  board:          "Panneau d'information",
  map:            "Carte / Plan",
  office:         "Office de tourisme",
  terminal:       "Borne d'information",
  trail_blaze:    "Balisage de sentier",
  route_marker:   "Marqueur d'itinéraire",
  sign:           "Panneau de signalisation",
  stele:          "Stèle d'information",
  tactile_model:  "Maquette tactile",
  tactile_map:    "Carte tactile",
};


// — Labels sport pour leisure=pitch/sports_centre —
// leisure=pitch + sport=X → "Terrain · X"
// leisure=sports_centre + sport=X → "Centre sportif · X"
const SPORT_LABELS = {
  table_tennis:    "Ping-pong",
  soccer:          "Football",
  basketball:      "Basket",
  tennis:          "Tennis",
  multi:           "Multisport",
  fitness:         "Fitness",
  climbing:        "Escalade",
  martial_arts:    "Arts martiaux",
  swimming:        "Natation",
  volleyball:      "Volley",
  handball:        "Handball",
  rugby:           "Rugby",
  boules:          "Pétanque",
  skateboard:      "Skate",
  scuba_diving:    "Plongée",
  padel:           "Padel",
  equestrian:      "Équitation",
};


// — Overrides second_hand —
const SECOND_HAND_OVERRIDES = {
  clothes:    "Friperie",
  car_parts:  "Casse auto",
};


/**
 * Cherche un label dans TAGS[category][value].
 * Retourne null si introuvable.
 */
function lookup(category, value) {
  return TAGS_TITLE[category]?.[value] ?? null;
}


/**
 * Retourne le label de cuisine, nettoyé.
 * Ex: "kebab;burger" → "Kebab, Burger"
 *     "french"       → "Française"
 */
function getCuisineLabel(raw) {
  if (!raw) return null;

  // Prend le premier si multi-valeur
  const parts = raw.split(";").map((s) => s.trim());
  const labels = parts
    .map((c) => lookup("cuisine", c) || capitalize(c.replace(/_/g, " ")))
    .slice(0, 2); // max 2 pour pas surcharger

  return labels.join(", ");
}


/**
 * Retourne le sport en français.
 * Gère les multi-valeurs (sport=soccer;rugby → premier)
 */
function getSportLabel(raw) {
  if (!raw) return null;
  const first = raw.split(";")[0].trim();
  return SPORT_LABELS[first] || lookup("sport", first) || capitalize(first.replace(/_/g, " "));
}


function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}


/**
 * Point d'entrée principal.
 *
 * @param {Object} tags - Propriétés du POI (feature.properties)
 * @returns {string} Label en français
 */
export function getLabel(tags) {
  if (!tags) return "POI";

  // ——————————————————————————————————————————
  // 1. Cas spéciaux (combos fréquentes)
  // ——————————————————————————————————————————

  // Distributeurs automatiques
  if (tags.amenity === "vending_machine" && tags.vending) {
    return VENDING_LABELS[tags.vending] || "Distributeur automatique";
  }

  // Points d'information touristique
  if (tags.tourism === "information" && tags.information) {
    return INFO_LABELS[tags.information] || "Point d'information";
  }

  // Hôtel + étoiles
  if (tags.tourism === "hotel" && tags.stars) {
    return `Hôtel ${tags.stars} étoiles`;
  }

  // Second hand → override ou suffixe
  if (tags.second_hand === "only" && tags.shop) {
    const override = SECOND_HAND_OVERRIDES[tags.shop];
    if (override) return override;
    const base = lookup("shop", tags.shop);
    if (base) return `${base} · Occasion`;
  }

  // Café thématique
  if (tags.amenity === "cafe" && tags.cafe) {
    const cafeType = lookup("cafe", tags.cafe);
    if (cafeType) return `Café · ${cafeType}`;
  }

  // ——————————————————————————————————————————
  // 2. Trouver la clé principale
  // ——————————————————————————————————————————

  let mainKey = null;
  let mainValue = null;

  for (const key of KEY_PRIORITY) {
    if (tags[key]) {
      mainKey = key;
      mainValue = tags[key];
      break;
    }
  }

  if (!mainKey) {
    // Aucune clé connue → fallback
    return tags.name || "POI";
  }

  // ——————————————————————————————————————————
  // 3. Label de base
  // ——————————————————————————————————————————

  let label = lookup(mainKey, mainValue);

  if (!label) {
    // Pas dans TAGS → on humanise la clé brute
    label = capitalize(mainValue.replace(/_/g, " "));
  }

  // ——————————————————————————————————————————
  // 4. Enrichir avec les tags secondaires
  // ——————————————————————————————————————————

  // Cuisine (restaurant, fast_food, cafe, bar)
  // On saute "coffee_shop" seul sur un café (redondant)
  if (tags.cuisine && ["restaurant", "fast_food", "cafe", "bar", "ice_cream"].includes(mainValue)) {
    let cuisine = tags.cuisine;
    // Sur un café, on retire "coffee_shop" de la liste des cuisines
    if (mainValue === "cafe") {
      cuisine = cuisine
        .split(";")
        .filter((c) => c.trim() !== "coffee_shop")
        .join(";");
    }
    if (cuisine) {
      const cuisineLabel = getCuisineLabel(cuisine);
      if (cuisineLabel) {
        label += ` · ${cuisineLabel}`;
      }
    }
  }

  // Sport (pitch, sports_centre, fitness_station)
  if (tags.sport && ["pitch", "sports_centre", "fitness_station", "sports_hall"].includes(mainValue)) {
    const sportLabel = getSportLabel(tags.sport);
    if (sportLabel) {
      label += ` · ${sportLabel}`;
    }
  }

  return label;
}