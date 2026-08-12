/**
 * Оригинальные схемы основного нарратива. Только инлайн-SVG:
 * ни одной внешней библиотеки, ни одного растрового изображения.
 * Цвет: синий — наш слой; серый — существующее; пунктир — гипотеза или будущее.
 */

const ACCENT = "#4694D1"
const ACCENT_DEEP = "#1355A0"
const ACCENT_SOFT = "#DAEAF6"
const LINE = "#C6CEDA"
const LINE_SOFT = "#DDE3EA"
const SURFACE = "#FFFFFF"
const INK = "#10161F"
const GREEN = "#1E7F4F"
const AMBER = "#B07208"

function Arrow({ id, color = LINE }: { id: string; color?: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 8 6"
      refX="7.4"
      refY="3"
      markerWidth="8"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L8 3 L0 6 z" fill={color} />
    </marker>
  )
}

/* ─── 1. Почему сейчас: три линии, сходящиеся к августу 2026 ─── */

export function WhyNowTimelines() {
  const lanes = [
    {
      y: 74,
      title: "Операционная",
      color: ACCENT,
      events: [
        { x: 150, t: "ЭДО с «Контуром»", d: "июль 2026" },
        { x: 400, t: "Veeroute в эксплуатации", d: "21.07.2026" },
        { x: 640, t: "Мобильное приложение", d: "август 2026" },
      ],
    },
    {
      y: 170,
      title: "Инфраструктурная",
      color: ACCENT_DEEP,
      events: [
        { x: 120, t: "М-12 до Урала", d: "16.07.2025" },
        { x: 390, t: "ВАТС на М-12", d: "31.03.2026" },
        { x: 655, t: "Свердловская обл. в режиме", d: "до 12.11.2028" },
      ],
    },
    {
      y: 266,
      title: "Технологическая",
      color: "#7B8593",
      events: [
        { x: 138, t: "Роботы последней мили", d: "промышленно" },
        { x: 405, t: "Автономный двор", d: "коммерчески" },
        { x: 648, t: "Магистральные ВАТС", d: "в режиме" },
      ],
    },
  ]

  return (
    <svg
      viewBox="0 0 1000 350"
      role="img"
      aria-label="Три линии — операционная, инфраструктурная и технологическая — сходятся к августу 2026 года, что делает текущий момент удобным для создания цифровой основы"
    >
      <defs>
        <Arrow id="wn-a" color={LINE} />
      </defs>

      {/* вертикаль «сейчас» */}
      <line x1="812" y1="34" x2="812" y2="316" stroke={ACCENT} strokeWidth="1.5" />
      <rect x="762" y="14" width="100" height="22" rx="3" fill={ACCENT} />
      <text x="812" y="29" textAnchor="middle" className="kdl-svg-head" fill="#fff">
        АВГУСТ 2026
      </text>

      {lanes.map((lane) => (
        <g key={lane.title}>
          <text x="0" y={lane.y - 22} className="kdl-svg-head">
            {lane.title.toUpperCase()}
          </text>
          <line
            x1="0"
            y1={lane.y}
            x2="880"
            y2={lane.y}
            stroke={LINE_SOFT}
            strokeWidth="1.5"
            markerEnd="url(#wn-a)"
          />
          {lane.events.map((e) => (
            <g key={e.t}>
              <circle cx={e.x} cy={lane.y} r="5" fill={lane.color} />
              <text x={e.x} y={lane.y + 22} textAnchor="middle" className="kdl-svg-label">
                {e.t}
              </text>
              <text x={e.x} y={lane.y + 38} textAnchor="middle" className="kdl-svg-mono">
                {e.d}
              </text>
            </g>
          ))}
        </g>
      ))}

      <text x="0" y="340" className="kdl-svg-sub">
        Три независимые линии сходятся в одной точке во времени — это и есть ответ на вопрос «почему сейчас».
      </text>
    </svg>
  )
}

