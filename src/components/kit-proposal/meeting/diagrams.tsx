/**
 * Схемы Meeting Mode. Рассчитаны на чтение с 3–4 метров: крупный штрих,
 * минимум подписей, никакой мелкой типографики. Только инлайн-SVG.
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

/* ─── Экран 3. Сеть: непрерывная работа ресурса ─── */

export function ResourceCycle() {
  const N = [
    { id: "A", x: 120, y: 190, t: "Узел A" },
    { id: "B", x: 430, y: 78, t: "Узел B" },
    { id: "C", x: 830, y: 140, t: "Узел C" },
    { id: "D", x: 620, y: 300, t: "Узел D" },
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
      aria-label="Схема сети из четырёх узлов: три плеча выполняются с грузом, одно короткое плечо — порожний переезд к следующей загрузке">
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
        const w = l.loaded ? 100 : 190
        return (
          <g key={l.a + l.b}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={l.loaded ? ACCENT : WARN}
              strokeWidth={l.loaded ? 3.5 : 2.5}
              strokeDasharray={l.loaded ? undefined : "9 7"}
              markerEnd={l.loaded ? "url(#rc-l)" : "url(#rc-e)"}
            />
            <rect
              x={mx - w / 2} y={my - 19} width={w} height="38" rx="5"
              fill="#0A0F16" stroke={l.loaded ? ACCENT : WARN} strokeWidth="1.4"
            />
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
          <text x={n.x} y={n.y + 1} textAnchor="middle" className="kdm-t-big">{n.id}</text>
          <text x={n.x} y={n.y + 22} textAnchor="middle" className="kdm-t-sub">{n.t}</text>
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

/* ─── Экран 4. Три слоя: спрос → ресурсы → назначение ─── */

export function ChainFormation() {
  const tasks = [
    { id: "128", r: "A → B", w: "18 т · 62 м³" },
    { id: "214", r: "B → C", w: "12 т · 74 м³" },
    { id: "309", r: "C → D", w: "20 т · 58 м³" },
  ]
  const res = [
    { t: "Тягач", s: "положение · доступность" },
    { t: "Полуприцеп", s: "тип · совместимость" },
    { t: "Водитель", s: "режим труда и отдыха" },
    { t: "Автономный ресурс", s: "условия эксплуатации", future: true },
  ]

  return (
    <svg viewBox="0 0 1000 470" className="kdm-svg" role="img"
      aria-label="Три слоя формирования цепочки: грузовые задания, ресурсы разных типов и результат назначения — последовательность заданий для каждого ресурса">
      <defs><Arrow id="cf-a" color={LINE} /></defs>

      <text x="0" y="14" className="kdm-t-head">СПРОС · ГРУЗОВЫЕ ЗАДАНИЯ</text>
      {tasks.map((t, i) => (
        <g key={t.id} transform={`translate(${i * 176},30)`}>
          <rect width="160" height="76" rx="6" fill={SURFACE} stroke={LINE} strokeWidth="1.5" />
          <text x="16" y="30" className="kdm-t-lab">Задание {t.id}</text>
          <text x="16" y="50" className="kdm-t-sub">{t.r}</text>
          <text x="16" y="66" className="kdm-t-mono">{t.w}</text>
        </g>
      ))}
      <text x="546" y="72" className="kdm-t-sub">окно погрузки · срок · SLA · совместимость · экономика</text>

      <text x="0" y="152" className="kdm-t-head">РЕСУРСЫ · РАЗНЫЕ СУЩНОСТИ</text>
      {res.map((r, i) => (
        <g key={r.t} transform={`translate(${i * 176},168)`}>
          <rect width="160" height="72" rx="6" fill={SURFACE}
            stroke={r.future ? LINE : ACCENT} strokeWidth="1.5"
            strokeDasharray={r.future ? "6 5" : undefined} />
          <text x="16" y="30" className="kdm-t-lab" fill={r.future ? "#8FA0B5" : "#fff"}>{r.t}</text>
          <text x="16" y="52" className="kdm-t-sub">{r.s}</text>
        </g>
      ))}
      <text x="722" y="212" className="kdm-t-sub">подключается позже —</text>
      <text x="722" y="230" className="kdm-t-sub">ядро не меняется</text>

      <line x1="500" y1="252" x2="500" y2="288" stroke={LINE} strokeWidth="2" markerEnd="url(#cf-a)" />
      <rect x="330" y="290" width="340" height="42" rx="6" fill="#0E141D" stroke={ACCENT} strokeWidth="1.6" />
      <text x="500" y="317" textAnchor="middle" className="kdm-t-lab" fill={ACCENT_2}>
        ПОДБОР ПОСЛЕДОВАТЕЛЬНОСТИ
      </text>

      <text x="0" y="368" className="kdm-t-head">РЕЗУЛЬТАТ · ЦЕПОЧКА НА РЕСУРС</text>
      {[
        { r: "Ресурс 01", c: ["128", "214", "309"] },
        { r: "Ресурс 02", c: ["151", "297", "…"] },
      ].map((row, i) => (
        <g key={row.r} transform={`translate(0,${386 + i * 44})`}>
          <text x="0" y="20" className="kdm-t-lab">{row.r}</text>
          {row.c.map((c, j) => (
            <g key={j} transform={`translate(${132 + j * 132},0)`}>
              <text x="-22" y="20" className="kdm-t-mono">→</text>
              <rect width="108" height="30" rx="4" fill={SURFACE} stroke={ACCENT} strokeWidth="1.3" />
              <text x="54" y="20" textAnchor="middle" className="kdm-t-sub" fill="#fff">Задание {c}</text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  )
}

/* ─── Экран 5. Чей это планировщик ─── */

export function PlannerOwnership() {
  return (
    <svg viewBox="0 0 1000 400" className="kdm-svg" role="img"
      aria-label="Схема принятия решения: сначала проверяем, закрывает ли задачу существующий планировщик компании; если да — интегрируем его, если нет — формулируем недостающую задачу после обследования">
      <defs><Arrow id="po-a" color={LINE} /><Arrow id="po-b" color={ACCENT} /></defs>

      <rect x="300" y="0" width="400" height="66" rx="7" fill={SURFACE} stroke={LINE} strokeWidth="1.5" />
      <text x="500" y="30" textAnchor="middle" className="kdm-t-lab">Задача последовательной загрузки</text>
      <text x="500" y="52" textAnchor="middle" className="kdm-t-sub">«круговые маршруты»</text>

      <line x1="500" y1="66" x2="500" y2="104" stroke={LINE} strokeWidth="2" markerEnd="url(#po-a)" />

      <rect x="240" y="106" width="520" height="62" rx="7" fill="#0E141D" stroke={ACCENT} strokeWidth="1.8" />
      <text x="500" y="134" textAnchor="middle" className="kdm-t-lab" fill={ACCENT_2}>
        Первый вопрос обследования
      </text>
      <text x="500" y="156" textAnchor="middle" className="kdm-t-sub">
        закрывает ли её планировщик, который уже работает в компании?
      </text>

      <line x1="380" y1="168" x2="230" y2="214" stroke={ACCENT} strokeWidth="2" markerEnd="url(#po-b)" />
      <line x1="620" y1="168" x2="770" y2="214" stroke={LINE} strokeWidth="2" markerEnd="url(#po-a)" />

      <g transform="translate(20,216)">
        <rect width="400" height="122" rx="7" fill={SURFACE} stroke={OK} strokeWidth="1.6" />
        <text x="22" y="32" className="kdm-t-lab" fill={OK}>ДА — закрывает</text>
        <text x="22" y="62" className="kdm-t-sub" fill="#B3C0D1">Интегрируем и используем.</text>
        <text x="22" y="84" className="kdm-t-sub" fill="#B3C0D1">Своего алгоритма не создаём.</text>
        <text x="22" y="106" className="kdm-t-mono">это самый дешёвый исход, и он нас устраивает</text>
      </g>

      <g transform="translate(580,216)">
        <rect width="400" height="122" rx="7" fill={SURFACE} stroke={LINE} strokeWidth="1.6" strokeDasharray="6 5" />
        <text x="22" y="32" className="kdm-t-lab" fill={WARN}>НЕТ — не закрывает</text>
        <text x="22" y="62" className="kdm-t-sub" fill="#B3C0D1">Формулируем недостающую</text>
        <text x="22" y="84" className="kdm-t-sub" fill="#B3C0D1">магистральную задачу — после обследования.</text>
        <text x="22" y="106" className="kdm-t-mono">не раньше, чем увидим данные и ограничения</text>
      </g>

      <text x="500" y="380" textAnchor="middle" className="kdm-t-sub" fill="#6F7F93">
        Абстрагируем контракты, но не абстрагируем планировщики
      </text>
    </svg>
  )
}

/* ─── Экран 7. Доверенный AI-контур ─── */

export function AiStack() {
  const rows = [
    { t: "Корпоративные данные и документы", s: "регламенты · инструкции · документы перевозки · документация поставщиков", k: "src" },
    { t: "Операционный и событийный слой", s: "план и факт · телематика · события узла · время прибытия · экономика плеча", k: "ops" },
    { t: "Защищённая база знаний", s: "разграничение доступа · аудит запросов · фильтрация чувствительных данных", k: "kb" },
    { t: "Корпоративный ассистент", s: "вопрос на естественном языке — ответ со ссылкой на источник", k: "ai" },
  ]

  return (
    <svg viewBox="0 0 1100 316" className="kdm-svg" role="img"
      aria-label="Четыре слоя корпоративного AI-контура: корпоративные данные, операционный слой, защищённая база знаний с разграничением доступа и аудитом, корпоративный ассистент">
      <defs><Arrow id="ai-a" color={LINE} /></defs>
      {rows.map((r, i) => {
        const y = i * 80
        const last = i === rows.length - 1
        return (
          <g key={r.k}>
            <rect x="60" y={y} width="980" height="62" rx="7"
              fill={last ? "#0E141D" : SURFACE}
              stroke={last ? ACCENT : LINE} strokeWidth={last ? 1.8 : 1.5} />
            <text x="86" y={y + 28} className="kdm-t-lab" fill={last ? ACCENT_2 : "#e6edf5"}>{r.t}</text>
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

/* ─── Экран 7б. Разделение ролей — вёрстка, а не SVG ───
   В колонке SVG масштабируется вниз и текст становится нечитаемым
   с нескольких метров. Обычная разметка масштабируется корректно. */

export const AI_BOUNDARIES: { a: string; b: string; tone: "algo" | "llm" | "vendor" }[] = [
  { a: "Маршрутизация и расписание", b: "алгоритмическая оптимизация", tone: "algo" },
  { a: "Прогноз времени прибытия", b: "статистика, при основаниях — ML", tone: "algo" },
  { a: "Вопросы к данным и знаниям", b: "языковая модель", tone: "llm" },
  { a: "Управление автомобилем", b: "зона производителя техники", tone: "vendor" },
]

export const BOUNDARY_TONE: Record<string, string> = {
  algo: ACCENT_2,
  llm: HYP,
  vendor: "#6F7F93",
}

/* ─── Экран 8. Этап 0 ─── */

export function Stage0Flow() {
  const steps = ["AS-IS", "данные", "baseline", "TO-BE", "scope пилота"]
  return (
    <svg viewBox="0 0 1000 150" className="kdm-svg" role="img"
      aria-label="Последовательность этапа 0: описание процесса как есть, данные, базовый замер, целевая модель, границы пилота и решение продолжить, скорректировать или остановиться">
      <defs><Arrow id="s0-a" color={LINE} /></defs>
      {steps.map((s, i) => {
        const w = 158, gap = 24
        const x = i * (w + gap)
        return (
          <g key={s}>
            <rect x={x} y="18" width={w} height="56" rx="6" fill={SURFACE} stroke={ACCENT} strokeWidth="1.5" />
            <text x={x + w / 2} y="52" textAnchor="middle" className="kdm-t-lab">{s}</text>
            {i < steps.length - 1 ? (
              <line x1={x + w} y1="46" x2={x + w + gap - 4} y2="46" stroke={LINE} strokeWidth="2" markerEnd="url(#s0-a)" />
            ) : null}
          </g>
        )
      })}
      <rect x="0" y="100" width="910" height="42" rx="6" fill="#0E141D" stroke={OK} strokeWidth="1.6" />
      <text x="24" y="127" className="kdm-t-lab" fill={OK}>GO · ADJUST · STOP</text>
      <text x="196" y="127" className="kdm-t-sub">решение принимается на данных, а не на презентации</text>
    </svg>
  )
}
