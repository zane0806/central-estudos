const SHEET_ID = "1RSMEdlBCzONSl7tFpsywUGUzrFRjjh8oOYYBAWnCi4E";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
const TARGET_TOTAL = 166;
const TARGET_PERCENT = 0.92;

const fallbackSummaryRows = [
  ["Prova", "Humanas (G+F+H)", "Linguagens (L+I)", "Matematica (M)", "Natureza (F+Q+B)", "Coluna1", "OBS"],
  ["ENEM 2019", 41, 34, 36, 34, 145, ""],
  ["ENEM 2024 PPL", 38, 34, 38, 35, 145, ""],
  ["ENEM 2023 PPL", 43, 39, 35, 37, 154, ""],
  ["ENEM 2018", "", "", 39, 34, 149, ""],
  ["ENEM 2022 PPL", "", "", 37, 36, 149, ""],
  ["ENEM 2022", 38, 34, 37, 34, 143, ""],
  ["ENEM 2021", 40, 36, 42, 36, 154, "feitas em 2026"],
  ["ENEM 2024", 44, 40, 41, 42, 167, ""],
  ["ENEM 2019 PPL", 42, 40, 42, 40, 164, ""],
  ["ENEM 2020 PPL", "", "", 38, 43, "", ""],
  ["ENEM 2021 PPL", "", "", 42, 42, "", ""],
  ["ENEM S. Poli", 37, 39, 41, 38, 155, ""]
];

const fallbackDetailRows = [
  ["Dia", "Prova", "G", "F", "H", "L", "I", "Total (T)", "ORDEM", "Observacoes"],
  ["Dia 1", "ENEM 2019", 0, 2, 2, 2, 9, 75, 1, ""],
  ["Dia 1", "ENEM 2021", 0, 1, 4, 9, 0, 76, 4, ""],
  ["Dia 1", "ENEM 2022", 3, 2, 2, 11, "", 72, 5, ""],
  ["Dia 1", "ENEM 2024", 0, 1, 0, 5, 0, 84, 6, ""],
  ["Dia 1", "ENEM 2023 PPL", "", "", 2, 6, "", 82, 3, ""],
  ["Dia 1", "ENEM 2024 PPL", "", "", 7, 11, "", 72, 2, ""],
  ["Dia", "Prova", "M", "F", "Q", "B", "Total (T)", "ORDEM", "Observacoes"],
  ["Dia 2", "ENEM 2018", 6, 5, 5, 1, 73, 4, ""],
  ["Dia 2", "ENEM 2019", 9, 7, 3, 1, 70, 3, ""],
  ["Dia 2", "ENEM 2021", 3, 2, 1, 6, 78, 7, ""],
  ["Dia 2", "ENEM 2022* sr", 8, 4, 6, 1, 71, 6, ""],
  ["Dia 2", "ENEM 2024", 4, 1, 1, 1, 83, 8, ""],
  ["Dia 2", "ENEM 2019 PPL", 3, 1, 3, 1, 82, 9, ""],
  ["Dia 2", "ENEM 2020 PPL", 6, 0, 2, 0, 82, 10, ""],
  ["Dia 2", "ENEM 2022 PPL*", 8, 4, 4, 1, 73, 5, ""],
  ["Dia 2", "ENEM 2023 PPL", 10, 4, 4, 0, 72, 2, ""],
  ["Dia 2", "ENEM 2024 PPL", 7, 4, 4, 2, 73, 1, ""]
];

const el = {
  status: document.querySelector("#data-status"),
  bestExam: document.querySelector("#best-exam"),
  bestExamDetail: document.querySelector("#best-exam-detail"),
  averageScore: document.querySelector("#average-score"),
  goalGap: document.querySelector("#goal-gap"),
  recentTrend: document.querySelector("#recent-trend"),
  progressChart: document.querySelector("#progress-chart"),
  areaChart: document.querySelector("#area-chart"),
  table: document.querySelector("#exam-table")
};

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeName(name) {
  return String(name || "")
    .replace(/\*/g, "")
    .replace(/\s+sr$/i, "")
    .trim();
}

