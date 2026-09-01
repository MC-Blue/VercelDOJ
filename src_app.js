const {
  calculateSanctions,
  clampFactCount,
  clampTigValue,
  formatTime,
  sumReductions
} = DojCalculations;

const rawCodePenal = String.raw`
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
Meurtre sur civil (Peine fédérale);0;0;0
Meurtre sur agent de l'état (Peine fédérale);0;0;0
Terrorisme (Peine fédérale);0;0;0
Haute trahison;2000000;0;Peine fédérale;Bracelet
Braquage de banque centrale;650000;30;Crime;Bracelet
Complicité de Braquage de banque centrale;320000;15;Crime;Bracelet
Cyber Attaque;650000;30;Crime;
Complicité de Cyber Attaque;325000;15;Crime;
Détournement de fonds;2000000;0;Peine fédérale;Bracelet
Harcèlement;500000;35;Délit majeur;
Blanchiment d'argent;500000;25;Délit majeur;
Faux témoignage;500000;20;Délit majeur;
Braquage de coiffeur;150000;20;Délit Mineur;
Complicité de Braquage de coiffeur;150000;20;Délit Mineur;
Transport de marchandises illégales;350000;15;Délit majeur;
`;

function normalizeCategorie(value) {
  return String(value || "Autre").replace(/\s*\(bracelet\)\s*/i, "").trim() || "Autre";
}

function isBraceletFact(categorieSource, details) {
  return normalizeSearchText(`${categorieSource} ${details}`).includes("bracelet");
}

const codePenal = rawCodePenal
  .trim()
  .split("\n")
  .map((line) => {
    const fields = line.split(";");
    const [nomRaw, amendeRaw, tempsRaw, categorieRaw, detailsRaw] = fields;
    const nomSource = String(nomRaw ?? "").trim();
    const categorieSource = String(categorieRaw ?? "").trim();
    const explicitCategorie = Boolean(categorieSource && categorieSource !== "0");
    const rawCategorie = explicitCategorie
      ? categorieSource
      : (nomSource.match(/\(([^)]+)\)$/)?.[1] ?? "Autre");
    const categorie = normalizeCategorie(rawCategorie);
    const detailsSource = String(detailsRaw ?? "").trim();
    const details = detailsSource.toLowerCase() === "true"
      ? "Bracelet"
      : detailsSource.toLowerCase() === "false"
        ? ""
        : detailsSource;
    const hasBracelet = isBraceletFact(rawCategorie, details);

    return {
      nom: explicitCategorie ? `${nomSource} (${categorie})` : nomSource,
      categorie,
      amende: Number(String(amendeRaw).replace(/[^\d-]/g, "")) || 0,
      temps: parseInt(tempsRaw, 10) || 0,
      details,
      hasBracelet,
      hasDetails: fields.length >= 5
    };
  });

const state = {
  facts: [],
  pendingFact: "",
  tigActive: false,
  prisonMinutes: 0,
  tigValue: 1,
  lawyerActive: false,
  procedureVices: [],
  procedureViceTargets: {},
  decisionBeforeAcquittement: "",
  acquittementLocked: false
};

const prelimState = {
  facts: [],
  pendingFact: "",
  tigActive: false,
  rawPrisonMinutes: 0,
  prisonMinutes: 0,
  tigValue: 1,
  lawyerActive: false,
  procedureVices: [],
  procedureViceTargets: {}
};

const judgementState = {
  facts: [],
  pendingFact: "",
  factCounts: new Map()
};

const suggestionIndices = {
  doj: 0,
  prelim: 0,
  judgement: 0
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const REPORT_CHANNEL_URL = "https://discord.com/channels/1153280827245994056/1289298347294855199";
const CIVIL_PARTY_LABEL = "poste de police de SERVICE / INSTITUTION";
const EMPTY_PERSON_LABEL = "nom et prénom à compléter";
const THEME_STORAGE_KEY = "doj_color_palette";
const CASE_STORAGE_KEY = "doj_case_autosave_v1";
const CASE_EXPORT_VERSION = 1;
const COLOR_PALETTES = [
  { id: "cyan", label: "Bleu cyan", primary: "#2bd7ff", primaryStrong: "#0ea5d7", accent: "#5bd7ff" },
  { id: "blue", label: "Bleu police", primary: "#5aa7ff", primaryStrong: "#2563eb", accent: "#8bbcff" },
  { id: "violet", label: "Violet", primary: "#a78bfa", primaryStrong: "#7c3aed", accent: "#c4b5fd" },
  { id: "green", label: "Vert", primary: "#43d695", primaryStrong: "#129765", accent: "#7ee7b6" },
  { id: "red", label: "Rouge", primary: "#ff667d", primaryStrong: "#dc2747", accent: "#ff9aad" },
  { id: "gold", label: "Or", primary: "#f5c451", primaryStrong: "#c78314", accent: "#ffe08a" },
  { id: "whiteblue", label: "Glace", primary: "#d7efff", primaryStrong: "#74b8e8", accent: "#9bd8ff" },
  { id: "pink", label: "Rose", primary: "#ff7ac8", primaryStrong: "#db2777", accent: "#ffaddd" }
];

const PROCEDURE_VICES = [
  { id: "1-1", category: "I - Droits fondamentaux", name: "Absence d'accès à un avocat alors que celui-ci est disponible", effect: "Acquittement", type: "acquittement" },
  { id: "1-2", category: "I - Droits fondamentaux", name: "Non-respect du délai légal d'attente de l'avocat", effect: "Acquittement", type: "acquittement" },
  { id: "1-3", category: "I - Droits fondamentaux", name: "Interrogatoire conduit sans la présence ou l'accord exprès de l'avocat, après demande formelle", effect: "Acquittement", type: "acquittement" },
  { id: "1-4", category: "I - Droits fondamentaux", name: "Atteinte au droit au silence", effect: "Acquittement", type: "acquittement" },
  { id: "1-5", category: "I - Droits fondamentaux", name: "Non-lecture des droits Miranda à l'individu", effect: "Acquittement", type: "acquittement" },
  { id: "1-6", category: "I - Droits fondamentaux", name: "Non-respect du délai raisonnable de notification des droits Miranda (15 minutes maximum après l'arrestation et l'arrivée au poste)", effect: "Acquittement", type: "acquittement" },
  { id: "1-7", category: "I - Droits fondamentaux", name: "Objets saisis avant lecture des droits", effect: "Réduction de peine de 30 %", type: "reduction", reduction: 30 },
  { id: "1-8", category: "I - Droits fondamentaux", name: "Aucune information communiquée sur les accusations lors de la procédure", effect: "Acquittement", type: "acquittement" },
  { id: "1-9", category: "I - Droits fondamentaux", name: "Traitements inhumains ou dégradants, menaces, pressions morales ou contraintes psychologiques hors cadre légal", effect: "Acquittement", type: "acquittement" },
  { id: "1-10", category: "I - Droits fondamentaux", name: "Conditions de détention contraires à la dignité humaine", effect: "Acquittement", type: "acquittement" },
  { id: "1-11", category: "I - Droits fondamentaux", name: "Refus injustifié de soins médicaux en détention", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "1-12", category: "I - Droits fondamentaux", name: "Refus injustifié de fournir nourriture ou boisson", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "1-13", category: "I - Droits fondamentaux", name: "Privation d'accès aux installations sanitaires ou aux mesures d'hygiène élémentaires", effect: "Réduction de peine de 25 %", type: "reduction", reduction: 25 },
  { id: "2-1", category: "II - Procédure judiciaire", name: "Non-transmission du dossier complet au DOJ ou à l'avocat dans le cadre d'une procédure de jugement", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "2-2", category: "II - Procédure judiciaire", name: "Non-transmission de la mise en détention (MED) à l'avocat (avant ou pendant une comparution/audience)", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "2-3", category: "II - Procédure judiciaire", name: "Non-respect du délai d'attente de la réponse du DOJ ou de l'avocat", effect: "Acquittement", type: "acquittement" },
  { id: "2-4", category: "II - Procédure judiciaire", name: "Refus de pause raisonnable durant un interrogatoire pour l'avocat ou le suspect", effect: "Réduction de peine de 25 %", type: "reduction", reduction: 25 },
  { id: "2-5", category: "II - Procédure judiciaire", name: "Sortie de comparution sans autorisation préalable du DOJ", effect: "Réduction de peine de 30 %", type: "reduction", reduction: 30 },
  { id: "2-6", category: "II - Procédure judiciaire", name: "Facture émise avant la fin de la comparution", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "3-1", category: "III - Preuves", name: "Preuve obtenue illégalement (absence de mandat ou de base légale)", effect: "Acquittement", type: "acquittement" },
  { id: "3-2", category: "III - Preuves", name: "Preuve inventée, fabriquée ou falsifiée", effect: "Acquittement", type: "acquittement" },
  { id: "3-3", category: "III - Preuves", name: "Destruction, altération, dissimulation ou perte volontaire des preuves", effect: "Acquittement", type: "acquittement" },
  { id: "3-4", category: "III - Preuves", name: "Destruction, altération, dissimulation ou perte d'un élément disculpatoire", effect: "Acquittement", type: "acquittement" },
  { id: "3-5", category: "III - Preuves", name: "Objet illégal mentionné sans preuve de saisie dans la MED", effect: "Annulation de la peine de possession", type: "annulation" },
  { id: "3-6", category: "III - Preuves", name: "Objet illégal saisi mais non effectivement possédé par l'individu", effect: "Annulation de la peine de possession", type: "annulation" },
  { id: "4-1", category: "IV - Arrestation", name: "Arrestation sans éléments matériels, indices objectifs ou témoignages concordants", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "4-2", category: "IV - Arrestation", name: "Arrestation sans nécessité légale ou manifestement disproportionnée", effect: "Réduction de peine de 30 %", type: "reduction", reduction: 30 },
  { id: "4-3", category: "IV - Arrestation", name: "Usage excessif de la force lors de l'arrestation", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "4-4", category: "IV - Arrestation", name: "Non-respect de la gradation et de l'escalade des moyens", effect: "Réduction de peine de 25 %", type: "reduction", reduction: 25 },
  { id: "4-5", category: "IV - Arrestation", name: "Atteinte à la dignité de la personne lors de l'arrestation", effect: "Réduction de peine de 40 %", type: "reduction", reduction: 40 },
  { id: "5-1", category: "V - Détention abusive", name: "Détention prolongée sans jugement ou sans justification légale", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "5-2", category: "V - Détention abusive", name: "Détention fondée sur des motifs punitifs, politiques, personnels ou discriminatoires", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "5-3", category: "V - Détention abusive", name: "Traitement différencié ou discriminatoire sans justification légale objective", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "6-1", category: "VI - Rapports et erreurs", name: "Inexactitude ou mauvaise qualification des faits dans les rapports", effect: "Réduction de peine de 40 %", type: "reduction", reduction: 40 },
  { id: "6-2", category: "VI - Rapports et erreurs", name: "Absence de pièces essentielles au dossier (rapports, photographies, objets saisis)", effect: "Réduction de peine de 25 %", type: "reduction", reduction: 25 },
  { id: "6-3", category: "VI - Rapports et erreurs", name: "Absence totale de Mise En Détention (MED)", effect: "Acquittement", type: "acquittement" },
  { id: "6-4", category: "VI - Rapports et erreurs", name: "Modification de la MED sans validation préalable du DOJ", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "6-5", category: "VI - Rapports et erreurs", name: "Erreur d'identité majeure (nom, prénom, sexe)", effect: "Acquittement", type: "acquittement" },
  { id: "6-6", category: "VI - Rapports et erreurs", name: "Erreur d'identité administrative (autres éléments d'état civil)", effect: "Réduction de peine de 25 %", type: "reduction", reduction: 25 },
  { id: "6-7", category: "VI - Rapports et erreurs", name: "Qualification pénale ne correspondant pas à l'infraction la plus grave applicable", effect: "Réduction de peine de 40 %", type: "reduction", reduction: 40 },
  { id: "7-1", category: "VII - Photographies et saisies", name: "Photographie du casier non conforme (tête et épaules uniquement) ou manquante", effect: "Réduction de peine de 25 %", type: "reduction", reduction: 25 },
  { id: "7-2", category: "VII - Photographies et saisies", name: "Présence d'effets personnels visibles sur la photographie", effect: "Réduction de peine de 25 %", type: "reduction", reduction: 25 },
  { id: "7-3", category: "VII - Photographies et saisies", name: "Objets illégaux non saisis ou omission de saisie avant comparution", effect: "Réduction de peine de 75 %", type: "reduction", reduction: 75 },
  { id: "7-4", category: "VII - Photographies et saisies", name: "Absence de photographies complètes (face, dos, profil gauche et profil droit) pour un individu tatoué", effect: "Réduction de peine de 25 %", type: "reduction", reduction: 25 },
  { id: "8-1", category: "VIII - Abus de pouvoir", name: "Exercice de l'autorité à des fins personnelles ou illégales", effect: "Acquittement", type: "acquittement" },
  { id: "8-2", category: "VIII - Abus de pouvoir", name: "Menaces, pressions ou contraintes visant à obtenir aveux ou informations hors cadre légal", effect: "Acquittement", type: "acquittement" },
  { id: "8-3", category: "VIII - Abus de pouvoir", name: "Représailles directes ou déguisées à l'encontre d'un individu ou d'un groupe", effect: "Réduction de peine de 40 %", type: "reduction", reduction: 40 },
  { id: "8-4", category: "VIII - Abus de pouvoir", name: "Utilisation des pouvoirs publics à des intérêts privés", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "8-5", category: "VIII - Abus de pouvoir", name: "Sanctions manifestement excessives ou injustifiées", effect: "Réduction de peine de 40 %", type: "reduction", reduction: 40 },
  { id: "8-6", category: "VIII - Abus de pouvoir", name: "Altération volontaire de la version des faits par une autorité ou un témoin officiel", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "9-1", category: "IX - Infractions majeures", name: "Propos incompatibles avec la fonction (menaces, insultes, propos discriminatoires ou intimidants)", effect: "Réduction de peine de 50 % + suites disciplinaires DOJ", type: "reduction", reduction: 50 },
  { id: "9-2", category: "IX - Infractions majeures", name: "Ajout, invention ou modification d'un chef d'accusation sans base légale ou validation du DOJ", effect: "Annulation de la peine concernée", type: "annulation" },
  { id: "9-3", category: "IX - Infractions majeures", name: "Falsification, altération ou création de documents juridiques ou officiels", effect: "Annulation de la peine concernée", type: "annulation" },
  { id: "9-4", category: "IX - Infractions majeures", name: "Application ou interprétation volontairement erronée de la loi à des fins personnelles", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "9-5", category: "IX - Infractions majeures", name: "Refus de communication d'informations légales ou défaut de transparence dans une enquête", effect: "Réduction de peine de 30 %", type: "reduction", reduction: 30 },
  { id: "9-6", category: "IX - Infractions majeures", name: "Atteinte au droit de la défense empêchant l'accusé de se défendre équitablement", effect: "Réduction de peine de 50 %", type: "reduction", reduction: 50 },
  { id: "9-7", category: "IX - Infractions majeures", name: "Retard injustifié dans le traitement d'une procédure judiciaire", effect: "Réduction de peine de 25 %", type: "reduction", reduction: 25 },
  { id: "9-8", category: "IX - Infractions majeures", name: "Manipulation de la procédure judiciaire visant à fausser l'issue d'une décision", effect: "Acquittement", type: "acquittement" }
];

const refs = {
  prelimForm: $("#prelimForm"),
  dojForm: $("#dojForm"),
  judgementForm: $("#judgementForm"),
  resetCase: $("#resetCase"),
  paletteToggle: $("#paletteToggle"),
  colorPalette: $("#colorPalette"),
  colorPaletteOptions: $("#colorPaletteOptions"),
  prelimName: $("#prelimName"),
  prelimLinkMed: $("#prelimLinkMed"),
  prelimJudge: $("#prelimJudge"),
  prelimSelectedFacts: $("#prelimSelectedFacts"),
  prelimFactSearch: $("#prelimFactSearch"),
  prelimFactSuggestions: $("#prelimFactSuggestions"),
  prelimComboToggle: $("#prelimComboToggle"),
  prelimAddFact: $("#prelimAddFact"),
  prelimTimeTotal: $("#prelimTimeTotal"),
  tigToggle: $("#tigToggle"),
  prelimTigValueField: $("#prelimTigValueField"),
  prelimTigValue: $("#prelimTigValue"),
  prelimTigHint: $("#prelimTigHint"),
  prelimViceReduction: $("#prelimViceReduction"),
  prelimTimeCapNotice: $("#prelimTimeCapNotice"),
  prelimLawyerToggle: $("#prelimLawyerToggle"),
  prelimLawyerName: $("#prelimLawyerName"),
  prelimLawyerNameField: $("#prelimLawyerNameField"),
  copyPrelimSapd: $("#copyPrelimSapd"),
  openPrelimHearing: $("#openPrelimHearing"),
  openPrelimVicesPicker: $("#openPrelimVicesPicker"),
  copyPrelimVicesContest: $("#copyPrelimVicesContest"),
  prelimSelectedProcedureVices: $("#prelimSelectedProcedureVices"),
  prelimVicesCounter: $("#prelimVicesCounter"),
  judgementName: $("#judgementName"),
  judgementLinkMed: $("#judgementLinkMed"),
  judgementJudge: $("#judgementJudge"),
  judgementSelectedFacts: $("#judgementSelectedFacts"),
  judgementFactSearch: $("#judgementFactSearch"),
  judgementFactSuggestions: $("#judgementFactSuggestions"),
  judgementComboToggle: $("#judgementComboToggle"),
  judgementAddFact: $("#judgementAddFact"),
  judgementTimeTotal: $("#judgementTimeTotal"),
  judgementFineTotal: $("#judgementFineTotal"),
  copyJudgementSapd: $("#copyJudgementSapd"),
  name: $("#name"),
  linkMed: $("#linkMed"),
  judge: $("#judge"),
  selectedFacts: $("#selectedFacts"),
  factSearch: $("#factSearch"),
  factSuggestions: $("#factSuggestions"),
  comboToggle: $("#comboToggle"),
  addFact: $("#addFact"),
  timeTotal: $("#timeTotal"),
  comparutionTigToggle: $("#comparutionTigToggle"),
  comparutionTigValueField: $("#comparutionTigValueField"),
  comparutionTigValue: $("#comparutionTigValue"),
  comparutionTigHint: $("#comparutionTigHint"),
  lawyerToggle: $("#lawyerToggle"),
  lawyerName: $("#lawyerName"),
  lawyerNameField: $("#lawyerNameField"),
  fineTotal: $("#fineTotal"),
  fineDouble: $("#fineDouble"),
  viceReduction: $("#viceReduction"),
  openHearing: $("#openHearing"),
  openVicesPicker: $("#openVicesPicker"),
  copySapd: $("#copySapd"),
  copyVicesContest: $("#copyVicesContest"),
  selectedProcedureVices: $("#selectedProcedureVices"),
  vicesCounter: $("#vicesCounter"),
  vices: $("#vices"),
  modal: $("#modal"),
  modalTitle: $("#modalTitle"),
  modalBody: $("#modalBody"),
  copyFallbackModal: $("#copyFallbackModal"),
  manualCopyText: $("#manualCopyText"),
  procedureVicesModal: $("#procedureVicesModal"),
  procedureVicesModalTitle: $("#procedureVicesModalTitle"),
  procedureVicesPickerSearch: $("#procedureVicesPickerSearch"),
  procedureVicesPickerCount: $("#procedureVicesPickerCount"),
  procedureVicesPickerList: $("#procedureVicesPickerList"),
  finishProcedureVices: $("#finishProcedureVices"),
  toast: $("#toast"),
  toastTitle: $("#toastTitle"),
  toastMessage: $("#toastMessage"),
  infoSearch: $("#infoSearch"),
  codeTable: $("#codeTable"),
  procedureVicesSearch: $("#procedureVicesSearch"),
  procedureVicesTable: $("#procedureVicesTable"),
  resetConfirmModal: $("#resetConfirmModal"),
  resetConfirmText: $("#resetConfirmText"),
  cancelReset: $("#cancelReset"),
  confirmReset: $("#confirmReset")
};

const factByName = new Map(codePenal.map((fact) => [fact.nom, fact]));
const procedureViceById = new Map(PROCEDURE_VICES.map((vice) => [vice.id, vice]));
const FACT_NAME_MIGRATIONS = new Map([
  ["Non respect d'un feu rouge/stop (Contravention)", "Non-respect d'un feu rouge/stop (Contravention)"],
  ["Trouble à l'ordre publique (Délit mineur)", "Trouble à l'ordre public (Délit mineur)"],
  ["Violence Physique légére (Délit mineur)", "Violence physique légère (Délit mineur)"],
  ["Violence Physique légére sur agent de l'état (Délit mineur)", "Violence physique légère sur agent de l'état (Délit mineur)"],
  ["Non respect des règles du bracelet (Crime)", "Non-respect des règles du bracelet (Crime)"],
  ["Détournement de fond (Peine fédérale)", "Détournement de fonds (Peine fédérale)"],
  ["Blachiment d'argent (Délit majeur)", "Blanchiment d'argent (Délit majeur)"],
  ["Transport de marchandises illégal (Délit majeur)", "Transport de marchandises illégales (Délit majeur)"]
]);

const CATEGORY_SEVERITY = new Map([
  ["peine federale", 0],
  ["crime", 1],
  ["delit majeur", 2],
  ["delit mineur", 3],
  ["contravention", 4],
  ["autre", 5]
]);

function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
    .format(Number(value) || 0)
    .replace("$US", "$");
}

