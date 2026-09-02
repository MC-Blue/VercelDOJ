/*
 * Catalogue unique des vices de procédure.
 * Garder un identifiant unique par vice et utiliser uniquement les types
 * "reduction", "annulation" ou "acquittement".
 */
const DojProcedureVices = (() => {
  const all = [
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

  const allowedTypes = new Set(["reduction", "annulation", "acquittement"]);
  const ids = new Set();

  const validated = all.map((vice) => {
    if (!vice.id || ids.has(vice.id)) throw new Error(`Identifiant de vice invalide ou dupliqué : ${vice.id}`);
    if (!vice.category || !vice.name || !vice.effect || !allowedTypes.has(vice.type)) {
      throw new Error(`Vice de procédure invalide : ${vice.id}`);
    }
    if (vice.type === "reduction" && (!Number.isInteger(vice.reduction) || vice.reduction < 0 || vice.reduction > 100)) {
      throw new Error(`Réduction invalide pour le vice ${vice.id}`);
    }
    ids.add(vice.id);
    return Object.freeze({ ...vice });
  });

  return Object.freeze({ all: Object.freeze(validated) });
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = DojProcedureVices;
}
