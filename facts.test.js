const assert = require("node:assert/strict");
const { all, categories, compareNames, resolveName } = require("./facts.js");

const expectedCategories = [
  "Contravention",
  "Délit mineur",
  "Délit majeur",
  "Crime",
  "Crime Fédéral"
];
const nameCollator = new Intl.Collator("fr", { sensitivity: "base", numeric: true });

assert.ok(all.length >= 118, "le répertoire ne doit pas perdre de faits lors d'un ajout");
assert.deepEqual(categories, expectedCategories, "les catégories doivent respecter l’ordre demandé");
assert.deepEqual(
  [...new Set(all.map((fact) => fact.categorie))],
  expectedCategories,
  "les faits doivent être regroupés dans l’ordre des catégories"
);
assert.deepEqual(
  expectedCategories.filter((category) => all.some((fact) => fact.categorie === category)),
  expectedCategories,
  "chaque catégorie doit contenir au moins un fait"
);
assert.ok(
  all.every((fact, index) => index === 0 || compareNames(all[index - 1].nom, fact.nom) <= 0),
  "les faits doivent être triés par catégorie puis par ordre alphabétique français"
);
assert.ok(
  all.every((fact, index) => (
    index === 0
    || all[index - 1].categorie !== fact.categorie
    || nameCollator.compare(all[index - 1].nom, fact.nom) <= 0
  )),
  "les faits de chaque catégorie doivent être triés par nom"
);
assert.ok(
  all.every((fact) => !/peine fédérale/i.test(`${fact.nom} ${fact.categorie}`)),
  "l’ancienne appellation Peine fédérale ne doit plus être affichée"
);
assert.equal(
  resolveName("Terrorisme (Peine fédérale)"),
  "Terrorisme (Crime Fédéral)",
  "les anciens dossiers fédéraux doivent être migrés"
);
assert.equal(
  resolveName("Braquage de coiffeur (Délit Mineur)"),
  "Braquage de coiffeur (Délit mineur)",
  "les anciennes catégories doivent être normalisées dans les dossiers sauvegardés"
);
assert.equal(
  resolveName("Transport de marchandises illégal (Délit majeur)"),
  "Transport de marchandises illégal (Délit majeur)",
  "une migration dont le fait cible a été retiré ne doit pas bloquer le catalogue"
);
assert.ok(
  all.some((fact) => fact.nom === "Braquage d'Ammunation (Délit mineur)"),
  "un fait récemment ajouté doit être disponible dans le catalogue"
);
assert.equal(new Set(all.map((fact) => fact.nom)).size, all.length, "les noms de faits doivent être uniques");
assert.ok(
  all.every((fact) => Number.isInteger(fact.amende) && fact.amende >= 0),
  "chaque amende doit être un entier positif ou nul"
);
assert.ok(
  all.every((fact) => Number.isInteger(fact.temps) && fact.temps >= 0),
  "chaque durée doit être un entier positif ou nul"
);
assert.deepEqual(
  all.find((fact) => fact.nom === "Prise d'otage sur agent de l'état (Crime)"),
  {
    nom: "Prise d'otage sur agent de l'état (Crime)",
    categorie: "Crime",
    amende: 550000,
    temps: 25,
    details: "Bracelet",
    hasBracelet: true
  },
  "le format compact doit produire les données utilisées par l'interface"
);

console.log("15/15 tests du répertoire des faits réussis.");