function factSeverityClass(fact) {
  const category = normalizeSearchText(fact?.categorie || "");
  if (category.includes("peine federale")) return "severity-federal";
  if (category.includes("crime")) return "severity-crime";
  if (category.includes("delit majeur")) return "severity-major";
  if (category.includes("delit mineur")) return "severity-minor";
  return "severity-contravention";
}

function appendFactCardContent(container, factName) {
  const fact = factByName.get(factName);
  const heading = document.createElement("span");
  heading.className = "fact-card-heading";
  appendFactDisplay(heading, factName);

  const meta = document.createElement("span");
  meta.className = "fact-card-meta";
  [
    fact?.categorie || "Autre",
    `${fact?.temps ?? 0} min`,
    formatMoney(fact?.amende ?? 0)
  ].forEach((value) => {
    const chip = document.createElement("span");
    chip.className = "fact-meta-chip";
    chip.textContent = value;
    meta.append(chip);
  });

  container.append(heading, meta);
}

function formatFactsForCopy(facts, countsOverride = null) {
  if (!facts.length) return "⛔ Faits retenus :";

  const counts = new Map();
  facts.forEach((fact) => {
    const count = countsOverride?.get(fact) ?? ((counts.get(fact) ?? 0) + 1);
    counts.set(fact, count);
  });

  const lines = Array.from(counts, ([fact, count]) => `- ${fact}${count > 1 ? `x${count}` : ""}`);
  return ["⛔ Faits retenus :", ...lines].join("\n");
}

function formatFactsForOpening(facts, countsOverride = null) {
  if (!facts.length) return "<li>-</li>";

  const counts = new Map();
  facts.forEach((fact) => {
    const count = countsOverride?.get(fact) ?? ((counts.get(fact) ?? 0) + 1);
    counts.set(fact, count);
  });

  return Array.from(counts, ([fact, count]) => `<li>${escapeHtml(fact)}${count > 1 ? `x${count}` : ""}</li>`).join("");
}

function normalizeSearchText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function fuzzyThreshold(length) {
  if (length <= 2) return 0;
  if (length <= 4) return 1;
  if (length <= 8) return 2;
  return 3;
}

function damerauLevenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
      }
    }
  }

  return matrix[a.length][b.length];
}

function scoreSearchToken(queryToken, targetToken) {
  if (targetToken === queryToken) return 0;
  if (targetToken.startsWith(queryToken)) return 1;
  if (targetToken.includes(queryToken)) return 2;
  if (queryToken.length <= 2) return Infinity;

  const threshold = fuzzyThreshold(queryToken.length);
  const prefix = targetToken.slice(0, Math.min(targetToken.length, queryToken.length));
  const distance = Math.min(
    damerauLevenshtein(queryToken, targetToken),
    damerauLevenshtein(queryToken, prefix)
  );

  return distance <= threshold ? 6 + distance : Infinity;
}

function factSearchText(fact) {
  return `${fact.nom} ${fact.categorie} ${fact.details} ${fact.hasBracelet ? "Bracelet" : ""}`;
}

function scoreFactSearch(fact, query) {
  const target = normalizeSearchText(factSearchText(fact));
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;
  if (target.includes(normalizedQuery)) return target.indexOf(normalizedQuery);

  const compactTarget = target.replace(/\s/g, "");
  const compactQuery = normalizedQuery.replace(/\s/g, "");
  if (compactTarget.includes(compactQuery)) return 20 + compactTarget.indexOf(compactQuery);

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const targetTokens = target.split(" ").filter(Boolean);
  let score = 60;

  for (const queryToken of queryTokens) {
    const bestScore = Math.min(...targetTokens.map((targetToken) => scoreSearchToken(queryToken, targetToken)));
    if (!Number.isFinite(bestScore)) return Infinity;
    score += bestScore;
  }

  return score;
}

