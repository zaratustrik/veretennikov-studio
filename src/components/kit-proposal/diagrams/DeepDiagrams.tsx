/** Схемы deep-dive страниц. Только инлайн-SVG. */

const ACCENT = "#4694D1"
const ACCENT_DEEP = "#1355A0"
const ACCENT_SOFT = "#DAEAF6"
const LINE = "#C6CEDA"
const LINE_SOFT = "#DDE3EA"
const SURFACE = "#FFFFFF"
const INK = "#10161F"
const GREEN = "#1E7F4F"
const AMBER = "#B07208"
const RED = "#B3261E"

function Arrow({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 8 6" refX="7.4" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L8 3 L0 6 z" fill={color} />
    </marker>
  )
}

/* ─── Adapter-модель подключения автономного исполнителя ─── */

export function AdapterFlow() {
  const boxes = [
    { x: 0, t: "Система КИТ", s: "формирует задачу: что, откуда, куда, к какому сроку", own: true },
    { x: 250, t: "Адаптер", s: "переводит задачу в интерфейс конкретного поставщика", own: true },
    { x: 500, t: "Управление поставщика", s: "его собственная система управления машиной", own: false },
    { x: 750, t: "Автономный тягач", s: "исполняет", own: false },
  ]

  return (
    <svg
      viewBox="0 0 968 302"
      role="img"
      aria-label="Модель подключения автономного исполнителя: система КИТ формирует бизнес-задачу, адаптер переводит её в интерфейс поставщика, поставщик управляет машиной. Обратно поступают телеметрия, статусы, расчётное время, исключения и доступность"
    >
      <defs>
        <Arrow id="af-f" color={ACCENT} />
        <Arrow id="af-b" color="#7B8593" />
      </defs>

      <text x="0" y="16" className="kdl-svg-head">
        ЗАДАЧА ИДЁТ ВПЕРЁД
      </text>

      {boxes.map((b, i) => (
        <g key={b.t}>
          <rect
            x={b.x}
            y="30"
            width="218"
            height="74"
            rx="5"
            fill={b.own ? ACCENT_SOFT : SURFACE}
            stroke={b.own ? ACCENT : LINE}
            strokeWidth={b.own ? 1.6 : 1}
          />
          <text x={b.x + 16} y="56" className="kdl-svg-label">
            {b.t}
          </text>
          <text x={b.x + 16} y="76" className="kdl-svg-sub">
            {b.s.length > 42 ? b.s.slice(0, 42) : b.s}
          </text>
          {b.s.length > 42 ? (
            <text x={b.x + 16} y="92" className="kdl-svg-sub">
              {b.s.slice(42)}
            </text>
          ) : null}
          {i < boxes.length - 1 ? (
            <line
              x1={b.x + 218}
              y1="67"
              x2={b.x + 246}
              y2="67"
              stroke={ACCENT}
              strokeWidth="1.5"
              markerEnd="url(#af-f)"
            />
          ) : null}
        </g>
      ))}

      <text x="0" y="146" className="kdl-svg-head">
        ДАННЫЕ ВОЗВРАЩАЮТСЯ
      </text>
      <line x1="958" y1="164" x2="10" y2="164" stroke="#7B8593" strokeWidth="1.5" markerEnd="url(#af-b)" strokeDasharray="5 4" />
      {["телеметрия", "статус", "расчётное время", "исключения", "доступность"].map((t, i) => (
        <text key={t} x={40 + i * 186} y="186" className="kdl-svg-sub">
          {t}
        </text>
      ))}

      <rect x="0" y="212" width="968" height="58" rx="5" fill="rgba(179,38,30,.05)" stroke={RED} strokeDasharray="5 4" />
      <text x="18" y="236" className="kdl-svg-label" fill={RED}>
        Граница, которую наша система не пересекает
      </text>
      <text x="18" y="256" className="kdl-svg-sub">
        Руление, торможение, восприятие обстановки и безопасность движения остаются полностью в зоне поставщика.
      </text>

      <text x="0" y="292" className="kdl-svg-sub">
        Мы формируем бизнес-задачу и принимаем факты. Машиной управляет тот, кто за неё отвечает.
      </text>
    </svg>
  )
}

