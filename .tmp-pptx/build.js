// СОСПП — Внедрение базы знаний и RAG. Editorial Engineering presentation.
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
pres.title = "СОСПП — Внедрение базы знаний и RAG";
pres.author = "Veretennikov Studio";
pres.company = "Veretennikov Studio";

// ── Palette (no # prefix per pptxgenjs requirement) ──────────────────────
const C = {
  paper:  "F9F7F2",
  ink:    "0F1A2E",
  ink2:   "41506B",
  ink3:   "8E93A0",
  ink4:   "CDCABF",
  rule:   "DAD6CC",
  cobalt: "1F4DDE",
};
const FONT_SERIF = "Georgia";
const FONT_SANS  = "Calibri";
const FONT_MONO  = "Consolas";

const W = 10, H = 5.625;
const TOTAL = 23;

// ── helpers ──────────────────────────────────────────────────────────────
function chrome(slide, n, cover = false) {
  slide.background = { color: C.paper };

  // registration crosses at corners
  const regs = [
    [0.28, 0.28], [W - 0.28, 0.28],
    [0.28, H - 0.28], [W - 0.28, H - 0.28],
  ];
  for (const [x, y] of regs) {
    slide.addShape(pres.shapes.LINE, {
      x: x - 0.06, y, w: 0.12, h: 0,
      line: { color: C.ink3, width: 0.6 },
    });
    slide.addShape(pres.shapes.LINE, {
      x, y: y - 0.06, w: 0, h: 0.12,
      line: { color: C.ink3, width: 0.6 },
    });
  }

  // top mono labels
  slide.addText("VERETENNIKOV STUDIO", {
    x: 0.45, y: 0.30, w: 5, h: 0.22,
    fontFace: FONT_MONO, fontSize: 8, color: C.ink3,
    charSpacing: 4, margin: 0,
  });
  slide.addText(cover ? "ВНУТРЕННИЙ ДОКУМЕНТ" : `СЛАЙД ${String(n).padStart(2, "0")} / ${TOTAL}`, {
    x: W - 5.45, y: 0.30, w: 5, h: 0.22,
    fontFace: FONT_MONO, fontSize: 8, color: C.ink3, charSpacing: 4,
    align: "right", margin: 0,
  });

  // top hairline (under header text)
  slide.addShape(pres.shapes.LINE, {
    x: 0.45, y: 0.62, w: W - 0.9, h: 0,
    line: { color: C.rule, width: 0.75 },
  });

  // bottom hairline + footer
  slide.addShape(pres.shapes.LINE, {
    x: 0.45, y: H - 0.55, w: W - 0.9, h: 0,
    line: { color: C.rule, width: 0.75 },
  });
  slide.addText("СОСПП · ПЛАН ВНЕДРЕНИЯ БАЗЫ ЗНАНИЙ", {
    x: 0.45, y: H - 0.45, w: 5, h: 0.22,
    fontFace: FONT_MONO, fontSize: 8, color: C.ink3, charSpacing: 3, margin: 0,
  });
  slide.addText("2026", {
    x: W - 5.45, y: H - 0.45, w: 5, h: 0.22,
    fontFace: FONT_MONO, fontSize: 8, color: C.ink3, charSpacing: 3,
    align: "right", margin: 0,
  });
}

function title(slide, text, options = {}) {
  slide.addText(text, {
    x: 0.45, y: 0.85, w: W - 0.9, h: 0.7,
    fontFace: FONT_SERIF, fontSize: 26, color: C.ink, bold: false,
    align: "left", valign: "top", margin: 0,
    ...options,
  });
}

function meta(slide, text, y = 1.5) {
  slide.addText(text, {
    x: 0.45, y, w: W - 0.9, h: 0.3,
    fontFace: FONT_MONO, fontSize: 10, color: C.ink2,
    charSpacing: 2, margin: 0,
  });
}

function bullets(slide, items, opts = {}) {
  const { x = 0.45, y = 2.0, w = W - 0.9, h = 2.7, fontSize = 13 } = opts;
  const lines = items.map((t, i) => ({
    text: t,
    options: {
      bullet: { code: "2022" }, // standard bullet
      breakLine: i < items.length - 1,
      paraSpaceAfter: 4,
    },
  }));
  slide.addText(lines, {
    x, y, w, h,
    fontFace: FONT_SANS, fontSize, color: C.ink, valign: "top",
    margin: 0,
  });
}

function caption(slide, text, opts = {}) {
  const { y = H - 0.85, color = C.ink3, cobalt = false, size = 10 } = opts;
  slide.addText(text, {
    x: 0.45, y, w: W - 0.9, h: 0.25,
    fontFace: FONT_MONO, fontSize: size, color: cobalt ? C.cobalt : color,
    charSpacing: 1, margin: 0,
  });
}

function hairlineH(slide, y, opts = {}) {
  const { x = 0.45, w = W - 0.9, color = C.rule, dash = null } = opts;
  const line = { color, width: 0.6 };
  if (dash) line.dashType = dash;
  slide.addShape(pres.shapes.LINE, { x, y, w, h: 0, line });
}

// ── SLIDE 1 — COVER ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 1, true);
  // Mini index top of body
  s.addText("ВНУТРЕННИЙ ДОКУМЕНТ · 23 СЛАЙДА", {
    x: 0.45, y: 1.5, w: 9.1, h: 0.3,
    fontFace: FONT_MONO, fontSize: 9, color: C.ink3, charSpacing: 3, margin: 0,
  });
  // Title
  s.addText("Внедрение базы знаний\nи RAG-инфраструктуры", {
    x: 0.45, y: 2.0, w: 9.1, h: 1.6,
    fontFace: FONT_SERIF, fontSize: 38, color: C.ink, bold: false,
    align: "left", valign: "top", margin: 0,
  });
  // Subtitle
  s.addText("Свердловский областной союз промышленников и предпринимателей (СОСПП)", {
    x: 0.45, y: 3.5, w: 9.1, h: 0.4,
    fontFace: FONT_SANS, fontSize: 16, color: C.ink2,
    margin: 0,
  });
  s.addText("Пошаговый план реализации", {
    x: 0.45, y: 3.95, w: 9.1, h: 0.4,
    fontFace: FONT_SANS, fontSize: 16, italic: true, color: C.ink2,
    margin: 0,
  });
  // cobalt accent dot
  s.addShape(pres.shapes.OVAL, {
    x: 0.45, y: 4.6, w: 0.10, h: 0.10,
    fill: { color: C.cobalt }, line: { color: C.cobalt, width: 0 },
  });
  s.addText("Veretennikov Studio · Журнал планирования", {
    x: 0.65, y: 4.55, w: 6, h: 0.25,
    fontFace: FONT_MONO, fontSize: 9, color: C.ink3, charSpacing: 2, margin: 0,
  });
}

