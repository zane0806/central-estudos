const LEGACY_STORAGE_KEY = "central-estudos.exams.v2";
const STORAGE_PREFIX = "central-estudos.board.v2";
const PREVIOUS_STORAGE_PREFIX = "central-estudos.board.v1";
const ACTIVE_BOARD_KEY = "central-estudos.active-board.v1";
const TARGET_RATE = 0.92;

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

const seedExams = [
  { prova: "ENEM 2019", humanas: 41, linguagens: 34, matematica: 36, natureza: 34, total: 145, obs: "" },
  { prova: "ENEM 2024 PPL", humanas: 38, linguagens: 34, matematica: 38, natureza: 35, total: 145, obs: "" },
  { prova: "ENEM 2023 PPL", humanas: 43, linguagens: 39, matematica: 35, natureza: 37, total: 154, obs: "" },
  { prova: "ENEM 2018", humanas: null, linguagens: null, matematica: 39, natureza: 34, total: 149, obs: "" },
  { prova: "ENEM 2022 PPL", humanas: null, linguagens: null, matematica: 37, natureza: 36, total: 149, obs: "" },
  { prova: "ENEM 2022", humanas: 38, linguagens: 34, matematica: 37, natureza: 34, total: 143, obs: "" },
  { prova: "ENEM 2021", humanas: 40, linguagens: 36, matematica: 42, natureza: 36, total: 154, obs: "feitas em 2026" },
  { prova: "ENEM 2024", humanas: 44, linguagens: 40, matematica: 41, natureza: 42, total: 167, obs: "" },
  { prova: "ENEM 2019 PPL", humanas: 42, linguagens: 40, matematica: 42, natureza: 40, total: 164, obs: "" },
  { prova: "ENEM 2020 PPL", humanas: null, linguagens: null, matematica: 38, natureza: 43, total: 81, obs: "" },
  { prova: "ENEM 2021 PPL", humanas: null, linguagens: null, matematica: 42, natureza: 42, total: 84, obs: "" },
  { prova: "ENEM S. Poli", humanas: 37, linguagens: 39, matematica: 41, natureza: 38, total: 155, obs: "" }
];

const boards = [
  {
    id: "enem",
    label: "ENEM",
    totalMax: 180,
    seed: seedExams,
    placeholder: "Ex: ENEM 2025 PPL",
    note: "prova inteira",
    sections: [
      { key: "humanas", label: "Humanas", max: 45, color: colors.green },
      { key: "linguagens", label: "Linguagens", max: 45, color: colors.blue },
      { key: "matematica", label: "Matematica", max: 45, color: colors.coral },
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
      { key: "portugues", label: "Portugues", max: 10, color: colors.blue },
      { key: "literatura", label: "Literatura", max: 8, color: colors.violet },
      { key: "artes", label: "Artes", max: 2, color: colors.pink },
      { key: "ingles", label: "Ingles", max: 10, color: colors.teal },
      { key: "historia", label: "Historia", max: 10, color: colors.green },
      { key: "geografia", label: "Geografia", max: 10, color: colors.olive },
      { key: "filosofia_sociologia", label: "Filo/Socio", max: 10, color: colors.slate },
      { key: "biologia", label: "Biologia", max: 8, color: colors.gold },
      { key: "quimica", label: "Quimica", max: 7, color: colors.red },
      { key: "fisica", label: "Fisica", max: 7, color: colors.coral },
      { key: "matematica", label: "Matematica", max: 8, color: colors.blue }
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
      { key: "portugues", label: "Portugues", max: 10, color: colors.blue },
      { key: "matematica", label: "Matematica", max: 10, color: colors.coral },
      { key: "geografia", label: "Geografia", max: 5, color: colors.olive },
      { key: "historia", label: "Historia", max: 5, color: colors.green },
      { key: "ingles", label: "Ingles", max: 5, color: colors.teal },
      { key: "fisica", label: "Fisica", max: 5, color: colors.gold },
      { key: "disc_quimica", label: "Disc. Quimica", max: 4, color: colors.red, countsTowardTotal: false },
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
      { key: "portugues", label: "Portugues", max: 10, color: colors.blue },
      { key: "ingles", label: "Ingles", max: 10, color: colors.teal },
      { key: "historia", label: "Historia", max: 10, color: colors.green },
      { key: "geografia", label: "Geografia", max: 10, color: colors.olive },
      { key: "biologia", label: "Biologia", max: 10, color: colors.gold },
      { key: "quimica", label: "Quimica", max: 10, color: colors.red },
      { key: "fisica", label: "Fisica", max: 10, color: colors.coral },
      { key: "matematica", label: "Matematica", max: 10, color: colors.blue }
    ]
  },
  {
    id: "unifesp",
    label: "UNIFESP",
    totalMax: 45,
    seed: [],
    placeholder: "Ex: UNIFESP 2026 - complementares",
    note: "Provas complementares sem redacao: 25 objetivas + 20 especificas",
    sections: [
      { key: "portugues", label: "Portugues", max: 15, color: colors.blue },
      { key: "ingles", label: "Ingles", max: 10, color: colors.teal },
      { key: "biologia", label: "Biologia", max: 5, color: colors.gold },
      { key: "quimica", label: "Quimica", max: 5, color: colors.red },
      { key: "fisica", label: "Fisica", max: 5, color: colors.coral },
      { key: "matematica", label: "Matematica", max: 5, color: colors.blue }
    ]
  }
];

