const {
  calculateSanctions,
  clampFactCount,
  clampTigValue,
  formatTime,
  MAX_PRISON_MINUTES,
  normalizePrisonTime,
  sumReductions
} = DojCalculations;

const {
  all: codePenal,
  compareNames: compareFactNames,
  resolveName: resolveFactName
} = DojFacts;

const state = {
  facts: [],
  pendingFact: "",
  tigActive: false,
  uncappedPrisonMinutes: 0,
  prisonMinutes: 0,
  tigValue: 1,
  lawyerActive: false,
  procedureVices: [],
  decisionBeforeAcquittement: "",
  acquittementLocked: false
};

const prelimState = {
  facts: [],
  pendingFact: "",
  tigActive: false,
  uncappedPrisonMinutes: 0,
  prisonMinutes: 0,
  tigValue: 1,
  lawyerActive: false,
  procedureVices: []
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

const { all: PROCEDURE_VICES } = DojProcedureVices;

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
  judgementTimeHint: $("#judgementTimeHint"),
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
  timeCapNotice: $("#timeCapNotice"),
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
  if (category.includes("crime federal")) return "severity-federal";
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

  return codePenal.filter((fact) => Number.isFinite(scoreFactSearch(fact, query)));
}

function updatePrelimPrisonMinutes() {
  const reduction = selectedProcedureReduction(prelimState);
  const sanctions = calculateSanctions(
    prelimState.facts.map((name) => factByName.get(name)).filter(Boolean),
    { reduction }
  );
  prelimState.uncappedPrisonMinutes = sanctions.uncappedMinutes;
  prelimState.prisonMinutes = sanctions.minutes;
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
    const migratedFact = resolveFactName(fact);
    if (factByName.has(migratedFact)) counts.set(migratedFact, clampFactCount(count));
  });
  return counts;
}

function validFacts(facts) {
  return (Array.isArray(facts) ? facts : [])
    .map(resolveFactName)
    .filter((fact) => factByName.has(fact))
    .sort(compareFactNames);
}

function validProcedureVices(vices) {
  return (Array.isArray(vices) ? vices : []).filter((id) => procedureViceById.has(id));
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
      [currentDecision(), "Décision non choisie"]
    ],
    prelim: [
      [refs.prelimName.value.trim(), "Nom manquant"],
      [prelimState.facts.length, "Aucun fait sélectionné"]
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
      container: refs.prelimSelectedProcedureVices
    };
  }

  return {
    context: "doj",
    label: "Comparution",
    targetState: state,
    container: refs.selectedProcedureVices
  };
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
  const { targetState, container } = getProcedureVicesConfig(context);
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
        renderSelectedProcedureVices(context);
        if (!refs.procedureVicesModal.hidden && procedureVicesContext === context) renderProcedureVicesPicker();
        applyProcedureVicesEffects(context);
      });
    });

    item.append(text, remove);
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
  const { targetState } = getProcedureVicesConfig();
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
          } else if (!input.checked) {
            targetState.procedureVices = targetState.procedureVices.filter((id) => id !== vice.id);
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
  return selectedProcedureViceObjects(targetState)
    .map((vice) => `- ${vice.name} (${vice.effect})`);
}

function procedureVicesHtmlItems() {
  return selectedProcedureViceObjects(state)
    .map((vice) => `<li>${escapeHtml(vice.name)} (${escapeHtml(vice.effect)})</li>`);
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
      fineDouble: refs.fineDouble.checked
    }
  );
  state.uncappedPrisonMinutes = sanctions.uncappedMinutes;
  state.prisonMinutes = sanctions.minutes;

  refs.comparutionTigToggle.classList.toggle("active", state.tigActive);
  refs.comparutionTigToggle.setAttribute("aria-pressed", String(state.tigActive));
  refs.comparutionTigValueField.hidden = !state.tigActive;
  refs.comparutionTigHint.hidden = true;
  refs.comparutionTigValue.value = String(state.tigValue);
  refs.timeTotal.readOnly = true;
  refs.timeCapNotice.hidden = state.tigActive || state.uncappedPrisonMinutes <= MAX_PRISON_MINUTES;

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
  commitJudgementTime();
  saveCaseToStorage();
}