function searchFacts(query) {
  if (!normalizeSearchText(query)) return codePenal;

  return codePenal
    .map((fact, index) => ({
      fact,
      index,
      score: scoreFactSearch(fact, query),
      length: normalizeSearchText(fact.nom).length
    }))
    .filter((result) => Number.isFinite(result.score))
    .sort((a, b) => a.score - b.score || a.length - b.length || a.index - b.index)
    .map((result) => result.fact);
}

function updatePrelimPrisonMinutes() {
  const reduction = selectedProcedureReduction(prelimState);
  const sanctions = calculateSanctions(
    prelimState.facts.map((name) => factByName.get(name)).filter(Boolean),
    {
      reduction,
      annulledFacts: selectedAnnulledFacts(prelimState, prelimState.facts)
    }
  );
  prelimState.rawPrisonMinutes = sanctions.minutes;
  prelimState.prisonMinutes = Math.min(60, sanctions.minutes);
  refs.prelimViceReduction.value = `${reduction} %`;
}

function commitComparutionTigValue() {
  state.tigValue = clampTigValue(refs.comparutionTigValue.value, state.tigValue);
  refs.comparutionTigValue.value = String(state.tigValue);
  refs.comparutionTigHint.hidden = true;
  return state.tigValue;
}

function commitPrelimTigValue() {
  prelimState.tigValue = clampTigValue(refs.prelimTigValue.value, prelimState.tigValue);
  refs.prelimTigValue.value = String(prelimState.tigValue);
  refs.prelimTigHint.hidden = true;
  return prelimState.tigValue;
}

function updateTigDraft(input, targetState, hint, summary) {
  const value = input.value.trim();
  const valid = /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 300;
  hint.hidden = valid || !value;
  if (valid) {
    targetState.tigValue = Number(value);
    summary.value = `${value} T.I.G`;
  } else {
    summary.value = value ? `${targetState.tigValue} T.I.G` : "— T.I.G";
  }
  saveCaseToStorage();
}

function getComparutionTimeText() {
  return state.tigActive
    ? `${commitComparutionTigValue()} T.I.G`
    : refs.timeTotal.value;
}

function getLawyerName() {
  return refs.lawyerName.value.trim();
}

function hasLawyer() {
  return state.lawyerActive && getLawyerName();
}

function getPrelimLawyerName() {
  return refs.prelimLawyerName.value.trim();
}

function hasPrelimLawyer() {
  return prelimState.lawyerActive && getPrelimLawyerName();
}

function updateLawyerControl() {
  refs.lawyerToggle.classList.toggle("active", state.lawyerActive);
  refs.lawyerToggle.setAttribute("aria-pressed", String(state.lawyerActive));
  refs.lawyerNameField.hidden = !state.lawyerActive;
  if (!state.lawyerActive) refs.lawyerName.value = "";
  updateFieldVisualState(refs.lawyerName);
  saveCaseToStorage();
}

function updatePrelimLawyerControl() {
  refs.prelimLawyerToggle.classList.toggle("active", prelimState.lawyerActive);
  refs.prelimLawyerToggle.setAttribute("aria-pressed", String(prelimState.lawyerActive));
  refs.prelimLawyerNameField.hidden = !prelimState.lawyerActive;
  if (!prelimState.lawyerActive) refs.prelimLawyerName.value = "";
  updateFieldVisualState(refs.prelimLawyerName);
  saveCaseToStorage();
}

function updateFieldVisualState(input) {
  if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement)) return;
  const field = input.closest(".field, .inline-field, .tig-value-field");
  if (!field || input.readOnly || input.disabled || ["radio", "checkbox"].includes(input.type)) return;
  field.classList.toggle("is-filled", Boolean(input.value.trim()));
}

function refreshFieldVisualStates() {
  $$(".field input, .field textarea, .field select, .inline-field input, .tig-value-field input")
    .forEach(updateFieldVisualState);
}

function getStoredPaletteId() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function storePaletteId(id) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch (error) {
    // La couleur reste appliquée même si le navigateur bloque le stockage.
  }
}

function getPalette(id) {
  return COLOR_PALETTES.find((palette) => palette.id === id) ?? COLOR_PALETTES[0];
}