function rowsFromGvizTable(table) {
  return table.rows.map((row) => row.c.map((cell) => (cell ? cell.v : "")));
}

async function loadSheet(sheetName) {
  return new Promise((resolve, reject) => {
    const callbackName = `__zaneSheet${Date.now()}${Math.random().toString(36).slice(2)}`;
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Tempo esgotado ao ler a planilha."));
    }, 12000);
    const script = document.createElement("script");
    const params = new URLSearchParams({
      tqx: `out:json;responseHandler:${callbackName}`,
      sheet: sheetName,
      cacheBust: String(Date.now())
    });

    function cleanup() {
      window.clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (payload) => {
      cleanup();
      if (payload.status === "error") {
        reject(new Error(payload.errors?.[0]?.detailed_message || "Nao foi possivel ler a planilha publica."));
        return;
      }
      resolve(rowsFromGvizTable(payload.table));
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Nao foi possivel conectar a planilha."));
    };

    script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?${params}`;
    document.head.append(script);
  });
}

function cleanSummaryRows(rows) {
  return rows
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => (row[0] === "" || row[0] === null ? row.slice(1) : row).filter((_, index) => index < 7))
    .filter((row) => row[0] && row[0] !== "Prova")
    .map((row) => {
      const humanas = toNumber(row[1]);
      const linguagens = toNumber(row[2]);
      const matematica = toNumber(row[3]);
      const natureza = toNumber(row[4]);
      const explicitTotal = toNumber(row[5]);
      const computedTotal = [humanas, linguagens, matematica, natureza]
        .filter((value) => value !== null)
        .reduce((sum, value) => sum + value, 0);
      const hasComputedTotal = [humanas, linguagens, matematica, natureza].some((value) => value !== null);

      return {
        prova: String(row[0]).trim(),
        humanas,
        linguagens,
        matematica,
        natureza,
        total: explicitTotal ?? (hasComputedTotal ? computedTotal : null),
        obs: row[6] || ""
      };
    })
    .filter((exam) => exam.prova);
}

function cleanDetailRows(rows) {
  return rows
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => (row[0] === "" || row[0] === null ? row.slice(1) : row))
    .filter((row) => String(row[0] || "").startsWith("Dia"))
    .filter((row) => row[1] && row[1] !== "Prova")
    .map((row) => ({
      dia: row[0],
      prova: normalizeName(row[1]),
      total: toNumber(row[0] === "Dia 1" ? row[7] : row[6])
    }))
    .filter((row) => row.total !== null);
}

function mergeDetailTotals(exams, details) {
  const byExam = new Map(exams.map((exam) => [normalizeName(exam.prova), exam]));
  details.forEach((detail) => {
    const exam = byExam.get(detail.prova);
    if (!exam) return;
    if (detail.dia === "Dia 1") exam.dia1 = detail.total;
    if (detail.dia === "Dia 2") exam.dia2 = detail.total;
  });
  return exams;
}

function formatNumber(value, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${Math.round(value)}${suffix}`;
}

function statusFor(total) {
  if (total >= TARGET_TOTAL) return { label: "meta batida", className: "badge--hit" };
  if (total >= TARGET_TOTAL - 8) return { label: "perto", className: "badge--near" };
  return { label: "subindo", className: "badge--low" };
}

function updateMetrics(exams) {
  const withTotal = exams.filter((exam) => exam.total !== null);
  const best = withTotal.reduce((winner, exam) => (exam.total > winner.total ? exam : winner), withTotal[0]);
  const average = withTotal.reduce((sum, exam) => sum + exam.total, 0) / withTotal.length;
  const latest = withTotal.at(-1);
  const previous = withTotal.at(-2);
  const gap = latest ? TARGET_TOTAL - latest.total : null;
  const trend = latest && previous ? latest.total - previous.total : null;

  el.bestExam.textContent = best ? best.prova : "--";
  el.bestExamDetail.textContent = best ? `${best.total}/180 (${Math.round((best.total / 180) * 100)}%)` : "Aguardando dados";
  el.averageScore.textContent = formatNumber(average);
  el.goalGap.textContent = gap === null ? "--" : gap <= 0 ? `+${Math.abs(gap)}` : `${gap}`;
  el.recentTrend.textContent = trend === null ? "--" : trend >= 0 ? `+${trend}` : String(trend);
}

function drawProgressChart(canvas, exams) {
  const ctx = prepareCanvas(canvas);
  const data = exams.filter((exam) => exam.total !== null);
  const padding = { top: 22, right: 22, bottom: 56, left: 46 };
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const max = 180;
  const min = Math.max(0, Math.min(...data.map((exam) => exam.total), TARGET_TOTAL) - 12);

  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, padding, width, height, [min, TARGET_TOTAL, max], min, max);

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

function drawAreaChart(canvas, exams) {
  const ctx = prepareCanvas(canvas);
  const keys = [
    ["humanas", "Humanas", "#1f8a70"],
    ["linguagens", "Linguagens", "#3772ff"],
    ["matematica", "Matematica", "#df6b57"],
    ["natureza", "Natureza", "#d09b2c"]
  ];
  const values = keys.map(([key, label, color]) => {
    const available = exams.map((exam) => exam[key]).filter((value) => value !== null);
    const average = available.reduce((sum, value) => sum + value, 0) / available.length;
    return { label, color, value: average || 0 };
  });

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = { top: 20, right: 18, bottom: 40, left: 34 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const barGap = 16;
  const barW = (plotW - barGap * (values.length - 1)) / values.length;

  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, padding, width, height, [0, 21, 42, 45], 0, 45);

  values.forEach((item, index) => {
    const x = padding.left + index * (barW + barGap);
    const h = (item.value / 45) * plotH;
    const y = padding.top + plotH - h;

    ctx.fillStyle = item.color;
    roundedRect(ctx, x, y, barW, h, 6);
    ctx.fill();

    ctx.fillStyle = "#172026";
    ctx.font = "800 13px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(Math.round(item.value), x + barW / 2, y - 8);

    ctx.fillStyle = "#63707a";
    ctx.font = "700 11px system-ui";
    ctx.fillText(item.label, x + barW / 2, height - 14);
  });
}

function prepareCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = Number(canvas.getAttribute("height"));
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
    const y = padding.top + plotH - ((tick - min) / (max - min)) * plotH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(tick, padding.left - 8, y + 3);
  });
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