const el = {
  status: document.querySelector("#data-status"),
  goalPercent: document.querySelector("#goal-percent"),
  goalTotal: document.querySelector("#goal-total"),
  goalMeterFill: document.querySelector("#goal-meter-fill"),
  chartGoalPill: document.querySelector("#chart-goal-pill"),
  targetList: document.querySelector("#target-list"),
  progressChart: document.querySelector("#progress-chart"),
  examCarousel: document.querySelector("#exam-carousel"),
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
  exportData: document.querySelector("#export-data"),
  importData: document.querySelector("#import-data"),
  importFile: document.querySelector("#import-file"),
  resetData: document.querySelector("#reset-data"),
  boardTabs: [...document.querySelectorAll("[data-board]")]
};

let activeBoard = boardById(localStorage.getItem(ACTIVE_BOARD_KEY)) || boards[0];
let exams = loadExams(activeBoard);
let chartFrame = 0;
const chartWidths = new WeakMap();

function boardById(id) {
  return boards.find((board) => board.id === id);
}

function storageKey(board, prefix = STORAGE_PREFIX) {
  return `${prefix}.${board.id}`;
}

function targetTotal(board = activeBoard) {
  return Math.ceil(board.totalMax * TARGET_RATE);
}

function allSectionKeys() {
  return [...new Set(boards.flatMap((board) => board.sections.map((section) => section.key)))];
}