function applyPalette(id, shouldStore = true) {
  const palette = getPalette(id);
  const root = document.documentElement;
  root.style.setProperty("--primary", palette.primary);
  root.style.setProperty("--primary-strong", palette.primaryStrong);
  root.style.setProperty("--accent", palette.accent);
  refs.paletteToggle.style.setProperty("--swatch-primary", palette.primary);
  refs.paletteToggle.style.setProperty("--swatch-accent", palette.accent);
  refs.paletteToggle.setAttribute("aria-label", `Changer la couleur (${palette.label})`);

  $$(".color-swatch").forEach((button) => {
    const active = button.dataset.palette === palette.id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  if (shouldStore) storePaletteId(palette.id);
}

function renderColorPalette() {
  refs.colorPaletteOptions.innerHTML = "";

  COLOR_PALETTES.forEach((palette) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-swatch";
    button.dataset.palette = palette.id;
    button.setAttribute("role", "option");
    button.setAttribute("aria-label", palette.label);
    button.style.setProperty("--swatch-primary", palette.primary);
    button.style.setProperty("--swatch-accent", palette.accent);

    const dot = document.createElement("span");
    dot.className = "color-swatch-dot";
    dot.setAttribute("aria-hidden", "true");

    button.append(dot);
    button.addEventListener("click", () => {
      applyPalette(palette.id);
      closeColorPalette();
    });
    refs.colorPaletteOptions.append(button);
  });

  applyPalette(getStoredPaletteId() ?? COLOR_PALETTES[0].id, false);
}

function openColorPalette() {
  refs.colorPalette.hidden = false;
  refs.paletteToggle.setAttribute("aria-expanded", "true");
}

function closeColorPalette() {
  refs.colorPalette.hidden = true;
  refs.paletteToggle.setAttribute("aria-expanded", "false");
}

function toggleColorPalette() {
  if (refs.colorPalette.hidden) {
    openColorPalette();
    return;
  }

  closeColorPalette();
}

function currentDecision() {
  if (hasSelectedAcquittementVice()) return "Acquittement";
  return $('input[name="decision"]:checked')?.value ?? "";
}

function currentJudgementDecision() {
  return $('input[name="judgement_decision"]:checked')?.value ?? "";
}

let isRestoringCase = false;

function currentViewName() {
  return $(".view.active")?.id?.replace("View", "") || "doj";
}

function setRadioValue(name, value) {
  $$(`input[name="${name}"]`).forEach((input) => {
    input.checked = input.value === value;
  });
}

function serializeFactCounts(counts) {
  return Array.from(counts, ([fact, count]) => [fact, Math.max(1, Math.floor(Number(count) || 1))]);
}

function parseFactCounts(entries) {
  const counts = new Map();
  (Array.isArray(entries) ? entries : []).forEach(([fact, count]) => {
    const migratedFact = FACT_NAME_MIGRATIONS.get(fact) ?? fact;
    if (factByName.has(migratedFact)) counts.set(migratedFact, clampFactCount(count));
  });
  return counts;
}

function validFacts(facts) {
  return (Array.isArray(facts) ? facts : [])
    .map((fact) => FACT_NAME_MIGRATIONS.get(fact) ?? fact)
    .filter((fact) => factByName.has(fact));
}

function validProcedureVices(vices) {
  return (Array.isArray(vices) ? vices : []).filter((id) => procedureViceById.has(id));
}

function validProcedureViceTargets(targets, selectedVices, facts) {
  const validTargets = {};
  const source = targets && typeof targets === "object" ? targets : {};
  selectedVices.forEach((id) => {
    const vice = procedureViceById.get(id);
    const migratedFact = FACT_NAME_MIGRATIONS.get(source[id]) ?? source[id];
    if (vice?.type === "annulation" && facts.includes(migratedFact)) validTargets[id] = migratedFact;
  });
  return validTargets;
}

function pruneProcedureViceTargets(targetState = state, facts = state.facts) {
  Object.entries(targetState.procedureViceTargets).forEach(([id, fact]) => {
    if (!targetState.procedureVices.includes(id) || !facts.includes(fact)) {
      delete targetState.procedureViceTargets[id];
    }
  });
}

function getCaseSnapshot() {
  return {
    version: CASE_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    activeView: currentViewName(),
    comparution: {
      name: refs.name.value,
      linkMed: refs.linkMed.value,
      judge: refs.judge.value,
      lawyerActive: state.lawyerActive,
      lawyerName: refs.lawyerName.value,
      decision: currentDecision(),
      decisionBeforeAcquittement: state.decisionBeforeAcquittement,
      facts: [...state.facts],
      tigActive: state.tigActive,
      tigValue: state.tigValue,
      fineDouble: refs.fineDouble.checked,
      procedureVices: [...state.procedureVices],
      procedureViceTargets: { ...state.procedureViceTargets },
      vices: refs.vices.value
    },
    prelim: {
      name: refs.prelimName.value,
      linkMed: refs.prelimLinkMed.value,
      judge: refs.prelimJudge.value,
      lawyerActive: prelimState.lawyerActive,
      lawyerName: refs.prelimLawyerName.value,
      facts: [...prelimState.facts],
      tigActive: prelimState.tigActive,
      tigValue: prelimState.tigValue,
      procedureVices: [...prelimState.procedureVices],
      procedureViceTargets: { ...prelimState.procedureViceTargets }
    },
    judgement: {
      name: refs.judgementName.value,
      linkMed: refs.judgementLinkMed.value,
      judge: refs.judgementJudge.value,
      decision: currentJudgementDecision(),
      facts: [...judgementState.facts],
      factCounts: serializeFactCounts(judgementState.factCounts),
      timeTotal: refs.judgementTimeTotal.value,
      fineTotal: refs.judgementFineTotal.value
    }
  };
}

function saveCaseToStorage() {
  if (isRestoringCase) return;
  try {
    localStorage.setItem(CASE_STORAGE_KEY, JSON.stringify(getCaseSnapshot()));
  } catch (error) {
    console.warn("Case autosave failed.", error);
  }
}

function restoreCaseSnapshot(snapshot, shouldSwitchView = true) {
  if (!snapshot || typeof snapshot !== "object") return false;

  isRestoringCase = true;
  const comparution = snapshot.comparution || {};
  const prelim = snapshot.prelim || {};
  const judgement = snapshot.judgement || {};

  refs.name.value = comparution.name || "";
  refs.linkMed.value = comparution.linkMed || "";
  refs.judge.value = comparution.judge || "";
  refs.lawyerName.value = comparution.lawyerName || "";
  refs.fineDouble.checked = Boolean(comparution.fineDouble);
  refs.vices.value = comparution.vices || "";
  setRadioValue("decision", comparution.decision || "");
  state.facts = validFacts(comparution.facts);
  state.pendingFact = "";
  state.tigActive = Boolean(comparution.tigActive);
  state.tigValue = clampTigValue(comparution.tigValue ?? 1);
  state.lawyerActive = Boolean(comparution.lawyerActive);
  state.procedureVices = validProcedureVices(comparution.procedureVices);
  state.procedureViceTargets = validProcedureViceTargets(
    comparution.procedureViceTargets,
    state.procedureVices,
    state.facts
  );
  state.decisionBeforeAcquittement = comparution.decisionBeforeAcquittement || "";
  state.acquittementLocked = false;

  refs.prelimName.value = prelim.name || "";
  refs.prelimLinkMed.value = prelim.linkMed || "";
  refs.prelimJudge.value = prelim.judge || "";
  refs.prelimLawyerName.value = prelim.lawyerName || "";
  prelimState.facts = validFacts(prelim.facts);
  prelimState.pendingFact = "";
  prelimState.tigActive = Boolean(prelim.tigActive);
  prelimState.tigValue = clampTigValue(prelim.tigValue ?? 1);
  prelimState.lawyerActive = Boolean(prelim.lawyerActive);
  prelimState.procedureVices = validProcedureVices(prelim.procedureVices);
  prelimState.procedureViceTargets = validProcedureViceTargets(
    prelim.procedureViceTargets,
    prelimState.procedureVices,
    prelimState.facts
  );

  refs.judgementName.value = judgement.name || "";
  refs.judgementLinkMed.value = judgement.linkMed || "";
  refs.judgementJudge.value = judgement.judge || "";
  refs.judgementTimeTotal.value = judgement.timeTotal || "";
  refs.judgementFineTotal.value = judgement.fineTotal || "";
  setRadioValue("judgement_decision", judgement.decision || "");
  judgementState.facts = validFacts(judgement.facts);
  judgementState.pendingFact = "";
  judgementState.factCounts = parseFactCounts(judgement.factCounts);
  judgementState.facts.forEach((fact) => {
    if (!judgementState.factCounts.has(fact)) judgementState.factCounts.set(fact, 1);
  });

  updateLawyerControl();
  updatePrelimLawyerControl();
  updatePrelimPrisonMinutes();
  renderSelectedFacts();
  renderSelectedProcedureVices("doj");
  renderSelectedProcedureVices("prelim");
  applyProcedureVicesEffects("doj");
  applyProcedureVicesEffects("prelim");
  renderPrelimSelectedFacts();
  renderJudgementSelectedFacts();
  updatePrelimTime();
  updateJudgementTotals();
  updateTotals();
  refreshFieldVisualStates();
  if (shouldSwitchView && snapshot.activeView) switchView(snapshot.activeView);

  isRestoringCase = false;
  saveCaseToStorage();
  return true;
}

function loadSavedCase() {
  try {
    const raw = localStorage.getItem(CASE_STORAGE_KEY);
    if (!raw) return false;
    return restoreCaseSnapshot(JSON.parse(raw));
  } catch (error) {
    console.warn("Case restore failed.", error);
    return false;
  }
}

let pendingResetView = "";

function getResettableView() {
  const view = currentViewName();
  return ["doj", "prelim", "judgement"].includes(view) ? view : "";
}

function requestCurrentCaseReset() {
  pendingResetView = getResettableView();
  if (!pendingResetView) {
    showToast("Ouvre une comparution, une audience ou un jugement à réinitialiser.");
    return;
  }

  const labels = {
    doj: "de la comparution",
    prelim: "de l’audience préliminaire",
    judgement: "du jugement"
  };
  refs.resetConfirmText.textContent = `Toutes les données ${labels[pendingResetView]} seront effacées. Les autres dossiers seront conservés.`;
  openAccessibleModal(refs.resetConfirmModal, refs.cancelReset);
}

function closeResetConfirmModal() {
  pendingResetView = "";
  closeAccessibleModal(refs.resetConfirmModal);
}

function performCurrentCaseReset() {
  const view = pendingResetView;
  if (!view) return;
  const snapshot = getCaseSnapshot();

  if (view === "prelim") {
    snapshot.prelim = {};
  } else if (view === "judgement") {
    snapshot.judgement = {};
  } else if (view === "doj") {
    snapshot.comparution = {};
  }

  snapshot.activeView = view;
  restoreCaseSnapshot(snapshot, false);
  closeResetConfirmModal();
  showToast("Dossier réinitialisé.");
}

function validateCaseBeforeCopy(type) {
  const checks = {
    doj: [
      [refs.name.value.trim(), "Nom manquant"],
      [state.facts.length, "Aucun fait sélectionné"],
      [currentDecision(), "Décision non choisie"],
      [!hasUnassignedAnnulationVice(), "Sélectionne le fait concerné par chaque annulation"]
    ],
    prelim: [
      [refs.prelimName.value.trim(), "Nom manquant"],
      [prelimState.facts.length, "Aucun fait sélectionné"],
      [!hasUnassignedAnnulationVice("prelim"), "Sélectionne le fait concerné par chaque annulation"]
    ],
    judgement: [
      [refs.judgementName.value.trim(), "Nom manquant"],
      [judgementState.facts.length, "Aucun fait sélectionné"],
      [currentJudgementDecision(), "Décision non choisie"]
    ]
  };

  const missing = (checks[type] || []).find(([valid]) => !valid);
  if (!missing) return true;

  showToast(missing[1]);
  return false;
}

let procedureVicesContext = "doj";

function getProcedureVicesConfig(context = procedureVicesContext) {
  if (context === "prelim") {
    return {
      context,
      label: "Audience préliminaire",
      targetState: prelimState,
      facts: prelimState.facts,
      container: refs.prelimSelectedProcedureVices
    };
  }

  return {
    context: "doj",
    label: "Comparution",
    targetState: state,
    facts: state.facts,
    container: refs.selectedProcedureVices
  };
}

function hasUnassignedAnnulationVice(context = "doj") {
  const { targetState, facts } = getProcedureVicesConfig(context);
  return selectedProcedureViceObjects(targetState).some((vice) => (
    vice.type === "annulation" && !facts.includes(targetState.procedureViceTargets[vice.id])
  ));
}

function selectedProcedureViceObjects(targetState = state) {
  return targetState.procedureVices.map((id) => procedureViceById.get(id)).filter(Boolean);
}

function isProcedureViceSelected(id, targetState = state) {
  return targetState.procedureVices.includes(id);
}

function procedureViceMatches(vice, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  return normalizeSearchText(`${vice.category} ${vice.name} ${vice.effect}`).includes(normalizedQuery);
}

function selectedProcedureReduction(targetState = state) {
  const selected = selectedProcedureViceObjects(targetState);
  if (selected.some((vice) => vice.type === "acquittement")) return 100;
  return sumReductions(selected.filter((vice) => vice.type === "reduction").map((vice) => vice.reduction || 0));
}

function selectedAnnulledFacts(targetState = state, facts = state.facts) {
  return Array.from(new Set(
    selectedProcedureViceObjects(targetState)
      .filter((vice) => vice.type === "annulation")
      .map((vice) => targetState.procedureViceTargets[vice.id])
      .filter((fact) => facts.includes(fact))
  ));
}

function hasSelectedAcquittementVice() {
  return selectedProcedureViceObjects(state).some((vice) => vice.type === "acquittement");
}

function setComparutionAcquittement() {
  const target = $$('input[name="decision"]').find((input) => normalizeSearchText(input.value).includes("acquitt"));
  if (target) target.checked = true;
}

function updateComparutionDecisionLock() {
  const locked = hasSelectedAcquittementVice();
  if (locked && !state.acquittementLocked) {
    const selectedDecision = $$('input[name="decision"]:checked').find((input) => (
      !normalizeSearchText(input.value).includes("acquitt")
    ));
    if (selectedDecision) state.decisionBeforeAcquittement = selectedDecision.value;
  }

  $$('input[name="decision"]').forEach((input) => {
    const isAcquittement = normalizeSearchText(input.value).includes("acquitt");
    const label = input.closest("label");
    if (label) label.hidden = locked ? !isAcquittement : isAcquittement;
    input.disabled = locked && !isAcquittement;
    if (!locked && isAcquittement) input.checked = false;
  });

  if (locked) {
    setComparutionAcquittement();
  } else if (state.acquittementLocked && state.decisionBeforeAcquittement) {
    setRadioValue("decision", state.decisionBeforeAcquittement);
  }
  state.acquittementLocked = locked;
}

function applyProcedureVicesEffects(context = "doj") {
  if (context === "prelim") {
    updatePrelimPrisonMinutes();
    updatePrelimTime();
    return;
  }
  updateComparutionDecisionLock();
  updateTotals();
}

function renderSelectedProcedureVices(context = "doj") {
  const { targetState, facts, container } = getProcedureVicesConfig(context);
  const counter = context === "prelim" ? refs.prelimVicesCounter : refs.vicesCounter;
  const viceCount = targetState.procedureVices.length;
  counter.textContent = String(viceCount);
  counter.setAttribute("aria-label", `${viceCount} vice${viceCount > 1 ? "s" : ""} sélectionné${viceCount > 1 ? "s" : ""}`);
  container.classList.toggle("has-items", viceCount > 0);
  container.innerHTML = "";

  selectedProcedureViceObjects(targetState).forEach((vice, index) => {
    const item = document.createElement("div");
    item.className = `selected-item vice-card vice-card-${vice.type}`;
    item.style.setProperty("--item-index", String(index));

    const text = document.createElement("span");
    text.className = "selected-item-text vice-card-content";

    const name = document.createElement("span");
    name.className = "vice-card-name";
    name.textContent = vice.name;

    const effect = document.createElement("span");
    effect.className = `detail-badge ${vice.type}`;
    effect.textContent = vice.effect;
    text.append(name, effect);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.title = "Retirer le vice";
    remove.setAttribute("aria-label", `Retirer ${vice.name}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      removeCardWithAnimation(item, () => {
        targetState.procedureVices = targetState.procedureVices.filter((id) => id !== vice.id);
        delete targetState.procedureViceTargets[vice.id];
        renderSelectedProcedureVices(context);
        if (!refs.procedureVicesModal.hidden && procedureVicesContext === context) renderProcedureVicesPicker();
        applyProcedureVicesEffects(context);
      });
    });

    item.append(text, remove);

    if (vice.type === "annulation") {
      const targetField = document.createElement("label");
      targetField.className = "vice-target-field";
      targetField.textContent = "Fait dont la peine doit être annulée";

      const targetSelect = document.createElement("select");
      targetSelect.setAttribute("aria-label", `Fait annulé pour ${vice.name}`);
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = facts.length ? "Sélectionne un fait" : "Ajoute d’abord un fait";
      targetSelect.append(placeholder);

      facts.forEach((factName) => {
        const option = document.createElement("option");
        option.value = factName;
        option.textContent = factName;
        targetSelect.append(option);
      });
      targetSelect.value = targetState.procedureViceTargets[vice.id] || "";
      targetSelect.disabled = !facts.length;
      targetSelect.addEventListener("change", () => {
        if (targetSelect.value) {
          targetState.procedureViceTargets[vice.id] = targetSelect.value;
        } else {
          delete targetState.procedureViceTargets[vice.id];
        }
        applyProcedureVicesEffects(context);
      });

      targetField.append(targetSelect);
      item.append(targetField);
    }
    container.append(item);
  });

  if (!targetState.procedureVices.length) {
    const empty = document.createElement("div");
    empty.className = "empty-selected";
    empty.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z"/><path d="M9 12h6"/></svg>
      <span>Aucun vice sélectionné</span>
      <small>Utilisez le bouton de sélection pour en ajouter.</small>
    `;
    container.append(empty);
  }
}

function renderProcedureVicesTable() {
  const query = refs.procedureVicesSearch.value;
  const rows = PROCEDURE_VICES.filter((vice) => procedureViceMatches(vice, query));

  refs.procedureVicesTable.innerHTML = rows
    .map((vice) => `
      <tr>
        <td>${escapeHtml(vice.category)}</td>
        <td>${escapeHtml(vice.name)}</td>
        <td><span class="detail-badge ${vice.type}">${escapeHtml(vice.effect)}</span></td>
      </tr>
    `)
    .join("");
}

function renderProcedureVicesPicker() {
  const { targetState, facts } = getProcedureVicesConfig();
  const query = refs.procedureVicesPickerSearch.value;
  const rows = PROCEDURE_VICES.filter((vice) => procedureViceMatches(vice, query));
  const selectedCount = targetState.procedureVices.length;
  refs.procedureVicesPickerCount.textContent = `${selectedCount} vice${selectedCount > 1 ? "s" : ""} sélectionné${selectedCount > 1 ? "s" : ""}`;

  refs.procedureVicesPickerList.innerHTML = "";
  if (!rows.length) {
    refs.procedureVicesPickerList.innerHTML = '<div class="vices-empty-results">Aucun vice ne correspond à cette recherche.</div>';
    return;
  }

  const groups = new Map();
  rows.forEach((vice) => {
    if (!groups.has(vice.category)) groups.set(vice.category, []);
    groups.get(vice.category).push(vice);
  });

  groups.forEach((vices, category) => {
    const group = document.createElement("details");
    group.className = "vice-category-group";
    group.open = true;

    const summary = document.createElement("summary");
    const categoryName = document.createElement("span");
    categoryName.textContent = category;
    const categoryCount = document.createElement("span");
    categoryCount.className = "vice-category-count";
    categoryCount.textContent = String(vices.length);
    summary.append(categoryName, categoryCount);

    const options = document.createElement("div");
    options.className = "vice-category-options";

    [...vices]
      .sort((a, b) => Number(isProcedureViceSelected(b.id, targetState)) - Number(isProcedureViceSelected(a.id, targetState)))
      .forEach((vice) => {
        const label = document.createElement("label");
        label.className = `vice-option${isProcedureViceSelected(vice.id, targetState) ? " selected" : ""}`;

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = isProcedureViceSelected(vice.id, targetState);
        input.addEventListener("change", () => {
          if (input.checked && !isProcedureViceSelected(vice.id, targetState)) {
            targetState.procedureVices.push(vice.id);
            if (vice.type === "annulation" && facts.length === 1) {
              targetState.procedureViceTargets[vice.id] = facts[0];
            }
          } else if (!input.checked) {
            targetState.procedureVices = targetState.procedureVices.filter((id) => id !== vice.id);
            delete targetState.procedureViceTargets[vice.id];
          }
          label.classList.toggle("selected", input.checked);
          renderSelectedProcedureVices(procedureVicesContext);
          applyProcedureVicesEffects(procedureVicesContext);
          const count = targetState.procedureVices.length;
          refs.procedureVicesPickerCount.textContent = `${count} vice${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}`;
        });

        const content = document.createElement("span");
        content.className = "vice-option-content";
        content.innerHTML = `
          <b>${escapeHtml(vice.name)}</b>
          <span class="detail-badge ${vice.type}">${escapeHtml(vice.effect)}</span>
        `;

        label.append(input, content);
        options.append(label);
      });

    group.append(summary, options);
    refs.procedureVicesPickerList.append(group);
  });
}

function openProcedureVicesModal(context = "doj") {
  procedureVicesContext = context;
  refs.procedureVicesModalTitle.textContent = `Vices — ${getProcedureVicesConfig(context).label}`;
  refs.procedureVicesPickerSearch.value = "";
  renderProcedureVicesPicker();
  openAccessibleModal(refs.procedureVicesModal, refs.procedureVicesPickerSearch);
}

function closeProcedureVicesModal() {
  closeAccessibleModal(refs.procedureVicesModal);
}


function procedureVicesTextLines(targetState = state) {
  return selectedProcedureViceObjects(targetState).map((vice) => {
    const target = vice.type === "annulation" ? targetState.procedureViceTargets[vice.id] : "";
    return `- ${vice.name} (${vice.effect}${target ? ` — Fait concerné : ${target}` : ""})`;
  });
}

function procedureVicesHtmlItems() {
  return selectedProcedureViceObjects(state).map((vice) => {
    const target = vice.type === "annulation" ? state.procedureViceTargets[vice.id] : "";
    return `<li>${escapeHtml(vice.name)} (${escapeHtml(vice.effect)}${target ? ` — Fait concerné : ${escapeHtml(target)}` : ""})</li>`;
  });
}

function buildViceSapdText(context = "doj") {
  const isPrelim = context === "prelim";
  const targetState = isPrelim ? prelimState : state;
  const selected = selectedProcedureViceObjects(targetState);
  const vicesText = selected.length
    ? procedureVicesTextLines(targetState).join("\n")
    : "- Aucun vice sélectionné";
  const judge = isPrelim ? refs.prelimJudge.value : refs.judge.value;
  const linkMed = isPrelim ? refs.prelimLinkMed.value : refs.linkMed.value;
  const name = isPrelim ? refs.prelimName.value : refs.name.value;

  return [
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
    `👮‍♂️ Agents : ${judge}`,
    `📝 Lien de la MED : ${linkMed}`,
    `👤 Par : ${name}`,
    "",
    ":closed_book: Vice de procédure :",
    vicesText,
    "",
    "",
    "",
    "🚔 Poste de police : ",
    "Merci de créer un fil pour contester ou répondre ou autres",
    "",
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"
  ].join("\n");
}

function updateTotals() {
  const reduction = selectedProcedureReduction(state);
  refs.viceReduction.value = `${reduction} %`;

  const sanctions = calculateSanctions(
    state.facts.map((name) => factByName.get(name)).filter(Boolean),
    {
      reduction,
      fineDouble: refs.fineDouble.checked,
      annulledFacts: selectedAnnulledFacts(state, state.facts)
    }
  );
  state.prisonMinutes = sanctions.minutes;

  refs.comparutionTigToggle.classList.toggle("active", state.tigActive);
  refs.comparutionTigToggle.setAttribute("aria-pressed", String(state.tigActive));
  refs.comparutionTigValueField.hidden = !state.tigActive;
  refs.comparutionTigHint.hidden = true;
  refs.comparutionTigValue.value = String(state.tigValue);
  refs.timeTotal.readOnly = true;

  if (state.tigActive) {
    refs.timeTotal.value = `${state.tigValue} T.I.G`;
  } else {
    refs.timeTotal.value = formatTime(state.prisonMinutes);
  }

  refs.fineTotal.value = formatMoney(sanctions.fine);
  saveCaseToStorage();
}

function updateJudgementTotals() {
  // Le jugement est saisi manuellement: les faits ne changent pas le temps ni l'amende.
  saveCaseToStorage();
}

function categoryRank(fact) {
  return CATEGORY_SEVERITY.get(normalizeSearchText(fact.categorie)) ?? CATEGORY_SEVERITY.get("autre");
}

function sortFactsBySeverity(facts) {
  return [...facts].sort((a, b) => {
    const rankDiff = categoryRank(a) - categoryRank(b);
    if (rankDiff) return rankDiff;
    return b.temps - a.temps || b.amende - a.amende || a.nom.localeCompare(b.nom, "fr");
  });
}

function appendFactDisplay(container, factName) {
  const fact = factByName.get(factName);
  const name = document.createElement("span");
  name.className = "fact-name";
  name.textContent = factName;
  container.append(name);

  if (fact?.hasBracelet) {
    const badge = document.createElement("span");
    badge.className = "fact-badge";
    badge.textContent = "Bracelet";
    container.append(badge);
  }
}

function setSuggestionContent(option, fact) {
  const label = document.createElement("span");
  label.className = "suggestion-label";
  appendFactDisplay(label, fact.nom);

  const meta = document.createElement("span");
  meta.className = "suggestion-meta";
  meta.textContent = `${fact.categorie} · ${fact.temps} min · ${formatMoney(fact.amende)}`;

  option.append(label, meta);
}

function removeCardWithAnimation(item, callback) {
  if (item.classList.contains("is-removing")) return;
  item.classList.add("is-removing");
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 190;
  window.setTimeout(callback, delay);
}

function renderSelectedFacts() {
  refs.selectedFacts.innerHTML = "";

  state.facts.forEach((factName, index) => {
    const item = document.createElement("div");
    item.className = `selected-item fact-card ${factSeverityClass(factByName.get(factName))}`;
    item.style.setProperty("--item-index", String(index));
    item.addEventListener("click", (event) => event.stopPropagation());

    const text = document.createElement("span");
    text.className = "selected-item-text fact-card-content";
    appendFactCardContent(text, factName);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.title = "Retirer le fait";
    remove.setAttribute("aria-label", `Retirer ${factName}`);
    remove.textContent = "×";
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      removeCardWithAnimation(item, () => {
        state.facts.splice(index, 1);
        pruneProcedureViceTargets();
        renderSelectedFacts();
        renderSelectedProcedureVices();
        updateTotals();
      });
    });

    item.append(text, remove);
    refs.selectedFacts.append(item);
  });
}

function renderJudgementSelectedFacts() {
  refs.judgementSelectedFacts.innerHTML = "";

  judgementState.facts.forEach((factName, index) => {
    const item = document.createElement("div");
    item.className = `selected-item fact-card ${factSeverityClass(factByName.get(factName))}`;
    item.style.setProperty("--item-index", String(index));
    item.addEventListener("click", (event) => event.stopPropagation());

    const text = document.createElement("span");
    text.className = "selected-item-text fact-card-content";
    appendFactCardContent(text, factName);

    const countField = document.createElement("label");
    countField.className = "selected-item-count";
    countField.addEventListener("click", (event) => event.stopPropagation());

    const countText = document.createElement("span");
    countText.textContent = "x";

    const countInput = document.createElement("input");
    countInput.type = "number";
    countInput.min = "1";
    countInput.step = "1";
    countInput.value = String(judgementState.factCounts.get(factName) ?? 1);
    countInput.setAttribute("aria-label", `Nombre pour ${factName}`);
    countInput.addEventListener("input", () => {
      if (/^\d+$/.test(countInput.value) && Number(countInput.value) >= 1) {
        judgementState.factCounts.set(factName, clampFactCount(countInput.value));
      }
      saveCaseToStorage();
    });
    countInput.addEventListener("change", () => {
      const count = clampFactCount(countInput.value, judgementState.factCounts.get(factName) ?? 1);
      countInput.value = String(count);
      judgementState.factCounts.set(factName, count);
      saveCaseToStorage();
    });

    countField.append(countText, countInput);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.title = "Retirer le fait";
    remove.setAttribute("aria-label", `Retirer ${factName}`);
    remove.textContent = "×";
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      removeCardWithAnimation(item, () => {
        judgementState.facts.splice(index, 1);
        judgementState.factCounts.delete(factName);
        renderJudgementSelectedFacts();
        updateJudgementTotals();
      });
    });

    item.append(text, countField, remove);
    refs.judgementSelectedFacts.append(item);
  });
}