/* ─── 2. Грузопровод против обычной перевозки ─── */

export function PipelineVsRegular() {
  const W = 700
  return (
    <svg
      viewBox="0 0 1000 300"
      role="img"
      aria-label="Сравнение обычной перевозки и технологии Грузопровод: в обычной схеме полуприцеп простаивает во время отдыха водителя, в Грузопроводе движение непрерывно за счёт смены водителей"
    >
      {/* Обычная */}
      <text x="0" y="30" className="kdl-svg-head">
        ОБЫЧНАЯ ПЕРЕВОЗКА
      </text>
      <g transform="translate(0,44)">
        <rect x="0" y="0" width={W * 0.34} height="34" rx="3" fill={ACCENT_SOFT} stroke={LINE} />
        <text x={W * 0.17} y="21" textAnchor="middle" className="kdl-svg-label">
          движение
        </text>

        <rect
          x={W * 0.34}
          y="0"
          width={W * 0.26}
          height="34"
          rx="3"
          fill="#F2F4F7"
          stroke={LINE}
          strokeDasharray="4 4"
        />
        <text x={W * 0.47} y="21" textAnchor="middle" className="kdl-svg-label" fill={AMBER}>
          отдых водителя — груз стоит
        </text>

        <rect x={W * 0.6} y="0" width={W * 0.4} height="34" rx="3" fill={ACCENT_SOFT} stroke={LINE} />
        <text x={W * 0.8} y="21" textAnchor="middle" className="kdl-svg-label">
          движение
        </text>

        <text x={W + 22} y="21" className="kdl-svg-label" fill={INK}>
          700–800 км
        </text>
      </g>

      {/* Грузопровод */}
      <text x="0" y="150" className="kdl-svg-head">
        ГРУЗОПРОВОД™
      </text>
      <g transform="translate(0,164)">
        <rect x="0" y="0" width={W} height="34" rx="3" fill={ACCENT} />
        <text x={W / 2} y="21" textAnchor="middle" className="kdl-svg-label" fill="#fff">
          непрерывное движение
        </text>

        {[0.33, 0.66].map((p) => (
          <g key={p}>
            <line x1={W * p} y1="-8" x2={W * p} y2="42" stroke={SURFACE} strokeWidth="2" />
            <circle cx={W * p} cy="17" r="7" fill={SURFACE} stroke={ACCENT_DEEP} strokeWidth="1.5" />
            <text x={W * p} y="60" textAnchor="middle" className="kdl-svg-sub">
              смена водителя
            </text>
          </g>
        ))}

        <text x={W + 22} y="21" className="kdl-svg-label" fill={ACCENT_DEEP}>
          1 000–1 200 км
        </text>
      </g>

      <line x1="0" y1="252" x2="1000" y2="252" stroke={LINE_SOFT} />
      <text x="0" y="276" className="kdl-svg-sub">
        Точка смены исполнителя обязательна каждые ~1 000–1 200 км. Она нужна и сегодня, и при беспилотном плече —
      </text>
      <text x="0" y="292" className="kdl-svg-sub">
        по одной и той же причине. Это и есть узел.
      </text>
    </svg>
  )
}

/* ─── 3. Слои и возможный разрыв ─── */