// ── SLIDE 2 — Зачем СОСПП единая база знаний ───────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 2);
  title(s, "Зачем СОСПП единая база знаний");
  meta(s, "ОТ ФРАГМЕНТИРОВАННОГО ЗНАНИЯ К ЕДИНОМУ СЛОЮ С ПОИСКОМ И AI-АГЕНТАМИ");

  // 3-block layout: Context / Problem / Opportunity
  const blocks = [
    {
      label: "КОНТЕКСТ",
      text: "СОСПП работает с сотнями компаний-членов, десятками профильных комитетов, многолетней историей решений и официальных позиций по вопросам регулирования.",
    },
    {
      label: "ПРОБЛЕМА",
      text: "Знание сегодня фрагментировано — в файлах, головах ключевых сотрудников, разрозненных папках. Найти «что мы обсуждали по вопросу X», «кто из членов работает в отрасли Y» — занимает часы или дни, а не минуты.",
    },
    {
      label: "ВОЗМОЖНОСТЬ",
      text: "Единый слой знаний с поиском, который реально находит, и AI-агентом, который отвечает на вопросы по нашим данным с указанием источников. Ускорение работы аппарата и глубокая аналитика руководству в реальном времени.",
    },
  ];

  const baseY = 2.1, blockH = 0.95;
  blocks.forEach((b, i) => {
    const yy = baseY + i * (blockH + 0.05);
    // mono label
    s.addText(b.label, {
      x: 0.45, y: yy, w: 2.0, h: 0.25,
      fontFace: FONT_MONO, fontSize: 9, color: i === 2 ? C.cobalt : C.ink3,
      charSpacing: 3, margin: 0, bold: true,
    });
    // hairline
    hairlineH(s, yy + 0.27);
    // text body
    s.addText(b.text, {
      x: 0.45, y: yy + 0.32, w: 9.1, h: 0.65,
      fontFace: FONT_SANS, fontSize: 12.5, color: C.ink, margin: 0, valign: "top",
    });
  });
}

// ── SLIDE 3 — Что не работает сейчас ───────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 3);
  title(s, "Что не работает сейчас (по факту)");
  meta(s, "ПЯТЬ ТИПОВЫХ ПРОВАЛОВ В РАБОТЕ С КОРПОРАТИВНЫМИ ЗНАНИЯМИ");

  const items = [
    "Полнотекстовый поиск по сетевым папкам возвращает 50+ файлов по ключевому слову; релевантный — на 5-й странице.",
    "Хроника решений по сквозным вопросам разбросана по протоколам разных заседаний без сквозной нумерации тем.",
    "Реестр членов содержит контакты, но «в каких комитетах состоит компания и какие у неё интересы» выясняется в личном разговоре.",
    "Новый сотрудник входит в курс дела 3–6 месяцев — за счёт того, что ему объясняют «как мы тут работаем».",
    "Tacit knowledge — как мы обычно общаемся с конкретным ведомством, почему именно такая позиция по вопросу — живёт исключительно в головах 3–5 ключевых людей.",
  ];

  // Custom 2-col layout: number + text rows
  const baseY = 2.1, rowH = 0.52;
  items.forEach((t, i) => {
    const yy = baseY + i * rowH;
    s.addText(String(i + 1).padStart(2, "0"), {
      x: 0.45, y: yy + 0.05, w: 0.5, h: 0.35,
      fontFace: FONT_MONO, fontSize: 14, color: C.cobalt, bold: true, margin: 0,
    });
    s.addText(t, {
      x: 1.05, y: yy, w: 8.5, h: 0.5,
      fontFace: FONT_SANS, fontSize: 12, color: C.ink, valign: "top", margin: 0,
    });
    if (i < items.length - 1) hairlineH(s, yy + rowH - 0.05, { x: 1.05, w: 8.5 });
  });
}

// ── SLIDE 4 — Архитектура ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 4);
  title(s, "Что мы строим — высокоуровневая архитектура");
  meta(s, "4 СЛОЯ + GOVERNANCE СБОКУ");

  // 4 horizontal layers (bottom = sources, top = interface)
  const layers = [
    { label: "ИНТЕРФЕЙС", sub: "веб-консоль · Telegram-бот · опц. интеграция с почтой" },
    { label: "RETRIEVAL", sub: "гибрид vector + graph: vector ищет, граф уточняет по связям" },
    { label: "СЕМАНТИКА", sub: "сущности: компания, комитет, событие, позиция, обращение, отрасль" },
    { label: "ИСТОЧНИКИ", sub: "документы, реестры, протоколы, переписка, события" },
  ];

  const lx = 0.6, ly = 2.0, lw = 7.5, lh = 0.55, gap = 0.08;
  layers.forEach((L, i) => {
    const yy = ly + i * (lh + gap);
    // box hairline only
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: yy, w: lw, h: lh,
      fill: { color: C.paper }, line: { color: C.ink2, width: 0.75 },
    });
    s.addText(L.label, {
      x: lx + 0.15, y: yy + 0.06, w: 2.2, h: 0.25,
      fontFace: FONT_MONO, fontSize: 11, color: C.ink, bold: true, charSpacing: 2, margin: 0,
    });
    s.addText(L.sub, {
      x: lx + 0.15, y: yy + 0.30, w: lw - 0.3, h: 0.22,
      fontFace: FONT_SANS, fontSize: 11, color: C.ink2, italic: true, margin: 0,
    });
  });

  // Governance vertical side bar
  const gx = lx + lw + 0.25, gy = ly, gw = 1.05, gh = 4 * lh + 3 * gap;
  s.addShape(pres.shapes.RECTANGLE, {
    x: gx, y: gy, w: gw, h: gh,
    fill: { color: C.paper }, line: { color: C.cobalt, width: 0.9 },
  });
  // Rotated text — pptxgenjs supports rotate at shape level but not text auto-rotation;
  // we put short stacked labels
  s.addText("GOVERNANCE", {
    x: gx, y: gy + 0.15, w: gw, h: 0.3,
    fontFace: FONT_MONO, fontSize: 10, color: C.cobalt, bold: true, charSpacing: 2,
    align: "center", margin: 0,
  });
  const govItems = ["доступ", "аудит", "версии", "приватность"];
  govItems.forEach((g, i) => {
    s.addText("· " + g, {
      x: gx + 0.1, y: gy + 0.55 + i * 0.4, w: gw - 0.2, h: 0.3,
      fontFace: FONT_SANS, fontSize: 10, color: C.ink2, margin: 0, align: "left",
    });
  });

  caption(s, "ГИБРИД VECTOR + GRAPH — ДЕ-ФАКТО СТАНДАРТ ПРОДАКШЕН-ВНЕДРЕНИЙ В 2026 ГОДУ", { y: H - 0.85, cobalt: true });
}

