const LEGACY_STORAGE_KEY = "central-estudos.exams.v2";
const STORAGE_PREFIX = "central-estudos.board.v2";
const PREVIOUS_STORAGE_PREFIX = "central-estudos.board.v1";
const ACTIVE_BOARD_KEY = "central-estudos.active-board.v1";
const SEED_VERSION_PREFIX = "central-estudos.seed-version.v1";
const NOTES_STORAGE_PREFIX = "central-estudos.board-notes.v1";
const ESSAYS_STORAGE_PREFIX = "central-estudos.essay-records.v1";
const CANVAS_STORAGE_PREFIX = "central-estudos.canvas-state.v1";
const THEME_KEY = "central-estudos.theme.v1";
const MAP_MODE_KEY = "central-estudos.map-mode.v1";
const TARGET_PERCENT_KEY = "central-estudos.target-percent.v1";
const CANVAS_ONBOARDING_DISMISSED_KEY = "central-estudos.canvas-onboarding-dismissed.v1";
const SUPABASE_CONFIG = window.ZAN_SUPABASE_CONFIG || {};

const BOARD_SEED_VERSIONS = {
  unesp: "drive-site2-2026-07-05-unesp-2021-fisica-zero"
};

document.querySelector(".summary-grid")?.remove();

const colors = {
  green: "#1f8a70",
  blue: "#3772ff",
  coral: "#df6b57",
  gold: "#d09b2c",
  violet: "#7d5fff",
  teal: "#0f9aa7",
  pink: "#c95f8c",
  slate: "#63707a",
  olive: "#708238",
  red: "#b84a42"
};

const generalBoard = {
  id: "general",
  label: "GERAL",
  notebookOnly: true,
  totalMax: 0,
  essayMax: null,
  seed: [],
  placeholder: "",
  note: "canvas livre",
  sections: []
};

const boards = [
  {
    id: "enem",
    label: "ENEM",
    totalMax: 180,
    essayMax: 1000,
    seed: [],
    placeholder: "Ex: ENEM 2025 PPL",
    note: "prova inteira",
    sections: [
      { key: "humanas", label: "Humanas", max: 45, color: colors.green },
      { key: "linguagens", label: "Linguagens", max: 45, color: colors.blue },
      { key: "matematica", label: "Matemática", max: 45, color: colors.coral },
      { key: "natureza", label: "Natureza", max: 45, color: colors.gold }
    ]
  },
  {
    id: "unesp",
    label: "UNESP",
    totalMax: 90,
    essayMax: 28,
    seed: [],
    placeholder: "Ex: UNESP 2026 - 1a fase",
    note: "1a fase: 90 objetivas; distribuicao por disciplina para controle pessoal",
    sections: [
      { key: "portugues", label: "Português", max: 10, color: colors.blue },
      { key: "literatura", label: "Literatura", max: 8, color: colors.violet },
      { key: "artes", label: "Artes", max: 2, color: colors.pink },
      { key: "ingles", label: "Inglês", max: 10, color: colors.teal },
      { key: "historia", label: "Historia", max: 10, color: colors.green },
      { key: "geografia", label: "Geografia", max: 10, color: colors.olive },
      { key: "filosofia_sociologia", label: "Filo/Socio", max: 10, color: colors.slate },
      { key: "biologia", label: "Biologia", max: 8, color: colors.gold },
      { key: "quimica", label: "Química", max: 7, color: colors.red },
      { key: "fisica", label: "Física", max: 7, color: colors.coral },
      { key: "matematica", label: "Matemática", max: 8, color: colors.blue }
    ]
  },
  {
    id: "famema",
    label: "FAMEMA",
    totalMax: 40,
    essayMax: 11,
    seed: [],
    placeholder: "Ex: FAMEMA 2026 - objetiva",
    note: "Prova II objetiva; discursivas de quimica/biologia aparecem em contagem separada",
    sections: [
      { key: "portugues", label: "Português", max: 10, color: colors.blue },
      { key: "matematica", label: "Matemática", max: 10, color: colors.coral },
      { key: "geografia", label: "Geografia", max: 5, color: colors.olive },
      { key: "historia", label: "Historia", max: 5, color: colors.green },
      { key: "ingles", label: "Inglês", max: 5, color: colors.teal },
      { key: "fisica", label: "Física", max: 5, color: colors.gold },
      { key: "disc_quimica", label: "Disc. Química", max: 4, color: colors.red, countsTowardTotal: false },
      { key: "disc_biologia", label: "Disc. Biologia", max: 4, color: colors.gold, countsTowardTotal: false }
    ]
  },
  {
    id: "famerp",
    label: "FAMERP",
    totalMax: 80,
    essayMax: 20,
    seed: [],
    placeholder: "Ex: FAMERP 2026 - Conhecimentos Gerais",
    note: "Conhecimentos Gerais: 80 objetivas, 10 por disciplina",
    sections: [
      { key: "portugues", label: "Português", max: 10, color: colors.blue },
      { key: "ingles", label: "Inglês", max: 10, color: colors.teal },
      { key: "historia", label: "Historia", max: 10, color: colors.green },
      { key: "geografia", label: "Geografia", max: 10, color: colors.olive },
      { key: "biologia", label: "Biologia", max: 10, color: colors.gold },
      { key: "quimica", label: "Química", max: 10, color: colors.red },
      { key: "fisica", label: "Física", max: 10, color: colors.coral },
      { key: "matematica", label: "Matemática", max: 10, color: colors.blue }
    ]
  },
  {
    id: "unifesp",
    label: "UNIFESP",
    totalMax: 100,
    essayMax: 50,
    conversion: "unifesp-days",
    seed: [],
    placeholder: "Ex: UNIFESP 2026 - complementares",
    note: "Notas convertidas: Dia 1 e Dia 2 em escala de 0 a 100",
    sections: [
      { key: "portugues", label: "Português", max: 15, color: colors.blue, group: "dia1" },
      { key: "ingles", label: "Inglês", max: 10, color: colors.teal, group: "dia1" },
      { key: "biologia", label: "Biologia", max: 5, color: colors.gold, group: "dia2" },
      { key: "quimica", label: "Química", max: 5, color: colors.red, group: "dia2" },
      { key: "fisica", label: "Física", max: 5, color: colors.coral, group: "dia2" },
      { key: "matematica", label: "Matemática", max: 5, color: colors.blue, group: "dia2" }
    ]
  }
];

const notebookBoards = [generalBoard, ...boards];

const el = {
  status: document.querySelector("#data-status"),
  themeToggle: document.querySelector("#theme-toggle"),
  themeColorMeta: document.querySelector("#theme-color-meta"),
  views: [...document.querySelectorAll(".app-view")],
  viewButtons: [...document.querySelectorAll("[data-view-target]")],
  authPanel: document.querySelector("#auth-panel"),
  authClose: document.querySelector("#auth-close"),
  authCloseBackdrop: document.querySelector("#auth-close-backdrop"),
  activateSync: document.querySelector("#activate-sync"),
  authForm: document.querySelector("#auth-form"),
  authStatus: document.querySelector("#auth-status"),
  authEmail: document.querySelector("#auth-email"),
  authPassword: document.querySelector("#auth-password"),
  authSignup: document.querySelector("#auth-signup"),
  authSession: document.querySelector("#auth-session"),
  authUserEmail: document.querySelector("#auth-user-email"),
  authSignout: document.querySelector("#auth-signout"),
  syncNow: document.querySelector("#sync-now"),
  goalPercent: document.querySelector("#goal-percent"),
  goalTotal: document.querySelector("#goal-total"),
  goalMeterFill: document.querySelector("#goal-meter-fill"),
  goalForm: document.querySelector("#goal-form"),
  goalInput: document.querySelector("#goal-input"),
  goalNudge: document.querySelector("#goal-nudge"),
  chartGoalPill: document.querySelector("#chart-goal-pill"),
  targetList: document.querySelector("#target-list"),
  progressChart: document.querySelector("#progress-chart"),
  enemSubjectChartCard: document.querySelector("#enem-subject-chart-card"),
  enemSubjectChart: document.querySelector("#enem-subject-chart"),
  enemSubjectLegend: document.querySelector("#enem-subject-legend"),
  examCarousel: document.querySelector("#exam-carousel"),
  mapModeToggle: document.querySelector("#map-mode-toggle"),
  boardNotesCarousel: document.querySelector("#board-notes-carousel"),
  notebookCanvasWrap: document.querySelector(".notebook-canvas-wrap"),
  boardNotesLayer: document.querySelector("#canvas-items"),
  canvasConnections: document.querySelector("#canvas-connections"),
  canvasDrawing: document.querySelector("#canvas-drawing"),
  canvasOnboarding: document.querySelector("#canvas-onboarding"),
  canvasOnboardingDismiss: document.querySelector("#canvas-onboarding-dismiss"),
  penMode: document.querySelector("#pen-mode"),
  arrowMode: document.querySelector("#arrow-mode"),
  drawingColorOptions: document.querySelector("#drawing-color-options"),
  undoDrawing: document.querySelector("#undo-drawing"),
  clearDrawing: document.querySelector("#clear-drawing"),
  canvasToolStatus: document.querySelector("#canvas-tool-status"),
  essayForm: document.querySelector("#essay-form"),
  essayTheme: document.querySelector("#essay-theme"),
  essayScore: document.querySelector("#essay-score"),
  essayObservation: document.querySelector("#essay-observation"),
  essayScale: document.querySelector("#essay-scale"),
  essayList: document.querySelector("#essay-list"),
  table: document.querySelector("#exam-table"),
  tableHead: document.querySelector("thead tr"),
  form: document.querySelector("#exam-form"),
  scoreFields: document.querySelector("#score-fields"),
  formTitle: document.querySelector("#entry-title"),
  id: document.querySelector("#exam-id"),
  prova: document.querySelector("#exam-name"),
  obs: document.querySelector("#exam-notes"),
  formTotal: document.querySelector("#form-total"),
  saveExam: document.querySelector("#save-exam"),
  cancelEdit: document.querySelector("#cancel-edit"),
  boardTabs: [...document.querySelectorAll("[data-board]")]
};

const storedActiveBoard = boardById(localStorage.getItem(ACTIVE_BOARD_KEY));
let activeBoard = storedActiveBoard && (!storedActiveBoard.notebookOnly || location.hash === "#caderno") ? storedActiveBoard : boards[0];
let lastAcademicBoard = activeBoard.notebookOnly ? boards[0] : activeBoard;
let exams = loadExams(activeBoard);
let boardNotes = loadBoardNotes(activeBoard);
let essays = loadEssays(activeBoard);
let canvasState = loadCanvasState(activeBoard);
let activeTheme = localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
let mapMode = localStorage.getItem(MAP_MODE_KEY) === "errors" ? "errors" : "scores";
let targetPercent = loadTargetPercent();
let activeView = "home";
let supabaseClient = null;
let currentUser = null;
let chartFrame = 0;
let syncFeedbackTimer = 0;
let noteDrag = null;
let noteResize = null;
let customizingNoteId = null;
let noteSyncTimer = 0;
let canvasPan = null;
let lastCanvasTap = null;
let canvasMode = "move";
let drawingColor = "red";
let linkGesture = null;
let animatedNoteId = null;
let activeStroke = null;
let activeArrow = null;
const chartWidths = new WeakMap();

function boardById(id) {
  return notebookBoards.find((board) => board.id === id);
}

function storageKey(board, prefix = STORAGE_PREFIX) {
  return `${prefix}.${board.id}`;
}

function seedVersionKey(board) {
  return `${SEED_VERSION_PREFIX}.${board.id}`;
}

function notesStorageKey(board) {
  return `${NOTES_STORAGE_PREFIX}.${board.id}`;
}

function essaysStorageKey(board) {
  return `${ESSAYS_STORAGE_PREFIX}.${board.id}`;
}

function canvasStorageKey(board) {
  return `${CANVAS_STORAGE_PREFIX}.${board.id}`;
}

function targetTotal(board = activeBoard) {
  return targetPercent === null ? null : Math.ceil(board.totalMax * (targetPercent / 100));
}