function commitJudgementTime(notifyIfCapped = false) {
  const normalized = normalizePrisonTime(refs.judgementTimeTotal.value);
  refs.judgementTimeHint.hidden = normalized.valid;
  if (!normalized.valid) return false;

  refs.judgementTimeTotal.value = normalized.text;
  if (normalized.capped && notifyIfCapped) {
    showToast("Le temps du jugement est plafonné à 1h00.", "warning");
  }
  return true;
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
  refs.prelimTimeCapNotice.hidden = prelimState.tigActive || prelimState.uncappedPrisonMinutes <= MAX_PRISON_MINUTES;

  if (prelimState.tigActive) {
    refs.prelimTimeTotal.value = `${prelimState.tigValue} T.I.G`;
    saveCaseToStorage();
    return;
  }

  refs.prelimTimeTotal.value = formatTime(prelimState.prisonMinutes);
  saveCaseToStorage();
}

const FACT_SELECTORS = Object.freeze({
  doj: {
    state,
    input: refs.factSearch,
    suggestions: refs.factSuggestions,
    optionPrefix: "fact-suggestion-",
    duplicateMessage: "Ce fait est déjà ajouté.",
    afterAdd() {
      renderSelectedFacts();
      renderSelectedProcedureVices();
      updateTotals();
    }
  },
  prelim: {
    state: prelimState,
    input: refs.prelimFactSearch,
    suggestions: refs.prelimFactSuggestions,
    optionPrefix: "prelim-fact-suggestion-",
    duplicateMessage: "Ce fait est déjà ajouté.",
    afterAdd() {
      updatePrelimPrisonMinutes();
      renderPrelimSelectedFacts();
      renderSelectedProcedureVices("prelim");
      updatePrelimTime();
    }
  },
  judgement: {
    state: judgementState,
    input: refs.judgementFactSearch,
    suggestions: refs.judgementFactSuggestions,
    optionPrefix: "judgement-fact-suggestion-",
    duplicateMessage: "Ce fait est déjà ajouté. Modifie le nombre à droite.",
    beforeAdd(factName) {
      judgementState.factCounts.set(factName, 1);
    },
    afterAdd() {
      renderJudgementSelectedFacts();
      updateJudgementTotals();
    }
  }
});

function factSelectorConfig(type) {
  const config = FACT_SELECTORS[type];
  if (!config) throw new Error(`Sélecteur de faits inconnu : ${type}`);
  return config;
}

function factSuggestions(type) {
  return searchFacts(factSelectorConfig(type).input.value);
}

function closeFactSuggestions(type) {
  const { input, suggestions } = factSelectorConfig(type);
  suggestions.classList.remove("open");
  input.setAttribute("aria-expanded", "false");
  input.removeAttribute("aria-activedescendant");
}