// ── SLIDE 5 — 4 слоя знаний ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 5);
  title(s, "Основа: четыре слоя корпоративных знаний");
  meta(s, "СТЕК ОТ EXPLICIT-ДОКУМЕНТОВ К AI-ИЗВЛЕКАЕМОМУ TACIT");

  const layers = [
    { label: "ДОКУМЕНТЫ (EXPLICIT)", sub: "wiki, PDF, регламенты", era: "до 2020", solid: true },
    { label: "ИНДЕКСИРОВАНЫ (RAG)", sub: "векторный поиск, embeddings", era: "2023+" },
    { label: "СЕМАНТИЧЕСКИЙ СЛОЙ", sub: "сущности, связи, схемы", era: "2025+" },
    { label: "TACIT (AI-ИЗВЛЕКАЕМОЕ)", sub: "опыт, контекст решений, неявное", era: "2027+", future: true },
  ];

  const lx = 0.6, ly = 1.95, lw = 8.0, lh = 0.55, gap = 0.06;
  layers.forEach((L, i) => {
    const yy = ly + i * (lh + gap);
    if (L.future) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: lx, y: yy, w: lw, h: lh,
        fill: { color: C.paper },
        line: { color: C.cobalt, width: 1.2, dashType: "dash" },
      });
    } else {
      s.addShape(pres.shapes.RECTANGLE, {
        x: lx, y: yy, w: lw, h: lh,
        fill: { color: L.solid ? "F1EFE7" : C.paper },
        line: { color: C.ink2, width: 0.75 },
      });
    }
    s.addText(L.label, {
      x: lx + 0.2, y: yy + 0.05, w: 4.5, h: 0.25,
      fontFace: FONT_MONO, fontSize: 11, color: L.future ? C.cobalt : C.ink,
      bold: true, charSpacing: 2, margin: 0,
    });
    s.addText(L.sub, {
      x: lx + 0.2, y: yy + 0.30, w: 4.5, h: 0.22,
      fontFace: FONT_SANS, fontSize: 11, color: L.future ? C.cobalt : C.ink2,
      italic: true, margin: 0,
    });
    s.addText(L.era, {
      x: lx + lw - 1.5, y: yy + 0.17, w: 1.3, h: 0.25,
      fontFace: FONT_MONO, fontSize: 10, color: L.future ? C.cobalt : C.ink3,
      charSpacing: 1, align: "right", margin: 0,
    });
  });

  // frontier arrow on the right
  const ax = lx + lw + 0.25;
  s.addShape(pres.shapes.LINE, {
    x: ax, y: ly + 0.2, w: 0, h: 4 * lh + 3 * gap - 0.4,
    line: { color: C.ink3, width: 1 },
  });
  // arrowhead down (small triangle approximation using line)
  s.addShape(pres.shapes.LINE, {
    x: ax - 0.07, y: ly + 4 * lh + 3 * gap - 0.25, w: 0.07, h: 0.15,
    line: { color: C.cobalt, width: 1.5 },
  });
  s.addShape(pres.shapes.LINE, {
    x: ax, y: ly + 4 * lh + 3 * gap - 0.10, w: 0.07, h: -0.15,
    line: { color: C.cobalt, width: 1.5 },
  });
  s.addText("FRONTIER →", {
    x: ax + 0.1, y: ly + 1.2, w: 1.0, h: 0.3,
    fontFace: FONT_MONO, fontSize: 9, color: C.ink3, charSpacing: 1, margin: 0,
  });

  caption(s, "Каждый следующий слой даёт качественно новый ответ на запросы — но и стоит дороже предыдущего.");
}

// ── SLIDE 6 — Источники данных ─────────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 6);
  title(s, "Источники данных, которые подключаем");
  meta(s, "8 КАТЕГОРИЙ · ТОЧНЫЙ СПИСОК И ПРИОРИТЕТЫ — ИТОГ ЭТАПА 1");

  const items = [
    { t: "Внутренние документы", d: "регламенты, инструкции, шаблоны, методички" },
    { t: "Протоколы заседаний", d: "комитеты, президиум, общее собрание" },
    { t: "Позиции по вопросам", d: "официальные документы в органы власти" },
    { t: "Реестр членов", d: "карточки компаний, контакты, комитеты" },
    { t: "События и мероприятия", d: "программы, материалы, отчёты, фото-аудио" },
    { t: "Переписка", d: "выборочно по согласию — типовые обращения" },
    { t: "Аналитика и обзоры", d: "внутренние отчёты по отраслям и трендам" },
    { t: "Партнёрские контакты", d: "органы власти, эксперты, медиа" },
  ];

  // 2-column grid: 4 rows x 2 cols
  const baseY = 2.0, colW = 4.4, rowH = 0.62;
  items.forEach((it, i) => {
    const col = Math.floor(i / 4);
    const row = i % 4;
    const xx = 0.5 + col * (colW + 0.2);
    const yy = baseY + row * rowH;
    s.addText(String(i + 1).padStart(2, "0"), {
      x: xx, y: yy + 0.04, w: 0.45, h: 0.3,
      fontFace: FONT_MONO, fontSize: 13, color: C.cobalt, bold: true, margin: 0,
    });
    s.addText(it.t, {
      x: xx + 0.5, y: yy, w: colW - 0.5, h: 0.28,
      fontFace: FONT_SANS, fontSize: 12.5, color: C.ink, bold: true, margin: 0,
    });
    s.addText(it.d, {
      x: xx + 0.5, y: yy + 0.28, w: colW - 0.5, h: 0.30,
      fontFace: FONT_SANS, fontSize: 10.5, color: C.ink2, italic: true, margin: 0,
    });
  });

  caption(s, "Точный список и приоритеты — итог Этапа 1 (Аудит).");
}

// ── SLIDE 7 — Целевые сценарии ─────────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 7);
  title(s, "Целевые сценарии — что должна уметь система");
  meta(s, "7 ТИПОВЫХ ВОПРОСОВ · КРИТЕРИЙ ПРИЁМКИ MVP");

  const items = [
    "Какие компании-члены работают в отрасли X и какие у них общие вопросы?",
    "На каких заседаниях обсуждалась тема Y и какие были решения?",
    "Какие позиции мы заявляли по регулированию Z за последние 5 лет?",
    "Кто из членов уже взаимодействовал с ведомством N?",
    "Готов ли пакет материалов по теме W?",
    "Какие события у нас запланированы в ближайший месяц по теме V?",
    "Сколько компаний-членов поддерживают инициативу U?",
  ];

  const baseY = 2.0, rowH = 0.38;
  items.forEach((q, i) => {
    const yy = baseY + i * rowH;
    s.addText("Q", {
      x: 0.45, y: yy + 0.03, w: 0.3, h: 0.3,
      fontFace: FONT_MONO, fontSize: 11, color: C.cobalt, bold: true, margin: 0,
    });
    s.addText(String(i + 1).padStart(2, "0"), {
      x: 0.65, y: yy + 0.05, w: 0.4, h: 0.3,
      fontFace: FONT_MONO, fontSize: 9, color: C.ink3, margin: 0,
    });
    s.addText("«" + q + "»", {
      x: 1.1, y: yy + 0.02, w: 8.4, h: 0.3,
      fontFace: FONT_SANS, fontSize: 12.5, italic: true, color: C.ink, margin: 0, valign: "middle",
    });
    if (i < items.length - 1) hairlineH(s, yy + rowH - 0.05, { x: 1.1, w: 8.4 });
  });

  caption(s, "ЕСЛИ СИСТЕМА ОТВЕЧАЕТ НА ЭТИ 7 ВОПРОСОВ ЗА 30 СЕКУНД КАЖДЫЙ — ОНА РАБОТАЕТ.", { cobalt: true });
}

