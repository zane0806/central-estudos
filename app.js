const STORAGE_KEY = "central-estudos.exams.v2";
const TARGET_TOTAL = 166;

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
].map(withId);

const el = {
  status: document.querySelector("#data-status"),
  bestExam: document.querySelector("#best-exam"),
  bestExamDetail: document.querySelector("#best-exam-detail"),
  averageScore: document.querySelector("#average-score"),
  goalGap: document.querySelector("#goal-gap"),
  recentTrend: document.querySelector("#recent-trend"),
  progressChart: document.querySelector("#progress-chart"),
  examCarousel: document.querySelector("#exam-carousel"),
  table: document.querySelector("#exam-table"),
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
  resetData: document.querySelector("#reset-data")
};

let exams = loadExams();
let chartFrame = 0;
const chartWidths = new WeakMap();

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

function nullableScore(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function scoreFromInput(input) {
  const value = nullableScore(input.value);
  return value === null ? null : Math.max(0, Math.min(45, Math.round(value)));
}

function computeTotal(exam) {
  const scores = [exam.humanas, exam.linguagens, exam.matematica, exam.natureza];
  if (scores.every((score) => score !== null)) {
    return scores.reduce((sum, score) => sum + score, 0);
  }
  return exam.total ?? null;
}

function loadExams() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!Array.isArray(stored)) return seedExams;
    return stored.map(withId).filter((exam) => exam.prova && computeTotal(exam) !== null);
  } catch {
    return seedExams;
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
}

function setStatus(message, isError = false) {
  el.status.textContent = message;
  el.status.classList.toggle("is-error", isError);
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
  if (total >= TARGET_TOTAL) return { label: "meta batida", className: "badge--hit" };
  if (total >= TARGET_TOTAL - 8) return { label: "perto", className: "badge--near" };
  return { label: "subindo", className: "badge--low" };
}

function updateMetrics() {
  const withTotal = exams.map((exam) => ({ ...exam, total: computeTotal(exam) })).filter((exam) => exam.total !== null);

  if (!withTotal.length) {
    el.bestExam.textContent = "--";
    el.bestExamDetail.textContent = "Aguardando dados";
    el.averageScore.textContent = "--";
    el.goalGap.textContent = "--";
    el.recentTrend.textContent = "--";
    return;
  }

  const best = withTotal.reduce((winner, exam) => (exam.total > winner.total ? exam : winner), withTotal[0]);
  const average = withTotal.reduce((sum, exam) => sum + exam.total, 0) / withTotal.length;
  const latest = withTotal.at(-1);
  const previous = withTotal.at(-2);
  const gap = TARGET_TOTAL - latest.total;
  const trend = latest && previous ? latest.total - previous.total : null;

  el.bestExam.textContent = best.prova;
  el.bestExamDetail.textContent = `${best.total}/180 (${Math.round((best.total / 180) * 100)}%)`;
  el.averageScore.textContent = formatNumber(average);
  el.goalGap.textContent = gap <= 0 ? `+${Math.abs(gap)}` : `${gap}`;
  el.recentTrend.textContent = trend === null ? "--" : trend >= 0 ? `+${trend}` : String(trend);
}

function drawProgressChart(canvas) {
  const ctx = prepareCanvas(canvas);
  const data = exams.map((exam) => ({ ...exam, total: computeTotal(exam) })).filter((exam) => exam.total !== null);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = { top: 22, right: 22, bottom: 56, left: 46 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const max = 180;
  const min = data.length ? Math.max(0, Math.min(...data.map((exam) => exam.total), TARGET_TOTAL) - 12) : 0;

  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, padding, width, height, [min, TARGET_TOTAL, max], min, max);

  if (!data.length) {
    drawEmptyChart(ctx, width, height, "Sem provas cadastradas");
    return;
  }

  const points = data.map((exam, index) => ({
    exam,
    x: padding.left + (plotW * index) / Math.max(data.length - 1, 1),
    y: padding.top + plotH - ((exam.total - min) / (max - min)) * plotH
  }));

  const targetY = padding.top + plotH - ((TARGET_TOTAL - min) / (max - min)) * plotH;
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
    ctx.fillStyle = point.exam.total >= TARGET_TOTAL ? "#1f8a70" : "#df6b57";
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

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function renderTable() {
  el.table.innerHTML = exams
    .map((exam) => ({ ...exam, total: computeTotal(exam) }))
    .filter((exam) => exam.total !== null)
    .map((exam) => {
      const status = statusFor(exam.total);
      return `
        <tr>
          <td>${escapeHtml(exam.prova)}</td>
          <td>${formatNumber(exam.humanas)}</td>
          <td>${formatNumber(exam.linguagens)}</td>
          <td>${formatNumber(exam.matematica)}</td>
          <td>${formatNumber(exam.natureza)}</td>
          <td>${exam.total}/180</td>
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
  const areas = [
    ["humanas", "Humanas", "#1f8a70"],
    ["linguagens", "Linguagens", "#3772ff"],
    ["matematica", "Matematica", "#df6b57"],
    ["natureza", "Natureza", "#d09b2c"]
  ];
  const visibleExams = exams.map((exam) => ({ ...exam, total: computeTotal(exam) })).filter((exam) => exam.total !== null);

  if (!visibleExams.length) {
    el.examCarousel.innerHTML = `<div class="exam-empty">Sem provas cadastradas</div>`;
    return;
  }

  el.examCarousel.innerHTML = visibleExams
    .map((exam) => {
      const status = statusFor(exam.total);
      const rows = areas
        .map(([key, label, color]) => {
          const value = exam[key];
          const width = value === null ? 0 : Math.max(2, Math.min(100, (value / 45) * 100));
          return `
            <div class="area-row">
              <span>${label}</span>
              <div class="area-track" aria-hidden="true">
                <div class="area-fill" style="width: ${width}%; --area-color: ${color};"></div>
              </div>
              <strong>${formatNumber(value)}</strong>
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
              <span>/180</span>
            </div>
          </div>
          <div class="area-bars">${rows}</div>
        </article>
      `;
    })
    .join("");
}

function updateFormTotal() {
  const draft = readForm();
  const total = computeTotal(draft) ?? 0;
  el.formTotal.textContent = `${total}/180`;
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
  setStatus("Prova salva neste navegador");
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
    setStatus("Prova excluida deste navegador");
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(exams, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "central-estudos-backup.json";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("Backup exportado");
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result || "[]"));
      if (!Array.isArray(imported)) throw new Error("Formato invalido");
      exams = imported.map(withId).filter((exam) => exam.prova && computeTotal(exam) !== null);
      persist();
      render();
      resetForm();
      setStatus("Backup importado");
    } catch {
      setStatus("Arquivo de backup invalido", true);
    } finally {
      el.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!window.confirm("Restaurar a base inicial e substituir os dados salvos neste navegador?")) return;
  exams = seedExams.map((exam) => ({ ...exam, id: crypto.randomUUID() }));
  persist();
  render();
  resetForm();
  setStatus("Base inicial restaurada");
}

function render() {
  updateMetrics();
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

[el.humanas, el.linguagens, el.matematica, el.natureza].forEach((input) => {
  input.addEventListener("input", updateFormTotal);
});

window.addEventListener("resize", scheduleChartResize, { passive: true });

render();
updateFormTotal();
