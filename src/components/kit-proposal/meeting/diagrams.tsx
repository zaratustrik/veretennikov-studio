/**
 * Схемы Meeting Mode. Рассчитаны на чтение с 3–4 метров: крупный штрих,
 * минимум подписей, никакой мелкой типографики. Только инлайн-SVG.
 *
 * Все схемы идут на полную ширину слайда: в узкой колонке SVG
 * масштабируется вниз вместе с текстом и становится нечитаемым.
 */

const ACCENT = "#4694D1"
const ACCENT_2 = "#7AB8E8"
const LINE = "#2F3D4F"
const SURFACE = "#131B26"
const OK = "#4FBE8A"
const WARN = "#E0A63C"
const HYP = "#B98AD4"

function Arrow({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 10 8" refX="9" refY="4" markerWidth="10" markerHeight="8" orient="auto-start-reverse">
      <path d="M0 0 L10 4 L0 8 z" fill={color} />
    </marker>
  )
}

/* ─── Экран 2. Непрерывная работа ресурса ─── */

export function ResourceCycle() {
  const N = [
    { id: "A", x: 120, y: 190 },
    { id: "B", x: 430, y: 78 },
    { id: "C", x: 830, y: 140 },
    { id: "D", x: 620, y: 300 },
  ]
  const p = (a: string) => N.find((n) => n.id === a)!

  const legs = [
    { a: "A", b: "B", label: "Груз 1", loaded: true },
    { a: "B", b: "C", label: "Груз 2", loaded: true },
    { a: "C", b: "D", label: "Груз 3", loaded: true },
    { a: "D", b: "A", label: "Порожний переезд", loaded: false },
  ]

  return (
    <svg viewBox="0 0 1100 400" className="kdm-svg" role="img"
      aria-label="Четыре узла сети: три плеча выполняются с грузом, одно короткое плечо — порожний переезд к следующей загрузке">
      <defs>
        <Arrow id="rc-l" color={ACCENT} />
        <Arrow id="rc-e" color={WARN} />
      </defs>

      {legs.map((l) => {
        const A = p(l.a), B = p(l.b)
        const dx = B.x - A.x, dy = B.y - A.y
        const len = Math.hypot(dx, dy)
        const ux = dx / len, uy = dy / len
        const R = 46
        const x1 = A.x + ux * R, y1 = A.y + uy * R
        const x2 = B.x - ux * (R + 12), y2 = B.y - uy * (R + 12)
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
        const w = l.loaded ? 104 : 196
        return (
          <g key={l.a + l.b}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={l.loaded ? ACCENT : WARN}
              strokeWidth={l.loaded ? 3.5 : 2.5}
              strokeDasharray={l.loaded ? undefined : "9 7"}
              markerEnd={l.loaded ? "url(#rc-l)" : "url(#rc-e)"}
            />
            <rect x={mx - w / 2} y={my - 19} width={w} height="38" rx="5"
              fill="#0A0F16" stroke={l.loaded ? ACCENT : WARN} strokeWidth="1.4" />
            <text x={mx} y={my + 6} textAnchor="middle" className="kdm-t-lab"
              fill={l.loaded ? "#fff" : WARN}>
              {l.label}
            </text>
          </g>
        )
      })}

      {N.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="46" fill={SURFACE} stroke={LINE} strokeWidth="2" />
          <text x={n.x} y={n.y + 9} textAnchor="middle" className="kdm-t-big">{n.id}</text>
        </g>
      ))}

      <g transform="translate(0,378)">
        <line x1="10" y1="0" x2="46" y2="0" stroke={ACCENT} strokeWidth="3.5" />
        <text x="58" y="5" className="kdm-t-sub" fill="#B3C0D1">плечо с грузом — полезная работа</text>
        <line x1="420" y1="0" x2="456" y2="0" stroke={WARN} strokeWidth="2.5" strokeDasharray="9 7" />
        <text x="468" y="5" className="kdm-t-sub" fill="#B3C0D1">короткий порожний переезд к следующей загрузке</text>
      </g>
    </svg>
  )
}