// ── SLIDE 8 — Дорожная карта ───────────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 8);
  title(s, "Дорожная карта — обзор всех этапов");
  meta(s, "6–7 МЕСЯЦЕВ ДО ЗАПУСКА MVP · ДАЛЕЕ ЭКСПЛУАТАЦИЯ И РАЗВИТИЕ");

  const stages = [
    { name: "Аудит и инвентаризация", weeks: 2, start: 0 },
    { name: "Семантический слой",      weeks: 4, start: 2 },
    { name: "Подключение источников",  weeks: 5, start: 6 },
    { name: "Retrieval-инфраструктура",weeks: 4, start: 11 },
    { name: "Интерфейс и доступ",      weeks: 4, start: 15 },
    { name: "Пилот и метрики",         weeks: 4, start: 19 },
    { name: "Масштабирование/governance", weeks: 0, start: 23, ongoing: true },
  ];

  const totalWeeks = 28; // for chart scale
  const cx0 = 3.8, cxe = 9.5;
  const span = cxe - cx0;
  const baseY = 2.0, rowH = 0.36;

  // x-axis labels (weeks)
  [0, 4, 8, 12, 16, 20, 24, 28].forEach(wn => {
    const xx = cx0 + (wn / totalWeeks) * span;
    s.addShape(pres.shapes.LINE, {
      x: xx, y: baseY - 0.15, w: 0, h: 0.07,
      line: { color: C.ink3, width: 0.6 },
    });
    s.addText(`W${wn}`, {
      x: xx - 0.25, y: baseY - 0.35, w: 0.5, h: 0.2,
      fontFace: FONT_MONO, fontSize: 8, color: C.ink3, align: "center", margin: 0,
    });
  });
  // top hairline of the chart area
  s.addShape(pres.shapes.LINE, {
    x: cx0, y: baseY - 0.07, w: span, h: 0,
    line: { color: C.rule, width: 0.6 },
  });

  stages.forEach((st, i) => {
    const yy = baseY + i * rowH;
    // stage index + name (left column)
    s.addText(String(i + 1).padStart(2, "0"), {
      x: 0.45, y: yy + 0.04, w: 0.4, h: 0.3,
      fontFace: FONT_MONO, fontSize: 11, color: i === stages.length - 1 ? C.cobalt : C.ink,
      bold: true, margin: 0,
    });
    s.addText(st.name, {
      x: 0.90, y: yy + 0.04, w: 2.7, h: 0.3,
      fontFace: FONT_SANS, fontSize: 11, color: C.ink, margin: 0,
    });
    // bar
    const bx = cx0 + (st.start / totalWeeks) * span;
    const bw = st.ongoing
      ? cxe - bx
      : (st.weeks / totalWeeks) * span;
    if (st.ongoing) {
      // dashed for ongoing — label sits INSIDE the box, no overflow
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: yy + 0.06, w: bw, h: 0.22,
        fill: { color: C.paper },
        line: { color: C.cobalt, width: 0.9, dashType: "dash" },
      });
      s.addText("постоянно", {
        x: bx, y: yy + 0.05, w: bw, h: 0.24,
        fontFace: FONT_MONO, fontSize: 9, color: C.cobalt,
        align: "center", valign: "middle", margin: 0,
      });
    } else {
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: yy + 0.06, w: bw, h: 0.20,
        fill: { color: i === stages.length - 1 ? C.cobalt : C.ink2 },
        line: { color: C.ink2, width: 0 },
      });
      s.addText(`${st.weeks} нед`, {
        x: bx + bw + 0.05, y: yy + 0.04, w: 1.2, h: 0.3,
        fontFace: FONT_MONO, fontSize: 9, color: C.ink3, margin: 0,
      });
    }
  });

  caption(s, "До запуска MVP — 6–7 месяцев. Эксплуатация и развитие — далее непрерывно.");
}

// ── Helper for stage detail slides 9–15 ─────────────────────────────────
function stageSlide(n, idx, ttl, metaLine, whatDo, outputs, footerNote, footerCobalt = false) {
  const s = pres.addSlide();
  chrome(s, n);
  // Big stage index in the corner of the content
  s.addText(`ЭТАП ${String(idx).padStart(2, "0")}`, {
    x: 0.45, y: 0.85, w: 3, h: 0.4,
    fontFace: FONT_MONO, fontSize: 11, color: C.cobalt, bold: true, charSpacing: 3, margin: 0,
  });
  s.addText(ttl, {
    x: 0.45, y: 1.15, w: W - 0.9, h: 0.65,
    fontFace: FONT_SERIF, fontSize: 24, color: C.ink, margin: 0,
  });
  meta(s, metaLine, 1.85);

  // Two columns: what we do (left) / outputs (right)
  // Section labels
  const colW = 4.45, leftX = 0.45, rightX = 5.10, listY = 2.4;
  s.addText("ЧТО ДЕЛАЕМ", {
    x: leftX, y: listY, w: colW, h: 0.25,
    fontFace: FONT_MONO, fontSize: 10, color: C.ink3, charSpacing: 2, bold: true, margin: 0,
  });
  s.addText("НА ВЫХОДЕ", {
    x: rightX, y: listY, w: colW, h: 0.25,
    fontFace: FONT_MONO, fontSize: 10, color: C.ink3, charSpacing: 2, bold: true, margin: 0,
  });
  hairlineH(s, listY + 0.28, { x: leftX, w: colW });
  hairlineH(s, listY + 0.28, { x: rightX, w: colW });

  const mkLines = arr => arr.map((t, i) => ({
    text: t,
    options: {
      bullet: { code: "2022" },
      breakLine: i < arr.length - 1,
      paraSpaceAfter: 5,
    },
  }));
  s.addText(mkLines(whatDo), {
    x: leftX, y: listY + 0.4, w: colW, h: 2.2,
    fontFace: FONT_SANS, fontSize: 11.5, color: C.ink, valign: "top", margin: 0,
  });
  s.addText(mkLines(outputs), {
    x: rightX, y: listY + 0.4, w: colW, h: 2.2,
    fontFace: FONT_SANS, fontSize: 11.5, color: C.ink, valign: "top", margin: 0,
  });

  if (footerNote) {
    caption(s, footerNote, { cobalt: footerCobalt });
  }
}