function loadTargetPercent() {
  const parsed = nullableScore(localStorage.getItem(TARGET_PERCENT_KEY));
  return parsed !== null && parsed >= 1 && parsed <= 100 ? Math.round(parsed) : null;
}

function persistTargetPercent() {
  if (targetPercent === null) localStorage.removeItem(TARGET_PERCENT_KEY);
  else localStorage.setItem(TARGET_PERCENT_KEY, String(targetPercent));
}

function allSectionKeys() {
  return [...new Set(boards.flatMap((board) => board.sections.map((section) => section.key)))];
}

function nullableScore(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).trim().replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function withId(exam) {
  const scores = {};
  const sourceScores = exam.scores && typeof exam.scores === "object" ? exam.scores : {};

  allSectionKeys().forEach((key) => {
    const value = nullableScore(sourceScores[key] ?? exam[key]);
    if (value !== null) scores[key] = value;
  });

  return {
    id: exam.id || crypto.randomUUID(),
    prova: String(exam.prova || "").trim(),
    scores,
    total: nullableScore(exam.total),
    obs: String(exam.obs || "").trim()
  };
}

function getScore(exam, key) {
  return nullableScore(exam.scores?.[key] ?? exam[key]);
}

function cloneSeed(board) {
  return board.seed.map((exam) => withId({ ...exam, id: crypto.randomUUID() }));
}

function examSignature(exam) {
  return String(exam.prova || "").trim().toLowerCase();
}

function mergeSeedUpdate(examsList, board) {
  const seedVersion = BOARD_SEED_VERSIONS[board.id];
  if (!seedVersion || localStorage.getItem(seedVersionKey(board)) === seedVersion) {
    return examsList;
  }

  const existing = new Set(examsList.map(examSignature));
  const additions = [];
  const merged = examsList.map((exam) => {
    const seedExam = cloneSeed(board).find((item) => examSignature(item) === examSignature(exam));
    if (!seedExam) return exam;
    return { ...seedExam, id: exam.id };
  });

  cloneSeed(board).forEach((exam) => {
    if (!existing.has(examSignature(exam))) additions.push(exam);
  });

  const next = [...additions, ...merged];
  localStorage.setItem(seedVersionKey(board), seedVersion);
  localStorage.setItem(storageKey(board), JSON.stringify(next));
  return next;
}

function scoreFromInput(input) {
  const value = nullableScore(input.value);
  const max = Number(input.max || activeBoard.totalMax);
  return value === null ? null : Math.max(0, Math.min(max, value));
}

function computeTotal(exam, board = activeBoard) {
  if (board.conversion === "unifesp-days") {
    const converted = computeUnifespConverted(exam, board);
    if (!converted.complete) return exam.total ?? null;
    return Number(((converted.dia1.score + converted.dia2.score) / 2).toFixed(2));
  }

  const countedSections = board.sections.filter((section) => section.countsTowardTotal !== false);
  const scores = countedSections.map((section) => getScore(exam, section.key));
  if (scores.every((score) => score !== null)) {
    return scores.reduce((sum, score) => sum + score, 0);
  }
  return exam.total ?? null;
}

function computeUnifespConverted(exam, board = activeBoard) {
  const groups = [
    { key: "dia1", label: "Dia 1", sections: board.sections.filter((section) => section.group === "dia1") },
    { key: "dia2", label: "Dia 2", sections: board.sections.filter((section) => section.group === "dia2") }
  ];

  const result = {};
  groups.forEach((group) => {
    const rawMax = group.sections.reduce((sum, section) => sum + section.max, 0);
    const values = group.sections.map((section) => getScore(exam, section.key));
    const complete = values.every((value) => value !== null);
    const raw = values.reduce((sum, value) => sum + (value ?? 0), 0);
    result[group.key] = {
      label: group.label,
      raw,
      rawMax,
      complete,
      score: complete ? Number(((raw / rawMax) * 100).toFixed(2)) : null
    };
  });

  return {
    ...result,
    complete: groups.every((group) => result[group.key].complete)
  };
}

function secondarySections(board = activeBoard) {
  return board.sections.filter((section) => section.countsTowardTotal === false);
}

function computeSecondaryTotal(exam, board = activeBoard) {
  const sections = secondarySections(board);
  if (!sections.length) return null;
  const scores = sections.map((section) => getScore(exam, section.key));
  if (!scores.some((score) => score !== null)) return null;
  return scores.reduce((sum, score) => sum + (score ?? 0), 0);
}

function secondaryMax(board = activeBoard) {
  return secondarySections(board).reduce((sum, section) => sum + section.max, 0);
}

function normalizeExams(raw, board = activeBoard) {
  if (!Array.isArray(raw)) return [];
  return raw.map(withId).filter((exam) => exam.prova && computeTotal(exam, board) !== null);
}

function readStoredArray(key) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(stored) ? stored : null;
  } catch {
    return null;
  }
}

function loadExams(board) {
  const stored = readStoredArray(storageKey(board));
  if (stored) return mergeSeedUpdate(normalizeExams(stored, board), board);

  const previous = readStoredArray(storageKey(board, PREVIOUS_STORAGE_PREFIX));
  if (previous) {
    const migrated = normalizeExams(previous, board);
    const merged = mergeSeedUpdate(migrated, board);
    localStorage.setItem(storageKey(board), JSON.stringify(merged));
    return merged;
  }

  if (board.id === "enem") {
    const legacy = readStoredArray(LEGACY_STORAGE_KEY);
    if (legacy) {
      const migrated = normalizeExams(legacy, board);
      localStorage.setItem(storageKey(board), JSON.stringify(migrated));
      return migrated;
    }
  }

  return cloneSeed(board);
}

function loadBoardNotes(board) {
  const stored = readStoredArray(notesStorageKey(board));
  if (!stored) return [];
  return stored
    .filter((note) => note && typeof note.text === "string" && note.text.trim())
    .map((note, index) => ({
      id: note.id || crypto.randomUUID(),
      text: note.text.trim(),
      createdAt: note.createdAt || new Date().toISOString(),
      x: Number.isFinite(Number(note.x)) ? Number(note.x) : 32 + (index % 3) * 278,
      y: Number.isFinite(Number(note.y)) ? Number(note.y) : 32 + Math.floor(index / 3) * 190,
      color: ["neutral", "red", "blue", "green", "paper"].includes(note.color) ? note.color : "neutral",
      fontSize: Math.max(10, Math.min(48, Number(note.fontSize) || 16)),
      bold: Boolean(note.bold),
      underline: Boolean(note.underline),
      width: Math.max(200, Math.min(560, Number(note.width) || 246)),
      height: Math.max(140, Math.min(560, Number(note.height) || 168)),
      isChecklist: Boolean(note.isChecklist),
      checklistState: Array.isArray(note.checklistState) ? note.checklistState.map(Boolean) : []
    }));
}

function loadEssays(board) {
  const stored = readStoredArray(essaysStorageKey(board));
  if (!stored) return [];
  return stored
    .filter((essay) => essay && typeof essay.theme === "string" && nullableScore(essay.score) !== null)
    .map((essay) => ({
      id: essay.id || crypto.randomUUID(),
      theme: essay.theme.trim(),
      score: nullableScore(essay.score),
      observation: String(essay.observation || "").trim(),
      createdAt: essay.createdAt || new Date().toISOString()
    }));
}

function loadCanvasState(board) {
  try {
    const stored = JSON.parse(localStorage.getItem(canvasStorageKey(board)) || "null");
    return {
      links: Array.isArray(stored?.links) ? stored.links.filter((link) => link?.from && link?.to) : [],
      strokes: Array.isArray(stored?.strokes) ? stored.strokes.filter((stroke) => Array.isArray(stroke?.points) && stroke.points.length > 1) : [],
      arrows: Array.isArray(stored?.arrows) ? stored.arrows.filter((arrow) => arrow?.from && arrow?.to) : []
    };
  } catch {
    return { links: [], strokes: [], arrows: [] };
  }
}

function persistBoardNotes() {
  localStorage.setItem(notesStorageKey(activeBoard), JSON.stringify(boardNotes));
}

function persistEssays() {
  localStorage.setItem(essaysStorageKey(activeBoard), JSON.stringify(essays));
}

function persistCanvasState() {
  localStorage.setItem(canvasStorageKey(activeBoard), JSON.stringify(canvasState));
}

function persist() {
  localStorage.setItem(storageKey(activeBoard), JSON.stringify(exams));
  localStorage.setItem(ACTIVE_BOARD_KEY, activeBoard.id);
}

function switchView(view, { updateHash = true } = {}) {
  const next = ["home", "records", "notebook"].includes(view) ? view : "home";
  if (next !== "notebook" && activeBoard.notebookOnly) {
    activeBoard = lastAcademicBoard;
    exams = loadExams(activeBoard);
    boardNotes = loadBoardNotes(activeBoard);
    essays = loadEssays(activeBoard);
    canvasState = loadCanvasState(activeBoard);
    localStorage.setItem(ACTIVE_BOARD_KEY, activeBoard.id);
    resetForm();
    render();
  }
  activeView = next;
  document.body.dataset.view = next;
  el.views.forEach((section) => {
    section.hidden = section.dataset.view !== next;
  });
  el.viewButtons.forEach((button) => {
    const isActive = button.dataset.viewTarget === next;
    button.classList.toggle("is-active", isActive);
    if (button.closest(".header-nav")) button.setAttribute("aria-pressed", String(isActive));
  });
  if (updateHash) history.replaceState(null, "", `#${next === "home" ? "inicio" : next === "records" ? "registros" : "caderno"}`);
  window.scrollTo({ top: 0, behavior: "auto" });
  if (next === "records") requestAnimationFrame(() => drawCharts(true));
}

function openAuthModal() {
  if (!isSupabaseConfigured()) {
    setStatus("Sincronização indisponível neste momento.", true);
    return;
  }
  el.authPanel.hidden = false;
  document.body.classList.add("has-modal");
  requestAnimationFrame(() => el.authEmail?.focus());
}

function closeAuthModal() {
  el.authPanel.hidden = true;
  document.body.classList.remove("has-modal");
}

function setStatus(message, isError = false) {
  el.status.textContent = message;
  el.status.classList.toggle("is-error", isError);
}

function setSyncFeedback(state = "idle") {
  if (!el.syncNow) return;
  window.clearTimeout(syncFeedbackTimer);
  el.syncNow.classList.remove("is-success", "is-error");

  const feedback = {
    success: "Sincronizacao concluida",
    error: "Falha na sincronizacao"
  }[state];

  if (!feedback) {
    el.syncNow.setAttribute("aria-label", "Sincronizar dados");
    el.syncNow.title = "Sincronizar dados";
    return;
  }

  el.syncNow.classList.add(`is-${state}`);
  el.syncNow.setAttribute("aria-label", feedback);
  el.syncNow.title = feedback;
  syncFeedbackTimer = window.setTimeout(() => setSyncFeedback(), 2200);
}

function updateStatusForBoard() {
  setStatus(currentUser ? `${activeBoard.label}: sincronização ativa.` : "Dados salvos somente neste navegador.");
}

function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_CONFIG.url &&
    SUPABASE_CONFIG.anonKey &&
    window.supabase?.createClient
  );
}

function isOnlineMode() {
  return Boolean(supabaseClient && currentUser);
}

function updateAuthUi() {
  if (!isSupabaseConfigured()) {
    closeAuthModal();
    el.activateSync.hidden = true;
    return;
  }

  const signedIn = isOnlineMode();
  el.authForm.hidden = signedIn;
  el.authSession.hidden = !signedIn;
  el.activateSync.hidden = false;
  el.activateSync.textContent = signedIn ? "Sincronização ativa" : "Ativar sincronização";
  el.activateSync.classList.toggle("is-connected", signedIn);
  el.syncNow.setAttribute("aria-label", signedIn ? "Sincronizar dados" : "Ativar sincronização");
  el.syncNow.title = signedIn ? "Sincronizar dados" : "Ativar sincronização";
  el.authStatus.textContent = signedIn
    ? "Sessão ativa. Seus dados privados sincronizam entre os dispositivos."
    : "Entre para acessar os mesmos dados no celular e no computador.";
  if (el.authUserEmail) el.authUserEmail.textContent = currentUser?.email || "";
  updateStatusForBoard();
}