function renderPrelimSelectedFacts() {
  refs.prelimSelectedFacts.innerHTML = "";

  prelimState.facts.forEach((factName, index) => {
    const item = document.createElement("div");
    item.className = `selected-item fact-card ${factSeverityClass(factByName.get(factName))}`;
    item.style.setProperty("--item-index", String(index));
    item.addEventListener("click", (event) => event.stopPropagation());

    const text = document.createElement("span");
    text.className = "selected-item-text fact-card-content";
    appendFactCardContent(text, factName);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.title = "Retirer le fait";
    remove.setAttribute("aria-label", `Retirer ${factName}`);
    remove.textContent = "×";
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      removeCardWithAnimation(item, () => {
        prelimState.facts.splice(index, 1);
        pruneProcedureViceTargets(prelimState, prelimState.facts);
        updatePrelimPrisonMinutes();
        renderPrelimSelectedFacts();
        renderSelectedProcedureVices("prelim");
        updatePrelimTime();
      });
    });

    item.append(text, remove);
    refs.prelimSelectedFacts.append(item);
  });
}

function updatePrelimTime() {
  refs.tigToggle.classList.toggle("active", prelimState.tigActive);
  refs.tigToggle.setAttribute("aria-pressed", String(prelimState.tigActive));
  refs.prelimTigValueField.hidden = !prelimState.tigActive;
  refs.prelimTigHint.hidden = true;
  refs.prelimTigValue.value = String(prelimState.tigValue);
  refs.prelimTimeTotal.readOnly = true;
  refs.prelimTimeCapNotice.hidden = prelimState.tigActive || prelimState.rawPrisonMinutes <= 60;

  if (prelimState.tigActive) {
    refs.prelimTimeTotal.value = `${prelimState.tigValue} T.I.G`;
    saveCaseToStorage();
    return;
  }

  refs.prelimTimeTotal.value = formatTime(prelimState.prisonMinutes);
  saveCaseToStorage();
}

function getSuggestions() {
  return searchFacts(refs.factSearch.value);
}

function getPrelimSuggestions() {
  return searchFacts(refs.prelimFactSearch.value);
}

function getJudgementSuggestions() {
  return searchFacts(refs.judgementFactSearch.value);
}

function renderSuggestions(forceOpen = false) {
  const suggestions = getSuggestions();
  suggestionIndices.doj = Math.min(suggestionIndices.doj, Math.max(0, suggestions.length - 1));
  refs.factSuggestions.innerHTML = "";

  suggestions.forEach((fact, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.id = `fact-suggestion-${index}`;
    option.className = `suggestion${index === suggestionIndices.doj ? " active" : ""}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(index === suggestionIndices.doj));
    setSuggestionContent(option, fact);
    option.addEventListener("mousedown", (event) => event.preventDefault());
    option.addEventListener("click", () => {
      suggestionIndices.doj = index;
      state.pendingFact = fact.nom;
      refs.factSearch.value = fact.nom;
      closeSuggestions();
      refs.factSearch.focus();
    });
    refs.factSuggestions.append(option);
  });

  const shouldOpen = forceOpen || document.activeElement === refs.factSearch;
  refs.factSuggestions.classList.toggle("open", shouldOpen && suggestions.length > 0);
  refs.factSearch.setAttribute("aria-expanded", String(shouldOpen && suggestions.length > 0));
  if (shouldOpen && suggestions.length) {
    refs.factSearch.setAttribute("aria-activedescendant", `fact-suggestion-${suggestionIndices.doj}`);
  } else {
    refs.factSearch.removeAttribute("aria-activedescendant");
  }
}

function renderPrelimSuggestions(forceOpen = false) {
  const suggestions = getPrelimSuggestions();
  suggestionIndices.prelim = Math.min(suggestionIndices.prelim, Math.max(0, suggestions.length - 1));
  refs.prelimFactSuggestions.innerHTML = "";

  suggestions.forEach((fact, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.id = `prelim-fact-suggestion-${index}`;
    option.className = `suggestion${index === suggestionIndices.prelim ? " active" : ""}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(index === suggestionIndices.prelim));
    setSuggestionContent(option, fact);
    option.addEventListener("mousedown", (event) => event.preventDefault());
    option.addEventListener("click", () => {
      suggestionIndices.prelim = index;
      prelimState.pendingFact = fact.nom;
      refs.prelimFactSearch.value = fact.nom;
      closePrelimSuggestions();
      refs.prelimFactSearch.focus();
    });
    refs.prelimFactSuggestions.append(option);
  });

  const shouldOpen = forceOpen || document.activeElement === refs.prelimFactSearch;
  refs.prelimFactSuggestions.classList.toggle("open", shouldOpen && suggestions.length > 0);
  refs.prelimFactSearch.setAttribute("aria-expanded", String(shouldOpen && suggestions.length > 0));
  if (shouldOpen && suggestions.length) {
    refs.prelimFactSearch.setAttribute("aria-activedescendant", `prelim-fact-suggestion-${suggestionIndices.prelim}`);
  } else {
    refs.prelimFactSearch.removeAttribute("aria-activedescendant");
  }
}