// ── SLIDE 9 — Этап 1 ───────────────────────────────────────────────────
stageSlide(9, 1,
  "Аудит и инвентаризация",
  "2 НЕДЕЛИ · 1 АНАЛИТИК С НАШЕЙ СТОРОНЫ + 1 ПРЕДСТАВИТЕЛЬ СОСПП",
  [
    "Инвентаризируем источники: что где лежит, в каком формате, кто отвечает",
    "Документируем 7 целевых сценариев и приоритизируем их",
    "Согласовываем, какие данные включаем, какие — нет (юр. проверка)",
    "Снимаем правила доступа: кто может видеть какие типы документов",
  ],
  [
    "Документ «Источники и владельцы»",
    "Документ «Правила доступа»",
    "Список целевых сценариев с приоритизацией",
    "Smoke-test: сколько занимают самые сложные запросы вручную сейчас (baseline)",
  ],
);

// ── SLIDE 10 — Этап 2 ──────────────────────────────────────────────────
stageSlide(10, 2,
  "Семантический слой",
  "4 НЕДЕЛИ · 1 АРХИТЕКТОР С НАШЕЙ СТОРОНЫ + МЕТОДОЛОГ СОСПП",
  [
    "Описываем модель данных: компания, комитет, событие, позиция, обращение, отрасль",
    "Прописываем связи: компания → комитеты, событие → темы, позиция → ведомство",
    "Согласовываем словарь терминов (одинаковые термины = одно значение)",
    "Сравниваем со стандартами как ориентир (FIBO для финансов как пример строгости)",
  ],
  [
    "Семантическая схема (RDF/OWL или Cypher для Neo4j)",
    "Документация словаря",
    "Mapping исходных данных к схеме (где какое поле что значит)",
  ],
  "САМЫЙ ДЕШЁВЫЙ И ПРИ ЭТОМ САМЫЙ ВАЖНЫЙ ЭТАП. ОТ КАЧЕСТВА СХЕМЫ ЗАВИСИТ ВСЯ ОСТАЛЬНАЯ РАБОТА.",
  true,
);

// ── SLIDE 11 — Этап 3 ──────────────────────────────────────────────────
stageSlide(11, 3,
  "Подключение источников и ETL",
  "5 НЕДЕЛЬ · 2 РАЗРАБОТЧИКА",
  [
    "Пишем коннекторы к каждому из 8 источников",
    "Документы → извлечение текста + chunking + embeddings (500–800 токенов, overlap)",
    "Реестры → структурный импорт по семантической схеме",
    "Переписка → выборочно по согласию владельцев процессов",
    "Регулярная синхронизация (ежедневно/еженедельно по источнику)",
  ],
  [
    "8 рабочих коннекторов с логированием и алертами",
    "Векторный индекс на pgvector или Qdrant",
    "Граф знаний на Neo4j Community или PostgreSQL + pg_graph",
  ],
  "САМЫЙ ТРУДОЁМКИЙ ЭТАП. 60–70% ИНЖЕНЕРНОЙ РАБОТЫ — ЗДЕСЬ.",
);

// ── SLIDE 12 — Этап 4 ──────────────────────────────────────────────────
stageSlide(12, 4,
  "Retrieval-инфраструктура",
  "4 НЕДЕЛИ · 1 ML-ИНЖЕНЕР + 1 BACKEND-РАЗРАБОТЧИК",
  [
    "Гибридный retrieval: vector ловит «о чём речь» → граф уточняет по связям",
    "Reranking результатов под конкретный запрос",
    "Source attribution: к каждому ответу — ссылка на исходный документ",
    "Guardrails: при низкой уверенности — «не знаю», не выдумывает",
    "Обработка многошаговых запросов: компания → отрасль → история позиций",
  ],
  [
    "API «вопрос → ответ + источники»",
    "Тестовый набор 100+ типовых запросов с эталонами",
    "Метрики качества: precision, recall, hallucination rate",
  ],
);

// ── SLIDE 13 — Этап 5 ──────────────────────────────────────────────────
stageSlide(13, 5,
  "Интерфейс и доступ",
  "4 НЕДЕЛИ · 1 ФРОНТ-РАЗРАБОТЧИК + 1 ДИЗАЙНЕР",
  [
    "Веб-консоль: вопрос → ответ с источниками → открыть исходник",
    "Telegram-бот для быстрых вопросов в чате (особенно в полях)",
    "Опциональная интеграция с корпоративной почтой",
    "SSO с существующей системой СОСПП",
    "Гибкие права доступа по семантической схеме",
  ],
  [
    "Веб-приложение",
    "Telegram-бот",
    "Документация для пользователей и админов",
  ],
);

// ── SLIDE 14 — Этап 6 ──────────────────────────────────────────────────
stageSlide(14, 6,
  "Пилот и метрики",
  "4 НЕДЕЛИ · 3–5 ЧЕЛОВЕК СОСПП + НАШ МЕНЕДЖЕР ПРОЕКТА",
  [
    "Запускаем пилот на отдел ключевых сотрудников (8–15 человек)",
    "Каждый день — короткие 5-минутные опросы обратной связи",
    "Меряем: вопросов задано, % «не знаю», точность, скорость, hallucination rate",
    "Корректируем по ходу: chunking, источники, словарь, связи",
  ],
  [
    "Метрики до/после пилота",
    "Список 20–30 уточнений",
    "Решение go/no-go на масштабирование",
  ],
);

// ── SLIDE 15 — Этап 7 ──────────────────────────────────────────────────
stageSlide(15, 7,
  "Масштабирование и governance",
  "ПОСТОЯННО · 1 СУПЕРВАЙЗЕР + КОНТЕНТ-МЕНЕДЖЕР СОСПП",
  [
    "Доступ всему аппарату → потом отдельным член-компаниям (по согласию)",
    "Регулярная переиндексация (по расписанию + по триггерам)",
    "Аудит: кто что смотрел, не утекает ли чувствительная инфа",
    "Обновление семантической схемы по мере изменения структуры союза",
    "Метрика «сколько раз агент сказал не знаю» — KPI на улучшение базы",
  ],
  [
    "Регламент сопровождения",
    "SLA по обновлениям",
    "Регулярные отчёты руководству СОСПП",
  ],
);

