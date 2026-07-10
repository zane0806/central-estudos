const LEGACY_STORAGE_KEY = "central-estudos.exams.v2";
const STORAGE_PREFIX = "central-estudos.board.v2";
const PREVIOUS_STORAGE_PREFIX = "central-estudos.board.v1";
const ACTIVE_BOARD_KEY = "central-estudos.active-board.v1";
const SEED_VERSION_PREFIX = "central-estudos.seed-version.v1";
const NOTES_STORAGE_PREFIX = "central-estudos.board-notes.v1";
const THEME_KEY = "central-estudos.theme.v1";
const MAP_MODE_KEY = "central-estudos.map-mode.v1";
const TARGET_PERCENT_KEY = "central-estudos.target-percent.v1";
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

const boards = [
  {
    id: "enem",
    label: "ENEM",
    totalMax: 180,
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
  examCarousel: document.querySelector("#exam-carousel"),
  mapModeToggle: document.querySelector("#map-mode-toggle"),
  boardNoteText: document.querySelector("#board-note-text"),
  saveBoardNote: document.querySelector("#save-board-note"),
  clearBoardNote: document.querySelector("#clear-board-note"),
  boardNotesCarousel: document.querySelector("#board-notes-carousel"),
  notebookBoardLabel: document.querySelector("#notebook-board-label"),
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

let activeBoard = boardById(localStorage.getItem(ACTIVE_BOARD_KEY)) || boards[0];
let exams = loadExams(activeBoard);
let boardNotes = loadBoardNotes(activeBoard);
let activeTheme = localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
let mapMode = localStorage.getItem(MAP_MODE_KEY) === "errors" ? "errors" : "scores";
let targetPercent = loadTargetPercent();
let activeView = "home";
let supabaseClient = null;
let currentUser = null;
let chartFrame = 0;
let syncFeedbackTimer = 0;
let noteDrag = null;
const chartWidths = new WeakMap();

function boardById(id) {
  return boards.find((board) => board.id === id);
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
      y: Number.isFinite(Number(note.y)) ? Number(note.y) : 32 + Math.floor(index / 3) * 190
    }));
}

function persistBoardNotes() {
  localStorage.setItem(notesStorageKey(activeBoard), JSON.stringify(boardNotes));
}

function persist() {
  localStorage.setItem(storageKey(activeBoard), JSON.stringify(exams));
  localStorage.setItem(ACTIVE_BOARD_KEY, activeBoard.id);
}