/* ─── Процесс автономного двора ─── */

export function YardProcess() {
  const steps = [
    { t: "Ворота", s: "опознание, допуск" },
    { t: "Взвешивание", s: "контроль массы" },
    { t: "Слот", s: "место на площадке" },
    { t: "Перестановка", s: "человек или робот" },
    { t: "Сцепка / расцепка", s: "ключевая операция" },
    { t: "Док", s: "погрузка, разгрузка" },
    { t: "Готовность к выезду", s: "правило, а не экран" },
  ]
  const W = 128
  const GAP = 12

  return (
    <svg
      viewBox="0 0 968 216"
      role="img"
      aria-label="Процесс двора: ворота, взвешивание, слот, перестановка, сцепка и расцепка, док, проверка готовности к выезду. Каждый шаг может исполняться человеком или автономной техникой без изменения самого процесса"
    >
      <defs>
        <Arrow id="yp-a" color={LINE} />
      </defs>

      {steps.map((s, i) => {
        const x = i * (W + GAP)
        const key = i === 4
        return (
          <g key={s.t}>
            <rect
              x={x}
              y="28"
              width={W}
              height="72"
              rx="5"
              fill={key ? ACCENT_SOFT : SURFACE}
              stroke={key ? ACCENT : LINE}
              strokeWidth={key ? 1.6 : 1}
            />
            <text x={x + 12} y="54" className="kdl-svg-label">
              {s.t}
            </text>
            <text x={x + 12} y="74" className="kdl-svg-sub">
              {s.s}
            </text>
            {i < steps.length - 1 ? (
              <line x1={x + W} y1="64" x2={x + W + GAP - 2} y2="64" stroke={LINE} strokeWidth="1.5" markerEnd="url(#yp-a)" />
            ) : null}
          </g>
        )
      })}

      <text x="0" y="16" className="kdl-svg-head">
        ПРОЦЕСС ОДИНАКОВ ДЛЯ ЧЕЛОВЕКА И ДЛЯ АВТОНОМНОЙ ТЕХНИКИ
      </text>

      <line x1="0" y1="128" x2="968" y2="128" stroke={LINE_SOFT} />
      <text x="0" y="152" className="kdl-svg-label" fill={ACCENT_DEEP}>
        Сцепка и расцепка — самая тяжёлая ручная операция и самая ценная для автоматизации.
      </text>
      <text x="0" y="174" className="kdl-svg-sub">
        Существуют роботы-манипуляторы, самостоятельно подключающие тормозные и электрические линии полуприцепа.
      </text>
      <text x="0" y="192" className="kdl-svg-sub">
        Следствие для закупок уже сегодня: автоматизируемость сцепки — критерий выбора полуприцепов и тягачей,
      </text>
      <text x="0" y="208" className="kdl-svg-sub">
        потому что техника, купленная сейчас, будет работать тогда, когда автономный двор станет доступен.
      </text>
    </svg>
  )
}

/* ─── Матрица зрелости ─── */