function setAuthBusy(isBusy) {
  [el.authSignup, el.authSignout, el.syncNow, el.activateSync, el.authForm?.querySelector("button[type='submit']")]
    .filter(Boolean)
    .forEach((button) => {
      button.disabled = isBusy;
    });
}

async function initSupabase() {
  if (!isSupabaseConfigured()) {
    updateAuthUi();
    return;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    setStatus("Nao foi possivel carregar a sessao online.", true);
  }
  currentUser = data?.session?.user || null;
  updateAuthUi();

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
    updateAuthUi();
    if (currentUser) {
      const [allSynced, settingsSynced] = await Promise.all([
        syncAllBoards({ silent: true }),
        syncUserSettings()
      ]);
      const activeSynced = await loadActiveBoardData();
      closeAuthModal();
      setStatus(
        allSynced && settingsSynced && activeSynced
          ? "Conta conectada. Dados sincronizados."
          : "Conta conectada, mas a sincronizacao falhou. Seus dados locais continuam neste navegador.",
        !(allSynced && settingsSynced && activeSynced)
      );
    } else {
      exams = loadExams(activeBoard);
      boardNotes = loadBoardNotes(activeBoard);
      essays = loadEssays(activeBoard);
      canvasState = loadCanvasState(activeBoard);
      render();
      updateStatusForBoard();
    }
  });

  if (currentUser) {
    await Promise.all([syncAllBoards({ silent: true }), syncUserSettings()]);
    await loadActiveBoardData();
  }
}

async function fetchRemoteSettings() {
  if (!isOnlineMode()) return null;
  const { data, error } = await supabaseClient
    .from("user_settings")
    .select("target_percent")
    .eq("user_id", currentUser.id)
    .limit(1);
  if (error) throw error;
  const value = nullableScore(data?.[0]?.target_percent);
  return value !== null && value >= 1 && value <= 100 ? Math.round(value) : null;
}