export function LayerGap() {
  const boxes = [
    { x: 0, w: 224, t: "Клиентский контур", s: "сайт · API · приложение · ИИ-расчёт" },
    { x: 248, w: 224, t: "Учётное ядро", s: "заказы · ресурсы · ограничения" },
    { x: 496, w: 224, t: "ЭДО", s: "«Контур» · ГИС ЭПД" },
    { x: 744, w: 224, t: "WMS", s: "склад" },
  ]
  const lower = [
    { x: 0, w: 224, t: "Veeroute", s: "городская доставка · работает" },
    { x: 248, w: 224, t: "Магистральное плечо", s: "чем управляется?" },
    { x: 496, w: 224, t: "Узел и полуприцеп", s: "чем управляется?" },
    { x: 744, w: 224, t: "Автономные исполнители", s: "появятся позже" },
  ]

  return (
    <svg
      viewBox="0 0 968 372"
      role="img"
      aria-label="Схема слоёв: сверху клиентский контур, учётное ядро, электронный документооборот и склад; снизу специализированные системы; между ними — пунктирная область возможного операционного разрыва"
    >
      <text x="0" y="16" className="kdl-svg-head">
        СУЩЕСТВУЮЩИЕ СИСТЕМЫ
      </text>
      {boxes.map((b) => (
        <g key={b.t}>
          <rect x={b.x} y="28" width={b.w} height="62" rx="5" fill={SURFACE} stroke={LINE} />
          <text x={b.x + 16} y="52" className="kdl-svg-label">
            {b.t}
          </text>
          <text x={b.x + 16} y="70" className="kdl-svg-sub">
            {b.s}
          </text>
        </g>
      ))}

      {/* зона разрыва */}
      <rect
        x="0"
        y="122"
        width="968"
        height="98"
        rx="6"
        fill="rgba(176,114,8,.06)"
        stroke={AMBER}
        strokeDasharray="6 5"
        strokeWidth="1.5"
      />
      <text x="20" y="150" className="kdl-svg-head" fill={AMBER}>
        ВОЗМОЖНЫЙ ОПЕРАЦИОННЫЙ РАЗРЫВ — РАБОЧАЯ ГИПОТЕЗА
      </text>
      <text x="20" y="176" className="kdl-svg-label" fill={INK}>
        плечи «Грузопровода» · полуприцеп · передача ответственности · узел перевалки · будущие исполнители
      </text>
      <text x="20" y="200" className="kdl-svg-sub">
        Существует ли этот слой сегодня и в каком виде — первый вопрос обследования, а не наш вывод.
      </text>

      <text x="0" y="252" className="kdl-svg-head">
        СПЕЦИАЛИЗИРОВАННЫЕ ЗАДАЧИ
      </text>
      {lower.map((b, i) => (
        <g key={b.t}>
          <rect
            x={b.x}
            y="264"
            width={b.w}
            height="62"
            rx="5"
            fill={i === 0 ? SURFACE : "#FAFBFC"}
            stroke={i === 0 ? LINE : LINE_SOFT}
            strokeDasharray={i === 0 ? undefined : "5 4"}
          />
          <text x={b.x + 16} y="288" className="kdl-svg-label" fill={i === 0 ? INK : "#47515F"}>
            {b.t}
          </text>
          <text x={b.x + 16} y="306" className="kdl-svg-sub">
            {b.s}
          </text>
        </g>
      ))}

      <text x="0" y="358" className="kdl-svg-sub">
        Сплошная рамка — подтверждено публичными данными. Пунктир — неизвестно или относится к будущему.
      </text>
    </svg>
  )
}

/* ─── 4. Полуприцеп и сменяемые исполнители ─── */

