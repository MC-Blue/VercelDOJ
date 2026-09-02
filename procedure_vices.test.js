const assert = require("node:assert/strict");
const { all: procedureVices } = require("./procedure_vices.js");

assert.equal(procedureVices.length, 58, "le catalogue doit contenir les 58 vices attendus");
assert.equal(new Set(procedureVices.map((vice) => vice.id)).size, procedureVices.length, "chaque vice doit avoir un identifiant unique");
assert.ok(procedureVices.every((vice) => ["reduction", "annulation", "acquittement"].includes(vice.type)), "tous les types doivent être reconnus");
assert.ok(
  procedureVices.filter((vice) => vice.type === "reduction").every((vice) => Number.isInteger(vice.reduction) && vice.reduction >= 0 && vice.reduction <= 100),
  "chaque réduction doit être un pourcentage entier valide"
);
assert.equal(procedureVices.filter((vice) => vice.type === "annulation").length, 4, "les quatre vices d’annulation doivent être conservés");
assert.equal(procedureVices.find((vice) => vice.id === "1-7")?.reduction, 30);
assert.equal(procedureVices.find((vice) => vice.id === "9-3")?.type, "annulation");
assert.ok(Object.isFrozen(procedureVices) && procedureVices.every(Object.isFrozen), "le catalogue exposé doit être immuable");

console.log("8/8 tests du catalogue des vices réussis.");
