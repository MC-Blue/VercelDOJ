const assert = require("node:assert/strict");

const facts = new Map([
  ["Outrage à agent", { amende: 100000, temps: 10 }],
  ["Refus d'obtempérer", { amende: 80000, temps: 10 }],
  ["Braquage de Fleeca", { amende: 600000, temps: 25 }]
]);

const procedureVices = [
  { id: "reduction-30", type: "reduction", reduction: 30 },
  { id: "reduction-50", type: "reduction", reduction: 50 },
  { id: "annulation", type: "annulation" },
  { id: "acquittement", type: "acquittement" }
];

function clampReduction(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

function clampTigValue(value) {
  return Math.min(300, Math.max(1, Number(value) || 1));
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours}h${String(mins).padStart(2, "0")}`;
}

function calculateComparution(selectedFacts, { reduction = 0, fineDouble = false, tigActive = false, tigValue = 1 } = {}) {
  const percent = clampReduction(reduction);
  const rawMinutes = selectedFacts.reduce((sum, fact) => sum + (facts.get(fact)?.temps || 0), 0);
  const rawFine = selectedFacts.reduce((sum, fact) => sum + (facts.get(fact)?.amende || 0), 0);
  const minutes = Math.round(rawMinutes * (1 - percent / 100));
  const fine = Math.round((fineDouble ? rawFine * 2 : rawFine) * (1 - percent / 100));

  return {
    minutes,
    timeText: tigActive ? `${clampTigValue(tigValue)} T.I.G` : formatTime(minutes),
    fine
  };
}

function selectedProcedureReduction(selectedIds) {
  const selected = selectedIds.map((id) => procedureVices.find((vice) => vice.id === id)).filter(Boolean);
  if (selected.some((vice) => vice.type === "acquittement")) return 100;
  return Math.max(0, ...selected.filter((vice) => vice.type === "reduction").map((vice) => vice.reduction || 0));
}

assert.equal(calculateComparution(["Outrage à agent", "Refus d'obtempérer"]).timeText, "0h20");
assert.deepEqual(calculateComparution(["Braquage de Fleeca"], { reduction: 50 }), {
  minutes: 13,
  timeText: "0h13",
  fine: 300000
});
assert.equal(calculateComparution(["Outrage à agent"], { fineDouble: true, reduction: 25 }).fine, 150000);
assert.equal(calculateComparution(["Braquage de Fleeca"], { tigActive: true, tigValue: 12 }).timeText, "12 T.I.G");
assert.deepEqual([clampTigValue(0), clampTigValue(999)], [1, 300]);
assert.equal(selectedProcedureReduction(["reduction-30", "reduction-50"]), 50);
assert.equal(selectedProcedureReduction(["reduction-30", "acquittement"]), 100);
assert.equal(selectedProcedureReduction(["annulation"]), 0);

console.log("8/8 tests réussis.");