/* ─── Экран 3. Что именно оптимизируем ─── */

export function WhatToOptimise() {
  const items = [
    { t: "Груз", s: "объём · масса · срок" },
    { t: "Тягач", s: "положение · доступность" },
    { t: "Полуприцеп", s: "тип · совместимость" },
    { t: "Водитель", s: "режим труда и отдыха" },
    { t: "Автопоезд", s: "сцепка как единица" },
    { t: "Терминал", s: "окно обработки · слот" },
    { t: "Временнóе окно", s: "когда можно взять и сдать" },
    { t: "Следующее задание", s: "чем продолжить работу" },
  ]

  return (
    <svg viewBox="0 0 1100 300" className="kdm-svg" role="img"
      aria-label="Восемь разных сущностей, каждая со своими ограничениями: груз, тягач, полуприцеп, водитель, автопоезд, терминал, временное окно и следующее задание">
      {items.map((it, i) => {
        const col = i % 4, row = Math.floor(i / 4)
        const x = col * 278, y = row * 118
        return (
          <g key={it.t} transform={`translate(${x},${y})`}>
            <rect width="258" height="98" rx="7" fill={SURFACE} stroke={LINE} strokeWidth="1.5" />
            <text x="22" y="42" className="kdm-t-lab">{it.t}</text>
            <text x="22" y="68" className="kdm-t-sub">{it.s}</text>
          </g>
        )
      })}
      <text x="0" y="288" className="kdm-t-sub" fill="#6F7F93">
        у каждой — свои ограничения и своя доступность
      </text>
    </svg>
  )
}

/* ─── Экран 4. Откуда возникает решение ─── */

export function SolutionOrigin() {
  const inputs = [
    { t: "Грузовые задания", s: "что везти и куда" },
    { t: "Доступные ресурсы", s: "чем везти" },
    { t: "Операционные ограничения", s: "когда и как можно" },
    { t: "Состояние сети", s: "где что находится сейчас" },
  ]

  return (
    <svg viewBox="0 0 1100 420" className="kdm-svg" role="img"
      aria-label="Схема: задания, ресурсы, ограничения и состояние сети поступают в специализированный планировщик, на выходе — последовательность заданий и сравнение плана с фактом">
      <defs><Arrow id="so-a" color={LINE} /><Arrow id="so-b" color={ACCENT} /></defs>

      {inputs.map((it, i) => (
        <g key={it.t} transform={`translate(${i * 278},0)`}>
          <rect width="258" height="82" rx="7" fill={SURFACE} stroke={LINE} strokeWidth="1.5" />
          <text x="20" y="36" className="kdm-t-lab">{it.t}</text>
          <text x="20" y="60" className="kdm-t-sub">{it.s}</text>
          <line x1="129" y1="82" x2="129" y2="112" stroke={LINE} strokeWidth="2" />
        </g>
      ))}

      <line x1="129" y1="112" x2="971" y2="112" stroke={LINE} strokeWidth="2" />
      <line x1="550" y1="112" x2="550" y2="140" stroke={LINE} strokeWidth="2" markerEnd="url(#so-a)" />

      <rect x="260" y="142" width="580" height="76" rx="8" fill="#0E141D" stroke={ACCENT} strokeWidth="2" />
      <text x="550" y="176" textAnchor="middle" className="kdm-t-lab" fill={ACCENT_2}>
        СПЕЦИАЛИЗИРОВАННЫЙ ПЛАНИРОВЩИК
      </text>
      <text x="550" y="202" textAnchor="middle" className="kdm-t-sub">
        существующий, расширенный или новый — решается после обследования
      </text>

      <line x1="550" y1="218" x2="550" y2="248" stroke={ACCENT} strokeWidth="2" markerEnd="url(#so-b)" />

      <rect x="180" y="250" width="740" height="72" rx="7" fill={SURFACE} stroke={ACCENT} strokeWidth="1.6" />
      <text x="550" y="282" textAnchor="middle" className="kdm-t-lab">Последовательность заданий для ресурса</text>
      <text x="550" y="306" textAnchor="middle" className="kdm-t-sub">Ресурс 01 → 128 → 214 → 309</text>

      <line x1="550" y1="322" x2="550" y2="348" stroke={LINE} strokeWidth="2" markerEnd="url(#so-a)" />

      <rect x="300" y="350" width="500" height="60" rx="7" fill={SURFACE} stroke={LINE} strokeWidth="1.5" />
      <text x="550" y="378" textAnchor="middle" className="kdm-t-lab">План · факт · исключения</text>
      <text x="550" y="399" textAnchor="middle" className="kdm-t-sub">то, что видит оператор</text>
    </svg>
  )
}