// ── SLIDE 16 — Технологический стек ────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 16);
  title(s, "Технологический стек");
  meta(s, "ВЕСЬ СТЕК — В РФ-ПЕРИМЕТРЕ, БЕЗ ЗАРУБЕЖНЫХ ЗАВИСИМОСТЕЙ В ПРОДЕ");

  const leftItems = [
    { l: "ИНФРАСТРУКТУРА", isHeader: true },
    { l: "Хостинг", v: "Yandex Cloud (Compute + Object Storage), РФ-резидентность" },
    { l: "БД retrieval", v: "PostgreSQL + pgvector" },
    { l: "БД графа", v: "Neo4j Community или PostgreSQL + pg_graph" },
    { l: "Мониторинг", v: "Yandex Cloud Monitoring + Grafana" },
    { l: "CI/CD", v: "GitHub Actions через self-hosted runner" },
  ];
  const rightItems = [
    { l: "МОДЕЛИ И ПРИЛОЖЕНИЕ", isHeader: true },
    { l: "LLM (основная)", v: "YandexGPT Pro 5 (API)" },
    { l: "LLM (опция)", v: "self-hosted Qwen 2.5 / Llama 3.1 для чувствительных" },
    { l: "Embeddings", v: "bge-m3 (open-source, multilingual)" },
    { l: "Оркестрация", v: "Python + LangChain/LlamaIndex (с разумной долей кастома)" },
    { l: "Backend", v: "FastAPI" },
    { l: "Frontend", v: "Next.js" },
  ];

  function renderCol(items, x) {
    const baseY = 2.0, rowH = 0.45;
    items.forEach((it, i) => {
      const yy = baseY + i * rowH;
      if (it.isHeader) {
        s.addText(it.l, {
          x, y: yy, w: 4.45, h: 0.3,
          fontFace: FONT_MONO, fontSize: 11, color: C.cobalt, bold: true,
          charSpacing: 3, margin: 0,
        });
        hairlineH(s, yy + 0.34, { x, w: 4.45 });
      } else {
        s.addText(it.l, {
          x, y: yy, w: 1.5, h: 0.3,
          fontFace: FONT_MONO, fontSize: 10, color: C.ink2, margin: 0,
        });
        s.addText(it.v, {
          x: x + 1.55, y: yy, w: 2.9, h: 0.4,
          fontFace: FONT_SANS, fontSize: 11, color: C.ink, margin: 0, valign: "top",
        });
      }
    });
  }
  renderCol(leftItems, 0.45);
  renderCol(rightItems, 5.10);
}

// ── SLIDE 17 — Команда и роли ──────────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 17);
  title(s, "Команда и роли");
  meta(s, "СОВМЕСТНАЯ КОМАНДА: VERETENNIKOV STUDIO + СОСПП");

  const left = [
    "Product/project manager — ведёт проект, сроки",
    "Архитектор данных — семантический слой",
    "2 backend-разработчика — коннекторы, API",
    "ML-инженер — retrieval, guardrails, метрики",
    "Фронт-разработчик — веб-консоль и бот",
    "Дизайнер — на этапе интерфейса",
    "DevOps — инфра и CI/CD",
  ];
  const right = [
    "Куратор проекта (зам. директора уровня)",
    "1–2 методолога — семантическая схема и словарь",
    "Контент-менеджер — подключение источников",
    "Юрист — права на данные и согласия",
    "Группа пилотных пользователей: 8–15 человек",
  ];

  function renderTeam(title2, items, x) {
    s.addText(title2, {
      x, y: 2.0, w: 4.45, h: 0.3,
      fontFace: FONT_MONO, fontSize: 11, color: C.cobalt, bold: true, charSpacing: 3, margin: 0,
    });
    hairlineH(s, 2.34, { x, w: 4.45 });
    const baseY = 2.45, rowH = 0.36;
    items.forEach((t, i) => {
      const yy = baseY + i * rowH;
      s.addText(String(i + 1).padStart(2, "0"), {
        x, y: yy + 0.02, w: 0.35, h: 0.3,
        fontFace: FONT_MONO, fontSize: 10, color: C.ink3, margin: 0,
      });
      s.addText(t, {
        x: x + 0.4, y: yy, w: 4.05, h: 0.33,
        fontFace: FONT_SANS, fontSize: 11.5, color: C.ink, margin: 0, valign: "top",
      });
    });
  }
  renderTeam("VERETENNIKOV STUDIO (НАША СТОРОНА)", left, 0.45);
  renderTeam("СОСПП (СО СТОРОНЫ ЗАКАЗЧИКА)", right, 5.10);
}

// ── SLIDE 18 — Метрики успеха ──────────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 18);
  title(s, "Метрики успеха");
  meta(s, "7 KPI · ОДИН — ГЛАВНЫЙ, ПОДСВЕЧЕН КОБАЛЬТОМ");

  const metrics = [
    { l: "Скорость ответа", v: "≤ 30 секунд", n: "01" },
    { l: "Точность по 100 эталонным вопросам", v: "≥ 85%", n: "02" },
    { l: "Hallucination rate", v: "≤ 5%", n: "03" },
    { l: "«Сколько раз агент сказал не знаю»", v: "тренд вниз → база растёт", n: "04", highlight: true },
    { l: "Удовлетворённость пилотных пользователей", v: "≥ 4/5 у 80% участников", n: "05" },
    { l: "Время онбординга нового сотрудника", v: "3–6 мес → 4–6 нед", n: "06" },
    { l: "Использование на одного активного", v: "≥ 5 запросов в день", n: "07" },
  ];

  const baseY = 2.0, rowH = 0.40;
  metrics.forEach((m, i) => {
    const yy = baseY + i * rowH;
    s.addText(m.n, {
      x: 0.45, y: yy + 0.04, w: 0.4, h: 0.3,
      fontFace: FONT_MONO, fontSize: 11, color: m.highlight ? C.cobalt : C.ink3, bold: true, margin: 0,
    });
    s.addText(m.l, {
      x: 0.95, y: yy + 0.02, w: 5.0, h: 0.35,
      fontFace: FONT_SANS, fontSize: 12.5, color: m.highlight ? C.cobalt : C.ink,
      bold: !!m.highlight, margin: 0, valign: "top",
    });
    s.addText(m.v, {
      x: 6.05, y: yy + 0.02, w: 3.5, h: 0.35,
      fontFace: FONT_MONO, fontSize: 11.5, color: m.highlight ? C.cobalt : C.ink2,
      bold: !!m.highlight, margin: 0, valign: "top", align: "right",
    });
    if (i < metrics.length - 1) hairlineH(s, yy + rowH - 0.05);
  });

  caption(s, "ГЛАВНАЯ МЕТРИКА — №04. ПАДАЕТ = БАЗА РАСТЁТ. СТОИТ = РАБОТА СТОИТ.", { cobalt: true });
}

