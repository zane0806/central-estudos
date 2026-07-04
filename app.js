const LEGACY_STORAGE_KEY = "central-estudos.exams.v2";
const STORAGE_PREFIX = "central-estudos.board.v1";
const ACTIVE_BOARD_KEY = "central-estudos.active-board.v1";
const TARGET_RATE = 0.92;

document.querySelector(".summary-grid")?.remove();

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
      { key: "humanas", label: "Humanas", max: 45, color: "#1f8a70" },
      { key: "linguagens", label: "Linguagens", max: 45, color: "#3772ff" },
      { key: "matematica", label: "Matematica", max: 45, color: "#df6b57" },
      { key: "natureza", label: "Natureza", max: 45, color: "#d09b2c" }
    ]
  },
  {
    id: "unesp",
    label: "UNESP",
    totalMax: 90,
    seed: [],
    placeholder: "Ex: UNESP 2025 - 1a fase",
    note: "1a fase: Conhecimentos Gerais",
    sections: [
      { key: "humanas", label: "Humanas", max: 30, color: "#1f8a70" },
      { key: "linguagens", label: "Linguagens", max: 30, color: "#3772ff" },
      { key: "matematica", label: "Nat. + Mat.", max: 30, color: "#df6b57" }
    ]
  },
  {
    id: "famema",
    label: "FAMEMA",
    totalMax: 48,
    seed: [],
    placeholder: "Ex: FAMEMA 2026",
    note: "fase unica sem redacao: 8 discursivas + 40 objetivas",
    sections: [
      { key: "humanas", label: "Humanas", max: 10, color: "#1f8a70" },
      { key: "linguagens", label: "Linguagens", max: 15, color: "#3772ff" },
      { key: "matematica", label: "Mat. + Fis.", max: 15, color: "#df6b57" },
      { key: "natureza", label: "Bio/Qui disc.", max: 8, color: "#d09b2c" }
    ]
  },
  {
    id: "famerp",
    label: "FAMERP",
    totalMax: 80,
    seed: [],
    placeholder: "Ex: FAMERP 2026 - Conhecimentos Gerais",
    note: "Conhecimentos Gerais",
    sections: [
      { key: "humanas", label: "Humanas", max: 20, color: "#1f8a70" },
      { key: "linguagens", label: "Linguagens", max: 20, color: "#3772ff" },
      { key: "matematica", label: "Mat. + Fis.", max: 20, color: "#df6b57" },
      { key: "natureza", label: "Bio + Qui.", max: 20, color: "#d09b2c" }
    ]
  },
  {
    id: "unifesp",
    label: "UNIFESP",
    totalMax: 155,
    seed: [],
    placeholder: "Ex: UNIFESP 2026 - provas complementares",
    note: "provas complementares sem ENEM",
    sections: [
      { key: "linguagens", label: "Ling. + Redacao", max: 75, color: "#3772ff" },
      { key: "natureza", label: "Especificas", max: 80, color: "#d09b2c" }
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
  formTitle: document.querySelector("#entry-title"),
  id: document.querySelector("#exam-id"),
  prova: document.querySelector("#exam-name"),
  humanas: document.querySelector("#score-humanas"),
  linguagens: document.querySelector("#score-linguagens"),
  matematica: document.querySelector("#score-matematica"),
  natureza: document.querySelector("#score-natureza"),
  obs: document.querySelector("#exam-notes"),
  formTotal: document.querySelector("#form-total"),
  saveExam: document.querySelector("#save-exam"),
  cancelEdit: document.querySelector("#cancel-edit"),
  exportData: document.querySelector("#export-data"),
  importData: document.querySelector("#import-data"),
  importFile: document.querySelector("#import-file"),
  resetData: document.querySelector("#reset-data"),
  boardTabs: [...document.querySelectorAll("[data-board]")],
  labels: {
    humanas: document.querySelector("#label-humanas"),
    linguagens: document.querySelector("#label-linguagens"),
    matematica: document.querySelector("#label-matematica"),
    natureza: document.querySelector("#label-natureza")
  }
};

let activeBoard = boardById(localStorage.getItem(ACTIVE_BOARD_KEY)) || boards[0];
let exams = loadExams(activeBoard);
let chartFrame = 0;
const chartWidths = new WeakMap();

function boardById(id) {
  return boards.find((board) => board.id === id);
}

function storageKey(board) {
  return `${STORAGE_PREFIX}.${board.id}`;
}

function targetTotal(board = activeBoard) {
  return Math.ceil(board.totalMax * TARGET_RATE);
}

function scoreKeys() {
  return ["humanas", "linguagens", "matematica", "natureza"];
}

function sectionByKey(board, key) {
  return board.sections.find((section) => section.key === key);
}

function withId(exam) {
  return {
    id: exam.id || crypto.randomUUID(),
    prova: String(exam.prova || "").trim(),
    humanas: nullableScore(exam.humanas),
    linguagens: nullableScore(exam.linguagens),
    matematica: nullableScore(exam.matematica),
    natureza: nullableScore(exam.natureza),
    total: nullableScore(exam.total),
    obs: String(exam.obs || "").trim()
  };
}

function cloneSeed(board) {
  return board.seed.map((exam) => withId({ ...exam, id: crypto.randomUUID() }));
}

function nullableScore(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function scoreFromInput(input) {
  const value = nullableScore(input.value);
  const max = Number(input.max || activeBoard.totalMax);
  return value === null ? null : Math.max(0, Math.min(max, Math.round(value)));
}

function computeTotal(exam, board = activeBoard) {
  const scores = board.sections.map((section) => exam[section.key]);
  if (scores.every((score) => score !== null)) {
    return scores.reduce((sum, score) => sum + score, 0);
  }
  return exam.total ?? null;
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
          ${columns.map((section) => `<td>${formatNumber(exam[section.key])}</td>`).join("")}
          <td>${exam.total}/${activeBoard.totalMax}</td>
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

function renderExamCarousel() {
  const areas = activeBoard.sections;
  const visibleExams = exams.map((exam) => ({ ...exam, total: computeTotal(exam) })).filter((exam) => exam.total !== null);

  if (!visibleExams.length) {
    el.examCarousel.innerHTML = `<div class="exam-empty">Sem provas cadastradas em ${activeBoard.label}</div>`;
    return;
  }

  el.examCarousel.innerHTML = visibleExams
    .map((exam) => {
      const status = statusFor(exam.total);
      const rows = areas
        .map((section) => {
          const value = exam[section.key];
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
            </div>
          </div>
          <div class="area-bars">${rows}</div>
        </article>
      `;
    })
    .join("");
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
        <small>referencia de 92% nesse bloco</small>
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

function updateFormForBoard() {
  el.prova.placeholder = activeBoard.placeholder;
  if (!el.id.value) el.formTitle.textContent = "Nova prova";

  scoreKeys().forEach((key) => {
    const input = el[key];
    const label = input.closest("label");
    const section = sectionByKey(activeBoard, key);

    label.hidden = !section;
    input.disabled = !section;
    input.required = Boolean(section);
    input.max = section ? String(section.max) : "0";
    input.placeholder = section ? `0-${section.max}` : "";

    if (section) {
      el.labels[key].textContent = section.label;
    } else {
      input.value = "";
    }
  });
}

function updateFormTotal() {
  const draft = readForm();
  const total = computeTotal(draft) ?? 0;
  el.formTotal.textContent = `${total}/${activeBoard.totalMax}`;
}

function readForm() {
  return {
    id: el.id.value || crypto.randomUUID(),
    prova: el.prova.value.trim(),
    humanas: scoreFromInput(el.humanas),
    linguagens: scoreFromInput(el.linguagens),
    matematica: scoreFromInput(el.matematica),
    natureza: scoreFromInput(el.natureza),
    obs: el.obs.value.trim()
  };
}

function resetForm() {
  el.form.reset();
  el.id.value = "";
  el.formTitle.textContent = "Nova prova";
  el.saveExam.textContent = "Salvar prova";
  el.cancelEdit.hidden = true;
  updateFormForBoard();
  updateFormTotal();
}

function fillForm(exam) {
  el.id.value = exam.id;
  el.prova.value = exam.prova;
  el.humanas.value = exam.humanas ?? "";
  el.linguagens.value = exam.linguagens ?? "";
  el.matematica.value = exam.matematica ?? "";
  el.natureza.value = exam.natureza ?? "";
  el.obs.value = exam.obs ?? "";
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

[el.humanas, el.linguagens, el.matematica, el.natureza].forEach((input) => {
  input.addEventListener("input", updateFormTotal);
});

window.addEventListener("resize", scheduleChartResize, { passive: true });

render();
updateFormTotal();
updateStatusForBoard();