/* ─── Экран 7. Встраивание в существующий контур ─── */

export function IntegrationContour() {
  return (
    <svg viewBox="0 0 1100 404" className="kdm-svg" role="img"
      aria-label="Схема встраивания: сотрудник работает и через корпоративный контур, и напрямую в операционном интерфейсе. Корпоративный контур связан с цифровым ядром через адаптеры, операционный интерфейс — напрямую, поэтому не зависит от портала. Ниже ядра через адаптеры подключены существующие и будущие системы компании.">
      <defs>
        <Arrow id="ic-a" color={ACCENT} />
        <Arrow id="ic-g" color={LINE} />
      </defs>

      {/* Сотрудник */}
      <rect x="440" y="0" width="220" height="40" rx="6" fill={SURFACE} stroke={LINE} strokeWidth="1.5" />
      <text x="550" y="26" textAnchor="middle" className="kdm-t-lab">Сотрудник КИТ</text>

      {/* Развилка: два независимых пути */}
      <line x1="500" y1="40" x2="300" y2="60" stroke={LINE} strokeWidth="2" markerEnd="url(#ic-g)" />
      <line x1="600" y1="40" x2="800" y2="60" stroke={ACCENT} strokeWidth="2.5" markerEnd="url(#ic-a)" />

      {/* Корпоративный контур — чужая территория, нейтральный тон */}
      <rect x="60" y="62" width="440" height="80" rx="7" fill={SURFACE} stroke={LINE} strokeWidth="1.5" />
      <text x="84" y="90" className="kdm-t-lab">Корпоративный контур</text>
      <text x="84" y="113" className="kdm-t-sub">Bitrix24 · задачи · согласования</text>
      <text x="84" y="132" className="kdm-t-sub">коммуникации · документы</text>

      {/* Операционный интерфейс — наша территория */}
      <rect x="600" y="62" width="440" height="80" rx="7" fill="#0E141D" stroke={ACCENT} strokeWidth="1.8" />
      <text x="624" y="90" className="kdm-t-lab" fill={ACCENT_2}>Операционный интерфейс</text>
      <text x="624" y="113" className="kdm-t-sub">диспетчер работает напрямую</text>
      <text x="624" y="132" className="kdm-t-sub" fill={OK}>не зависит от портала</text>

      {/* Адаптеры к корпоративному контуру */}
      <line x1="280" y1="142" x2="280" y2="162" stroke={ACCENT} strokeWidth="2" />
      <rect x="172" y="164" width="216" height="32" rx="5" fill="#0A0F16" stroke={ACCENT} strokeWidth="1.5" />
      <text x="280" y="185" textAnchor="middle" className="kdm-t-lab" fill={ACCENT_2}>API · адаптеры</text>
      <line x1="280" y1="196" x2="280" y2="220" stroke={ACCENT} strokeWidth="2" markerEnd="url(#ic-a)" />

      {/* Что именно уходит наверх */}
      <text x="402" y="178" className="kdm-t-sub" fill={WARN}>↑ только то, что требует</text>
      <text x="402" y="196" className="kdm-t-sub" fill={WARN}>решения человека</text>

      {/* Прямой путь: минует адаптеры и портал */}
      <line x1="820" y1="142" x2="820" y2="220" stroke={ACCENT} strokeWidth="2.5" markerEnd="url(#ic-a)" />

      {/* Цифровое ядро */}
      <rect x="60" y="222" width="980" height="92" rx="8" fill={ACCENT} />
      <text x="84" y="250" className="kdm-t-head" fill="#DAEAF6">ЦИФРОВОЕ ЯДРО МАГИСТРАЛЬНОЙ ЛОГИСТИКИ</text>
      <text x="84" y="277" className="kdm-t-lab" fill="#fff">
        рейсы · плечи · ресурсы · полуприцепы · узлы · ETA · события · аналитика
      </text>
      <text x="84" y="300" className="kdm-t-sub" fill="#C9E1F5">
        телеметрия, координаты и постоянные пересчёты остаются здесь
      </text>

      {/* Адаптеры к внешним системам */}
      <line x1="550" y1="314" x2="550" y2="330" stroke={ACCENT} strokeWidth="2" />
      <rect x="442" y="332" width="216" height="32" rx="5" fill="#0A0F16" stroke={ACCENT} strokeWidth="1.5" />
      <text x="550" y="353" textAnchor="middle" className="kdm-t-lab" fill={ACCENT_2}>API · адаптеры</text>
      <line x1="550" y1="364" x2="550" y2="380" stroke={ACCENT} strokeWidth="2" markerEnd="url(#ic-a)" />

      {/* Существующие и будущие системы — одной строкой */}
      <rect x="60" y="372" width="980" height="32" rx="6"
        fill={SURFACE} stroke={LINE} strokeWidth="1.4" strokeDasharray="6 5" />
      <text x="550" y="393" textAnchor="middle" className="kdm-t-lab" fill="#B3C0D1">
        КИТ.API · Veeroute · ЭДО · склад · телематика · автономный транспорт
      </text>
    </svg>
  )
}