export function TrailerCustody() {
  const cx = 484
  const cy = 176
  const R = 138
  const execs = [
    { a: -140, t: "Водитель + тягач", s: "сегодня" },
    { a: -40, t: "Автономный тягач", s: "позже" },
    { a: 40, t: "Терминальный тягач", s: "во дворе" },
    { a: 140, t: "Партнёр-перевозчик", s: "привлечённый" },
  ]

  return (
    <svg
      viewBox="0 0 968 392"
      role="img"
      aria-label="Полуприцеп в центре, вокруг четыре сменяемых исполнителя: водитель с тягачом, автономный тягач, терминальный тягач и партнёр-перевозчик. Исполнители меняются, грузовая единица и история ответственности остаются"
    >
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={LINE_SOFT} strokeDasharray="3 5" />

      {/* центр */}
      <rect x={cx - 96} y={cy - 40} width="192" height="80" rx="6" fill={ACCENT} />
      <text x={cx} y={cy - 12} textAnchor="middle" className="kdl-svg-head" fill="#fff">
        ПОСТОЯННЫЙ ОБЪЕКТ
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        style={{ fontSize: 18, fontWeight: 500, fill: "#fff" }}
        className="kdl-svg-label"
      >
        Полуприцеп
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" className="kdl-svg-sub" fill="#DAEAF6">
        груз · пломба · состояние · история
      </text>

      {execs.map((e) => {
        const rad = (e.a * Math.PI) / 180
        const x = cx + Math.cos(rad) * (R + 8)
        const y = cy + Math.sin(rad) * (R + 8)
        const anchor = Math.cos(rad) < -0.3 ? "end" : Math.cos(rad) > 0.3 ? "start" : "middle"
        const bx = anchor === "end" ? x - 188 : anchor === "start" ? x : x - 94
        return (
          <g key={e.t}>
            <line
              x1={cx + Math.cos(rad) * 100}
              y1={cy + Math.sin(rad) * 46}
              x2={x - Math.cos(rad) * 6}
              y2={y - Math.sin(rad) * 6}
              stroke={LINE}
              strokeWidth="1.5"
            />
            <rect x={bx} y={y - 22} width="188" height="44" rx="5" fill={SURFACE} stroke={LINE} />
            <text x={bx + 14} y={y - 4} className="kdl-svg-label">
              {e.t}
            </text>
            <text x={bx + 14} y={y + 13} className="kdl-svg-sub">
              {e.s}
            </text>
          </g>
        )
      })}

      <text x="0" y="376" className="kdl-svg-sub">
        Исполнители меняются. Грузовая единица и непрерывная история ответственности остаются — это и есть то,
      </text>
      <text x="0" y="390" className="kdl-svg-sub">
        что должно принадлежать компании при любой смене техники и поставщика.
      </text>
    </svg>
  )
}

/* ─── 5. Иерархия груза ─── */

export function CargoHierarchy() {
  const rows = [
    { t: "Отправление", s: "обязательство перед клиентом", exec: "", w: 560 },
    { t: "Полуприцеп / контейнер", s: "перемещаемая единица магистрали", exec: "Тягач · ВАТС · терминальный тягач", w: 500 },
    { t: "Партия груза", s: "часть отправления в одном полуприцепе", exec: "", w: 440 },
    { t: "Паллета", s: "складская единица", exec: "Погрузчик · AMR · робопогрузчик", w: 380 },
    { t: "Грузовая единица", s: "короб, тара", exec: "", w: 320 },
    { t: "Место / посылка", s: "то, что вручается получателю", exec: "Курьер · постамат · робот · дрон", w: 260 },
  ]
  const H = 46
  const GAP = 12

  return (
    <svg
      viewBox="0 0 968 400"
      role="img"
      aria-label="Иерархия груза от отправления до отдельного места. Магистральным исполнителям достаточно уровня полуприцепа, исполнителям последней мили нужен уровень отдельного места"
    >
      {rows.map((r, i) => {
        const y = i * (H + GAP) + 10
        const isLast = i === rows.length - 1
        return (
          <g key={r.t}>
            <rect
              x={i * 16}
              y={y}
              width={r.w}
              height={H}
              rx="5"
              fill={isLast ? ACCENT_SOFT : SURFACE}
              stroke={isLast ? ACCENT : LINE}
              strokeWidth={isLast ? 1.6 : 1}
            />
            <text x={i * 16 + 16} y={y + 20} className="kdl-svg-label">
              {r.t}
            </text>
            <text x={i * 16 + 16} y={y + 36} className="kdl-svg-sub">
              {r.s}
            </text>
            {r.exec ? (
              <>
                <line
                  x1={i * 16 + r.w + 8}
                  y1={y + H / 2}
                  x2="660"
                  y2={y + H / 2}
                  stroke={LINE_SOFT}
                  strokeDasharray="3 4"
                />
                <text x="668" y={y + H / 2 + 4} className="kdl-svg-sub">
                  {r.exec}
                </text>
              </>
            ) : null}
          </g>
        )
      })}

      <rect x="656" y="330" width="312" height="58" rx="5" fill="rgba(176,114,8,.07)" stroke={AMBER} strokeDasharray="5 4" />
      <text x="672" y="352" className="kdl-svg-label" fill={AMBER}>
        Без уровня «место»
      </text>
      <text x="672" y="370" className="kdl-svg-sub">
        автоматизированная последняя миля невозможна —
      </text>
      <text x="672" y="384" className="kdl-svg-sub">
        ни роботом, ни постаматом, ни дроном.
      </text>
    </svg>
  )
}