function renderJudgementSuggestions(forceOpen = false) {
  const suggestions = getJudgementSuggestions();
  suggestionIndices.judgement = Math.min(suggestionIndices.judgement, Math.max(0, suggestions.length - 1));
  refs.judgementFactSuggestions.innerHTML = "";

  suggestions.forEach((fact, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.id = `judgement-fact-suggestion-${index}`;
    option.className = `suggestion${index === suggestionIndices.judgement ? " active" : ""}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(index === suggestionIndices.judgement));
    setSuggestionContent(option, fact);
    option.addEventListener("mousedown", (event) => event.preventDefault());
    option.addEventListener("click", () => {
      suggestionIndices.judgement = index;
      judgementState.pendingFact = fact.nom;
      refs.judgementFactSearch.value = fact.nom;
      closeJudgementSuggestions();
      refs.judgementFactSearch.focus();
    });
    refs.judgementFactSuggestions.append(option);
  });

  const shouldOpen = forceOpen || document.activeElement === refs.judgementFactSearch;
  refs.judgementFactSuggestions.classList.toggle("open", shouldOpen && suggestions.length > 0);
  refs.judgementFactSearch.setAttribute("aria-expanded", String(shouldOpen && suggestions.length > 0));
  if (shouldOpen && suggestions.length) {
    refs.judgementFactSearch.setAttribute("aria-activedescendant", `judgement-fact-suggestion-${suggestionIndices.judgement}`);
  } else {
    refs.judgementFactSearch.removeAttribute("aria-activedescendant");
  }
}

function closeSuggestions() {
  refs.factSuggestions.classList.remove("open");
  refs.factSearch.setAttribute("aria-expanded", "false");
  refs.factSearch.removeAttribute("aria-activedescendant");
}

function closeJudgementSuggestions() {
  refs.judgementFactSuggestions.classList.remove("open");
  refs.judgementFactSearch.setAttribute("aria-expanded", "false");
  refs.judgementFactSearch.removeAttribute("aria-activedescendant");
}

function closePrelimSuggestions() {
  refs.prelimFactSuggestions.classList.remove("open");
  refs.prelimFactSearch.setAttribute("aria-expanded", "false");
  refs.prelimFactSearch.removeAttribute("aria-activedescendant");
}

function suggestionConfig(type) {
  const configs = {
    doj: {
      input: refs.factSearch,
      getItems: getSuggestions,
      render: renderSuggestions,
      setPending: (fact) => { state.pendingFact = fact; },
      add: addFact,
      optionPrefix: "fact-suggestion-"
    },
    prelim: {
      input: refs.prelimFactSearch,
      getItems: getPrelimSuggestions,
      render: renderPrelimSuggestions,
      setPending: (fact) => { prelimState.pendingFact = fact; },
      add: addPrelimFact,
      optionPrefix: "prelim-fact-suggestion-"
    },
    judgement: {
      input: refs.judgementFactSearch,
      getItems: getJudgementSuggestions,
      render: renderJudgementSuggestions,
      setPending: (fact) => { judgementState.pendingFact = fact; },
      add: addJudgementFact,
      optionPrefix: "judgement-fact-suggestion-"
    }
  };
  return configs[type];
}

function moveSuggestionSelection(type, direction) {
  const config = suggestionConfig(type);
  const items = config.getItems();
  if (!items.length) return;
  suggestionIndices[type] = (suggestionIndices[type] + direction + items.length) % items.length;
  config.render(true);
  document.getElementById(`${config.optionPrefix}${suggestionIndices[type]}`)?.scrollIntoView({ block: "nearest" });
}

function addActiveSuggestion(type) {
  const config = suggestionConfig(type);
  if (!config.input.value.trim()) {
    config.add();
    return;
  }
  const items = config.getItems();
  const selected = items[suggestionIndices[type]];
  if (selected) config.setPending(selected.nom);
  config.add();
}

function resolveFactFromInput() {
  const value = refs.factSearch.value.trim();
  if (!value) return "";
  if (factByName.has(value)) return value;
  return getSuggestions()[0]?.nom ?? "";
}

function resolveJudgementFactFromInput() {
  const value = refs.judgementFactSearch.value.trim();
  if (!value) return "";
  if (factByName.has(value)) return value;
  return getJudgementSuggestions()[0]?.nom ?? "";
}

function resolvePrelimFactFromInput() {
  const value = refs.prelimFactSearch.value.trim();
  if (!value) return "";
  if (factByName.has(value)) return value;
  return getPrelimSuggestions()[0]?.nom ?? "";
}

function addFact() {
  const factName = state.pendingFact || resolveFactFromInput();
  if (!factName) {
    showToast("Sélectionne un fait avant d'ajouter.");
    return;
  }

  if (state.facts.length >= 10) {
    showToast("La limite de 10 faits est atteinte.");
    return;
  }

  if (state.facts.includes(factName)) {
    showToast("Ce fait est déjà ajouté.");
    return;
  }

  state.facts.push(factName);
  if (state.facts.length === 1) {
    selectedProcedureViceObjects().forEach((vice) => {
      if (vice.type === "annulation" && !state.procedureViceTargets[vice.id]) {
        state.procedureViceTargets[vice.id] = factName;
      }
    });
  }
  state.pendingFact = "";
  suggestionIndices.doj = 0;
  refs.factSearch.value = "";
  closeSuggestions();
  renderSelectedFacts();
  renderSelectedProcedureVices();
  updateTotals();
}

function addJudgementFact() {
  const factName = judgementState.pendingFact || resolveJudgementFactFromInput();
  if (!factName) {
    showToast("Sélectionne un fait avant d'ajouter.");
    return;
  }

  if (judgementState.facts.length >= 10) {
    showToast("La limite de 10 faits est atteinte.");
    return;
  }

  if (judgementState.facts.includes(factName)) {
    showToast("Ce fait est déjà ajouté. Modifie le nombre à droite.");
    return;
  }

  judgementState.facts.push(factName);
  judgementState.factCounts.set(factName, 1);
  judgementState.pendingFact = "";
  suggestionIndices.judgement = 0;
  refs.judgementFactSearch.value = "";
  closeJudgementSuggestions();
  renderJudgementSelectedFacts();
  updateJudgementTotals();
}

function addPrelimFact() {
  const factName = prelimState.pendingFact || resolvePrelimFactFromInput();
  if (!factName) {
    showToast("Sélectionne un fait avant d'ajouter.");
    return;
  }

  if (prelimState.facts.length >= 10) {
    showToast("La limite de 10 faits est atteinte.");
    return;
  }

  if (prelimState.facts.includes(factName)) {
    showToast("Ce fait est déjà ajouté.");
    return;
  }

  prelimState.facts.push(factName);
  if (prelimState.facts.length === 1) {
    selectedProcedureViceObjects(prelimState).forEach((vice) => {
      if (vice.type === "annulation" && !prelimState.procedureViceTargets[vice.id]) {
        prelimState.procedureViceTargets[vice.id] = factName;
      }
    });
  }
  prelimState.pendingFact = "";
  suggestionIndices.prelim = 0;
  refs.prelimFactSearch.value = "";
  closePrelimSuggestions();
  updatePrelimPrisonMinutes();
  renderPrelimSelectedFacts();
  renderSelectedProcedureVices("prelim");
  updatePrelimTime();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTrimmedValue(input, fallback = "") {
  const value = input.value.trim();
  return value || fallback;
}

function openingParagraph(lines) {
  // Les lignes peuvent contenir de petits fragments HTML; toute valeur utilisateur doit être échappée avant l'appel.
  return `<p>${lines.filter(Boolean).join("<br>")}</p>`;
}

function openingList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function openingSection(title, content, className = "") {
  const classes = ["opening-section", className].filter(Boolean).join(" ");
  return `
      <section class="${classes}">
        <h3>${escapeHtml(title)}</h3>
        ${content}
      </section>
    `;
}

function sanctionGrid(rows) {
  return `
        <div class="sanction-grid">
          ${rows.map(([label, value]) => `<span>${escapeHtml(label)}</span><b>${value}</b>`).join("")}
        </div>
      `;
}

function getDateLong() {
  return new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function getDateShort() {
  return new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function getHourText() {
  return new Date()
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false })
    .replace(":", "h");
}

function buildSapdText() {
  const timeText = getComparutionTimeText();

  return [
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
    "# Comparution",
    `👨‍⚖️ Juge / Procureur / OPJ : ${refs.judge.value}`,
    `🗓️ Date de délibération : ${getDateShort()}`,
    `⚖️ Décision : ${currentDecision()}`,
    `🕒 Temps : ${timeText}`,
    `💰 Amende : ${refs.fineTotal.value}`,
    formatFactsForCopy(state.facts),
    `👤 Identité : ${refs.name.value}`,
    ...(hasLawyer() ? [`⚖️ Avocat : ${getLawyerName()}`] : []),
    `📝 Lien de la MED : ${refs.linkMed.value}`,
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"
  ].join("\n");
}

function buildPrelimSapdText() {
  const timeText = prelimState.tigActive
    ? `${commitPrelimTigValue()} T.I.G`
    : refs.prelimTimeTotal.value;

  return [
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
    "# Audience Préliminaire",
    `👨‍⚖️ Juge / Procureur / OPJ : ${refs.prelimJudge.value}`,
    `🗓️ Date de délibération : ${getDateShort()}`,
    "⚖️ Décision : Attente de Jugement",
    `🕒 Temps : ${timeText}`,
    formatFactsForCopy(prelimState.facts),
    `👤 Identité : ${refs.prelimName.value}`,
    ...(hasPrelimLawyer() ? [`⚖️ Avocat : ${getPrelimLawyerName()}`] : []),
    `📝 Lien de la MED : ${refs.prelimLinkMed.value}`,
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"
  ].join("\n");
}

function buildJudgementSapdText() {
  return [
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
    "# Jugement",
    `👨‍⚖️ Juge / Procureur : ${refs.judgementJudge.value}`,
    `🗓️ Date de délibération : ${getDateShort()}`,
    `⚖️ Décision : ${currentJudgementDecision()}`,
    `🕒 Temps : ${refs.judgementTimeTotal.value}`,
    `💰 Amende : ${refs.judgementFineTotal.value}`,
    formatFactsForCopy(judgementState.facts, judgementState.factCounts),
    `👤 Identité : ${refs.judgementName.value}`,
    `📝 Lien du dossier de jugement : ${refs.judgementLinkMed.value}`,
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"
  ].join("\n");
}

function buildOpeningText() {
  const facts = formatFactsForCopy(state.facts).replace("⛔ Faits retenus :\n", "").replace("⛔ Faits retenus :", "-");
  const timeText = getComparutionTimeText();
  const name = getTrimmedValue(refs.name, EMPTY_PERSON_LABEL);
  const judge = getTrimmedValue(refs.judge, "Procureur / Juge / OPJ à compléter");
  const lawyerName = getLawyerName();
  const representationLine = hasLawyer()
    ? `⚖️ assisté(e) de son avocat ${lawyerName}`
    : "❌ se représentant lui-même / elle-même";
  const lawyerDefenseLine = hasLawyer()
    ? `⚖️ ${lawyerName}, confirmez-vous ou contestez-vous le rapport présenté ?`
    : "";
  const vices = [
    ...procedureVicesTextLines(),
    ...refs.vices.value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `- ${line}`)
  ].join("\n");

  return [
    `Bonjour / Bonsoir à toutes et à tous.`,
    `Je suis le Procureur / Officier de Police Judiciaire / Juge ${judge}.`,
    `Nous sommes le ${getDateLong()}, il est actuellement ${getHourText()}, et je déclare la comparution officiellement ouverte.`,
    "",
    "Identification des parties",
    "Nous sommes en présence de :",
    `La partie civile, représentée par le ${CIVIL_PARTY_LABEL}`,
    `La partie accusée, constituée de Monsieur / Madame ${name},`,
    representationLine,
    "",
    "Exposé des faits",
    "Je demande maintenant à l’agent en charge du dossier de nous énoncer :",
    "- les infractions reprochées,",
    "- l’amende requise,",
    "- la peine de prison encourue,",
    "- les biens saisis.",
    "",
    "Déclaration de l’accusé",
    `Monsieur / Madame ${name},`,
    "déclarez-vous coupable ou non coupable des faits qui vous sont reprochés ?",
    "",
    "Rapport de l’agent",
    "Agent NOM, merci d’exposer à la Cour :",
    "- le lieu de commission des faits,",
    "- les faits constatés,",
    "- les éléments matériels relevés.",
    "",
    "Défense",
    `Monsieur / Madame ${name},`,
    "au regard des éléments exposés par les agents,",
    "qu’avez-vous à déclarer pour votre défense ?",
    lawyerDefenseLine,
    "",
    "Compléments éventuels",
    "Les agents souhaitent-ils ajouter des faits complémentaires ?",
    "(limite réglementaire applicable)",
    "",
    "Suspension de séance",
    `S’il n’y a rien à ajouter, il est actuellement ${getHourText()}, et je suspends la séance le temps de la délibération.`,
    "➡️ (Consultation des éléments via la plateforme officielle DOJ)",
    "",
    "Reprise de séance & verdict",
    "(Reprise de séance)",
    "Suite à délibération,",
    `Monsieur / Madame ${name},`,
    "la Cour vous déclare :",
    "🔴 COUPABLE / NON COUPABLE des faits suivants :",
    facts,
    "",
    "🔴 Sanctions prononcées :",
    `Amende : ${refs.fineTotal.value}`,
    `Peine de prison : ${timeText}`,
    "Biens restitués : liste",
    "Biens saisis non restitués : liste",
    vices ? `\n⚠️Vices de procédure :⚠️\n${vices}` : "",
    "",
    "Clôture",
    `Il est ${getHourText()}, je déclare la comparution terminée.`,
    "",
    "📎 Merci de copier le rapport dans le canal prévu à cet effet :",
    REPORT_CHANNEL_URL
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function renderOpeningModal() {
  const name = escapeHtml(getTrimmedValue(refs.name, EMPTY_PERSON_LABEL));
  const judge = escapeHtml(getTrimmedValue(refs.judge, "Procureur / Juge / OPJ à compléter"));
  const lawyerName = escapeHtml(getLawyerName());
  const representationLine = hasLawyer()
    ? `⚖️ assisté(e) de son avocat <b>${lawyerName}</b>`
    : "❌ se représentant lui-même / elle-même";
  const lawyerDefenseLine = hasLawyer()
    ? `<br>⚖️ ${lawyerName}, confirmez-vous ou contestez-vous le rapport présenté ?`
    : "";
  const date = escapeHtml(getDateLong());
  const hour = escapeHtml(getHourText());
  const timeText = escapeHtml(getComparutionTimeText());
  const civilParty = escapeHtml(CIVIL_PARTY_LABEL);
  const reportUrl = escapeHtml(REPORT_CHANNEL_URL);
  const facts = formatFactsForOpening(state.facts);
  const vices = [
    ...procedureVicesHtmlItems(),
    ...refs.vices.value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<li>${escapeHtml(line)}</li>`)
  ].join("");

  refs.modalBody.innerHTML = `
    <div class="opening-document">
      <section class="opening-section opening-intro">
        <h3>Ouverture</h3>
        <p>Bonjour / Bonsoir à toutes et à tous.<br>
        Je suis le Procureur / Officier de Police Judiciaire / Juge <b>${judge}</b>.<br>
        Nous sommes le <b>${date}</b>, il est actuellement <b>${hour}</b>, et je déclare la comparution officiellement ouverte.</p>
      </section>

      <section class="opening-section">
        <h3>Identification des parties</h3>
        <p>Nous sommes en présence de :<br>
        La partie civile, représentée par le ${civilParty}<br>
        La partie accusée, constituée de Monsieur / Madame <b>${name}</b>,<br>
        ${representationLine}</p>
      </section>

      <section class="opening-section">
        <h3>Exposé des faits</h3>
        <p>Je demande maintenant à l’agent en charge du dossier de nous énoncer :</p>
        <ul>
          <li>les infractions reprochées,</li>
          <li>l’amende requise,</li>
          <li>la peine de prison encourue,</li>
          <li>les biens saisis.</li>
        </ul>
      </section>

      <section class="opening-section">
        <h3>Déclaration de l’accusé</h3>
        <p>Monsieur / Madame ${name},<br>
        déclarez-vous coupable ou non coupable des faits qui vous sont reprochés ?</p>
      </section>

      <section class="opening-section">
        <h3>Rapport de l’agent</h3>
        <p>Agent NOM, merci d’exposer à la Cour :</p>
        <ul>
          <li>le lieu de commission des faits,</li>
          <li>les faits constatés,</li>
          <li>les éléments matériels relevés.</li>
        </ul>
      </section>

      <section class="opening-section">
        <h3>Défense</h3>
        <p>Monsieur / Madame ${name},<br>
        au regard des éléments exposés par les agents,<br>
        qu’avez-vous à déclarer pour votre défense ?${lawyerDefenseLine}</p>
      </section>

      <section class="opening-section">
        <h3>Compléments éventuels</h3>
        <p>Les agents souhaitent-ils ajouter des faits complémentaires ?<br>
        (limite réglementaire applicable)</p>
      </section>

      <section class="opening-section">
        <h3>Suspension de séance</h3>
        <p>S’il n’y a rien à ajouter,<br>
        il est actuellement <b>${hour}</b>, et je suspends la séance le temps de la délibération.<br>
        ➡️ (Consultation des éléments via la plateforme officielle DOJ)</p>
      </section>

      <section class="opening-section">
        <h3>Reprise de séance & verdict</h3>
        <p>(Reprise de séance)<br>
        Suite à délibération,<br>
        Monsieur / Madame ${name},<br>
        la Cour vous déclare :<br>
        🔴 COUPABLE / NON COUPABLE des faits suivants :</p>
        <ul>${facts}</ul>
      </section>

      <section class="opening-section opening-sanctions">
        <h3>Sanctions prononcées</h3>
        <p>🔴 Sanctions prononcées :</p>
        <div class="sanction-grid">
          <span>Amende</span>
          <b>${escapeHtml(refs.fineTotal.value)}</b>
          <span>Peine de prison</span>
          <b>${timeText}</b>
          <span>Biens restitués</span>
          <b>liste</b>
          <span>Biens saisis non restitués</span>
          <b>liste</b>
        </div>
        ${vices ? `<div class="script-warning"><b>⚠️Vices de procédure :⚠️</b><ul>${vices}</ul></div>` : ""}
      </section>

      <section class="opening-section">
        <h3>Clôture</h3>
        <p>Il est <b>${hour}</b>, je déclare la comparution terminée.<br><br>
        📎 Merci de copier le rapport dans le canal prévu à cet effet :<br>
        <span class="script-link">${reportUrl}</span></p>
      </section>
    </div>
  `;
}