export function MaturityMatrix() {
  const items = [
    { t: "Складская робототехника", x: 3, y: 0, g: "ready" },
    { t: "Роботы последней мили", x: 3, y: 1, g: "ready" },
    { t: "Автономный двор", x: 2, y: 1, g: "ready" },
    { t: "Автоматическая сцепка", x: 2, y: 0, g: "ready" },
    { t: "Магистральные ВАТС", x: 2, y: 2, g: "dev" },
    { t: "Роботизированная разгрузка", x: 1, y: 2, g: "dev" },
    { t: "Автономные фургоны", x: 1, y: 3, g: "dev" },
    { t: "Грузовые дроны", x: 1, y: 4, g: "hor" },
    { t: "Мультимодальность", x: 2, y: 4, g: "hor" },
  ]
  const colX = [40, 260, 480, 700]
  const rowY = [40, 96, 152, 208, 264]
  const colLab = ["Пилоты", "Ранняя коммерция", "Коммерческая", "Промышленная"]
  const rowLab = ["2026–2027", "2027–2028", "2028–2029", "2029+", "перспектива"]
  const color = (g: string) => (g === "ready" ? GREEN : g === "dev" ? AMBER : "#7B8593")

  return (
    <svg
      viewBox="0 0 968 344"
      role="img"
      aria-label="Матрица зрелости автономных технологий: по горизонтали — зрелость в России, по вертикали — реалистичный горизонт для компании. Автономность двора и складская робототехника зрелее и ближе, чем магистральные беспилотники"
    >
      <text x="40" y="16" className="kdl-svg-head">
        ЗРЕЛОСТЬ В РОССИИ →
      </text>
      <text x="0" y="332" className="kdl-svg-head">
        ↓ ГОРИЗОНТ ДЛЯ КИТ
      </text>

      {colX.map((x, i) => (
        <text key={i} x={x} y="32" className="kdl-svg-mono">
          {colLab[i]}
        </text>
      ))}
      {rowY.map((y, i) => (
        <text key={i} x="0" y={y + 26} className="kdl-svg-mono">
          {rowLab[i]}
        </text>
      ))}

      {items.map((it) => (
        <g key={it.t}>
          <rect
            x={colX[it.x]}
            y={rowY[it.y]}
            width="212"
            height="42"
            rx="5"
            fill={SURFACE}
            stroke={color(it.g)}
            strokeWidth="1.4"
          />
          <circle cx={colX[it.x]! + 14} cy={rowY[it.y]! + 21} r="4" fill={color(it.g)} />
          <text x={colX[it.x]! + 26} y={rowY[it.y]! + 25} className="kdl-svg-label">
            {it.t}
          </text>
        </g>
      ))}
    </svg>
  )
}

/* ─── Дерево экономического эффекта ─── */

export function EffectTree() {
  const drivers = [
    { t: "Время планирования", d: "↓", now: true },
    { t: "Простой в узле", d: "↓", now: true },
    { t: "Порожний пробег", d: "↓", now: true },
    { t: "Загрузка полуприцепа", d: "↑", now: true },
    { t: "Использование тягача", d: "↑", now: true },
    { t: "Оборачиваемость полуприцепа", d: "↑", now: true },
    { t: "Опоздания и компенсации", d: "↓", now: true },
    { t: "Ручные операции", d: "↓", now: true },
    { t: "Разбор исключений", d: "↓", now: true },
    { t: "Зависимость от водителя", d: "↓", now: false },
  ]

  return (
    <svg
      viewBox="0 0 968 356"
      role="img"
      aria-label="Дерево экономического эффекта: девять из десяти драйверов работают на существующем парке без автономной техники. Только последний требует появления беспилотных исполнителей"
    >
      <defs>
        <Arrow id="et-a" color={LINE} />
      </defs>

      <rect x="334" y="0" width="300" height="52" rx="5" fill={ACCENT} />
      <text x="484" y="24" textAnchor="middle" className="kdl-svg-head" fill="#DAEAF6">
        ЭКОНОМИЧЕСКИЙ ЭФФЕКТ
      </text>
      <text x="484" y="42" textAnchor="middle" className="kdl-svg-sub" fill="#fff">
        измеряется только относительно подписанного baseline
      </text>

      <line x1="484" y1="52" x2="484" y2="76" stroke={LINE} strokeWidth="1.5" />
      <line x1="80" y1="76" x2="888" y2="76" stroke={LINE} strokeWidth="1.5" />

      {drivers.map((d, i) => {
        const col = i % 5
        const row = Math.floor(i / 5)
        const x = col * 190
        const y = 100 + row * 92
        return (
          <g key={d.t}>
            {row === 0 ? (
              <line x1={x + 88} y1="76" x2={x + 88} y2={y} stroke={LINE} strokeWidth="1.5" markerEnd="url(#et-a)" />
            ) : null}
            <rect
              x={x}
              y={y}
              width="176"
              height="66"
              rx="5"
              fill={SURFACE}
              stroke={d.now ? GREEN : AMBER}
              strokeWidth="1.4"
              strokeDasharray={d.now ? undefined : "5 4"}
            />
            <text
              x={x + 14}
              y={y + 26}
              style={{ fontSize: 15, fontWeight: 600, fill: d.now ? GREEN : AMBER }}
              className="kdl-svg-label"
            >
              {d.d}
            </text>
            <text x={x + 34} y={y + 26} className="kdl-svg-label">
              {d.t.length > 20 ? d.t.slice(0, 20) : d.t}
            </text>
            {d.t.length > 20 ? (
              <text x={x + 34} y={y + 42} className="kdl-svg-label">
                {d.t.slice(20)}
              </text>
            ) : null}
            <text x={x + 14} y={y + 58} className="kdl-svg-mono" fill={d.now ? GREEN : AMBER}>
              {d.now ? "работает сегодня" : "требует автономной техники"}
            </text>
          </g>
        )
      })}

      <text x="0" y="340" className="kdl-svg-sub">
        Девять драйверов из десяти не требуют появления беспилотников. Автономность — дополнительная возможность, а не условие окупаемости.
      </text>
    </svg>
  )
}