// ── SLIDE 19 — Управление и governance ────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 19);
  title(s, "Управление и governance");
  meta(s, "ДОСТУП · АУДИТ · КОНФИДЕНЦИАЛЬНОСТЬ · ВЕРСИОННОСТЬ · ПРОТИВОРЕЧИЯ");

  const items = [
    { h: "Матрица доступа", b: "по семантической схеме: роль → видимые типы документов" },
    { h: "Аудит запросов", b: "каждый запрос логируется (кто, что, какой ответ, какие источники)" },
    { h: "Конфиденциальность", b: "чувствительные документы — отдельный уровень с доп. ограничениями" },
    { h: "Юридическая база", b: "согласия от членов на использование их данных оформляются документально" },
    { h: "Версионность", b: "при обновлении документов сохраняется история и diff" },
    { h: "Управление противоречиями", b: "если два документа противоречат — система показывает обе и просит модератора" },
  ];

  const baseY = 2.0, rowH = 0.5;
  items.forEach((it, i) => {
    const yy = baseY + i * rowH;
    s.addText(String(i + 1).padStart(2, "0"), {
      x: 0.45, y: yy + 0.05, w: 0.4, h: 0.3,
      fontFace: FONT_MONO, fontSize: 11, color: C.cobalt, bold: true, margin: 0,
    });
    s.addText(it.h, {
      x: 0.95, y: yy, w: 3.2, h: 0.3,
      fontFace: FONT_SANS, fontSize: 12, bold: true, color: C.ink, margin: 0, valign: "top",
    });
    s.addText(it.b, {
      x: 4.2, y: yy + 0.02, w: 5.4, h: 0.45,
      fontFace: FONT_SANS, fontSize: 11, italic: true, color: C.ink2, margin: 0, valign: "top",
    });
    if (i < items.length - 1) hairlineH(s, yy + rowH - 0.05);
  });
}

// ── SLIDE 20 — Риски и митигация ──────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 20);
  title(s, "Топ-5 рисков и митигация");
  meta(s, "ОРГАНИЗАЦИОННЫЕ ПРОВАЛЫ КРИТИЧНЕЕ ТЕХНИЧЕСКИХ");

  const risks = [
    {
      r: "Резистенция к документированию",
      m: "Документирование как побочный эффект работы, без отдельной нагрузки; внедряем только там, где есть владелец процесса.",
    },
    {
      r: "Источники низкого качества (сканы PDF, неструктурированные таблицы)",
      m: "Этап аудита определяет границы. Начинаем с того, что уже структурно (реестры, протоколы), деграды разбираем потом.",
    },
    {
      r: "Утечка чувствительной инфы через ответы агента",
      m: "Guardrails + матрица доступа + audit-логи + обязательная проверка на пилоте перед расширением круга пользователей.",
    },
    {
      r: "Стоимость API/LLM растёт быстрее ROI",
      m: "Кеширование запросов, переход на self-hosted модель при достижении точки безубыточности.",
    },
    {
      r: "Семантическая схема устаревает (структура союза меняется)",
      m: "Версионирование схемы, квартальные ревизии с методологом, миграции.",
    },
  ];

  // table-like
  // header
  const headY = 1.95;
  s.addText("РИСК", {
    x: 0.45, y: headY, w: 4.0, h: 0.3,
    fontFace: FONT_MONO, fontSize: 10, color: C.cobalt, bold: true, charSpacing: 2, margin: 0,
  });
  s.addText("МИТИГАЦИЯ", {
    x: 4.6, y: headY, w: 5.0, h: 0.3,
    fontFace: FONT_MONO, fontSize: 10, color: C.cobalt, bold: true, charSpacing: 2, margin: 0,
  });
  hairlineH(s, headY + 0.28);

  const baseY = 2.35, rowH = 0.58;
  risks.forEach((r, i) => {
    const yy = baseY + i * rowH;
    s.addText(r.r, {
      x: 0.45, y: yy, w: 4.0, h: 0.55,
      fontFace: FONT_SANS, fontSize: 11.5, color: C.ink, bold: true, margin: 0, valign: "top",
    });
    s.addText(r.m, {
      x: 4.6, y: yy, w: 5.0, h: 0.55,
      fontFace: FONT_SANS, fontSize: 11, color: C.ink2, margin: 0, valign: "top",
    });
    if (i < risks.length - 1) hairlineH(s, yy + rowH - 0.05);
  });
}

// ── SLIDE 21 — Бюджет и сроки ──────────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 21);
  title(s, "Бюджет и сроки");
  meta(s, "ОЦЕНКА В ВИЛКАХ · ФИКСИРУЕМ СТОИМОСТЬ ЭТАП-ЗА-ЭТАПОМ");

  const stages = [
    { n: "01", name: "Аудит",                    d: "2 нед",  c: "150–200 тыс ₽" },
    { n: "02", name: "Семантический слой",       d: "4 нед",  c: "400–600 тыс ₽" },
    { n: "03", name: "Подключение источников",   d: "5 нед",  c: "600–900 тыс ₽" },
    { n: "04", name: "Retrieval-инфраструктура", d: "4 нед",  c: "400–600 тыс ₽" },
    { n: "05", name: "Интерфейс",                d: "4 нед",  c: "500–700 тыс ₽" },
    { n: "06", name: "Пилот",                    d: "4 нед",  c: "250–350 тыс ₽" },
  ];

  // header
  const headY = 1.95;
  ["ЭТАП", "НАЗВАНИЕ", "ДЛИТ.", "СТОИМОСТЬ"].forEach((h, i) => {
    const xx = [0.45, 1.45, 5.95, 7.45][i];
    const ww = [0.95, 4.45, 1.45, 2.15][i];
    s.addText(h, {
      x: xx, y: headY, w: ww, h: 0.3,
      fontFace: FONT_MONO, fontSize: 10, color: C.cobalt, bold: true, charSpacing: 2, margin: 0,
      align: i === 3 ? "right" : "left",
    });
  });
  hairlineH(s, headY + 0.28);

  const baseY = 2.20, rowH = 0.30;
  stages.forEach((st, i) => {
    const yy = baseY + i * rowH;
    s.addText(st.n, {
      x: 0.45, y: yy, w: 0.95, h: 0.28,
      fontFace: FONT_MONO, fontSize: 12, bold: true, color: C.ink, margin: 0,
    });
    s.addText(st.name, {
      x: 1.45, y: yy, w: 4.45, h: 0.28,
      fontFace: FONT_SANS, fontSize: 12, color: C.ink, margin: 0,
    });
    s.addText(st.d, {
      x: 5.95, y: yy, w: 1.45, h: 0.28,
      fontFace: FONT_MONO, fontSize: 11, color: C.ink2, margin: 0,
    });
    s.addText(st.c, {
      x: 7.45, y: yy, w: 2.15, h: 0.28,
      fontFace: FONT_MONO, fontSize: 11, color: C.ink, margin: 0, align: "right",
    });
    hairlineH(s, yy + rowH - 0.04);
  });

  // total row
  const totalY = baseY + stages.length * rowH + 0.08;
  s.addText("ИТОГО MVP", {
    x: 0.45, y: totalY, w: 1.95, h: 0.32,
    fontFace: FONT_MONO, fontSize: 12, bold: true, color: C.cobalt, charSpacing: 2, margin: 0,
  });
  s.addText("до запуска", {
    x: 2.40, y: totalY + 0.04, w: 3.55, h: 0.28,
    fontFace: FONT_SANS, fontSize: 11, italic: true, color: C.ink2, margin: 0,
  });
  s.addText("6–7 мес", {
    x: 5.95, y: totalY, w: 1.45, h: 0.32,
    fontFace: FONT_MONO, fontSize: 12, bold: true, color: C.cobalt, margin: 0,
  });
  s.addText("2,3–3,4 млн ₽", {
    x: 7.45, y: totalY, w: 2.15, h: 0.32,
    fontFace: FONT_MONO, fontSize: 12, bold: true, color: C.cobalt, align: "right", margin: 0,
  });

  // ops costs footer — push down to clear total row
  const opsY = totalY + 0.50;
  hairlineH(s, opsY);
  s.addText("ЭКСПЛУАТАЦИЯ", {
    x: 0.45, y: opsY + 0.05, w: 2.0, h: 0.22,
    fontFace: FONT_MONO, fontSize: 9, color: C.ink3, charSpacing: 2, margin: 0,
  });
  s.addText("Инфра Yandex Cloud 30–60 тыс ₽/мес · LLM-токены 10–30 тыс ₽/мес · сопровождение 150–250 тыс ₽/мес (год 1)", {
    x: 0.45, y: opsY + 0.27, w: 9.1, h: 0.25,
    fontFace: FONT_SANS, fontSize: 10, color: C.ink2, margin: 0, valign: "top",
  });
}