function renderTable(exams) {
  el.table.innerHTML = exams
    .filter((exam) => exam.total !== null)
    .map((exam) => {
      const status = statusFor(exam.total);
      return `
        <tr>
          <td>${exam.prova}</td>
          <td>${formatNumber(exam.humanas)}</td>
          <td>${formatNumber(exam.linguagens)}</td>
          <td>${formatNumber(exam.matematica)}</td>
          <td>${formatNumber(exam.natureza)}</td>
          <td>${exam.total}/180</td>
          <td><span class="badge ${status.className}">${status.label}</span></td>
        </tr>
      `;
    })
    .join("");
}

function render(exams) {
  updateMetrics(exams);
  drawProgressChart(el.progressChart, exams);
  drawAreaChart(el.areaChart, exams);
  renderTable(exams);

  window.onresize = () => {
    drawProgressChart(el.progressChart, exams);
    drawAreaChart(el.areaChart, exams);
  };
}

async function boot() {
  try {
    const [summaryRows, detailRows] = await Promise.all([loadSheet("Página1"), loadSheet("Página2")]);
    const exams = mergeDetailTotals(cleanSummaryRows(summaryRows), cleanDetailRows(detailRows));
    render(exams);
    el.status.textContent = "Planilha viva conectada";
  } catch (error) {
    const exams = mergeDetailTotals(cleanSummaryRows(fallbackSummaryRows), cleanDetailRows(fallbackDetailRows));
    render(exams);
    el.status.textContent = "Usando snapshot: publique a planilha na web para atualizar ao vivo";
    el.status.classList.add("is-error");
    console.warn(error);
  }
}

document.querySelectorAll("a[href='#']").forEach((link) => {
  link.href = SHEET_URL;
});

boot();