function switchView(view, { updateHash = true } = {}) {
  const next = ["home", "records", "notebook"].includes(view) ? view : "home";
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
    y: Number(row.position_y ?? row.y ?? 32)
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
    position_y: Math.round(note.y || 32)
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

async function fetchRemoteBoard(board) {
  const [examResult, noteResult] = await Promise.all([
    supabaseClient
      .from("exam_records")
      .select("id, board_id, prova, scores, total, obs, position, created_at, updated_at")
      .eq("board_id", board.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabaseClient
      .from("board_note_records")
      .select("id, board_id, text, position_x, position_y, created_at, updated_at")
      .eq("board_id", board.id)
      .order("created_at", { ascending: false })
  ]);

  if (examResult.error) throw examResult.error;
  if (noteResult.error) throw noteResult.error;

  const remoteNotes = (noteResult.data || []).map(rowToNote).filter((note) => note.text);
  if (remoteNotes.length > 1 && remoteNotes.every((note) => note.x === 32 && note.y === 32)) {
    remoteNotes.forEach((note, index) => {
      note.x = 32 + (index % 3) * 278;
      note.y = 32 + Math.floor(index / 3) * 190;
    });
  }

  return {
    exams: normalizeExams((examResult.data || []).map(rowToExam), board),
    notes: remoteNotes
  };
}

async function saveRemoteBoard(board, nextExams, nextNotes) {
  const examRows = nextExams.map((exam, index) => examToRow(exam, board, index));
  const noteRows = nextNotes.map((note) => noteToRow(note, board));

  if (examRows.length) {
    const { error } = await supabaseClient.from("exam_records").upsert(examRows, { onConflict: "id" });
    if (error) throw error;
  }

  if (noteRows.length) {
    const { error } = await supabaseClient.from("board_note_records").upsert(noteRows, { onConflict: "id" });
    if (error) throw error;
  }
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

function saveLocalBoard(board, nextExams, nextNotes) {
  localStorage.setItem(storageKey(board), JSON.stringify(nextExams));
  localStorage.setItem(notesStorageKey(board), JSON.stringify(nextNotes));
}

async function syncBoardData(board, { silent = false } = {}) {
  if (!isOnlineMode()) return { ok: false, error: new Error("Sessao online indisponivel") };
  try {
    const localExams = normalizeExams(loadExams(board), board);
    const localNotes = loadBoardNotes(board);
    const remote = await fetchRemoteBoard(board);
    const mergedExams = mergeExamsForSync(remote.exams, localExams);
    const mergedNotes = mergeNotesForSync(remote.notes, localNotes);
    await saveRemoteBoard(board, mergedExams, mergedNotes);
    saveLocalBoard(board, mergedExams, mergedNotes);

    if (board.id === activeBoard.id) {
      exams = mergedExams;
      boardNotes = mergedNotes;
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
  for (const board of boards) {
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
  }
  if (el.themeColorMeta) {
    el.themeColorMeta.setAttribute("content", activeTheme === "dark" ? "#0b0b0a" : "#f2efe8");
  }
  drawCharts(true);
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

function renderBoardNotes() {
  if (!el.boardNotesCarousel) return;
  if (el.notebookBoardLabel) el.notebookBoardLabel.textContent = activeBoard.label;

  if (!boardNotes.length) {
    el.boardNotesCarousel.innerHTML = `
      <div class="canvas-empty">
        <span>01</span>
        <strong>Canvas livre</strong>
        <p>Crie a primeira nota de ${escapeHtml(activeBoard.label)}. Ela aparecerá aqui e poderá ser arrastada.</p>
      </div>
    `;
    return;
  }

  el.boardNotesCarousel.innerHTML = boardNotes
    .map((note) => `
      <article class="canvas-note" data-note-id="${note.id}" style="--note-x: ${Math.max(16, note.x || 32)}px; --note-y: ${Math.max(16, note.y || 32)}px;">
        <div class="canvas-note__bar" data-note-drag="${note.id}">
          <span>${escapeHtml(activeBoard.label)} // ${escapeHtml(formatDate(note.createdAt))}</span>
          <button type="button" data-note-action="delete" data-id="${note.id}" aria-label="Excluir nota">×</button>
        </div>
        <p>${escapeHtml(note.text)}</p>
      </article>
    `)
    .join("");
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
  exams = loadExams(activeBoard);
  boardNotes = loadBoardNotes(activeBoard);
  if (el.boardNoteText) el.boardNoteText.value = "";
  localStorage.setItem(ACTIVE_BOARD_KEY, activeBoard.id);
  resetForm();
  render();
  if (isOnlineMode()) await syncBoardData(activeBoard, { silent: true });
  updateStatusForBoard();
}

function render() {
  updateBoardTabs();
  updateMapModeToggle();
  updateFormForBoard();
  renderTargets();
  drawCharts(true);
  renderExamCarousel();
  renderBoardNotes();
  renderTable();
}

function drawCharts(force = false) {
  const charts = [
    [el.progressChart, drawProgressChart]
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

async function saveBoardNote() {
  const text = el.boardNoteText?.value.trim();
  if (!text) {
    setStatus("Escreva uma observacao antes de salvar.", true);
    return;
  }

  boardNotes = [
    {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
      x: 32 + (boardNotes.length % 3) * 278,
      y: 32 + Math.floor(boardNotes.length / 3) * 190
    },
    ...boardNotes
  ];
  persistBoardNotes();
  if (isOnlineMode()) {
    try {
      await saveRemoteBoard(activeBoard, exams, boardNotes);
    } catch (error) {
      setStatus(`Observacao salva localmente. Falha no sync: ${error.message || "verifique o Supabase"}`, true);
    }
  }
  el.boardNoteText.value = "";
  renderBoardNotes();
  setStatus(isOnlineMode() ? `${activeBoard.label}: observacao salva e sincronizada` : `${activeBoard.label}: observacao salva neste navegador`);
}

function clearBoardNote() {
  if (el.boardNoteText) el.boardNoteText.value = "";
}

async function handleBoardNotesClick(event) {
  const button = event.target.closest("button[data-note-action]");
  if (!button || button.dataset.noteAction !== "delete") return;
  boardNotes = boardNotes.filter((note) => note.id !== button.dataset.id);
  persistBoardNotes();
  if (isOnlineMode()) {
    try {
      await deleteRemoteNote(button.dataset.id);
    } catch (error) {
      setStatus(`Observacao excluida localmente. Falha no sync: ${error.message || "verifique o Supabase"}`, true);
    }
  }
  renderBoardNotes();
  setStatus(`${activeBoard.label}: observacao excluida deste navegador`);
}

function startNoteDrag(event) {
  if (event.button !== 0 || event.target.closest("button")) return;
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
el.saveBoardNote.addEventListener("click", saveBoardNote);
el.clearBoardNote.addEventListener("click", clearBoardNote);
el.boardNotesCarousel.addEventListener("click", handleBoardNotesClick);
el.boardNotesCarousel.addEventListener("pointerdown", startNoteDrag);
document.addEventListener("pointermove", moveNoteDrag, { passive: false });
document.addEventListener("pointerup", endNoteDrag);
document.addEventListener("pointercancel", endNoteDrag);

el.viewButtons.forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.viewTarget));
});

el.boardTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchBoard(tab.dataset.board));
});

window.addEventListener("resize", scheduleChartResize, { passive: true });
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !el.authPanel.hidden) closeAuthModal();
});

applyTheme(activeTheme);
switchView("home");
render();
updateFormTotal();
updateStatusForBoard();
initSupabase();
