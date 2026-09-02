const assert = require("node:assert/strict");
const {
  calculateSanctions,
  clampFactCount,
  clampReduction,
  clampTigValue,
  formatTime,
  MAX_PRISON_MINUTES,
  normalizePrisonTime,
  sumReductions
} = require("./calculations.js");

const facts = [
  { nom: "Outrage à agent", amende: 100000, temps: 10 },
  { nom: "Refus d'obtempérer", amende: 80000, temps: 10 },
  { nom: "Braquage de Fleeca", amende: 600000, temps: 25 }
];

assert.equal(sumReductions([30, 50]), 80, "les réductions de vice doivent s'additionner");
assert.equal(sumReductions([30, 50, 40]), 100, "le cumul des vices doit être plafonné à 100 %");
assert.deepEqual(calculateSanctions(facts.slice(0, 2)), {
  rawMinutes: 20,
  rawFine: 180000,
  uncappedMinutes: 20,
  minutes: 20,
  fine: 180000
});
assert.deepEqual(calculateSanctions([facts[2]], { reduction: 50 }), {
  rawMinutes: 25,
  rawFine: 600000,
  uncappedMinutes: 13,
  minutes: 13,
  fine: 300000
});
assert.equal(calculateSanctions([facts[0]], { fineDouble: true, reduction: 25 }).fine, 150000);
assert.equal(MAX_PRISON_MINUTES, 60, "le plafond de prison doit être fixé à une heure");
assert.deepEqual(
  calculateSanctions([{ nom: "Fait long A", amende: 0, temps: 40 }, { nom: "Fait long B", amende: 0, temps: 35 }]),
  { rawMinutes: 75, rawFine: 0, uncappedMinutes: 75, minutes: 60, fine: 0 },
  "un cumul de 75 minutes doit être plafonné à 60 minutes"
);
assert.equal(
  calculateSanctions([{ amende: 0, temps: 100 }], { reduction: 50 }).minutes,
  50,
  "la réduction doit être appliquée avant le plafond"
);
assert.deepEqual(normalizePrisonTime(""), {
  valid: true,
  requestedMinutes: 0,
  minutes: 0,
  capped: false,
  text: ""
});
assert.deepEqual(normalizePrisonTime("45 minutes"), {
  valid: true,
  requestedMinutes: 45,
  minutes: 45,
  capped: false,
  text: "0h45"
});
assert.deepEqual(normalizePrisonTime("1h10"), {
  valid: true,
  requestedMinutes: 70,
  minutes: 60,
  capped: true,
  text: "1h00"
});
assert.equal(normalizePrisonTime("durée libre").valid, false, "une durée non reconnue doit être refusée");
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

console.log("22/22 tests de calcul réussis.");