function renderPrelimOpeningModal() {
  const name = escapeHtml(getTrimmedValue(refs.prelimName, EMPTY_PERSON_LABEL));
  const judge = escapeHtml(getTrimmedValue(refs.prelimJudge, "Procureur / Juge / OPJ à compléter"));
  const lawyerName = escapeHtml(getPrelimLawyerName());
  const prelimLawyerIntro = hasPrelimLawyer()
    ? `<br>La partie accusée est assistée de son avocat <b>${lawyerName}</b>`
    : "";
  const date = escapeHtml(getDateLong());
  const shortDate = escapeHtml(getDateShort());
  const hour = escapeHtml(getHourText());
  const timeText = escapeHtml(prelimState.tigActive ? `${commitPrelimTigValue()} T.I.G` : refs.prelimTimeTotal.value);
  const civilParty = escapeHtml(CIVIL_PARTY_LABEL);
  const facts = formatFactsForOpening(prelimState.facts);
  const procedureQuestion = hasPrelimLawyer()
    ? "La défense souhaite-t-elle signaler un élément de procédure ?"
    : "La partie accusée souhaite-t-elle signaler un élément de procédure ?";

  const sections = [
    openingSection("Ouverture", openingParagraph([
      "Bonjour / Bonsoir à toutes et à tous.",
      `Je suis le Procureur / Officier de Police Judiciaire / Juge <b>${judge}</b>.`,
      `Nous sommes le <b>${date}</b>, il est actuellement <b>${hour}</b>, et je déclare l’audience préliminaire officiellement ouverte.`
    ]), "opening-intro"),

    openingSection("Identification des parties", openingParagraph([
      "Nous sommes en présence de :",
      `La partie civile, représentée par le ${civilParty}`,
      `La partie accusée, constituée de Monsieur / Madame <b>${name}</b>${prelimLawyerIntro}`
    ])),

    hasPrelimLawyer()
      ? openingSection("Avocat", openingParagraph([
          `L’avocat <b>${lawyerName}</b> est présent pour assister la partie accusée.`,
          "Il pourra formuler les observations utiles avant la décision préliminaire."
        ]))
      : "",

    openingSection("Objet de l’audience préliminaire", openingParagraph([
      "Cette audience a pour objectif de vérifier les éléments du dossier, d’identifier les faits retenus et de préparer la suite de la procédure avant jugement."
    ])),

    openingSection("Exposé des faits", `
        ${openingParagraph(["Je demande maintenant à l’agent en charge du dossier de nous énoncer :"])}
        ${openingList([
          "les faits constatés,",
          "les éléments matériels relevés,",
          "les infractions susceptibles d’être retenues."
        ])}
      `),

    openingSection("Déclaration de la partie accusée", openingParagraph([
      `Monsieur / Madame ${name},`,
      "au regard des éléments exposés, avez-vous une déclaration ou une observation à formuler avant la décision préliminaire ?"
    ])),

    openingSection("Vérification de procédure", openingParagraph([
      "Les agents souhaitent-ils ajouter un complément au dossier ?",
      procedureQuestion
    ])),

    openingSection("Suspension de séance", openingParagraph([
      "S’il n’y a rien à ajouter,",
      `il est actuellement <b>${hour}</b>, et je suspends la séance le temps de la délibération préliminaire.`,
      "➡️ (Consultation des éléments via la plateforme officielle DOJ)"
    ])),

    openingSection("Reprise et décision préliminaire", `
        ${openingParagraph([
          "Suite à délibération, votre cas sera vu en jugement.",
          "La décision préliminaire est : <b>Attente de Jugement</b>.",
          `Date de délibération : <b>${shortDate}</b>`,
          "Faits retenus :"
        ])}
        <ul>${facts}</ul>
      `),

    openingSection("Mesure retenue", sanctionGrid([
      ["Temps", timeText],
      ["Affaires restituées", "liste"],
      ["Affaires saisies", "liste"]
    ]), "opening-sanctions"),

    openingSection("Clôture", openingParagraph([
      `Il est <b>${hour}</b>, je déclare l’audience préliminaire terminée.`,
      "Le dossier est transmis pour la suite de la procédure judiciaire."
    ]))
  ].filter(Boolean);

  refs.modalBody.innerHTML = `
    <div class="opening-document">
      ${sections.join("")}
    </div>
  `;
}

let modalReturnFocus = null;

function setPageInert(inert) {
  [document.querySelector(".topbar"), document.querySelector("main"), document.querySelector(".footer")]
    .filter(Boolean)
    .forEach((element) => { element.inert = inert; });
}

function openAccessibleModal(modal, initialFocus = null) {
  modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  setPageInert(true);
  modal.hidden = false;
  window.setTimeout(() => {
    const focusTarget = initialFocus || modal.querySelector("button, input, textarea, select, [tabindex]:not([tabindex='-1'])");
    focusTarget?.focus();
  }, 0);
}

function closeAccessibleModal(modal) {
  if (modal.hidden) return;
  modal.hidden = true;
  setPageInert(false);
  const returnFocus = modalReturnFocus;
  modalReturnFocus = null;
  window.setTimeout(() => returnFocus?.focus(), 0);
}

function activeModal() {
  return [refs.resetConfirmModal, refs.procedureVicesModal, refs.copyFallbackModal, refs.modal]
    .find((modal) => !modal.hidden) ?? null;
}