/* ─── Экран 8. От маршрута к сети ─── */

export function NetworkScale() {
  const steps = [
    { t: "Одно направление", s: "проверяемый пилот", now: true },
    { t: "Несколько связанных плеч", s: "последовательность работы", now: true },
    { t: "Терминалы сети", s: "передача и обработка", now: false },
    { t: "Партнёрские ресурсы", s: "привлечённый транспорт", now: false },
    { t: "Будущий узел", s: "если проект состоится", now: false },
    { t: "Автономные ресурсы", s: "ещё один тип исполнителя", now: false },
  ]

  return (
    <svg viewBox="0 0 1100 240" className="kdm-svg" role="img"
      aria-label="Масштабирование от одного направления к нескольким плечам, терминалам сети, партнёрским ресурсам, будущему узлу и автономным ресурсам">
      <defs><Arrow id="ns-a" color={LINE} /></defs>
      {steps.map((s, i) => {
        const col = i % 3, row = Math.floor(i / 3)
        const x = col * 372, y = row * 118
        return (
          <g key={s.t} transform={`translate(${x},${y})`}>
            <rect width="348" height="94" rx="7"
              fill={s.now ? "#0E141D" : SURFACE}
              stroke={s.now ? ACCENT : LINE} strokeWidth="1.6"
              strokeDasharray={s.now ? undefined : "7 6"} />
            <text x="24" y="42" className="kdm-t-lab" fill={s.now ? "#fff" : "#8FA0B5"}>{s.t}</text>
            <text x="24" y="68" className="kdm-t-sub">{s.s}</text>
            {i < steps.length - 1 && col < 2 ? (
              <line x1="348" y1="47" x2="368" y2="47" stroke={LINE} strokeWidth="2" markerEnd="url(#ns-a)" />
            ) : null}
          </g>
        )
      })}
      <g transform="translate(0,228)">
        <rect x="0" y="-12" width="14" height="14" rx="3" fill="#0E141D" stroke={ACCENT} strokeWidth="1.6" />
        <text x="24" y="0" className="kdm-t-sub" fill="#B3C0D1">проверяемо на первом этапе</text>
        <rect x="330" y="-12" width="14" height="14" rx="3" fill={SURFACE} stroke={LINE} strokeWidth="1.6" strokeDasharray="4 3" />
        <text x="354" y="0" className="kdm-t-sub" fill="#B3C0D1">потенциальное развитие после подтверждения базовой задачи</text>
      </g>
    </svg>
  )
}