/* ─── 6. Архитектура: специализированные планировщики + связующий слой ─── */

export function ArchitectureMap() {
  const cols = [
    { x: 0, t: "Veeroute", s: "город", note: "существует, остаётся", own: false },
    { x: 196, t: "Магистральные плечи", s: "сеть", note: "предмет обследования", own: true },
    { x: 392, t: "WMS / WES", s: "склад", note: "поставщик", own: false },
    { x: 588, t: "Узел и двор", s: "территория", note: "по мере появления объекта", own: true },
    { x: 784, t: "Поставщик автономности", s: "машина", note: "их зона ответственности", own: false },
  ]

  return (
    <svg
      viewBox="0 0 968 396"
      role="img"
      aria-label="Архитектура: сверху существующий контур КИТ, снизу специализированные планировщики разных систем, между ними — связующий слой задач, событий и ответственности"
    >
      <defs>
        <Arrow id="ar-a" color={LINE} />
        <Arrow id="ar-b" color={ACCENT} />
      </defs>

      {/* KIT core */}
      <rect x="0" y="0" width="968" height="64" rx="6" fill="#F2F4F7" stroke={LINE} />
      <text x="20" y="26" className="kdl-svg-head">
        КОНТУР КИТ — ИСТОЧНИК ПРАВДЫ О ЗАКАЗЕ
      </text>
      <text x="20" y="48" className="kdl-svg-label">
        клиентские сервисы · учётное ядро · тарифы · документы · склад
      </text>

      <line x1="484" y1="64" x2="484" y2="104" stroke={LINE} strokeWidth="1.5" markerEnd="url(#ar-a)" />

      {/* связующий слой */}
      <rect x="0" y="106" width="968" height="86" rx="6" fill={ACCENT} />
      <text x="20" y="130" className="kdl-svg-head" fill="#DAEAF6">
        СВЯЗУЮЩИЙ СЛОЙ — ПРЕДМЕТ ПРОЕКТА
      </text>
      <text x="20" y="154" className="kdl-svg-label" fill="#fff">
        задача · ресурс и его способности · ответственность за груз · событие · план и факт · стоимость
      </text>
      <text x="20" y="176" className="kdl-svg-sub" fill="#C9E1F5">
        Абстрагируем контракты между мирами — не абстрагируем сами планировщики.
      </text>

      {cols.map((c) => (
        <g key={c.t}>
          <line
            x1={c.x + 90}
            y1="192"
            x2={c.x + 90}
            y2="238"
            stroke={c.own ? ACCENT : LINE}
            strokeWidth="1.5"
            strokeDasharray={c.own ? undefined : "4 4"}
            markerEnd={c.own ? "url(#ar-b)" : "url(#ar-a)"}
          />
          <rect
            x={c.x}
            y="240"
            width="180"
            height="76"
            rx="5"
            fill={SURFACE}
            stroke={c.own ? ACCENT : LINE}
            strokeWidth={c.own ? 1.6 : 1}
          />
          <text x={c.x + 14} y="264" className="kdl-svg-label">
            {c.t}
          </text>
          <text x={c.x + 14} y="282" className="kdl-svg-sub">
            {c.s}
          </text>
          <text x={c.x + 14} y="304" className="kdl-svg-mono" fill={c.own ? ACCENT_DEEP : "#7B8593"}>
            {c.note}
          </text>
        </g>
      ))}

      <line x1="0" y1="344" x2="968" y2="344" stroke={LINE_SOFT} />
      <text x="0" y="366" className="kdl-svg-sub">
        Синим — то, что может стать предметом разработки. Серым пунктиром — чужие системы, которые мы не переписываем:
      </text>
      <text x="0" y="382" className="kdl-svg-sub">
        Veeroute остаётся планировщиком города, склад — за поставщиком робототехники, машина — за поставщиком автономности.
      </text>
    </svg>
  )
}

