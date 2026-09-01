const assert = require("node:assert/strict");
const {
  calculateSanctions,
  clampFactCount,
  clampReduction,
  clampTigValue,
  combinedReduction,
  formatTime,
  sumReductions
} = require("./calculations.js");

const facts = [
  { nom: "Outrage à agent", amende: 100000, temps: 10 },
  { nom: "Refus d'obtempérer", amende: 80000, temps: 10 },
  { nom: "Braquage de Fleeca", amende: 600000, temps: 25 }
];

assert.equal(sumReductions([30, 50]), 80, "les réductions de vice doivent s'additionner");
assert.equal(sumReductions([30, 50, 40]), 100, "le cumul des vices doit être plafonné à 100 %");
assert.equal(combinedReduction(10, [30, 50]), 90, "la réduction manuelle doit rester séparée puis s'ajouter");
assert.equal(combinedReduction(40, [30, 50]), 100, "la réduction totale doit être plafonnée à 100 %");
assert.deepEqual(calculateSanctions(facts.slice(0, 2)), {
  rawMinutes: 20,
  rawFine: 180000,
  minutes: 20,
  fine: 180000
});
assert.deepEqual(calculateSanctions([facts[2]], { reduction: 50 }), {
  rawMinutes: 25,
  rawFine: 600000,
  minutes: 13,
  fine: 300000
});
assert.equal(calculateSanctions([facts[0]], { fineDouble: true, reduction: 25 }).fine, 150000);
assert.deepEqual(
  calculateSanctions(facts.slice(0, 2), { annulledFacts: ["Outrage à agent"] }),
  { rawMinutes: 10, rawFine: 80000, minutes: 10, fine: 80000 },
  "un fait ciblé par un vice d'annulation doit être exclu des sanctions"
);
assert.equal(clampReduction(-20), 0);
assert.equal(clampReduction(120), 100);
assert.equal(clampTigValue(12), 12);
assert.equal(clampTigValue(0), 1);
assert.equal(clampTigValue(999), 300);
assert.equal(clampTigValue("1.5", 12), 12, "les TIG décimaux doivent être refusés");
assert.equal(clampTigValue("1e2", 12), 12, "la notation exponentielle doit être refusée");
assert.equal(clampFactCount("", 5), 5, "un compteur vide doit conserver sa valeur précédente");
assert.equal(clampFactCount("2.5", 5), 5, "un compteur décimal doit être refusé");
assert.equal(formatTime(1500), "25h00", "les durées ne doivent pas reboucler après 24 heures");

console.log("18/18 tests réussis.");
