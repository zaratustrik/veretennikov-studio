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
      <text x="84" y="250" className="kdm-t-head" fill="#DAEAF6">ЦИФРОВОЕ ЯДРО УПРАВЛЕНИЯ ГРУЗОПОТОКАМИ</text>
      <text x="84" y="277" className="kdm-t-lab" fill="#fff">
        партии · консолидация · терминалы · плечи · сроки · события · аналитика
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
  const steps = ["Реальный поток", "Данные", "Baseline", "Постановка задачи", "Scope пилота"]
  return (
    <svg viewBox="0 0 1100 158" className="kdm-svg" role="img"
      aria-label="Последовательность первого этапа: реальный грузопоток, данные, базовый замер, постановка задачи оптимизации, границы пилота и решение продолжить, скорректировать или остановиться">
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
