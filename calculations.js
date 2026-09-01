const DojCalculations = (() => {
  function clampInteger(value, min, max, fallback = min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, Math.round(number)));
  }

  function clampReduction(value) {
    return clampInteger(value, 0, 100, 0);
  }

  function clampWholeNumber(value, min, max, fallback) {
    if (typeof value === "string" && !/^\d+$/.test(value.trim())) return fallback;
    const number = Number(value);
    if (!Number.isInteger(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function clampTigValue(value, fallback = 1) {
    return clampWholeNumber(value, 1, 300, fallback);
  }

  function clampFactCount(value, fallback = 1) {
    return clampWholeNumber(value, 1, Number.MAX_SAFE_INTEGER, fallback);
  }

  function sumReductions(values) {
    return Math.min(
      100,
      (Array.isArray(values) ? values : []).reduce((sum, value) => sum + clampReduction(value), 0)
    );
  }

  function combinedReduction(manualReduction, procedureReductions) {
    return Math.min(100, clampReduction(manualReduction) + sumReductions(procedureReductions));
  }

  function formatTime(minutes) {
    const safeMinutes = Math.max(0, Math.round(Number(minutes) || 0));
    const hours = Math.floor(safeMinutes / 60);
    const mins = safeMinutes % 60;
    return `${hours}h${String(mins).padStart(2, "0")}`;
  }

  function calculateSanctions(facts, { reduction = 0, fineDouble = false, annulledFacts = [] } = {}) {
    const annulled = new Set(Array.isArray(annulledFacts) ? annulledFacts : []);
    const applicableFacts = (Array.isArray(facts) ? facts : []).filter((fact) => !annulled.has(fact.nom));
    const percent = clampReduction(reduction);
    const rawMinutes = applicableFacts.reduce((sum, fact) => sum + (Number(fact.temps) || 0), 0);
    const rawFine = applicableFacts.reduce((sum, fact) => sum + (Number(fact.amende) || 0), 0);

    return {
      rawMinutes,
      rawFine,
      minutes: Math.round(rawMinutes * (1 - percent / 100)),
      fine: Math.round((fineDouble ? rawFine * 2 : rawFine) * (1 - percent / 100))
    };
  }

  return {
    calculateSanctions,
    clampFactCount,
    clampInteger,
    clampReduction,
    clampTigValue,
    combinedReduction,
    formatTime,
    sumReductions
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = DojCalculations;
}