/* ─── Слои инфраструктуры ─── */

export function InfraStack() {
  const layers = [
    { t: "Клиенты и системы КИТ", s: "существующий контур компании", fill: "#F2F4F7", stroke: LINE },
    { t: "Интеграции и программные интерфейсы", s: "получить задачу, вернуть факт", fill: SURFACE, stroke: LINE },
    { t: "Операционное ядро", s: "задачи, ресурсы, ответственность, план и факт", fill: ACCENT_SOFT, stroke: ACCENT },
    { t: "Событийный слой", s: "факт прибытия или перецепки доступен всем системам без жёсткой связи", fill: ACCENT_SOFT, stroke: ACCENT },
  ]

  return (
    <svg
      viewBox="0 0 968 352"
      role="img"
      aria-label="Слои инфраструктуры: системы КИТ, интеграции, операционное ядро, событийный слой, ниже — телеметрия и локальный узел площадки, ещё ниже — аналитика и история"
    >
      <defs>
        <Arrow id="is-a" color={LINE} />
      </defs>

      {layers.map((l, i) => (
        <g key={l.t}>
          <rect x="134" y={i * 62} width="700" height="50" rx="5" fill={l.fill} stroke={l.stroke} strokeWidth={i >= 2 ? 1.6 : 1} />
          <text x="152" y={i * 62 + 22} className="kdl-svg-label">
            {l.t}
          </text>
          <text x="152" y={i * 62 + 39} className="kdl-svg-sub">
            {l.s}
          </text>
          {i < layers.length - 1 ? (
            <line x1="484" y1={i * 62 + 50} x2="484" y2={i * 62 + 60} stroke={LINE} strokeWidth="1.5" markerEnd="url(#is-a)" />
          ) : null}
        </g>
      ))}

      <line x1="300" y1="248" x2="300" y2="266" stroke={LINE} strokeWidth="1.5" markerEnd="url(#is-a)" />
      <line x1="668" y1="248" x2="668" y2="266" stroke={LINE} strokeWidth="1.5" markerEnd="url(#is-a)" />

      <rect x="134" y="268" width="330" height="50" rx="5" fill={SURFACE} stroke={LINE} />
      <text x="152" y="290" className="kdl-svg-label">
        Телеметрия
      </text>
      <text x="152" y="307" className="kdl-svg-sub">
        отдельное хранилище временных рядов
      </text>

      <rect x="504" y="268" width="330" height="50" rx="5" fill={SURFACE} stroke={ACCENT} strokeWidth="1.6" />
      <text x="522" y="290" className="kdl-svg-label">
        Локальный узел площадки
      </text>
      <text x="522" y="307" className="kdl-svg-sub">
        работает при потере связи, синхронизируется после
      </text>

      <text x="0" y="344" className="kdl-svg-sub">
        Справочная архитектура. Конкретный состав определяется после этапа обследования — навязывать стек заранее неправильно.
      </text>
    </svg>
  )
}