function trapModalFocus(event, modal) {
  if (event.key !== "Tab") return;
  const focusable = Array.from(modal.querySelectorAll(
    "button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex='-1'])"
  )).filter((element) => !element.hidden && element.getClientRects().length);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openModal() {
  refs.modalTitle.textContent = "Ouverture de comparution";
  renderOpeningModal();
  openAccessibleModal(refs.modal);
}

function openPrelimModal() {
  refs.modalTitle.textContent = "Ouverture audience préliminaire";
  renderPrelimOpeningModal();
  openAccessibleModal(refs.modal);
}

function closeModal() {
  closeAccessibleModal(refs.modal);
}

function openManualCopyModal(text) {
  refs.manualCopyText.value = text;
  openAccessibleModal(refs.copyFallbackModal, refs.manualCopyText);
  window.setTimeout(() => {
    refs.manualCopyText.select();
  }, 0);
}

function closeManualCopyModal() {
  closeAccessibleModal(refs.copyFallbackModal);
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

function animateCopyConfirmation(button) {
  if (!(button instanceof HTMLButtonElement) || !button.classList.contains("copy-feedback")) return;
  button.querySelector(".copy-confirmation")?.remove();
  button.classList.add("copy-confirmed");

  const confirmation = document.createElement("span");
  confirmation.className = "copy-confirmation";
  confirmation.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>
    <span>Copié</span>
  `;
  button.append(confirmation);

  window.setTimeout(() => {
    button.classList.remove("copy-confirmed");
    confirmation.remove();
  }, 1600);
}

async function copyText(text, successMessage) {
  const triggerButton = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
  let copied = fallbackCopyText(text);

  if (!copied && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (error) {
      console.warn("Clipboard API failed, using fallback.", error);
    }
  }

  if (copied) {
    animateCopyConfirmation(triggerButton);
    showToast(successMessage);
  } else {
    openManualCopyModal(text);
    showToast("Copie automatique bloquée, texte affiché.", "warning");
  }
}

let toastTimer = 0;
function showToast(message, requestedType = "") {
  const warningPattern = /manquant|aucun|sélectionne|limite|déjà|bloqu|incorrect|invalide|ouvre une|doit être/i;
  const type = requestedType || (warningPattern.test(message) ? "warning" : "success");
  window.clearTimeout(toastTimer);
  refs.toast.dataset.type = type;
  refs.toastTitle.textContent = type === "warning" ? "À vérifier" : "Action terminée";
  refs.toastMessage.textContent = message;
  refs.toast.classList.remove("show");
  void refs.toast.offsetWidth;
  refs.toast.classList.add("show");
  toastTimer = window.setTimeout(() => refs.toast.classList.remove("show"), 3200);
}

function renderCodeTable() {
  const query = refs.infoSearch.value;
  const rows = normalizeSearchText(query)
    ? sortFactsBySeverity(codePenal.filter((fact) => matchesInfoSearch(fact, query)))
    : sortFactsBySeverity(codePenal);

  refs.codeTable.innerHTML = rows
    .map((fact) => {
      const detail = fact.details || "-";
      const detailHtml = fact.details === "Bracelet"
        ? `<span class="detail-badge">${escapeHtml(detail)}</span>`
        : escapeHtml(detail);

      return `
        <tr>
          <td>${escapeHtml(fact.nom)}</td>
          <td>${escapeHtml(formatMoney(fact.amende).replace(/\s/g, " "))}</td>
          <td>${fact.temps} min</td>
          <td>${detailHtml}</td>
        </tr>
      `;
    })
    .join("");
}

function matchesInfoSearch(fact, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const infoText = normalizeSearchText(factSearchText(fact));
  return infoText.includes(normalizedQuery) || Number.isFinite(scoreFactSearch(fact, query));
}

let viewTransitionTimer = 0;

function switchView(target) {
  const nextView = $(`#${target}View`);
  if (!nextView) return;
  const viewOrder = ["doj", "prelim", "judgement", "infos", "procedureVices"];
  const currentView = $(".view.active");
  if (currentView === nextView) return;
  const currentName = currentView?.id.replace(/View$/, "") || target;
  const directionClass = viewOrder.indexOf(target) >= viewOrder.indexOf(currentName)
    ? "view-enter-right"
    : "view-enter-left";

  $$(".view").forEach((view) => {
    view.classList.remove("active", "view-enter-right", "view-enter-left");
  });
  nextView.classList.add("active", directionClass);
  window.clearTimeout(viewTransitionTimer);
  viewTransitionTimer = window.setTimeout(() => {
    nextView.classList.remove("view-enter-right", "view-enter-left");
  }, 300);
  $$(".nav-link").forEach((button) => {
    const active = button.dataset.viewTarget === target;
    button.classList.toggle("active", active);
    if (active) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
  const resettable = ["doj", "prelim", "judgement"].includes(target);
  refs.resetCase.disabled = !resettable;
  refs.resetCase.title = resettable
    ? "Réinitialiser uniquement ce dossier"
    : "Ouvre un dossier pour pouvoir le réinitialiser";
  saveCaseToStorage();
}

function handleSuggestionKeydown(event, type, close) {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    moveSuggestionSelection(type, event.key === "ArrowDown" ? 1 : -1);
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    addActiveSuggestion(type);
    return;
  }
  if (event.key === "Escape") close();
}

refs.resetCase.addEventListener("click", requestCurrentCaseReset);

refs.factSearch.addEventListener("input", () => {
  suggestionIndices.doj = 0;
  state.pendingFact = factByName.has(refs.factSearch.value.trim()) ? refs.factSearch.value.trim() : "";
  renderSuggestions(true);
});

refs.prelimFactSearch.addEventListener("input", () => {
  suggestionIndices.prelim = 0;
  prelimState.pendingFact = factByName.has(refs.prelimFactSearch.value.trim()) ? refs.prelimFactSearch.value.trim() : "";
  renderPrelimSuggestions(true);
});

refs.judgementFactSearch.addEventListener("input", () => {
  suggestionIndices.judgement = 0;
  judgementState.pendingFact = factByName.has(refs.judgementFactSearch.value.trim()) ? refs.judgementFactSearch.value.trim() : "";
  renderJudgementSuggestions(true);
});

refs.judgementFactSearch.addEventListener("focus", () => renderJudgementSuggestions(true));
refs.judgementFactSearch.addEventListener("blur", () => window.setTimeout(closeJudgementSuggestions, 120));

refs.judgementFactSearch.addEventListener("keydown", (event) => {
  handleSuggestionKeydown(event, "judgement", closeJudgementSuggestions);
});

refs.prelimFactSearch.addEventListener("focus", () => renderPrelimSuggestions(true));
refs.prelimFactSearch.addEventListener("blur", () => window.setTimeout(closePrelimSuggestions, 120));

refs.prelimFactSearch.addEventListener("keydown", (event) => {
  handleSuggestionKeydown(event, "prelim", closePrelimSuggestions);
});

refs.factSearch.addEventListener("focus", () => renderSuggestions(true));
refs.factSearch.addEventListener("blur", () => window.setTimeout(closeSuggestions, 120));

refs.factSearch.addEventListener("keydown", (event) => {
  handleSuggestionKeydown(event, "doj", closeSuggestions);
});

refs.comboToggle.addEventListener("click", () => {
  refs.factSearch.focus();
  renderSuggestions(true);
});

refs.prelimComboToggle.addEventListener("click", () => {
  refs.prelimFactSearch.focus();
  renderPrelimSuggestions(true);
});

refs.judgementComboToggle.addEventListener("click", () => {
  refs.judgementFactSearch.focus();
  renderJudgementSuggestions(true);
});

refs.prelimAddFact.addEventListener("click", addPrelimFact);
refs.tigToggle.addEventListener("click", () => {
  if (prelimState.tigActive) commitPrelimTigValue();
  prelimState.tigActive = !prelimState.tigActive;
  updatePrelimTime();
  if (prelimState.tigActive) refs.prelimTigValue.focus();
});
refs.prelimLawyerToggle.addEventListener("click", () => {
  prelimState.lawyerActive = !prelimState.lawyerActive;
  updatePrelimLawyerControl();
  if (prelimState.lawyerActive) refs.prelimLawyerName.focus();
});
refs.prelimTigValue.addEventListener("input", () => {
  updateTigDraft(refs.prelimTigValue, prelimState, refs.prelimTigHint, refs.prelimTimeTotal);
});
refs.prelimTigValue.addEventListener("change", () => {
  commitPrelimTigValue();
  updatePrelimTime();
});
refs.copyPrelimSapd.addEventListener("click", () => {
  if (!validateCaseBeforeCopy("prelim")) return;
  copyText(buildPrelimSapdText(), "Audience préliminaire copiée dans le presse-papier");
});
refs.openPrelimVicesPicker.addEventListener("click", () => openProcedureVicesModal("prelim"));
refs.copyPrelimVicesContest.addEventListener("click", () => {
  if (hasUnassignedAnnulationVice("prelim")) {
    showToast("Sélectionne le fait concerné par chaque annulation");
    return;
  }
  copyText(buildViceSapdText("prelim"), "Texte des vices copié");
});
refs.openPrelimHearing.addEventListener("click", openPrelimModal);

refs.judgementAddFact.addEventListener("click", addJudgementFact);
refs.copyJudgementSapd.addEventListener("click", () => {
  if (!validateCaseBeforeCopy("judgement")) return;
  copyText(buildJudgementSapdText(), "Jugement copié dans le presse-papier");
});

refs.addFact.addEventListener("click", addFact);
refs.comparutionTigToggle.addEventListener("click", () => {
  if (state.tigActive) commitComparutionTigValue();
  state.tigActive = !state.tigActive;
  updateTotals();
  if (state.tigActive) refs.comparutionTigValue.focus();
});
refs.lawyerToggle.addEventListener("click", () => {
  state.lawyerActive = !state.lawyerActive;
  updateLawyerControl();
  if (state.lawyerActive) refs.lawyerName.focus();
});
refs.comparutionTigValue.addEventListener("input", () => {
  updateTigDraft(refs.comparutionTigValue, state, refs.comparutionTigHint, refs.timeTotal);
});
refs.comparutionTigValue.addEventListener("change", () => {
  commitComparutionTigValue();
  updateTotals();
});
refs.fineDouble.addEventListener("change", updateTotals);
refs.openVicesPicker.addEventListener("click", () => openProcedureVicesModal("doj"));
refs.openHearing.addEventListener("click", openModal);
refs.copySapd.addEventListener("click", () => {
  if (!validateCaseBeforeCopy("doj")) return;
  copyText(buildSapdText(), "Texte copié dans le presse-papier");
});
refs.infoSearch.addEventListener("input", renderCodeTable);
refs.copyVicesContest.addEventListener("click", () => {
  if (hasUnassignedAnnulationVice("doj")) {
    showToast("Sélectionne le fait concerné par chaque annulation");
    return;
  }
  copyText(buildViceSapdText("doj"), "Texte des vices copié");
});
refs.procedureVicesSearch.addEventListener("input", renderProcedureVicesTable);
refs.procedureVicesPickerSearch.addEventListener("input", renderProcedureVicesPicker);
refs.finishProcedureVices.addEventListener("click", closeProcedureVicesModal);
refs.paletteToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleColorPalette();
});
refs.colorPalette.addEventListener("click", (event) => event.stopPropagation());

[refs.prelimForm, refs.dojForm, refs.judgementForm].forEach((form) => {
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", saveCaseToStorage);
  form.addEventListener("change", saveCaseToStorage);
});

document.addEventListener("input", (event) => updateFieldVisualState(event.target));
document.addEventListener("change", (event) => updateFieldVisualState(event.target));

$$("[data-view-target]").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.viewTarget));
});

$$("[data-close-modal]").forEach((element) => element.addEventListener("click", closeModal));
$$("[data-close-copy-modal]").forEach((element) => element.addEventListener("click", closeManualCopyModal));
$$("[data-close-procedure-vices-modal]").forEach((element) => element.addEventListener("click", closeProcedureVicesModal));
$$('[data-close-reset-modal]').forEach((element) => element.addEventListener("click", closeResetConfirmModal));
refs.cancelReset.addEventListener("click", closeResetConfirmModal);
refs.confirmReset.addEventListener("click", performCurrentCaseReset);

document.addEventListener("keydown", (event) => {
  const modal = activeModal();
  if (modal) {
    trapModalFocus(event, modal);
    if (event.key === "Escape") {
      if (modal === refs.resetConfirmModal) closeResetConfirmModal();
      if (modal === refs.modal) closeModal();
      if (modal === refs.copyFallbackModal) closeManualCopyModal();
      if (modal === refs.procedureVicesModal) closeProcedureVicesModal();
    }
    return;
  }
  if (event.key === "Escape" && !refs.colorPalette.hidden) closeColorPalette();
});

document.addEventListener("click", () => {
  if (!refs.colorPalette.hidden) closeColorPalette();
});

renderColorPalette();
renderCodeTable();
renderProcedureVicesTable();
if (!loadSavedCase()) {
  renderPrelimSelectedFacts();
  renderJudgementSelectedFacts();
  renderSelectedFacts();
  renderSelectedProcedureVices("doj");
  renderSelectedProcedureVices("prelim");
  updateComparutionDecisionLock();
  updateLawyerControl();
  updatePrelimLawyerControl();
  updatePrelimTime();
  updateJudgementTotals();
  updateTotals();
}
refreshFieldVisualStates();