/* ─── 7. Дорожная карта ─── */

export function RoadmapStrip() {
  const stages = [
    { t: "Этап 0", s: "Обследование", av: false, hub: false },
    { t: "Этап 1", s: "Цифровая тень", av: false, hub: false },
    { t: "Этап 2", s: "Операционная платформа", av: false, hub: false },
    { t: "Этап 3", s: "Узел и двор", av: false, hub: true },
    { t: "Этап 4", s: "Первый автономный ресурс", av: true, hub: true },
    { t: "Этап 5", s: "Экосистема исполнителей", av: true, hub: true },
  ]
  const W = 150
  const GAP = 13

  return (
    <svg
      viewBox="0 0 968 214"
      role="img"
      aria-label="Дорожная карта из шести этапов. Первые три не требуют ни беспилотной техники, ни строительства объекта. Каждый этап заканчивается решением продолжить, скорректировать или остановиться"
    >
      <line x1="0" y1="44" x2="968" y2="44" stroke={LINE_SOFT} />

      {stages.map((s, i) => {
        const x = i * (W + GAP)
        const own = !s.av && !s.hub
        return (
          <g key={s.t}>
            <circle cx={x + 18} cy="44" r="6" fill={own ? GREEN : AMBER} />
            <rect
              x={x}
              y="62"
              width={W}
              height="86"
              rx="5"
              fill={SURFACE}
              stroke={own ? GREEN : LINE}
              strokeWidth={own ? 1.4 : 1}
              strokeDasharray={own ? undefined : "5 4"}
            />
            <text x={x + 14} y="86" className="kdl-svg-mono" fill={own ? GREEN : AMBER}>
              {s.t}
            </text>
            <text x={x + 14} y="108" className="kdl-svg-label">
              {s.s.length > 18 ? s.s.split(" ")[0] : s.s}
            </text>
            {s.s.length > 18 ? (
              <text x={x + 14} y="124" className="kdl-svg-label">
                {s.s.split(" ").slice(1).join(" ")}
              </text>
            ) : null}
            <text x={x + 14} y="140" className="kdl-svg-sub">
              {own ? "без техники и стройки" : s.av ? "нужна техника" : "нужен объект"}
            </text>
            {i < stages.length - 1 ? (
              <text x={x + W + 3} y="48" className="kdl-svg-mono" fill="#7B8593">
                ▸
              </text>
            ) : null}
          </g>
        )
      })}

      <text x="0" y="24" className="kdl-svg-head">
        КАЖДЫЙ ЭТАП ЗАКАНЧИВАЕТСЯ РЕШЕНИЕМ: ПРОДОЛЖИТЬ · СКОРРЕКТИРОВАТЬ · ОСТАНОВИТЬСЯ
      </text>
      <text x="0" y="182" className="kdl-svg-sub">
        Зелёным — этапы, которые не требуют ни беспилотной техники, ни строительства объекта: они окупаются на существующем парке.
      </text>
      <text x="0" y="200" className="kdl-svg-sub">
        Пунктиром — этапы, зависящие от внешних условий, которые компания контролирует не полностью.
      </text>
    </svg>
  )
}