function renderFactSuggestions(type, forceOpen = false) {
  const config = factSelectorConfig(type);
  const items = factSuggestions(type);
  const activeIndex = Math.min(suggestionIndices[type], Math.max(0, items.length - 1));
  suggestionIndices[type] = activeIndex;
  config.suggestions.innerHTML = "";

  items.forEach((fact, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.id = `${config.optionPrefix}${index}`;
    option.className = `suggestion${index === activeIndex ? " active" : ""}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(index === activeIndex));
    setSuggestionContent(option, fact);
    option.addEventListener("mousedown", (event) => event.preventDefault());
    option.addEventListener("click", () => {
      suggestionIndices[type] = index;
      config.state.pendingFact = fact.nom;
      config.input.value = fact.nom;
      closeFactSuggestions(type);
      config.input.focus();
    });
    config.suggestions.append(option);
  });

  const shouldOpen = forceOpen || document.activeElement === config.input;
  const isOpen = shouldOpen && items.length > 0;
  config.suggestions.classList.toggle("open", isOpen);
  config.input.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    config.input.setAttribute("aria-activedescendant", `${config.optionPrefix}${activeIndex}`);
  } else {
    config.input.removeAttribute("aria-activedescendant");
  }
}

function moveSuggestionSelection(type, direction) {
  const config = factSelectorConfig(type);
  const items = factSuggestions(type);
  if (!items.length) return;
  suggestionIndices[type] = (suggestionIndices[type] + direction + items.length) % items.length;
  renderFactSuggestions(type, true);
  document.getElementById(`${config.optionPrefix}${suggestionIndices[type]}`)
    ?.scrollIntoView({ block: "nearest" });
}

function addActiveSuggestion(type) {
  const config = factSelectorConfig(type);
  if (config.input.value.trim()) {
    const selected = factSuggestions(type)[suggestionIndices[type]];
    if (selected) config.state.pendingFact = selected.nom;
  }
  addFactForContext(type);
}

function resolveFactFromInput(type) {
  const { input } = factSelectorConfig(type);
  const value = input.value.trim();
  if (!value) return "";
  if (factByName.has(value)) return value;
  return factSuggestions(type)[0]?.nom ?? "";
}

function addFactForContext(type) {
  const config = factSelectorConfig(type);
  const factName = config.state.pendingFact || resolveFactFromInput(type);

  if (!factName) {
    showToast("Sélectionne un fait avant d'ajouter.");
    return;
  }
  if (config.state.facts.length >= 10) {
    showToast("La limite de 10 faits est atteinte.");
    return;
  }
  if (config.state.facts.includes(factName)) {
    showToast(config.duplicateMessage);
    return;
  }

  config.beforeAdd?.(factName);
  config.state.facts.push(factName);
  config.state.facts.sort(compareFactNames);
  config.state.pendingFact = "";
  suggestionIndices[type] = 0;
  config.input.value = "";
  closeFactSuggestions(type);
  config.afterAdd();
}

function handleSuggestionKeydown(event, type) {
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
  if (event.key === "Escape") closeFactSuggestions(type);
}

function bindFactSelector(type, toggle, addButton) {
  const config = factSelectorConfig(type);

  config.input.addEventListener("input", () => {
    suggestionIndices[type] = 0;
    const exactName = config.input.value.trim();
    config.state.pendingFact = factByName.has(exactName) ? exactName : "";
    renderFactSuggestions(type, true);
  });
  config.input.addEventListener("focus", () => renderFactSuggestions(type, true));
  config.input.addEventListener("blur", () => {
    window.setTimeout(() => closeFactSuggestions(type), 120);
  });
  config.input.addEventListener("keydown", (event) => handleSuggestionKeydown(event, type));

  toggle.addEventListener("click", () => {
    config.input.focus();
    renderFactSuggestions(type, true);
  });
  addButton.addEventListener("click", () => addFactForContext(type));
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
    ? codePenal.filter((fact) => matchesInfoSearch(fact, query))
    : codePenal;

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

refs.resetCase.addEventListener("click", requestCurrentCaseReset);
bindFactSelector("doj", refs.comboToggle, refs.addFact);
bindFactSelector("prelim", refs.prelimComboToggle, refs.prelimAddFact);
bindFactSelector("judgement", refs.judgementComboToggle, refs.judgementAddFact);
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
  copyText(buildViceSapdText("prelim"), "Texte des vices copié");
});
refs.openPrelimHearing.addEventListener("click", openPrelimModal);

refs.copyJudgementSapd.addEventListener("click", () => {
  if (!commitJudgementTime(true)) {
    showToast("Temps du jugement incorrect.", "warning");
    return;
  }
  if (!validateCaseBeforeCopy("judgement")) return;
  copyText(buildJudgementSapdText(), "Jugement copié dans le presse-papier");
});
refs.judgementTimeTotal.addEventListener("input", () => {
  refs.judgementTimeHint.hidden = true;
});
refs.judgementTimeTotal.addEventListener("change", () => {
  commitJudgementTime(true);
  saveCaseToStorage();
});

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