async function saveRemoteSettings() {
  if (!isOnlineMode()) return;
  const { error } = await supabaseClient.from("user_settings").upsert(
    { user_id: currentUser.id, target_percent: targetPercent },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

async function syncUserSettings() {
  if (!isOnlineMode()) return false;
  try {
    const remoteTarget = await fetchRemoteSettings();
    if (remoteTarget !== null) {
      targetPercent = remoteTarget;
      persistTargetPercent();
    } else if (targetPercent !== null) {
      await saveRemoteSettings();
    }
    renderTargets();
    drawCharts(true);
    return true;
  } catch {
    return false;
  }
}

function rowToExam(row) {
  return withId({
    id: row.id,
    prova: row.prova,
    scores: row.scores || {},
    total: row.total,
    obs: row.obs || ""
  });
}

function examToRow(exam, board, position) {
  return {
    id: exam.id,
    user_id: currentUser.id,
    board_id: board.id,
    prova: exam.prova,
    scores: exam.scores || {},
    total: computeTotal(exam, board),
    obs: exam.obs || "",
    position
  };
}

function rowToNote(row) {
  return {
    id: row.id,
    text: String(row.text || "").trim(),
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    x: Number(row.position_x ?? row.x ?? 32),
    y: Number(row.position_y ?? row.y ?? 32),
    color: row.card_color || "neutral",
    fontSize: Number(row.font_size || 16),
    bold: Boolean(row.is_bold),
    underline: Boolean(row.is_underlined),
    width: Number(row.card_width || 246),
    height: Number(row.card_height || 168),
    isChecklist: Boolean(row.is_checklist),
    checklistState: Array.isArray(row.checklist_state) ? row.checklist_state.map(Boolean) : []
  };
}

function noteToRow(note, board) {
  return {
    id: note.id,
    user_id: currentUser.id,
    board_id: board.id,
    text: note.text,
    created_at: note.createdAt || new Date().toISOString(),
    position_x: Math.round(note.x || 32),
    position_y: Math.round(note.y || 32),
    card_color: note.color || "neutral",
    font_size: Math.max(10, Math.min(48, Number(note.fontSize) || 16)),
    is_bold: Boolean(note.bold),
    is_underlined: Boolean(note.underline),
    card_width: Math.round(note.width || 246),
    card_height: Math.round(note.height || 168),
    is_checklist: Boolean(note.isChecklist),
    checklist_state: Array.isArray(note.checklistState) ? note.checklistState.map(Boolean) : []
  };
}

function rowToEssay(row) {
  return {
    id: row.id,
    theme: String(row.theme || "").trim(),
    score: nullableScore(row.score),
    observation: String(row.observation || "").trim(),
    createdAt: row.created_at || new Date().toISOString()
  };
}

function essayToRow(essay, board) {
  return {
    id: essay.id,
    user_id: currentUser.id,
    board_id: board.id,
    theme: essay.theme,
    score: essay.score,
    observation: essay.observation || "",
    created_at: essay.createdAt || new Date().toISOString()
  };
}

function mergeExamsForSync(remoteExams, localExams) {
  const bySignature = new Set(remoteExams.map(examSignature));
  const additions = localExams.filter((exam) => !bySignature.has(examSignature(exam)));
  return [...remoteExams, ...additions];
}

function mergeNotesForSync(remoteNotes, localNotes) {
  const byId = new Set(remoteNotes.map((note) => note.id));
  const byText = new Set(remoteNotes.map((note) => `${note.text}::${note.createdAt}`));
  const additions = localNotes.filter((note) => !byId.has(note.id) && !byText.has(`${note.text}::${note.createdAt}`));
  return [...remoteNotes, ...additions];
}

function mergeEssaysForSync(remoteEssays, localEssays) {
  const byId = new Set(remoteEssays.map((essay) => essay.id));
  const additions = localEssays.filter((essay) => !byId.has(essay.id));
  return [...remoteEssays, ...additions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function fetchRemoteBoard(board) {
  const [examResult, noteResult, essayResult, canvasResult] = await Promise.all([
    supabaseClient
      .from("exam_records")
      .select("id, board_id, prova, scores, total, obs, position, created_at, updated_at")
      .eq("board_id", board.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabaseClient
      .from("board_note_records")
      .select("id, board_id, text, position_x, position_y, card_color, font_size, is_bold, is_underlined, card_width, card_height, is_checklist, checklist_state, created_at, updated_at")
      .eq("board_id", board.id)
      .order("created_at", { ascending: false }),
    supabaseClient
      .from("essay_records")
      .select("id, board_id, theme, score, observation, created_at, updated_at")
      .eq("board_id", board.id)
      .order("created_at", { ascending: false }),
    supabaseClient
      .from("board_canvas_records")
      .select("board_id, canvas_state, updated_at")
      .eq("board_id", board.id)
      .limit(1)
  ]);

  if (examResult.error) throw examResult.error;
  if (noteResult.error) throw noteResult.error;
  if (essayResult.error) throw essayResult.error;
  if (canvasResult.error) throw canvasResult.error;

  const remoteNotes = (noteResult.data || []).map(rowToNote).filter((note) => note.text);
  if (remoteNotes.length > 1 && remoteNotes.every((note) => note.x === 32 && note.y === 32)) {
    remoteNotes.forEach((note, index) => {
      note.x = 32 + (index % 3) * 278;
      note.y = 32 + Math.floor(index / 3) * 190;
    });
  }

  return {
    exams: normalizeExams((examResult.data || []).map(rowToExam), board),
    notes: remoteNotes,
    essays: (essayResult.data || []).map(rowToEssay).filter((essay) => essay.theme && essay.score !== null),
    canvasState: canvasResult.data?.[0]?.canvas_state || { links: [], strokes: [], arrows: [] }
  };
}

async function saveRemoteBoard(board, nextExams, nextNotes, nextEssays = essays, nextCanvasState = canvasState) {
  const examRows = nextExams.map((exam, index) => examToRow(exam, board, index));
  const noteRows = nextNotes.filter((note) => String(note.text || "").trim()).map((note) => noteToRow(note, board));
  const essayRows = nextEssays.map((essay) => essayToRow(essay, board));

  if (examRows.length) {
    const { error } = await supabaseClient.from("exam_records").upsert(examRows, { onConflict: "id" });
    if (error) throw error;
  }

  if (noteRows.length) {
    const { error } = await supabaseClient.from("board_note_records").upsert(noteRows, { onConflict: "id" });
    if (error) throw error;
  }

  if (essayRows.length) {
    const { error } = await supabaseClient.from("essay_records").upsert(essayRows, { onConflict: "id" });
    if (error) throw error;
  }

  const { error: canvasError } = await supabaseClient.from("board_canvas_records").upsert(
    { user_id: currentUser.id, board_id: board.id, canvas_state: nextCanvasState || { links: [], strokes: [], arrows: [] } },
    { onConflict: "user_id,board_id" }
  );
  if (canvasError) throw canvasError;
}

async function deleteRemoteExam(id) {
  if (!isOnlineMode()) return;
  const { error } = await supabaseClient.from("exam_records").delete().eq("id", id);
  if (error) throw error;
}

async function deleteRemoteNote(id) {
  if (!isOnlineMode()) return;
  const { error } = await supabaseClient.from("board_note_records").delete().eq("id", id);
  if (error) throw error;
}

async function deleteRemoteEssay(id) {
  if (!isOnlineMode()) return;
  const { error } = await supabaseClient.from("essay_records").delete().eq("id", id);
  if (error) throw error;
}

function saveLocalBoard(board, nextExams, nextNotes, nextEssays, nextCanvasState) {
  localStorage.setItem(storageKey(board), JSON.stringify(nextExams));
  localStorage.setItem(notesStorageKey(board), JSON.stringify(nextNotes));
  localStorage.setItem(essaysStorageKey(board), JSON.stringify(nextEssays));
  localStorage.setItem(canvasStorageKey(board), JSON.stringify(nextCanvasState));
}

async function syncBoardData(board, { silent = false } = {}) {
  if (!isOnlineMode()) return { ok: false, error: new Error("Sessao online indisponivel") };
  try {
    const localExams = normalizeExams(loadExams(board), board);
    const localNotes = loadBoardNotes(board);
    const localEssays = loadEssays(board);
    const localCanvasState = loadCanvasState(board);
    const remote = await fetchRemoteBoard(board);
    const mergedExams = mergeExamsForSync(remote.exams, localExams);
    const mergedNotes = mergeNotesForSync(remote.notes, localNotes);
    const mergedEssays = mergeEssaysForSync(remote.essays, localEssays);
    const mergedCanvasState = remote.canvasState?.strokes?.length || remote.canvasState?.links?.length || remote.canvasState?.arrows?.length
      ? remote.canvasState
      : localCanvasState;
    await saveRemoteBoard(board, mergedExams, mergedNotes, mergedEssays, mergedCanvasState);
    saveLocalBoard(board, mergedExams, mergedNotes, mergedEssays, mergedCanvasState);

    if (board.id === activeBoard.id) {
      exams = mergedExams;
      boardNotes = mergedNotes;
      essays = mergedEssays;
      canvasState = mergedCanvasState;
      render();
    }

    if (!silent) setStatus(`${board.label}: dados sincronizados com sua conta`);
    return { ok: true };
  } catch (error) {
    if (!silent) {
      setStatus(
        `Nao foi possivel sincronizar ${board.label}. Seus dados continuam salvos neste navegador.`,
        true
      );
    }
    return { ok: false, error };
  }
}

async function syncAllBoards({ silent = false } = {}) {
  if (!isOnlineMode()) return false;
  const failedBoards = [];
  for (const board of notebookBoards) {
    const result = await syncBoardData(board, { silent: true });
    if (!result.ok) failedBoards.push(board.label);
  }
  if (failedBoards.length) {
    if (!silent) {
      setStatus(
        `Nao foi possivel sincronizar ${failedBoards.join(", ")}. Seus dados continuam salvos neste navegador.`,
        true
      );
    }
    return false;
  }
  if (!silent) setStatus("Todos os vestibulares foram sincronizados.");
  return true;
}

async function loadActiveBoardData() {
  if (!isOnlineMode()) {
    exams = loadExams(activeBoard);
    boardNotes = loadBoardNotes(activeBoard);
    essays = loadEssays(activeBoard);
    canvasState = loadCanvasState(activeBoard);
    render();
    return true;
  }
  const result = await syncBoardData(activeBoard, { silent: true });
  return result.ok;
  updateStatusForBoard();
}

function cssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function applyTheme(theme) {
  activeTheme = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = activeTheme;
  localStorage.setItem(THEME_KEY, activeTheme);
  if (el.themeToggle) {
    const isDark = activeTheme === "dark";
    const label = isDark ? "Ativar modo claro" : "Ativar modo escuro";
    el.themeToggle.setAttribute("aria-label", label);
    el.themeToggle.title = label;
    el.themeToggle.setAttribute("aria-pressed", String(isDark));
    el.themeToggle.querySelector('[data-theme-icon="moon"]')?.toggleAttribute("hidden", !isDark);
    el.themeToggle.querySelector('[data-theme-icon="sun"]')?.toggleAttribute("hidden", isDark);
  }
  if (el.themeColorMeta) {
    el.themeColorMeta.setAttribute("content", activeTheme === "dark" ? "#0b0b0a" : "#f2efe8");
  }
  drawCharts(true);
  renderCanvasOverlays();
}

function toggleTheme() {
  applyTheme(activeTheme === "dark" ? "light" : "dark");
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

function formatMapValue(value, section) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return mapMode === "errors" ? formatNumber(value) : `${formatNumber(value)}/${section.max}`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function statusFor(total) {
  const target = targetTotal();
  if (target === null) return { label: "sem meta", className: "badge--unset" };
  const nearWindow = Math.max(2, Math.ceil(activeBoard.totalMax * 0.05));
  if (total >= target) return { label: "meta batida", className: "badge--hit" };
  if (total >= target - nearWindow) return { label: "perto", className: "badge--near" };
  return { label: "subindo", className: "badge--low" };
}

function drawProgressChart(canvas) {
  const ctx = prepareCanvas(canvas);
  const data = exams.map((exam) => ({ ...exam, total: computeTotal(exam) })).filter((exam) => exam.total !== null);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = { top: 22, right: 22, bottom: 28, left: 46 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const max = activeBoard.totalMax;
  const target = targetTotal();
  const referenceValues = data.map((exam) => exam.total);
  if (target !== null) referenceValues.push(target);
  const min = referenceValues.length ? Math.max(0, Math.min(...referenceValues) - Math.ceil(max * 0.07)) : 0;

  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, padding, width, height, [...new Set([min, target, max].filter((value) => value !== null))], min, max);

  if (!data.length) {
    drawEmptyChart(ctx, width, height, `Sem provas de ${activeBoard.label}`);
    return;
  }

  const points = data.map((exam, index) => ({
    exam,
    x: padding.left + (plotW * index) / Math.max(data.length - 1, 1),
    y: padding.top + plotH - ((exam.total - min) / (max - min)) * plotH
  }));

  if (target !== null) {
    const targetY = padding.top + plotH - ((target - min) / (max - min)) * plotH;
    ctx.strokeStyle = cssVar("--green") || "#1f8a70";
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(width - padding.right, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#3772ff";
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  points.forEach((point) => {
    ctx.fillStyle = target !== null && point.exam.total >= target
      ? (cssVar("--green") || "#1f8a70")
      : (cssVar("--coral") || "#df6b57");
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = cssVar("--ink") || "#172026";
    ctx.font = "700 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(point.exam.total, point.x, point.y - 11);
  });

}

function drawEnemSubjectChart(canvas) {
  const ctx = prepareCanvas(canvas);
  const data = exams.filter((exam) => computeTotal(exam) !== null);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = { top: 28, right: 24, bottom: 34, left: 42 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const target = targetPercent === null ? null : Math.ceil(45 * (targetPercent / 100));
  const scoreValues = data.flatMap((exam) => activeBoard.sections.map((section) => getScore(exam, section.key))).filter((value) => value !== null);
  if (target !== null) scoreValues.push(target);
  const lowest = scoreValues.length ? Math.min(...scoreValues) : 0;
  const min = lowest <= 7 ? 0 : Math.max(0, Math.floor((lowest - 4) / 5) * 5);
  const range = Math.max(1, 45 - min);

  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, padding, width, height, [...new Set([min, target, 45].filter((value) => value !== null))], min, 45);

  if (!data.length) {
    drawEmptyChart(ctx, width, height, "Sem provas do ENEM");
    return;
  }

  if (target !== null) {
    const targetY = padding.top + plotH - ((target - min) / range) * plotH;
    ctx.save();
    ctx.strokeStyle = cssVar("--green") || "#48d29b";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(width - padding.right, targetY);
    ctx.stroke();
    ctx.restore();
  }

  activeBoard.sections.forEach((section) => {
    const points = data.map((exam, index) => ({
      value: getScore(exam, section.key) ?? 0,
      x: padding.left + (plotW * index) / Math.max(data.length - 1, 1)
    }));
    ctx.strokeStyle = section.color;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    points.forEach((point, index) => {
      const y = padding.top + plotH - ((point.value - min) / range) * plotH;
      if (index === 0) ctx.moveTo(point.x, y);
      else ctx.lineTo(point.x, y);
    });
    ctx.stroke();

    points.forEach((point) => {
      const y = padding.top + plotH - ((point.value - min) / range) * plotH;
      ctx.fillStyle = section.color;
      ctx.beginPath();
      ctx.arc(point.x, y, 3.6, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

function renderEnemSubjectChart() {
  const isEnem = activeBoard.id === "enem";
  el.enemSubjectChartCard.hidden = !isEnem;
  if (!isEnem) return;
  el.enemSubjectLegend.innerHTML = activeBoard.sections
    .map((section) => `<span><i style="--legend-color:${section.color}"></i>${escapeHtml(section.label)}</span>`)
    .join("");
}

function prepareCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(canvas.getBoundingClientRect().width));
  if (!canvas.dataset.displayHeight) {
    canvas.dataset.displayHeight = canvas.getAttribute("height") || "260";
  }
  const height = Number(canvas.dataset.displayHeight);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  return ctx;
}

function drawGrid(ctx, padding, width, height, ticks, min, max) {
  const plotH = height - padding.top - padding.bottom;
  ctx.strokeStyle = cssVar("--line") || "#dce2e6";
  ctx.fillStyle = cssVar("--muted") || "#63707a";
  ctx.lineWidth = 1;
  ctx.font = "700 10px system-ui";
  ctx.textAlign = "right";

  ticks.forEach((tick) => {
    const y = padding.top + plotH - ((tick - min) / (max - min || 1)) * plotH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(tick, padding.left - 8, y + 3);
  });
}

function drawEmptyChart(ctx, width, height, label) {
  ctx.fillStyle = cssVar("--muted") || "#63707a";
  ctx.font = "800 14px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(label, width / 2, height / 2);
}

function renderTable() {
  const rows = exams
    .map((exam) => ({ ...exam, total: computeTotal(exam) }))
    .filter((exam) => exam.total !== null);
  const columns = activeBoard.sections;

  el.tableHead.innerHTML = `
    <th>Prova</th>
    ${columns.map((section) => `<th>${escapeHtml(section.label)}</th>`).join("")}
    <th>Total</th>
    <th>Status</th>
    <th>Ações</th>
  `;

  if (!rows.length) {
    el.table.innerHTML = `
      <tr>
        <td class="empty-table" colspan="${columns.length + 4}">Sem provas cadastradas em ${activeBoard.label}</td>
      </tr>
    `;
    return;
  }

  el.table.innerHTML = rows
    .map((exam) => {
      const status = statusFor(exam.total);
      return `
        <tr>
          <td>${escapeHtml(exam.prova)}</td>
          ${columns.map((section) => `<td>${formatNumber(getScore(exam, section.key))}</td>`).join("")}
          <td>${formatTotalCell(exam)}</td>
          <td><span class="badge ${status.className}">${status.label}</span></td>
          <td>
            <div class="row-actions">
              <button class="button button--secondary table-action" type="button" data-action="edit" data-id="${exam.id}">Editar</button>
              <button class="button button--secondary button--danger table-action" type="button" data-action="delete" data-id="${exam.id}">Excluir</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function formatTotalCell(exam) {
  if (activeBoard.conversion === "unifesp-days") {
    const converted = computeUnifespConverted(exam);
    return `Media ${exam.total}/100 | D1 ${formatConvertedDay(converted.dia1)} | D2 ${formatConvertedDay(converted.dia2)}`;
  }

  const secondary = computeSecondaryTotal(exam);
  const max = secondaryMax();
  if (secondary === null || !max) return `${exam.total}/${activeBoard.totalMax}`;
  return `${exam.total}/${activeBoard.totalMax} + ${secondary}/${max}`;
}

function formatConvertedDay(day) {
  if (!day.complete) return "--/100";
  return `${day.score}/100 (${day.raw}/${day.rawMax})`;
}

function renderExamCarousel() {
  const visibleExams = exams.map((exam) => ({ ...exam, total: computeTotal(exam) })).filter((exam) => exam.total !== null);

  if (!visibleExams.length) {
    el.examCarousel.innerHTML = `<div class="exam-empty">Sem provas cadastradas em ${activeBoard.label}</div>`;
    return;
  }

  el.examCarousel.innerHTML = visibleExams
    .map((exam) => {
      const status = statusFor(exam.total);
      const sectionRows = activeBoard.sections.map((section) => {
        const score = getScore(exam, section.key);
        const value = score === null ? null : mapMode === "errors" ? Math.max(0, section.max - score) : score;
        return { section, value };
      });
      const maxError = mapMode === "errors"
        ? Math.max(0, ...sectionRows.map((row) => row.value ?? 0))
        : null;
      const rows = activeBoard.sections
        .map((section) => {
          const row = sectionRows.find((item) => item.section.key === section.key);
          const value = row?.value ?? null;
          const width = mapMode === "errors"
            ? value && maxError ? Math.min(100, (value / maxError) * 100) : 0
            : value === null ? 0 : Math.max(2, Math.min(100, (value / section.max) * 100));
          return `
            <div class="area-row">
              <span>${escapeHtml(section.label)}</span>
              <div class="area-track" aria-hidden="true">
                <div class="area-fill" style="width: ${width}%; --area-color: ${section.color};"></div>
              </div>
              <strong>${formatMapValue(value, section)}</strong>
            </div>
          `;
        })
        .join("");

      return `
        <article class="exam-score-card">
          <div class="exam-score-card__head">
            <div>
              <h3>${escapeHtml(exam.prova)}</h3>
              <span class="badge ${status.className}">${status.label}</span>
            </div>
            <div class="exam-score-card__total">
              <span>Total</span>
              <strong>${exam.total}</strong>
              <span>/${activeBoard.totalMax}</span>
              ${renderSecondaryTotal(exam)}
            </div>
          </div>
          <div class="exam-score-card__note">
            <span>Observação da prova</span>
            <p>${exam.obs ? escapeHtml(exam.obs) : "Nenhuma observação registrada."}</p>
          </div>
          <div class="area-bars">${rows}</div>
        </article>
      `;
    })
    .join("");

  requestAnimationFrame(() => {
    el.examCarousel.scrollLeft = el.examCarousel.scrollWidth;
  });
}

function updateMapModeToggle() {
  if (!el.mapModeToggle) return;
  const isScoreMode = mapMode === "scores";
  el.mapModeToggle.classList.toggle("is-active", isScoreMode);
  el.mapModeToggle.setAttribute("aria-pressed", String(isScoreMode));
  el.mapModeToggle.setAttribute("aria-label", isScoreMode ? "Mostrar erros por disciplina" : "Mostrar acertos por disciplina");
  el.mapModeToggle.setAttribute(
    "title",
    isScoreMode ? "Mostrando acertos por disciplina" : "Mostrando erros por disciplina"
  );
}

function toggleMapMode() {
  mapMode = mapMode === "scores" ? "errors" : "scores";
  localStorage.setItem(MAP_MODE_KEY, mapMode);
  updateMapModeToggle();
  renderExamCarousel();
}

function renderEssays() {
  if (!el.essayList) return;
  el.essayScale.textContent = `ESCALA 0–${activeBoard.essayMax}`;
  el.essayScore.placeholder = `0–${activeBoard.essayMax}`;
  el.essayScore.setAttribute("aria-label", `Nota de zero a ${activeBoard.essayMax}`);

  if (!essays.length) {
    el.essayList.innerHTML = `
      <div class="essay-empty">
        <span>SEM REGISTROS</span>
        <p>Adicione a primeira redação de ${escapeHtml(activeBoard.label)} para acompanhar tema, nota e orientação.</p>
      </div>
    `;
    return;
  }

  el.essayList.innerHTML = essays
    .map((essay, index) => `
      <article class="essay-record">
        <div class="essay-record__index">${String(essays.length - index).padStart(2, "0")}</div>
        <div class="essay-record__content">
          <span>${escapeHtml(formatDate(essay.createdAt))} // ${escapeHtml(activeBoard.label)}</span>
          <h3>${escapeHtml(essay.theme)}</h3>
          <p>${essay.observation ? escapeHtml(essay.observation) : "Sem observação."}</p>
        </div>
        <div class="essay-record__score"><strong>${formatNumber(essay.score)}</strong><span>/${activeBoard.essayMax}</span></div>
        <button type="button" class="essay-record__delete" data-essay-action="delete" data-id="${essay.id}" aria-label="Excluir redação ${escapeHtml(essay.theme)}">EXCLUIR</button>
      </article>
    `)
    .join("");

}

async function saveEssay(event) {
  event.preventDefault();
  const theme = el.essayTheme.value.trim();
  const score = nullableScore(el.essayScore.value);
  const observation = el.essayObservation.value.trim();
  if (!theme || score === null || score < 0 || score > activeBoard.essayMax) {
    setStatus(`Preencha o tema e uma nota entre 0 e ${activeBoard.essayMax}.`, true);
    return;
  }

  essays = [{ id: crypto.randomUUID(), theme, score, observation, createdAt: new Date().toISOString() }, ...essays];
  persistEssays();
  el.essayForm.reset();
  renderEssays();
  setStatus(`${activeBoard.label}: redação salva neste navegador.`);

  if (isOnlineMode()) {
    try {
      await saveRemoteBoard(activeBoard, exams, boardNotes, essays, canvasState);
      setStatus(`${activeBoard.label}: redação salva e sincronizada.`);
    } catch (error) {
      setStatus(`Redação salva localmente. Falha no sync: ${error.message || "verifique o Supabase"}`, true);
    }
  }
}

async function handleEssayClick(event) {
  const button = event.target.closest("button[data-essay-action='delete']");
  if (!button) return;
  const id = button.dataset.id;
  essays = essays.filter((essay) => essay.id !== id);
  persistEssays();
  renderEssays();
  if (isOnlineMode()) {
    try {
      await deleteRemoteEssay(id);
    } catch {
      setStatus("Redação excluída localmente; a sincronização falhou.", true);
      return;
    }
  }
  setStatus(`${activeBoard.label}: redação excluída.`);
}

function renderBoardNotes() {
  if (!el.boardNotesLayer) return;
  const cardToAnimate = animatedNoteId;
  animatedNoteId = null;

  el.boardNotesLayer.innerHTML = boardNotes
    .map((note) => `
      <article class="canvas-note canvas-note--${note.color || "neutral"}${customizingNoteId === note.id ? " is-customizing" : ""}${cardToAnimate === note.id ? " is-new" : ""}" data-note-id="${note.id}" style="--note-x:${Math.max(16, note.x || 32)}px;--note-y:${Math.max(16, note.y || 32)}px;--note-width:${Math.max(200, Math.min(560, note.width || 246))}px;--note-height:${Math.max(140, Math.min(560, note.height || 168))}px;--note-font-size:${Math.max(10, Math.min(48, note.fontSize || 16))}px;">
        <div class="canvas-note__bar" data-note-drag="${note.id}">
          <span>${escapeHtml(activeBoard.label)} // ${escapeHtml(formatDate(note.createdAt))}</span>
          <div class="canvas-note__actions">
            <button type="button" data-note-action="customize" data-id="${note.id}" aria-label="Editar e personalizar card" aria-pressed="${customizingNoteId === note.id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.5-1 11-11-3.5-3.5-11 11L4 20Zm10.5-14 3.5 3.5"></path></svg></button>
            <button type="button" data-note-action="delete" data-id="${note.id}" aria-label="Excluir nota">×</button>
          </div>
        </div>
        ${customizingNoteId === note.id ? renderNoteInspector(note) : ""}
        ${renderNoteContent(note)}
        <button class="canvas-note__connector" type="button" data-note-link-handle="${note.id}" aria-label="Arraste para conectar este card a outro"><span aria-hidden="true"></span></button>
        <button class="canvas-note__resize" type="button" data-note-resize="${note.id}" aria-label="Redimensionar card"></button>
      </article>
    `)
    .join("");
  renderCanvasOverlays();
  el.boardNotesLayer.querySelectorAll(".canvas-note.is-new").forEach((card) => {
    setTimeout(() => card.classList.remove("is-new"), 420);
  });
}

function checklistItems(note) {
  const items = String(note.text || "").split(/\r?\n/);
  return items.length ? items : [""];
}

function renderNoteInspector(note) {
  const colors = ["neutral", "red", "blue", "green", "paper"];
  return `
    <div class="canvas-note__inspector" data-note-inspector="${note.id}">
      <div class="card-color-options" aria-label="Cor do card">
        ${colors.map((color) => `<button type="button" class="card-color card-color--${color}${note.color === color ? " is-active" : ""}" data-note-control="color" data-value="${color}" data-id="${note.id}" aria-label="Cor ${color}" aria-pressed="${note.color === color}"></button>`).join("")}
      </div>
      <label class="card-font-control"><span>Tamanho</span><input type="range" min="10" max="48" step="1" value="${note.fontSize || 16}" data-note-control="font" data-id="${note.id}"><output>${Math.round(note.fontSize || 16)} px</output></label>
      <div class="card-format-options">
        <button type="button" class="${note.bold ? "is-active" : ""}" data-note-control="bold" data-id="${note.id}" aria-pressed="${note.bold}"><strong>B</strong><span>Negrito</span></button>
        <button type="button" class="${note.underline ? "is-active" : ""}" data-note-control="underline" data-id="${note.id}" aria-pressed="${note.underline}"><u>U</u><span>Sublinhado</span></button>
        <button type="button" class="${note.isChecklist ? "is-active" : ""}" data-note-control="checklist" data-id="${note.id}" aria-pressed="${note.isChecklist}"><strong>✓</strong><span>Checklist</span></button>
      </div>
    </div>
  `;
}

function renderNoteContent(note) {
  const contentClass = `${note.bold ? "is-bold" : ""} ${note.underline ? "is-underlined" : ""}`;
  if (!note.isChecklist) {
    return `<div class="canvas-note__editor ${contentClass}" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Editar conteúdo do card" spellcheck="true" data-note-editor="${note.id}" data-placeholder="Comece a escrever...">${escapeHtml(note.text)}</div>`;
  }
  const items = checklistItems(note);
  note.checklistState = items.map((_, index) => Boolean(note.checklistState?.[index]));
  return `
    <div class="canvas-note__checklist ${contentClass}">
      ${items.map((item, index) => `
        <div class="canvas-check-item${note.checklistState[index] ? " is-checked" : ""}">
          <input type="checkbox" data-note-action="check" data-id="${note.id}" data-check-index="${index}" ${note.checklistState[index] ? "checked" : ""}>
          <span contenteditable="true" role="textbox" spellcheck="true" data-note-check-editor="${note.id}" data-check-index="${index}" data-placeholder="Item da lista">${escapeHtml(item)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function noteCenter(note) {
  const element = el.boardNotesLayer?.querySelector(`[data-note-id="${CSS.escape(note.id)}"]`);
  return {
    x: (note.x || 32) + (element?.offsetWidth || 246) / 2,
    y: (note.y || 32) + (element?.offsetHeight || 152) / 2
  };
}

function linkCurvePath(from, to) {
  const direction = to.x >= from.x ? 1 : -1;
  const curve = Math.max(58, Math.abs(to.x - from.x) * 0.42, Math.abs(to.y - from.y) * 0.18);
  return `M ${from.x} ${from.y} C ${from.x + curve * direction} ${from.y}, ${to.x - curve * direction} ${to.y}, ${to.x} ${to.y}`;
}

function renderCanvasOverlays() {
  if (!el.canvasConnections || !el.canvasDrawing) return;
  const width = Math.max(el.boardNotesCarousel.scrollWidth, el.boardNotesCarousel.clientWidth, 1800);
  const height = Math.max(el.boardNotesCarousel.scrollHeight, el.boardNotesCarousel.clientHeight, 1400);
  [el.canvasConnections, el.canvasDrawing].forEach((svg) => {
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
  });

  const noteIds = new Set(boardNotes.map((note) => note.id));
  canvasState.links = canvasState.links.filter((link) => noteIds.has(link.from) && noteIds.has(link.to));
  el.canvasConnections.innerHTML = canvasState.links
    .map((link) => {
      const from = noteCenter(boardNotes.find((note) => note.id === link.from));
      const to = noteCenter(boardNotes.find((note) => note.id === link.to));
      const path = linkCurvePath(from, to);
      return `<g class="canvas-connection"><path class="canvas-connection__shadow" d="${path}"></path><path class="canvas-connection__line" d="${path}"></path><circle cx="${from.x}" cy="${from.y}" r="4"></circle><circle cx="${to.x}" cy="${to.y}" r="4"></circle></g>`;
    })
    .join("");

  if (!Array.isArray(canvasState.arrows)) canvasState.arrows = [];
  const arrowMarkers = ["neutral", "red", "blue", "green", "paper"]
    .map((color) => `<marker id="arrowhead-${color}" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L9,4.5 L0,9 z" style="fill:${drawingColorValue(color)};stroke:none"></path></marker>`)
    .join("");
  const arrowPaths = canvasState.arrows
    .map((arrow) => {
      const colorKey = ["neutral", "red", "blue", "green", "paper"].includes(arrow.color) ? arrow.color : "red";
      return `<path class="canvas-arrow" d="M ${arrow.from.x} ${arrow.from.y} L ${arrow.to.x} ${arrow.to.y}" stroke="${drawingColorValue(colorKey)}" stroke-width="2.4" marker-end="url(#arrowhead-${colorKey})"></path>`;
    })
    .join("");
  const strokePaths = canvasState.strokes
    .map((stroke) => {
      const points = stroke.points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
      return `<path d="${points}" stroke="${drawingColorValue(stroke.color || "red")}" stroke-width="${Math.max(1, Math.min(8, stroke.width || 2.4))}"></path>`;
    })
    .join("");
  el.canvasDrawing.innerHTML = `<defs>${arrowMarkers}</defs>${arrowPaths}${strokePaths}`;
  el.canvasDrawing.classList.toggle("is-active", canvasMode === "pen" || canvasMode === "arrow");
}

function drawingColorValue(color) {
  if (String(color).startsWith("#")) return escapeHtml(color);
  return {
    neutral: cssVar("--muted-strong") || "#c4c2ba",
    red: "#e44232",
    blue: "#6b8cff",
    green: "#48d29b",
    paper: "#d7cbbb"
  }[color] || "#e44232";
}

function updateDrawingColorControls() {
  el.drawingColorOptions.querySelectorAll("[data-drawing-color]").forEach((button) => {
    const active = button.dataset.drawingColor === drawingColor;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function applyCanvasOnboardingPreference() {
  if (!el.canvasOnboarding) return;
  try {
    el.canvasOnboarding.hidden = localStorage.getItem(CANVAS_ONBOARDING_DISMISSED_KEY) === "true";
  } catch {
    el.canvasOnboarding.hidden = false;
  }
}

function dismissCanvasOnboarding(event) {
  event?.preventDefault();
  event?.stopPropagation();
  if (el.canvasOnboarding) el.canvasOnboarding.hidden = true;
  try {
    localStorage.setItem(CANVAS_ONBOARDING_DISMISSED_KEY, "true");
  } catch {
    // A instrucao ainda fecha quando o navegador bloqueia storage em file://.
  }
}

function setCanvasMode(mode) {
  canvasMode = ["pen", "arrow"].includes(mode) ? mode : "move";
  el.penMode.classList.toggle("is-active", canvasMode === "pen");
  el.penMode.setAttribute("aria-pressed", String(canvasMode === "pen"));
  el.arrowMode.classList.toggle("is-active", canvasMode === "arrow");
  el.arrowMode.setAttribute("aria-pressed", String(canvasMode === "arrow"));
  el.boardNotesCarousel.dataset.canvasMode = canvasMode;
  el.canvasToolStatus.textContent = canvasMode === "pen"
      ? "Desenhe livremente sobre a mesa."
      : canvasMode === "arrow"
        ? "Clique e arraste para criar uma seta."
      : "Arraste o fundo para navegar. Use o ponto lateral dos cards para conectá-los.";
  renderBoardNotes();
}

async function syncCanvasState() {
  if (!isOnlineMode()) return;
  try {
    await saveRemoteBoard(activeBoard, exams, boardNotes, essays, canvasState);
  } catch {
    setStatus("Alteração salva neste navegador; a sincronização do caderno falhou.", true);
  }
}

function handleDrawingColorClick(event) {
  const button = event.target.closest("[data-drawing-color]");
  if (!button) return;
  drawingColor = button.dataset.drawingColor;
  updateDrawingColorControls();
}

function canvasPoint(event) {
  const rect = el.canvasDrawing.getBoundingClientRect();
  return { x: Math.round(event.clientX - rect.left), y: Math.round(event.clientY - rect.top) };
}

function updateLinkPreview(to) {
  if (!linkGesture) return;
  const fromNote = boardNotes.find((note) => note.id === linkGesture.from);
  if (!fromNote) return;
  const from = noteCenter(fromNote);
  let preview = el.canvasConnections.querySelector("[data-link-preview]");
  if (!preview) {
    el.canvasConnections.insertAdjacentHTML("beforeend", `
      <g class="canvas-connection canvas-connection--preview" data-link-preview>
        <path class="canvas-connection__shadow"></path>
        <path class="canvas-connection__line"></path>
        <circle class="canvas-connection__start" r="5"></circle>
        <circle class="canvas-connection__end" r="5"></circle>
      </g>
    `);
    preview = el.canvasConnections.querySelector("[data-link-preview]");
  }
  const path = linkCurvePath(from, to);
  preview.querySelectorAll("path").forEach((item) => item.setAttribute("d", path));
  preview.querySelector(".canvas-connection__start").setAttribute("cx", from.x);
  preview.querySelector(".canvas-connection__start").setAttribute("cy", from.y);
  preview.querySelector(".canvas-connection__end").setAttribute("cx", to.x);
  preview.querySelector(".canvas-connection__end").setAttribute("cy", to.y);
}

function startCardLink(event) {
  const handle = event.target.closest("[data-note-link-handle]");
  if (!handle || canvasMode !== "move" || event.button !== 0) return;
  const note = boardNotes.find((item) => item.id === handle.dataset.noteLinkHandle);
  if (!note) return;
  linkGesture = {
    from: note.id,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    target: null
  };
  handle.closest(".canvas-note")?.classList.add("is-link-source");
  updateLinkPreview(canvasPoint(event));
  handle.setPointerCapture?.(event.pointerId);
  el.canvasToolStatus.textContent = "Arraste a conexão até o card de destino.";
  event.preventDefault();
  event.stopPropagation();
}

function moveCardLink(event) {
  if (!linkGesture || event.pointerId !== linkGesture.pointerId) return;
  if (Math.hypot(event.clientX - linkGesture.startX, event.clientY - linkGesture.startY) > 5) linkGesture.moved = true;
  el.boardNotesLayer.querySelectorAll(".is-link-target").forEach((card) => card.classList.remove("is-link-target"));
  const targetElement = document.elementFromPoint(event.clientX, event.clientY)?.closest(".canvas-note");
  const targetId = targetElement?.dataset.noteId;
  const validTarget = targetId && targetId !== linkGesture.from;
  linkGesture.target = validTarget ? targetId : null;
  if (validTarget) targetElement.classList.add("is-link-target");
  const targetNote = validTarget ? boardNotes.find((note) => note.id === targetId) : null;
  updateLinkPreview(targetNote ? noteCenter(targetNote) : canvasPoint(event));
  event.preventDefault();
}

function endCardLink(event) {
  if (!linkGesture || event.pointerId !== linkGesture.pointerId) return;
  const finished = linkGesture;
  linkGesture = null;
  el.boardNotesLayer.querySelectorAll(".is-link-source, .is-link-target").forEach((card) => card.classList.remove("is-link-source", "is-link-target"));
  el.canvasConnections.querySelector("[data-link-preview]")?.remove();
  if (!finished.moved || !finished.target) {
    el.canvasToolStatus.textContent = "Arraste o ponto lateral de um card até outro para conectá-los.";
    return;
  }
  const exists = canvasState.links.some((link) =>
    (link.from === finished.from && link.to === finished.target) || (link.from === finished.target && link.to === finished.from)
  );
  if (!exists) {
    canvasState.links.push({ id: crypto.randomUUID(), from: finished.from, to: finished.target });
    persistCanvasState();
    renderCanvasOverlays();
    syncCanvasState();
  }
  el.canvasToolStatus.textContent = exists ? "Esses cards já estão conectados." : "Cards conectados.";
}

function startDrawing(event) {
  if (!["pen", "arrow"].includes(canvasMode) || event.button !== 0) return;
  const point = canvasPoint(event);
  if (canvasMode === "arrow") {
    activeArrow = { id: crypto.randomUUID(), color: drawingColor, from: point, to: point, createdAt: Date.now() };
    canvasState.arrows.push(activeArrow);
  } else {
    activeStroke = {
      id: crypto.randomUUID(),
      color: drawingColor,
      width: event.pointerType === "touch" ? 3 : 2.4,
      points: [point],
      createdAt: Date.now()
    };
    canvasState.strokes.push(activeStroke);
  }
  el.canvasDrawing.setPointerCapture?.(event.pointerId);
  renderCanvasOverlays();
  event.preventDefault();
}

function moveDrawing(event) {
  const point = canvasPoint(event);
  if (activeArrow && canvasMode === "arrow") {
    activeArrow.to = point;
    renderCanvasOverlays();
    event.preventDefault();
    return;
  }
  if (!activeStroke || canvasMode !== "pen") return;
  const last = activeStroke.points.at(-1);
  if (Math.hypot(point.x - last.x, point.y - last.y) < 2) return;
  activeStroke.points.push(point);
  renderCanvasOverlays();
  event.preventDefault();
}

function endDrawing() {
  if (!activeStroke && !activeArrow) return;
  if (activeStroke && activeStroke.points.length < 2) canvasState.strokes = canvasState.strokes.filter((stroke) => stroke.id !== activeStroke.id);
  if (activeArrow && Math.hypot(activeArrow.to.x - activeArrow.from.x, activeArrow.to.y - activeArrow.from.y) < 12) {
    canvasState.arrows = canvasState.arrows.filter((arrow) => arrow.id !== activeArrow.id);
  }
  activeStroke = null;
  activeArrow = null;
  persistCanvasState();
  renderCanvasOverlays();
  syncCanvasState();
}

function undoDrawing() {
  const lastStroke = canvasState.strokes.at(-1);
  const lastArrow = canvasState.arrows.at(-1);
  if (!lastStroke && !lastArrow) return;
  if ((lastArrow?.createdAt || 0) > (lastStroke?.createdAt || 0)) canvasState.arrows.pop();
  else canvasState.strokes.pop();
  persistCanvasState();
  renderCanvasOverlays();
  syncCanvasState();
}

function clearDrawing() {
  if (!canvasState.strokes.length) return;
  canvasState.strokes = [];
  persistCanvasState();
  renderCanvasOverlays();
  syncCanvasState();
  el.canvasToolStatus.textContent = "Traços de caneta removidos. Setas e conexões foram preservadas.";
}

function renderSecondaryTotal(exam) {
  if (activeBoard.conversion === "unifesp-days") {
    const converted = computeUnifespConverted(exam);
    return `
      <span>${formatConvertedDay(converted.dia1)}</span>
      <span>${formatConvertedDay(converted.dia2)}</span>
    `;
  }

  const secondary = computeSecondaryTotal(exam);
  const max = secondaryMax();
  if (secondary === null || !max) return "";
  return `<span>Disc. ${secondary}/${max}</span>`;
}

function updateBoardTabs() {
  el.boardTabs.forEach((tab) => {
    const isActive = tab.dataset.board === activeBoard.id;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
}

function renderTargets() {
  const target = targetTotal();
  el.goalPercent.textContent = targetPercent === null ? "--" : String(targetPercent);
  el.goalTotal.textContent = target === null
    ? "Nenhuma meta definida"
    : `${target} / ${activeBoard.totalMax} em ${activeBoard.label}`;
  el.goalMeterFill.style.width = `${targetPercent || 0}%`;
  el.goalNudge.hidden = targetPercent !== null;
  el.chartGoalPill.textContent = target === null ? "Defina sua meta" : `Meta ${target}`;
  el.chartGoalPill.classList.toggle("is-unset", target === null);
  if (document.activeElement !== el.goalInput) el.goalInput.value = targetPercent ?? "";
}

async function saveGoal(event) {
  event.preventDefault();
  const next = nullableScore(el.goalInput.value);
  if (next === null || next < 1 || next > 100) {
    setStatus("Defina uma meta entre 1% e 100%.", true);
    el.goalInput.focus();
    return;
  }
  targetPercent = Math.round(next);
  persistTargetPercent();
  renderTargets();
  drawCharts(true);
  if (isOnlineMode()) {
    try {
      await saveRemoteSettings();
      setStatus(`Meta de ${targetPercent}% salva e sincronizada.`);
    } catch {
      setStatus(`Meta de ${targetPercent}% salva neste navegador; a sincronização falhou.`, true);
    }
  } else {
    setStatus(`Meta de ${targetPercent}% salva neste navegador.`);
  }
}

function renderScoreFields(exam = null) {
  el.scoreFields.innerHTML = activeBoard.sections
    .map((section) => {
      const value = exam ? getScore(exam, section.key) : null;
      return `
        <label>
          ${escapeHtml(section.label)}${section.group ? ` <small>${section.group === "dia1" ? "Dia 1" : "Dia 2"}</small>` : ""}
          <input
            data-score-key="${section.key}"
            name="${section.key}"
            type="text"
            inputmode="decimal"
            placeholder="0-${section.max}"
            value="${value ?? ""}"
            ${section.countsTowardTotal === false ? "" : "required"}
          >
        </label>
      `;
    })
    .join("");

  el.scoreFields.querySelectorAll("input[data-score-key]").forEach((input) => {
    input.addEventListener("input", updateFormTotal);
  });
}

function updateFormForBoard() {
  el.prova.placeholder = activeBoard.placeholder;
  if (!el.id.value) {
    el.formTitle.textContent = "Nova prova";
    renderScoreFields();
  }
}

function updateFormTotal() {
  const draft = readForm();

  if (activeBoard.conversion === "unifesp-days") {
    const converted = computeUnifespConverted(draft);
    const total = converted.complete ? Number(((converted.dia1.score + converted.dia2.score) / 2).toFixed(2)) : 0;
    el.formTotal.textContent = `Media ${total}/100 | D1 ${formatConvertedDay(converted.dia1)} | D2 ${formatConvertedDay(converted.dia2)}`;
    return;
  }

  const total = computeTotal(draft) ?? 0;
  const secondary = computeSecondaryTotal(draft);
  const max = secondaryMax();
  el.formTotal.textContent = secondary === null || !max
    ? `${total}/${activeBoard.totalMax}`
    : `${total}/${activeBoard.totalMax} + ${secondary}/${max}`;
}

function readForm() {
  const scores = {};
  el.scoreFields.querySelectorAll("input[data-score-key]").forEach((input) => {
    scores[input.dataset.scoreKey] = scoreFromInput(input);
  });

  return {
    id: el.id.value || crypto.randomUUID(),
    prova: el.prova.value.trim(),
    scores,
    obs: el.obs.value.trim()
  };
}

function resetForm() {
  el.form.reset();
  el.id.value = "";
  el.formTitle.textContent = "Nova prova";
  el.saveExam.textContent = "Salvar prova";
  el.cancelEdit.hidden = true;
  renderScoreFields();
  updateFormForBoard();
  updateFormTotal();
}

function fillForm(exam) {
  el.id.value = exam.id;
  el.prova.value = exam.prova;
  el.obs.value = exam.obs ?? "";
  renderScoreFields(exam);
  el.formTitle.textContent = "Editar prova";
  el.saveExam.textContent = "Salvar alteracoes";
  el.cancelEdit.hidden = false;
  updateFormTotal();
  document.querySelector("#entry-card").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function saveForm(event) {
  event.preventDefault();
  const draft = readForm();
  const total = computeTotal(draft);

  if (!draft.prova || total === null) {
    setStatus("Preencha nome e notas da prova.", true);
    return;
  }

  if (total > activeBoard.totalMax) {
    setStatus(`O total nao pode passar de ${activeBoard.totalMax}.`, true);
    return;
  }

  const saved = { ...draft, total };
  const currentIndex = exams.findIndex((exam) => exam.id === saved.id);
  if (currentIndex >= 0) exams[currentIndex] = saved;
  else exams.push(saved);

  persist();
  render();
  resetForm();
  if (isOnlineMode()) {
    try {
      await saveRemoteBoard(activeBoard, exams, boardNotes);
      setStatus(`${activeBoard.label}: prova salva e sincronizada`);
    } catch (error) {
      setStatus(`Prova salva localmente. Falha no sync: ${error.message || "verifique o Supabase"}`, true);
    }
  } else {
    setStatus(`${activeBoard.label}: prova salva neste navegador`);
  }
}

async function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const exam = exams.find((item) => item.id === button.dataset.id);
  if (!exam) return;

  if (button.dataset.action === "edit") {
    fillForm(exam);
    return;
  }

  if (button.dataset.action === "delete") {
    if (!window.confirm(`Excluir "${exam.prova}"?`)) return;
    exams = exams.filter((item) => item.id !== exam.id);
    persist();
    if (isOnlineMode()) {
      try {
        await deleteRemoteExam(exam.id);
      } catch (error) {
        setStatus(`Prova excluida localmente. Falha no sync: ${error.message || "verifique o Supabase"}`, true);
      }
    }
    render();
    setStatus(`${activeBoard.label}: prova excluida deste navegador`);
  }
}

async function switchBoard(boardId) {
  const nextBoard = boardById(boardId);
  if (!nextBoard || nextBoard.id === activeBoard.id) return;
  activeBoard = nextBoard;
  if (!activeBoard.notebookOnly) lastAcademicBoard = activeBoard;
  exams = loadExams(activeBoard);
  boardNotes = loadBoardNotes(activeBoard);
  essays = loadEssays(activeBoard);
  canvasState = loadCanvasState(activeBoard);
  customizingNoteId = null;
  setCanvasMode("move");
  localStorage.setItem(ACTIVE_BOARD_KEY, activeBoard.id);
  if (!activeBoard.notebookOnly) resetForm();
  render();
  if (isOnlineMode()) await syncBoardData(activeBoard, { silent: true });
  updateStatusForBoard();
}

function render() {
  updateBoardTabs();
  renderBoardNotes();
  if (activeBoard.notebookOnly) {
    el.enemSubjectChartCard.hidden = true;
    return;
  }
  updateMapModeToggle();
  updateFormForBoard();
  renderTargets();
  renderEnemSubjectChart();
  drawCharts(true);
  renderExamCarousel();
  renderEssays();
  renderTable();
}

function drawCharts(force = false) {
  const charts = [
    [el.progressChart, drawProgressChart],
    ...(activeBoard.id === "enem" ? [[el.enemSubjectChart, drawEnemSubjectChart]] : [])
  ];

  charts.forEach(([canvas, draw]) => {
    const width = Math.round(canvas.getBoundingClientRect().width);
    if (!width) return;
    if (!force && chartWidths.get(canvas) === width) return;
    chartWidths.set(canvas, width);
    draw(canvas);
  });
}

function scheduleChartResize() {
  if (chartFrame) return;
  chartFrame = requestAnimationFrame(() => {
    chartFrame = 0;
    drawCharts(false);
  });
}

function createBoardNoteAt(clientX, clientY) {
  if (canvasMode !== "move") return;
  const rect = el.boardNotesCarousel.getBoundingClientRect();
  const width = 280;
  const height = 190;
  const x = Math.max(16, Math.min(el.boardNotesCarousel.clientWidth - width - 16, clientX - rect.left - width / 2));
  const y = Math.max(16, Math.min(el.boardNotesCarousel.clientHeight - height - 16, clientY - rect.top - 28));
  const note = {
    id: crypto.randomUUID(),
    text: "",
    createdAt: new Date().toISOString(),
    x: Math.round(x),
    y: Math.round(y),
    color: "neutral",
    fontSize: 16,
    bold: false,
    underline: false,
    width,
    height,
    isChecklist: false,
    checklistState: []
  };
  boardNotes = [note, ...boardNotes];
  customizingNoteId = note.id;
  animatedNoteId = note.id;
  renderBoardNotes();
  focusNoteEditor(note.id);
  el.canvasToolStatus.textContent = "Card criado. Escreva diretamente e use o lápis para personalizar.";
}

function handleCanvasDoubleClick(event) {
  if (event.target.closest(".canvas-note") || canvasMode !== "move") return;
  createBoardNoteAt(event.clientX, event.clientY);
  event.preventDefault();
}

function focusNoteEditor(noteId, checklistIndex = null) {
  requestAnimationFrame(() => {
    const selector = checklistIndex === null
      ? `[data-note-editor="${CSS.escape(noteId)}"]`
      : `[data-note-check-editor="${CSS.escape(noteId)}"][data-check-index="${checklistIndex}"]`;
    const editor = el.boardNotesLayer.querySelector(selector);
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  });
}

function scheduleNoteSync(noteId = null) {
  clearTimeout(noteSyncTimer);
  const boardId = activeBoard.id;
  noteSyncTimer = setTimeout(async () => {
    if (!isOnlineMode() || activeBoard.id !== boardId) return;
    try {
      const note = noteId ? boardNotes.find((item) => item.id === noteId) : null;
      if (noteId && (!note || !String(note.text || "").trim())) {
        await deleteRemoteNote(noteId);
        return;
      }
      await saveRemoteBoard(activeBoard, exams, boardNotes, essays, canvasState);
    } catch {
      setStatus("Edição salva neste navegador; a sincronização do card falhou.", true);
    }
  }, 650);
}

function handleNoteEditorInput(event) {
  const editor = event.target.closest("[data-note-editor], [data-note-check-editor]");
  if (!editor) return;
  const noteId = editor.dataset.noteEditor || editor.dataset.noteCheckEditor;
  const note = boardNotes.find((item) => item.id === noteId);
  if (!note) return;
  if (editor.dataset.noteEditor) {
    note.text = editor.innerText.replace(/\n{3,}/g, "\n\n");
  } else {
    const card = editor.closest(".canvas-note");
    note.text = [...card.querySelectorAll("[data-note-check-editor]")].map((item) => item.innerText).join("\n");
  }
  persistBoardNotes();
  scheduleNoteSync(note.id);
}

function handleNoteEditorKeydown(event) {
  const editor = event.target.closest("[data-note-check-editor]");
  if (!editor || event.key !== "Enter") return;
  event.preventDefault();
  const note = boardNotes.find((item) => item.id === editor.dataset.noteCheckEditor);
  const index = Number(editor.dataset.checkIndex);
  if (!note || !Number.isInteger(index)) return;
  const items = checklistItems(note);
  items[index] = editor.innerText;
  items.splice(index + 1, 0, "");
  note.checklistState.splice(index + 1, 0, false);
  note.text = items.join("\n");
  persistBoardNotes();
  renderBoardNotes();
  focusNoteEditor(note.id, index + 1);
}

function updateNoteAppearance(note, control, value) {
  if (control === "color" && ["neutral", "red", "blue", "green", "paper"].includes(value)) note.color = value;
  if (control === "font") note.fontSize = Math.max(10, Math.min(48, Number(value) || 16));
  if (control === "bold") note.bold = !note.bold;
  if (control === "underline") note.underline = !note.underline;
  if (control === "checklist") {
    note.isChecklist = !note.isChecklist;
    note.checklistState = checklistItems(note).map((_, index) => Boolean(note.checklistState[index]));
    note.height = Math.max(note.height || 190, 210);
  }
  persistBoardNotes();
  renderBoardNotes();
  focusNoteEditor(note.id, note.isChecklist ? 0 : null);
  scheduleNoteSync(note.id);
}

function handleNoteControlClick(event) {
  const control = event.target.closest("[data-note-control]");
  if (!control || control.dataset.noteControl === "font") return;
  const note = boardNotes.find((item) => item.id === control.dataset.id);
  if (!note) return;
  updateNoteAppearance(note, control.dataset.noteControl, control.dataset.value);
}

function handleNoteControlInput(event) {
  const control = event.target.closest("[data-note-control='font']");
  if (!control) return;
  const note = boardNotes.find((item) => item.id === control.dataset.id);
  if (!note) return;
  note.fontSize = Math.max(10, Math.min(48, Number(control.value) || 16));
  control.nextElementSibling.textContent = `${note.fontSize} px`;
  control.closest(".canvas-note").style.setProperty("--note-font-size", `${note.fontSize}px`);
  persistBoardNotes();
  scheduleNoteSync(note.id);
}

async function handleBoardNotesClick(event) {
  const control = event.target.closest("[data-note-action]");
  if (!control) return;
  const noteId = control.dataset.id;
  if (control.dataset.noteAction === "customize") {
    customizingNoteId = customizingNoteId === noteId ? null : noteId;
    renderBoardNotes();
    if (customizingNoteId) focusNoteEditor(noteId);
    return;
  }
  if (control.dataset.noteAction === "check") {
    const note = boardNotes.find((item) => item.id === noteId);
    const index = Number(control.dataset.checkIndex);
    if (!note || !Number.isInteger(index)) return;
    note.checklistState[index] = control.checked;
    control.closest(".canvas-check-item")?.classList.toggle("is-checked", control.checked);
    persistBoardNotes();
    syncCanvasState();
    return;
  }
  if (control.dataset.noteAction !== "delete") return;
  if (customizingNoteId === noteId) customizingNoteId = null;
  boardNotes = boardNotes.filter((note) => note.id !== noteId);
  canvasState.links = canvasState.links.filter((link) => link.from !== noteId && link.to !== noteId);
  persistBoardNotes();
  persistCanvasState();
  renderBoardNotes();
  if (isOnlineMode()) {
    try {
      await Promise.all([deleteRemoteNote(noteId), syncCanvasState()]);
    } catch (error) {
      setStatus(`Observacao excluida localmente. Falha no sync: ${error.message || "verifique o Supabase"}`, true);
      return;
    }
  }
  setStatus(`${activeBoard.label}: observacao excluida deste navegador`);
}

function startCanvasPan(event) {
  if (
    canvasMode !== "move"
    || event.button !== 0
    || event.target.closest(".canvas-note, .canvas-onboarding, button, input, textarea, select, label")
  ) return;
  canvasPan = {
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    startX: event.clientX,
    startY: event.clientY,
    scrollLeft: el.notebookCanvasWrap.scrollLeft,
    scrollTop: el.notebookCanvasWrap.scrollTop,
    moved: false
  };
  el.notebookCanvasWrap.classList.add("is-panning");
  el.notebookCanvasWrap.setPointerCapture?.(event.pointerId);
}

function moveCanvasPan(event) {
  if (!canvasPan || event.pointerId !== canvasPan.pointerId) return;
  const dx = event.clientX - canvasPan.startX;
  const dy = event.clientY - canvasPan.startY;
  if (Math.hypot(dx, dy) > 6) canvasPan.moved = true;
  el.notebookCanvasWrap.scrollLeft = canvasPan.scrollLeft - dx;
  el.notebookCanvasWrap.scrollTop = canvasPan.scrollTop - dy;
  event.preventDefault();
}

function endCanvasPan(event) {
  if (!canvasPan || event.pointerId !== canvasPan.pointerId) return;
  const finished = canvasPan;
  canvasPan = null;
  el.notebookCanvasWrap.classList.remove("is-panning");
  if (finished.moved || finished.pointerType !== "touch") return;
  const now = Date.now();
  if (lastCanvasTap && now - lastCanvasTap.time < 380 && Math.hypot(event.clientX - lastCanvasTap.x, event.clientY - lastCanvasTap.y) < 28) {
    createBoardNoteAt(event.clientX, event.clientY);
    lastCanvasTap = null;
  } else {
    lastCanvasTap = { time: now, x: event.clientX, y: event.clientY };
  }
}

function startNoteDrag(event) {
  if (canvasMode !== "move" || event.button !== 0 || event.target.closest("button")) return;
  const handle = event.target.closest("[data-note-drag]");
  if (!handle) return;
  const noteElement = handle.closest(".canvas-note");
  const note = boardNotes.find((item) => item.id === handle.dataset.noteDrag);
  if (!noteElement || !note) return;
  noteDrag = {
    id: note.id,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: note.x || 32,
    originY: note.y || 32,
    element: noteElement
  };
  noteElement.classList.add("is-dragging");
  handle.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function moveNoteDrag(event) {
  if (!noteDrag || event.pointerId !== noteDrag.pointerId) return;
  const canvas = el.boardNotesCarousel;
  const maxX = Math.max(16, canvas.clientWidth - noteDrag.element.offsetWidth - 16);
  const maxY = Math.max(16, canvas.clientHeight - noteDrag.element.offsetHeight - 16);
  const x = Math.max(16, Math.min(maxX, noteDrag.originX + event.clientX - noteDrag.startX));
  const y = Math.max(16, Math.min(maxY, noteDrag.originY + event.clientY - noteDrag.startY));
  noteDrag.element.style.setProperty("--note-x", `${Math.round(x)}px`);
  noteDrag.element.style.setProperty("--note-y", `${Math.round(y)}px`);
  const draggedNote = boardNotes.find((item) => item.id === noteDrag.id);
  if (draggedNote) {
    draggedNote.x = Math.round(x);
    draggedNote.y = Math.round(y);
    renderCanvasOverlays();
  }
  noteDrag.x = x;
  noteDrag.y = y;
  event.preventDefault();
}

async function endNoteDrag(event) {
  if (!noteDrag || event.pointerId !== noteDrag.pointerId) return;
  const finished = noteDrag;
  noteDrag = null;
  finished.element.classList.remove("is-dragging");
  if (finished.x === undefined || finished.y === undefined) return;
  const note = boardNotes.find((item) => item.id === finished.id);
  if (!note) return;
  note.x = Math.round(finished.x);
  note.y = Math.round(finished.y);
  persistBoardNotes();
  if (isOnlineMode()) {
    try {
      await saveRemoteBoard(activeBoard, exams, boardNotes);
    } catch {
      setStatus("Posição salva neste navegador; a sincronização falhou.", true);
    }
  }
}

function startNoteResize(event) {
  if (["pen", "arrow"].includes(canvasMode) || event.button !== 0) return;
  const handle = event.target.closest("[data-note-resize]");
  if (!handle) return;
  const note = boardNotes.find((item) => item.id === handle.dataset.noteResize);
  const element = handle.closest(".canvas-note");
  if (!note || !element) return;
  noteResize = {
    id: note.id,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    width: note.width || element.offsetWidth,
    height: note.height || element.offsetHeight,
    fontSize: note.fontSize || 16,
    element
  };
  element.classList.add("is-resizing");
  handle.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function moveNoteResize(event) {
  if (!noteResize || event.pointerId !== noteResize.pointerId) return;
  const note = boardNotes.find((item) => item.id === noteResize.id);
  if (!note) return;
  const maxWidth = Math.min(560, el.boardNotesCarousel.clientWidth - (note.x || 32) - 16);
  const maxHeight = Math.min(560, el.boardNotesCarousel.clientHeight - (note.y || 32) - 16);
  const width = Math.max(200, Math.min(maxWidth, noteResize.width + event.clientX - noteResize.startX));
  const height = Math.max(140, Math.min(maxHeight, noteResize.height + event.clientY - noteResize.startY));
  const scale = ((width / noteResize.width) + (height / noteResize.height)) / 2;
  const fontSize = Math.max(10, Math.min(48, noteResize.fontSize * scale));
  note.width = Math.round(width);
  note.height = Math.round(height);
  note.fontSize = Math.round(fontSize);
  noteResize.element.style.setProperty("--note-width", `${note.width}px`);
  noteResize.element.style.setProperty("--note-height", `${note.height}px`);
  noteResize.element.style.setProperty("--note-font-size", `${note.fontSize}px`);
  renderCanvasOverlays();
  event.preventDefault();
}

async function endNoteResize(event) {
  if (!noteResize || event.pointerId !== noteResize.pointerId) return;
  const finished = noteResize;
  noteResize = null;
  finished.element.classList.remove("is-resizing");
  persistBoardNotes();
  if (isOnlineMode()) {
    try {
      await saveRemoteBoard(activeBoard, exams, boardNotes, essays, canvasState);
    } catch {
      setStatus("Tamanho salvo neste navegador; a sincronização falhou.", true);
    }
  }
}

async function handleAuthSignIn(event) {
  event.preventDefault();
  if (!supabaseClient) return;
  const email = el.authEmail.value.trim();
  const password = el.authPassword.value;
  if (!email || !password) {
    setStatus("Preencha email e senha.", true);
    return;
  }

  setAuthBusy(true);
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  setAuthBusy(false);
  if (error) {
    setStatus(`Nao foi possivel entrar: ${error.message}`, true);
    return;
  }
  el.authPassword.value = "";
}

async function handleAuthSignUp() {
  if (!supabaseClient) return;
  const email = el.authEmail.value.trim();
  const password = el.authPassword.value;
  if (!email || !password) {
    setStatus("Preencha email e senha para criar a conta.", true);
    return;
  }

  setAuthBusy(true);
  const { error } = await supabaseClient.auth.signUp({ email, password });
  setAuthBusy(false);
  if (error) {
    setStatus(`Nao foi possivel criar a conta: ${error.message}`, true);
    return;
  }
  el.authPassword.value = "";
  setStatus("Conta criada. Se o Supabase pedir confirmacao, confirme pelo email.");
}

async function handleAuthSignOut() {
  if (!supabaseClient) return;
  setAuthBusy(true);
  const { error } = await supabaseClient.auth.signOut();
  setAuthBusy(false);
  if (error) setStatus(`Nao foi possivel sair: ${error.message}`, true);
}

async function handleManualSync() {
  if (!isOnlineMode()) {
    openAuthModal();
    return;
  }
  setSyncFeedback();
  el.syncNow.classList.add("is-syncing");
  setAuthBusy(true);
  try {
    const [boardsSynced, settingsSynced] = await Promise.all([syncAllBoards(), syncUserSettings()]);
    const synced = boardsSynced && settingsSynced;
    setSyncFeedback(synced ? "success" : "error");
  } finally {
    setAuthBusy(false);
    el.syncNow.classList.remove("is-syncing");
  }
}

function handleActivateSync() {
  openAuthModal();
}

el.form.addEventListener("submit", saveForm);
el.cancelEdit.addEventListener("click", resetForm);
el.table.addEventListener("click", handleTableClick);
el.themeToggle.addEventListener("click", toggleTheme);
el.mapModeToggle.addEventListener("click", toggleMapMode);
el.authForm.addEventListener("submit", handleAuthSignIn);
el.authSignup.addEventListener("click", handleAuthSignUp);
el.authSignout.addEventListener("click", handleAuthSignOut);
el.syncNow.addEventListener("click", handleManualSync);
el.activateSync.addEventListener("click", handleActivateSync);
el.authClose.addEventListener("click", closeAuthModal);
el.authCloseBackdrop.addEventListener("click", closeAuthModal);
el.goalForm.addEventListener("submit", saveGoal);
el.essayForm.addEventListener("submit", saveEssay);
el.essayList.addEventListener("click", handleEssayClick);
el.boardNotesCarousel.addEventListener("click", handleBoardNotesClick);
el.boardNotesCarousel.addEventListener("click", handleNoteControlClick);
el.boardNotesCarousel.addEventListener("input", handleNoteEditorInput);
el.boardNotesCarousel.addEventListener("input", handleNoteControlInput);
el.boardNotesCarousel.addEventListener("keydown", handleNoteEditorKeydown);
el.boardNotesCarousel.addEventListener("pointerdown", startCardLink);
el.boardNotesCarousel.addEventListener("pointerdown", startNoteResize);
el.boardNotesCarousel.addEventListener("pointerdown", startNoteDrag);
el.notebookCanvasWrap.addEventListener("pointerdown", startCanvasPan);
el.notebookCanvasWrap.addEventListener("pointermove", moveCanvasPan, { passive: false });
el.notebookCanvasWrap.addEventListener("pointerup", endCanvasPan);
el.notebookCanvasWrap.addEventListener("pointercancel", endCanvasPan);
el.notebookCanvasWrap.addEventListener("dblclick", handleCanvasDoubleClick);
el.penMode.addEventListener("click", () => setCanvasMode(canvasMode === "pen" ? "move" : "pen"));
el.arrowMode.addEventListener("click", () => setCanvasMode(canvasMode === "arrow" ? "move" : "arrow"));
el.drawingColorOptions.addEventListener("click", handleDrawingColorClick);
el.undoDrawing.addEventListener("click", undoDrawing);
el.clearDrawing.addEventListener("click", clearDrawing);
el.canvasDrawing.addEventListener("pointerdown", startDrawing);
el.canvasDrawing.addEventListener("pointermove", moveDrawing);
el.canvasDrawing.addEventListener("pointerup", endDrawing);
el.canvasDrawing.addEventListener("pointercancel", endDrawing);
document.addEventListener("pointermove", moveNoteDrag, { passive: false });
document.addEventListener("pointermove", moveNoteResize, { passive: false });
document.addEventListener("pointermove", moveCardLink, { passive: false });
document.addEventListener("pointerup", endNoteDrag);
document.addEventListener("pointercancel", endNoteDrag);
document.addEventListener("pointerup", endNoteResize);
document.addEventListener("pointercancel", endNoteResize);
document.addEventListener("pointerup", endCardLink);
document.addEventListener("pointercancel", endCardLink);
el.canvasOnboardingDismiss?.addEventListener("pointerdown", (event) => event.stopPropagation());
el.canvasOnboardingDismiss?.addEventListener("click", dismissCanvasOnboarding);

el.viewButtons.forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.viewTarget));
});

el.boardTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchBoard(tab.dataset.board));
});

window.addEventListener("resize", () => {
  scheduleChartResize();
  renderCanvasOverlays();
}, { passive: true });
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !el.authPanel.hidden) closeAuthModal();
});

applyTheme(activeTheme);
updateDrawingColorControls();
applyCanvasOnboardingPreference();
const initialView = location.hash === "#registros" ? "records" : location.hash === "#caderno" ? "notebook" : "home";
switchView(initialView, { updateHash: false });
render();
updateFormTotal();
updateStatusForBoard();
initSupabase();
