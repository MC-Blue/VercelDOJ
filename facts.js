/*
 * Répertoire des faits de l'application.
 *
 * Pour ajouter un fait, ajoutez simplement une ligne à FACTS_SOURCE :
 * Nom;amende;minutes;catégorie;détails facultatifs
 *
 * Exemples :
 * Nouvelle infraction (Contravention);25000;0;0
 * Nouvelle infraction grave;500000;25;Crime;Bracelet
 *
 * Catégories acceptées : Contravention, Délit mineur, Délit majeur,
 * Crime et Crime Fédéral.
 *
 * Les faits sont automatiquement validés puis triés par catégorie et par nom.
 */
const DojFacts = (() => {
  const FACTS_SOURCE = String.raw`
Usage abusif du klaxon (Contravention);20000;0;0
Circulation à contre-sens (Contravention);30000;0;0
Circulation hors-route (Contravention);80000;0;0
Stationnement dangereux / interdit (Contravention);30000;0;0
Non-respect d'un feu rouge/stop (Contravention);30000;0;0
Dépassement dangereux (Contravention);5000;0;0
Véhicule non en état (Contravention);40000;0;0
Excès de vitesse >80km/h (Contravention);50000;0;0
Dégradation de la voie publique (Contravention);30000;0;0
Entrave à la circulation (Contravention);30000;0;0
Atteinte à la pudeur (Contravention);20000;0;0
Défaut de permis (Contravention);30000;0;0
Incitation à la haine (Contravention);30000;0;0
Dissimulation du visage (Délit mineur);100000;10;0
Défaut de permis (Délit mineur);40000;10;0
Outrage à agent (Délit mineur);100000;10;0
Outrage à la cour (Délit mineur);200000;10;0
Mise en danger de la vie d'autrui (Délit mineur);200000;10;0
Port d'arme illégal légère (Délit mineur);200000;10;0
Exhibition d'arme de catégorie A (Délit mineur);50000;15;0
Trouble à l'ordre public (Délit mineur);30000;10;0
Refus d'obtempérer (Délit mineur);80000;10;0
Menace verbale / intimidation envers agent de l'état (Délit mineur);200000;5;0
Possession d'argent sale (x2 Possession) (Délit mineur);0;5;0
Possession de gilet par balle (Délit mineur);100000;10;0
Manifestation illégale (Délit mineur);100000;10;0
Vol (Délit mineur);200000;10;0
Braquage de supérette (Délit mineur);200000;15;0
Braquage d'ATM (Délit mineur);200000;15;0
Cambriolage (Délit mineur);200000;10;0
Possession de drogue >5 (Délit mineur);100000;15;0
Usurpation d'identité (Délit mineur);300000;10;0
Usurpation de fonction publique (Délit mineur);300000;10;0
Entrave au secours (Délit mineur);80000;10;0
Attroupement illégal (Délit mineur);100000;10;0
Embuscade (Délit mineur);200000;10;0
Faux à une administration (Délit mineur);1000000;10;0
Course illégale (Délit mineur);200000;10;0
Exhibition d'arme de catégorie B/C (Délit mineur);100000;10;0
Intrusion;500000;20;Délit majeur;
Port du Gilet Pare-Balle (Délit mineur);200000;10;0
Violence physique légère (Délit mineur);200000;10;0
Violence physique légère sur agent de l'état (Délit mineur);300000;10;0
Tentative de corruption (Délit mineur);60000;10;0
Attaque de fourgon blindé (Délit mineur);200000;10;0
Diffamation (Délit mineur);50000;10;0
Violence physique aggravée (Délit majeur);400000;20;0
Complicité de Violence physique aggravée (Délit majeur);100000;10;0
Violence physique aggravée sur agent de l'état (Délit majeur);400000;25;0
Complicité de Violence physique aggravée sur agent de l'état (Délit majeur);200000;12;0
Fabrication de drogue (Délit majeur);500000;20;0
Complicité de Fabrication de drogue (Délit majeur);200000;10;0
Fabrication d'arme (Délit majeur);600000;25;0
Vente de drogue (Délit majeur);200000;20;0
Complicité de Vente de drogue (Délit majeur);100000;10;0
Escroquerie à l'entreprise (Délit majeur);300000;10;0
Entrave à une opération de police (Délit majeur);200000;10;0
Refus d'identification (Délit majeur);80000;10;0
Évasion (Délit majeur);400000;20;0
Complicité d'Évasion (Délit majeur);200000;10;0
Entrave à la justice (Délit majeur);400000;15;0
Tentative de kidnapping (Délit majeur);200000;15;0
Complicité de Tentative de kidnapping (Délit majeur);80000;7;0
Parjure (Délit majeur);200000;20;0
Braquage de Bijouterie (Délit majeur);500000;25;0
Complicité de Braquage de Bijouterie (Délit majeur);300000;12;0
Braquage de Fleeca (Délit majeur);600000;25;0
Complicité de Braquage de Fleeca (Délit majeur);300000;12;0
Abus de pouvoir (Délit majeur);500000;20;0
Port d'arme illégale lourde (Délit majeur);400000;15;0
Exhibition d'arme de catégorie D/E (Délit majeur);500000;10;0
Trahison (INDIC)(Délit majeur);500000;20;0
Appartenance à une organisation criminelle (Délit majeur);500000;20;0
Usurpation de fonction gouvernementale (Délit majeur);500000;20;0
Complicité d'Usurpation de fonction gouvernementale (Délit majeur);300000;0;0
Prise d'otage;400000;20;Crime;>= 5 otage = Bracelet
Complicité de Prise d'otage;200000;10;Crime;>= 5 otage = Bracelet
Prise d'otage sur agent de l'état;550000;25;Crime;Bracelet
Complicité de Prise d'otage sur agent de l'état;270000;12;Crime;Bracelet
Trafic d'arme;500000;35;Crime;Bracelet
Complicité de Trafic d'arme;250000;17;Crime;Bracelet
Complicité de meurtre;500000;40;Crime;Bracelet
Tentative de meurtre sur civil;450000;40;Crime;
Complicité de tentative de meurtre sur civil;220000;20;Crime;
Tir sur civil;500000;20;Crime;
Complicité de Tir sur Civil;250000;10;Crime;
Tir sur agent de l'état;500000;20;Crime;Bracelet
Complicité de Tir sur agent de l'état;250000;10;Crime;Bracelet
Tentative de meurtre sur agent de l'état;500000;25;Crime;Bracelet
Complicité de Tentative de meurtre sur agent de l'état;250000;12;Crime;Bracelet
Kidnapping;400000;20;Crime;
Complicité de Kidnapping;200000;10;Crime;
Braquage de banque (Crime);700000;30;0
Complicité de Braquage de banque (Crime);300000;15;0
Sédition;1000000;20;Crime;Bracelet
Attaque de Convoi Gouvernemental;1000000;30;Crime;Bracelet
Complicité d'Attaque de Convoi Gouvernemental;500000;15;Crime;Bracelet
Attaque de bâtiment Gouvernemental;1000000;30;Crime;Bracelet
Complicité d'Attaque de bâtiment Gouvernemental;500000;15;Crime;Bracelet
Complicité de Meurtre sur civil;500000;15;Crime;Bracelet
Complicité de Meurtre sur agent de l'état;1000000;30;Crime;Bracelet
Complicité de Terrorisme (Crime);2000000;30;0
Non-respect des règles du bracelet;3000000;30;Crime;Bracelet
Meurtre sur civil (Crime Fédéral);0;0;0
Meurtre sur agent de l'état (Crime Fédéral);0;0;0
Terrorisme (Crime Fédéral);0;0;0
Haute trahison;2000000;0;Crime Fédéral;Bracelet
Braquage de banque centrale;650000;30;Crime;Bracelet
Complicité de Braquage de banque centrale;320000;15;Crime;Bracelet
Cyber Attaque;650000;30;Crime;
Complicité de Cyber Attaque;325000;15;Crime;
Détournement de fonds;2000000;0;Crime Fédéral;Bracelet
Harcèlement;500000;35;Délit majeur;
Blanchiment d'argent;500000;25;Délit majeur;
Faux témoignage;500000;20;Délit majeur;
Braquage de coiffeur;150000;20;Délit mineur;
Complicité de Braquage de coiffeur;150000;20;Délit mineur;
Transport de marchandises illégales;350000;15;Délit majeur;
`;

  const nameCollator = new Intl.Collator("fr", {
    sensitivity: "base",
    numeric: true
  });

  const CATEGORY_ORDER = Object.freeze([
    "Contravention",
    "Délit mineur",
    "Délit majeur",
    "Crime",
    "Crime Fédéral"
  ]);
  const categoryRanks = new Map(CATEGORY_ORDER.map((category, index) => [category, index]));
  const CATEGORY_ALIASES = new Map([
    ["contravention", "Contravention"],
    ["delit mineur", "Délit mineur"],
    ["delit majeur", "Délit majeur"],
    ["crime", "Crime"],
    ["peine federale", "Crime Fédéral"],
    ["crime federal", "Crime Fédéral"],
    ["crime federale", "Crime Fédéral"]
  ]);

  function normalizeCategory(value) {
    const source = String(value || "Autre").replace(/\s*\(bracelet\)\s*/i, "").trim();
    const normalized = normalizeForSearch(source);
    return CATEGORY_ALIASES.get(normalized) || source || "Autre";
  }

  function normalizeForSearch(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function parseFact(line, index) {
    const fields = line.split(";");
    const [nameRaw, fineRaw, minutesRaw, categoryRaw, detailsRaw] = fields;
    const sourceName = String(nameRaw ?? "").trim();
    const sourceCategory = String(categoryRaw ?? "").trim();
    const hasExplicitCategory = Boolean(sourceCategory && sourceCategory !== "0");

    if (!sourceName) throw new Error(`Fait invalide à la ligne ${index + 1} : nom manquant.`);
    if (!/^\d+$/.test(String(fineRaw ?? "").trim())) {
      throw new Error(`Fait invalide à la ligne ${index + 1} : amende incorrecte.`);
    }
    if (!/^\d+$/.test(String(minutesRaw ?? "").trim())) {
      throw new Error(`Fait invalide à la ligne ${index + 1} : durée incorrecte.`);
    }

    const rawCategory = hasExplicitCategory
      ? sourceCategory
      : (sourceName.match(/\(([^)]+)\)$/)?.[1] ?? "Autre");
    const category = normalizeCategory(rawCategory);
    if (!categoryRanks.has(category)) {
      throw new Error(`Fait invalide à la ligne ${index + 1} : catégorie inconnue « ${rawCategory} ».`);
    }
    const sourceDetails = String(detailsRaw ?? "").trim();
    const details = sourceDetails.toLowerCase() === "true"
      ? "Bracelet"
      : sourceDetails.toLowerCase() === "false"
        ? ""
        : sourceDetails;

    const nameWithoutCategory = hasExplicitCategory
      ? sourceName
      : sourceName.replace(/\s*\([^)]+\)\s*$/, "").trim();

    return Object.freeze({
      nom: `${nameWithoutCategory} (${category})`,
      categorie: category,
      amende: Number(fineRaw),
      temps: Number(minutesRaw),
      details,
      hasBracelet: normalizeForSearch(`${rawCategory} ${details}`).includes("bracelet")
    });
  }

  function compareFacts(left, right) {
    const rankDifference = (categoryRanks.get(left.categorie) ?? CATEGORY_ORDER.length)
      - (categoryRanks.get(right.categorie) ?? CATEGORY_ORDER.length);
    return rankDifference || nameCollator.compare(left.nom, right.nom);
  }

  const facts = FACTS_SOURCE
    .trim()
    .split("\n")
    .map(parseFact)
    .sort(compareFacts);

  const names = new Set();
  facts.forEach((fact) => {
    if (names.has(fact.nom)) throw new Error(`Fait dupliqué : ${fact.nom}`);
    names.add(fact.nom);
  });

  const factsByName = new Map(facts.map((fact) => [fact.nom, fact]));
  const LEGACY_NAME_MIGRATIONS = new Map([
    ["Non respect d'un feu rouge/stop (Contravention)", "Non-respect d'un feu rouge/stop (Contravention)"],
    ["Trouble à l'ordre publique (Délit mineur)", "Trouble à l'ordre public (Délit mineur)"],
    ["Violence Physique légére (Délit mineur)", "Violence physique légère (Délit mineur)"],
    ["Violence Physique légére sur agent de l'état (Délit mineur)", "Violence physique légère sur agent de l'état (Délit mineur)"],
    ["Non respect des règles du bracelet (Crime)", "Non-respect des règles du bracelet (Crime)"],
    ["Meurtre sur civil (Peine fédérale)", "Meurtre sur civil (Crime Fédéral)"],
    ["Meurtre sur agent de l'état (Peine fédérale)", "Meurtre sur agent de l'état (Crime Fédéral)"],
    ["Terrorisme (Peine fédérale)", "Terrorisme (Crime Fédéral)"],
    ["Haute trahison (Peine fédérale)", "Haute trahison (Crime Fédéral)"],
    ["Détournement de fond (Peine fédérale)", "Détournement de fonds (Crime Fédéral)"],
    ["Détournement de fonds (Peine fédérale)", "Détournement de fonds (Crime Fédéral)"],
    ["Blachiment d'argent (Délit majeur)", "Blanchiment d'argent (Délit majeur)"],
    ["Transport de marchandises illégal (Délit majeur)", "Transport de marchandises illégales (Délit majeur)"],
    ["Braquage de coiffeur (Délit Mineur)", "Braquage de coiffeur (Délit mineur)"],
    ["Complicité de Braquage de coiffeur (Délit Mineur)", "Complicité de Braquage de coiffeur (Délit mineur)"]
  ]);

  LEGACY_NAME_MIGRATIONS.forEach((currentName, legacyName) => {
    if (!factsByName.has(currentName)) {
      throw new Error(`Migration de fait invalide : ${legacyName} → ${currentName}`);
    }
  });

  return Object.freeze({
    all: Object.freeze(facts),
    categories: CATEGORY_ORDER,
    compareNames: (left, right) => {
      const leftFact = factsByName.get(left);
      const rightFact = factsByName.get(right);
      if (leftFact && rightFact) return compareFacts(leftFact, rightFact);
      return nameCollator.compare(left, right);
    },
    resolveName: (name) => LEGACY_NAME_MIGRATIONS.get(name) ?? name
  });
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = DojFacts;
}
