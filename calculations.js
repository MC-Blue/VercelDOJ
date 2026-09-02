const DojCalculations = (() => {
  const MAX_PRISON_MINUTES = 60;

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

  function formatTime(minutes) {
    const safeMinutes = Math.max(0, Math.round(Number(minutes) || 0));
    const hours = Math.floor(safeMinutes / 60);
    const mins = safeMinutes % 60;
    return `${hours}h${String(mins).padStart(2, "0")}`;
  }

  function normalizePrisonTime(value) {
    const source = String(value ?? "").trim().toLowerCase();
    if (!source) {
      return { valid: true, requestedMinutes: 0, minutes: 0, capped: false, text: "" };
    }

    const hoursMatch = source.match(/^(\d+)\s*h(?:\s*(\d+))?$/i);
    const minutesMatch = source.match(/^(\d+)\s*(?:min(?:ute)?s?)?$/i);
    if (!hoursMatch && !minutesMatch) {
      return { valid: false, requestedMinutes: 0, minutes: 0, capped: false, text: source };
    }

    const requestedMinutes = hoursMatch
      ? (Number(hoursMatch[1]) * 60) + Number(hoursMatch[2] || 0)
      : Number(minutesMatch[1]);
    const minutes = Math.min(MAX_PRISON_MINUTES, requestedMinutes);

    return {
      valid: true,
      requestedMinutes,
      minutes,
      capped: requestedMinutes > MAX_PRISON_MINUTES,
      text: formatTime(minutes)
    };
  }

  function calculateSanctions(facts, { reduction = 0, fineDouble = false } = {}) {
    const applicableFacts = Array.isArray(facts) ? facts : [];
    const percent = clampReduction(reduction);
    const rawMinutes = applicableFacts.reduce((sum, fact) => sum + (Number(fact.temps) || 0), 0);
    const rawFine = applicableFacts.reduce((sum, fact) => sum + (Number(fact.amende) || 0), 0);
    const uncappedMinutes = Math.round(rawMinutes * (1 - percent / 100));

    return {
      rawMinutes,
      rawFine,
      uncappedMinutes,
      minutes: Math.min(MAX_PRISON_MINUTES, uncappedMinutes),
      fine: Math.round((fineDouble ? rawFine * 2 : rawFine) * (1 - percent / 100))
    };
  }

  return {
    calculateSanctions,
    clampFactCount,
    clampReduction,
    clampTigValue,
    formatTime,
    MAX_PRISON_MINUTES,
    normalizePrisonTime,
    sumReductions
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = DojCalculations;
}