/* ─── Приложение. Слои данных ─── */

export function AiStack() {
  const rows = [
    { t: "Операционные данные и документы", s: "план и факт · события · регламенты · документы перевозки", k: "src" },
    { t: "Накопленная история", s: "то, чего нельзя купить: она требует времени наблюдений", k: "ops" },
    { t: "Разграничение доступа и аудит", s: "правила предприятия, а не правила инструмента", k: "kb" },
    { t: "Внутренний аналитический помощник", s: "вопрос сотрудника — ответ со ссылкой на источник", k: "ai" },
  ]

  return (
    <svg viewBox="0 0 1100 316" className="kdm-svg" role="img"
      aria-label="Четыре слоя: операционные данные и документы, накопленная история, разграничение доступа и аудит, внутренний аналитический помощник">
      <defs><Arrow id="ai-a" color={LINE} /></defs>
      {rows.map((r, i) => {
        const y = i * 80
        const last = i === rows.length - 1
        return (
          <g key={r.k}>
            <rect x="60" y={y} width="980" height="62" rx="7"
              fill={last ? "#0E141D" : SURFACE}
              stroke={last ? HYP : LINE} strokeWidth={last ? 1.8 : 1.5}
              strokeDasharray={last ? "7 6" : undefined} />
            <text x="86" y={y + 28} className="kdm-t-lab" fill={last ? HYP : "#e6edf5"}>{r.t}</text>
            <text x="86" y={y + 49} className="kdm-t-sub">{r.s}</text>
            {!last ? (
              <line x1="550" y1={y + 62} x2="550" y2={y + 76} stroke={LINE} strokeWidth="2" markerEnd="url(#ai-a)" />
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}

export const AI_BOUNDARIES: { a: string; b: string; tone: "algo" | "llm" | "vendor" }[] = [
  { a: "Маршрутизация и расписание", b: "математическая оптимизация", tone: "algo" },
  { a: "Прогноз времени прибытия", b: "статистика, при основаниях — ML", tone: "algo" },
  { a: "Вопросы к данным и знаниям", b: "языковая модель", tone: "llm" },
  { a: "Управление автомобилем", b: "зона производителя техники", tone: "vendor" },
]

export const BOUNDARY_TONE: Record<string, string> = {
  algo: ACCENT_2,
  llm: HYP,
  vendor: "#6F7F93",
}

/* ─── Экран 7. Этап 0 ─── */

export function Stage0Flow() {
  const steps = ["Реальный процесс", "Данные", "Baseline", "Постановка задачи", "Scope пилота"]
  return (
    <svg viewBox="0 0 1100 158" className="kdm-svg" role="img"
      aria-label="Последовательность первого этапа: реальный процесс, данные, базовый замер, постановка задачи оптимизации, границы пилота и решение продолжить, скорректировать или остановиться">
      <defs><Arrow id="s0-a" color={LINE} /></defs>
      {steps.map((s, i) => {
        const w = 196, gap = 30
        const x = i * (w + gap)
        return (
          <g key={s}>
            <rect x={x} y="14" width={w} height="60" rx="7" fill={SURFACE} stroke={ACCENT} strokeWidth="1.6" />
            <text x={x + w / 2} y="50" textAnchor="middle" className="kdm-t-lab">{s}</text>
            {i < steps.length - 1 ? (
              <line x1={x + w} y1="44" x2={x + w + gap - 5} y2="44" stroke={LINE} strokeWidth="2" markerEnd="url(#s0-a)" />
            ) : null}
          </g>
        )
      })}
      <rect x="0" y="102" width="1022" height="48" rx="7" fill="#0E141D" stroke={OK} strokeWidth="1.6" />
      <text x="26" y="132" className="kdm-t-lab" fill={OK}>GO · ADJUST · STOP</text>
      <text x="228" y="132" className="kdm-t-sub">решение принимается на ваших данных, а не на этой презентации</text>
    </svg>
  )
}