function nullableScore(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
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

function scoreFromInput(input) {
  const value = nullableScore(input.value);
  const max = Number(input.max || activeBoard.totalMax);
  return value === null ? null : Math.max(0, Math.min(max, Math.round(value)));
}

function computeTotal(exam, board = activeBoard) {
  const countedSections = board.sections.filter((section) => section.countsTowardTotal !== false);
  const scores = countedSections.map((section) => getScore(exam, section.key));
  if (scores.every((score) => score !== null)) {
    return scores.reduce((sum, score) => sum + score, 0);
  }
  return exam.total ?? null;
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
  if (stored) return normalizeExams(stored, board);

  const previous = readStoredArray(storageKey(board, PREVIOUS_STORAGE_PREFIX));
  if (previous) {
    const migrated = normalizeExams(previous, board);
    localStorage.setItem(storageKey(board), JSON.stringify(migrated));
    return migrated;
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

function persist() {
  localStorage.setItem(storageKey(activeBoard), JSON.stringify(exams));
  localStorage.setItem(ACTIVE_BOARD_KEY, activeBoard.id);
}

function setStatus(message, isError = false) {
  el.status.textContent = message;
  el.status.classList.toggle("is-error", isError);
}

function updateStatusForBoard() {
  setStatus(`${activeBoard.label}: dados salvos neste navegador`);
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${Math.round(value)}`;
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
  const padding = { top: 22, right: 22, bottom: 56, left: 46 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const max = activeBoard.totalMax;
  const target = targetTotal();
  const min = data.length ? Math.max(0, Math.min(...data.map((exam) => exam.total), target) - Math.ceil(max * 0.07)) : 0;

  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, padding, width, height, [min, target, max], min, max);

  if (!data.length) {
    drawEmptyChart(ctx, width, height, `Sem provas de ${activeBoard.label}`);
    return;
  }

  const points = data.map((exam, index) => ({
    exam,
    x: padding.left + (plotW * index) / Math.max(data.length - 1, 1),
    y: padding.top + plotH - ((exam.total - min) / (max - min)) * plotH
  }));

  const targetY = padding.top + plotH - ((target - min) / (max - min)) * plotH;
  ctx.strokeStyle = "#1f8a70";
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(padding.left, targetY);
  ctx.lineTo(width - padding.right, targetY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#3772ff";
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  points.forEach((point) => {
    ctx.fillStyle = point.exam.total >= target ? "#1f8a70" : "#df6b57";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#172026";
    ctx.font = "700 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(point.exam.total, point.x, point.y - 11);
  });

  ctx.fillStyle = "#63707a";
  ctx.font = "700 10px system-ui";
  ctx.textAlign = "right";
  points.forEach((point, index) => {
    if (index % Math.ceil(points.length / 6) !== 0 && index !== points.length - 1) return;
    ctx.save();
    ctx.translate(point.x, height - 16);
    ctx.rotate(-0.45);
    ctx.fillText(point.exam.prova, 0, 0);
    ctx.restore();
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
  ctx.strokeStyle = "#dce2e6";
  ctx.fillStyle = "#63707a";
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
  ctx.fillStyle = "#63707a";
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
    <th>Acoes</th>
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
  const secondary = computeSecondaryTotal(exam);
  const max = secondaryMax();
  if (secondary === null || !max) return `${exam.total}/${activeBoard.totalMax}`;
  return `${exam.total}/${activeBoard.totalMax} + ${secondary}/${max}`;
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
      const rows = activeBoard.sections
        .map((section) => {
          const value = getScore(exam, section.key);
          const width = value === null ? 0 : Math.max(2, Math.min(100, (value / section.max) * 100));
          return `
            <div class="area-row">
              <span>${escapeHtml(section.label)}</span>
              <div class="area-track" aria-hidden="true">
                <div class="area-fill" style="width: ${width}%; --area-color: ${section.color};"></div>
              </div>
              <strong>${formatNumber(value)}/${section.max}</strong>
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
          <div class="area-bars">${rows}</div>
        </article>
      `;
    })
    .join("");
}

function renderSecondaryTotal(exam) {
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
  el.goalPercent.textContent = `${Math.round(TARGET_RATE * 100)}%`;
  el.goalTotal.textContent = `${target} / ${activeBoard.totalMax}`;
  el.goalMeterFill.style.width = `${Math.round(TARGET_RATE * 100)}%`;
  el.chartGoalPill.textContent = `Meta ${target}`;

  const sectionTargets = activeBoard.sections
    .map((section) => `
      <div>
        <span>${escapeHtml(section.label)}</span>
        <strong>${Math.ceil(section.max * TARGET_RATE)}/${section.max}</strong>
        <small>${section.countsTowardTotal === false ? "contagem separada" : "referencia de 92% nesse bloco"}</small>
      </div>
    `)
    .join("");

  el.targetList.innerHTML = `
    <div>
      <span>Total</span>
      <strong>${target}/${activeBoard.totalMax}</strong>
      <small>${activeBoard.note}</small>
    </div>
    ${sectionTargets}
  `;
}

function renderScoreFields(exam = null) {
  el.scoreFields.innerHTML = activeBoard.sections
    .map((section) => {
      const value = exam ? getScore(exam, section.key) : null;
      return `
        <label>
          ${escapeHtml(section.label)}
          <input
            data-score-key="${section.key}"
            name="${section.key}"
            type="number"
            inputmode="numeric"
            min="0"
            max="${section.max}"
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

function saveForm(event) {
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
  setStatus(`${activeBoard.label}: prova salva neste navegador`);
}

function handleTableClick(event) {
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
    render();
    setStatus(`${activeBoard.label}: prova excluida deste navegador`);
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(exams, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${activeBoard.id}-backup.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus(`${activeBoard.label}: backup exportado`);
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result || "[]"));
      if (!Array.isArray(imported)) throw new Error("Formato invalido");
      exams = normalizeExams(imported);
      persist();
      render();
      resetForm();
      setStatus(`${activeBoard.label}: backup importado`);
    } catch {
      setStatus("Arquivo de backup invalido", true);
    } finally {
      el.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

function resetData() {
  const message = activeBoard.seed.length
    ? `Restaurar a base inicial de ${activeBoard.label} e substituir os dados salvos neste navegador?`
    : `Limpar as provas de ${activeBoard.label} salvas neste navegador?`;
  if (!window.confirm(message)) return;
  exams = cloneSeed(activeBoard);
  persist();
  render();
  resetForm();
  setStatus(activeBoard.seed.length ? `${activeBoard.label}: base inicial restaurada` : `${activeBoard.label}: tela limpa`);
}

function switchBoard(boardId) {
  const nextBoard = boardById(boardId);
  if (!nextBoard || nextBoard.id === activeBoard.id) return;
  activeBoard = nextBoard;
  exams = loadExams(activeBoard);
  localStorage.setItem(ACTIVE_BOARD_KEY, activeBoard.id);
  resetForm();
  render();
  updateStatusForBoard();
}

function render() {
  updateBoardTabs();
  updateFormForBoard();
  renderTargets();
  drawCharts(true);
  renderExamCarousel();
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

el.form.addEventListener("submit", saveForm);
el.cancelEdit.addEventListener("click", resetForm);
el.table.addEventListener("click", handleTableClick);
el.exportData.addEventListener("click", exportData);
el.importData.addEventListener("click", () => el.importFile.click());
el.importFile.addEventListener("change", () => importData(el.importFile.files?.[0]));
el.resetData.addEventListener("click", resetData);

el.boardTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchBoard(tab.dataset.board));
});

window.addEventListener("resize", scheduleChartResize, { passive: true });

render();
updateFormTotal();
updateStatusForBoard();