// ── SLIDE 22 — Первая неделя ───────────────────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 22);
  title(s, "С чего начнём в первую неделю");
  meta(s, "ОТ KICK-OFF ДО ПЕРЕДАЧИ АРТЕФАКТОВ ЭТАПА 1");

  const days = [
    { d: "День 1", t: "Kick-off встреча, согласование куратора проекта со стороны СОСПП" },
    { d: "Дни 2–3", t: "Подписание NDA и соглашения о работе с данными" },
    { d: "Дни 4–5", t: "Первый рабочий день аудита — обход отделов, инвентаризация источников" },
    { d: "Дни 6–7", t: "Рабочая сессия по 7 целевым сценариям" },
    { d: "Дни 8–10", t: "Первая версия документа «Источники и владельцы»" },
    { d: "Дни 11–14", t: "Завершение Этапа 1, передача артефактов и согласование бюджета на остальные этапы" },
  ];

  const baseY = 2.0, rowH = 0.45;
  days.forEach((it, i) => {
    const yy = baseY + i * rowH;
    s.addText(it.d, {
      x: 0.45, y: yy + 0.03, w: 1.7, h: 0.3,
      fontFace: FONT_MONO, fontSize: 11, bold: true, color: i === days.length - 1 ? C.cobalt : C.ink,
      charSpacing: 1, margin: 0,
    });
    s.addText(it.t, {
      x: 2.25, y: yy, w: 7.3, h: 0.4,
      fontFace: FONT_SANS, fontSize: 12, color: C.ink, margin: 0, valign: "top",
    });
    if (i < days.length - 1) hairlineH(s, yy + rowH - 0.05);
  });

  caption(s, "К КОНЦУ 2-Й НЕДЕЛИ — ЧЁТКОЕ ПОНИМАНИЕ ОБЪЁМА РАБОТ И ПОДТВЕРЖДЁННЫЙ БЮДЖЕТ ОСТАЛЬНЫХ ЭТАПОВ.");
}

// ── SLIDE 23 — Следующие шаги и контакты ──────────────────────────────
{
  const s = pres.addSlide();
  chrome(s, 23);
  title(s, "Следующие шаги");
  meta(s, "ОТ КОМАНДЫ STUDIO · ОТ СОСПП · ДОКУМЕНТЫ К ПОДПИСАНИЮ");

  const blocks = [
    {
      h: "ОТ НАС (VERETENNIKOV STUDIO)",
      items: [
        "Готовы запустить kick-off в течение 2 недель",
        "Команда на Этап 1 — выделена и доступна в указанные сроки",
      ],
    },
    {
      h: "ОТ СОСПП",
      items: [
        "Назначить куратора проекта (зам. директора уровня)",
        "Обеспечить аналитику доступ к ключевым отделам на Этап 1",
        "Выделить методолога на Этап 2",
      ],
    },
    {
      h: "ДОКУМЕНТЫ К ПОДПИСАНИЮ",
      items: [
        "Договор на Этап 1 (фиксированная стоимость)",
        "NDA",
        "Соглашение об обработке данных",
      ],
    },
  ];

  const baseY = 2.0, colW = 3.0;
  blocks.forEach((b, i) => {
    const xx = 0.45 + i * (colW + 0.1);
    s.addText(b.h, {
      x: xx, y: baseY, w: colW, h: 0.3,
      fontFace: FONT_MONO, fontSize: 10, bold: true, color: C.cobalt, charSpacing: 2, margin: 0,
    });
    hairlineH(s, baseY + 0.32, { x: xx, w: colW });
    const lines = b.items.map((t, ii) => ({
      text: t,
      options: { bullet: { code: "2022" }, breakLine: ii < b.items.length - 1, paraSpaceAfter: 6 },
    }));
    s.addText(lines, {
      x: xx, y: baseY + 0.42, w: colW, h: 1.8,
      fontFace: FONT_SANS, fontSize: 11.5, color: C.ink, valign: "top", margin: 0,
    });
  });

  // Contact block at bottom
  const cY = H - 1.30;
  hairlineH(s, cY);
  s.addText("КОНТАКТ", {
    x: 0.45, y: cY + 0.05, w: 1.5, h: 0.25,
    fontFace: FONT_MONO, fontSize: 9, color: C.ink3, charSpacing: 2, margin: 0,
  });
  s.addText("Анатолий Веретенников", {
    x: 0.45, y: cY + 0.30, w: 5, h: 0.3,
    fontFace: FONT_SERIF, fontSize: 16, color: C.ink, margin: 0,
  });
  s.addText("strana.vfx@gmail.com  ·  t.me/VeretennikovINFO  ·  veretennikov.info", {
    x: 0.45, y: cY + 0.62, w: 9.1, h: 0.25,
    fontFace: FONT_MONO, fontSize: 10, color: C.ink2, margin: 0,
  });
}

// ── write file ───────────────────────────────────────────────────────────
const OUT = "C:\\Users\\Home-PC\\OneDrive\\Документы\\SOSPP-vnedrenie-bazy-znaniy.pptx";
pres.writeFile({ fileName: OUT }).then(file => {
  console.log("OK:", file);
}).catch(err => {
  console.error("ERR:", err);
  process.exit(1);
});
