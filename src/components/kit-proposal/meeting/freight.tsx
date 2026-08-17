/**
 * Схемы Meeting Mode по постановке от 17.08.2026: сборные грузопотоки
 * через сеть терминалов и прямые рейсы как источник свободной ёмкости.
 * Только инлайн-SVG, полная ширина слайда, крупный штрих.
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

/* ─── Экран 2. Одна машина — четыре разных маршрута ─── */

export function ConsolidatedLoad() {
  // Доли задают только высоту полосы: числа на экране не нужны,
  // иначе схему принципа читают как реальную загрузку.
  const parts = [
    { id: "01", to: "Терминал B", who: "клиент 1", share: 30, c: ACCENT },
    { id: "02", to: "Терминал C", who: "клиент 2", share: 25, c: ACCENT_2 },
    { id: "03", to: "Терминал C", who: "клиент 3", share: 20, c: HYP },
    { id: "04", to: "Терминал D", who: "клиент 4", share: 25, c: WARN },
  ]

  return (
    <svg viewBox="0 0 1100 366" className="kdm-svg" role="img"
      aria-label="Одна машина везёт четыре партии разным получателям в разные терминалы. На транзитном узле груз перераспределяется, и каждая партия уходит своим следующим плечом.">
      <defs><Arrow id="cl-a" color={ACCENT} /><Arrow id="cl-g" color={LINE} /></defs>

      {/* Машина как контейнер долей */}
      <text x="0" y="16" className="kdm-t-head">ОДНА МАШИНА · ОДИН КОНТЕЙНЕР</text>
      <rect x="0" y="30" width="300" height="290" rx="8" fill={SURFACE} stroke={LINE} strokeWidth="1.8" />
      {parts.map((p, i) => {
        const h = (p.share / 100) * 264
        const prev = parts.slice(0, i).reduce((a, x) => a + (x.share / 100) * 264, 0)
        const y = 43 + prev
        return (
          <g key={p.id}>
            <rect x="14" y={y} width="272" height={h - 6} rx="5" fill="#0A0F16" stroke={p.c} strokeWidth="1.5" />
            <text x="30" y={y + h / 2 - 2} className="kdm-t-lab" fill={p.c}>Груз {p.id}</text>
          </g>
        )
      })}

      {/* Транзитный узел */}
      <line x1="300" y1="175" x2="384" y2="175" stroke={ACCENT} strokeWidth="2.5" markerEnd="url(#cl-a)" />
      <rect x="392" y="132" width="196" height="86" rx="8" fill="#0E141D" stroke={ACCENT} strokeWidth="2" />
      <text x="490" y="168" textAnchor="middle" className="kdm-t-lab" fill={ACCENT_2}>Транзитный узел</text>
      <text x="490" y="192" textAnchor="middle" className="kdm-t-sub">перераспределение</text>

      {/* Расхождение партий по своим плечам */}
      {parts.map((p, i) => {
        const y = 44 + i * 78
        return (
          <g key={"o" + p.id}>
            <line x1="588" y1="175" x2="656" y2={y + 26} stroke={p.c} strokeWidth="2" markerEnd="url(#cl-a)" />
            <rect x="664" y={y} width="436" height="54" rx="6" fill={SURFACE} stroke={p.c} strokeWidth="1.5" />
            <text x="686" y={y + 24} className="kdm-t-lab" fill={p.c}>Груз {p.id}</text>
            <text x="790" y={y + 24} className="kdm-t-lab">{p.to}</text>
            <text x="686" y={y + 44} className="kdm-t-sub">{p.who} · свой срок · своё следующее плечо</text>
          </g>
        )
      })}

      <text x="0" y="352" className="kdm-t-sub" fill="#B3C0D1">
        Физически партии едут вместе. Логически у каждой свой срок и свой следующий узел.
      </text>
      <text x="1100" y="352" textAnchor="end" className="kdm-t-sub" fill="#6F7F93">Схема принципа</text>
    </svg>
  )
}

/* ─── Экран 3. Сеть узлов: вход и выход оптимизации ─── */

export function NetworkFlow() {
  // Первая встреча: важен не полный перечень входов оптимизации,
  // а сама мысль «считаем путь партии по сети, а не рейс».
  const IN = ["что и куда везём", "к какому сроку", "чем можем везти"]
  const OUT = ["состав консолидации", "через какие терминалы", "план движения партии"]
  const nodes = [
    { x: 0, y: 62, l: "A" }, { x: 186, y: 20, l: "B" }, { x: 186, y: 104, l: "C" },
    { x: 372, y: 8, l: "D" }, { x: 372, y: 62, l: "E" }, { x: 372, y: 118, l: "F" },
  ]
  const links: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5]]

  return (
    <svg viewBox="0 0 1100 292" className="kdm-svg" role="img"
      aria-label="Слева вход: что и куда везём, к какому сроку, чем можем везти. В центре — сеть терминалов. Справа выход: состав консолидации, через какие терминалы идёт партия и план её движения.">
      <defs><Arrow id="nf-a" color={ACCENT} /></defs>

      <text x="0" y="16" className="kdm-t-head">НА ВХОДЕ</text>
      {IN.map((t, i) => (
        <g key={t} transform={`translate(0,${30 + i * 52})`}>
          <rect width="290" height="42" rx="5" fill={SURFACE} stroke={LINE} strokeWidth="1.3" />
          <text x="20" y="27" className="kdm-t-sub" fill="#e6edf5">{t}</text>
        </g>
      ))}

      <text x="372" y="16" className="kdm-t-head">СЕТЬ ТЕРМИНАЛОВ И ТРАНЗИТНЫХ СКЛАДОВ</text>
      <g transform="translate(372,42)">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a]!.x} y1={nodes[a]!.y} x2={nodes[b]!.x} y2={nodes[b]!.y}
            stroke={LINE} strokeWidth="1.8" />
        ))}
        {nodes.map((n) => (
          <g key={n.l}>
            <circle cx={n.x} cy={n.y} r="25" fill={SURFACE} stroke={ACCENT} strokeWidth="1.8" />
            <text x={n.x} y={n.y + 6} textAnchor="middle" className="kdm-t-lab">{n.l}</text>
          </g>
        ))}
      </g>

      <text x="782" y="16" className="kdm-t-head">НА ВЫХОДЕ</text>
      {OUT.map((t, i) => (
        <g key={t} transform={`translate(782,${30 + i * 52})`}>
          <rect width="318" height="42" rx="5" fill="#0E141D" stroke={ACCENT} strokeWidth="1.5" />
          <text x="20" y="27" className="kdm-t-sub" fill="#fff">{t}</text>
        </g>
      ))}

      <line x1="300" y1="104" x2="340" y2="104" stroke={ACCENT} strokeWidth="2" markerEnd="url(#nf-a)" />
      <line x1="734" y1="104" x2="774" y2="104" stroke={ACCENT} strokeWidth="2" markerEnd="url(#nf-a)" />

      <line x1="0" y1="240" x2="1100" y2="240" stroke={LINE} />
      <text x="0" y="272" className="kdm-t-sub" fill="#B3C0D1">
        Оптимизировать нужно не отдельный рейс, а прохождение всех партий через сеть.
      </text>
    </svg>
  )
}

/* ─── Экран 4. Прямой рейс: что после доставки ─── */

export function DirectReturn() {
  const options = [
    { t: "Прямой обратный заказ", s: "если он есть в пуле" },
    { t: "Сборный поток", s: "если совместим по типу и срокам" },
    { t: "Перевозка между терминалами", s: "работа внутри сети" },
    { t: "Короткий переезд к загрузке", s: "если рядом есть выгодный заказ" },
    { t: "Подождать на месте", s: "если это дешевле переезда" },
  ]

  return (
    <svg viewBox="0 0 1100 330" className="kdm-svg" role="img"
      aria-label="Прямой рейс от завода к заводу. После выгрузки вместо автоматического порожнего возврата система проверяет пять вариантов: обратный заказ, сборный поток, межтерминальное плечо, короткий переезд или ожидание.">
      <defs><Arrow id="dr-a" color={ACCENT} /><Arrow id="dr-w" color={WARN} /></defs>

      {/* Прямой рейс */}
      <rect x="0" y="30" width="200" height="64" rx="7" fill={SURFACE} stroke={LINE} strokeWidth="1.5" />
      <text x="100" y="60" textAnchor="middle" className="kdm-t-lab">Завод A</text>
      <text x="100" y="80" textAnchor="middle" className="kdm-t-sub">отправитель</text>

      <line x1="200" y1="62" x2="286" y2="62" stroke={ACCENT} strokeWidth="3" markerEnd="url(#dr-a)" />
      <text x="243" y="46" textAnchor="middle" className="kdm-t-sub" fill={ACCENT_2}>прямой рейс</text>

      <rect x="294" y="30" width="200" height="64" rx="7" fill={SURFACE} stroke={LINE} strokeWidth="1.5" />
      <text x="394" y="60" textAnchor="middle" className="kdm-t-lab">Завод B</text>
      <text x="394" y="80" textAnchor="middle" className="kdm-t-sub">получатель</text>

      {/* Развилка после выгрузки */}
      <line x1="394" y1="94" x2="394" y2="128" stroke={ACCENT} strokeWidth="2" markerEnd="url(#dr-a)" />
      <rect x="264" y="130" width="260" height="46" rx="7" fill="#0E141D" stroke={ACCENT} strokeWidth="1.8" />
      <text x="394" y="159" textAnchor="middle" className="kdm-t-lab" fill={ACCENT_2}>Машина освободилась</text>

      {/* Порожний возврат — то, чего избегаем */}
      <line x1="264" y1="153" x2="150" y2="153" stroke={WARN} strokeWidth="2" strokeDasharray="8 6" markerEnd="url(#dr-w)" />
      <text x="0" y="148" className="kdm-t-sub" fill={WARN}>порожний</text>
      <text x="0" y="167" className="kdm-t-sub" fill={WARN}>возврат</text>

      {/* Варианты продолжения */}
      <text x="560" y="16" className="kdm-t-head">ЧТО ПРОВЕРЯЕТ СИСТЕМА</text>
      {options.map((o, i) => (
        <g key={o.t} transform={`translate(560,${30 + i * 54})`}>
          <rect width="540" height="44" rx="6" fill={SURFACE} stroke={ACCENT} strokeWidth="1.4" />
          <text x="20" y="20" className="kdm-t-lab">{o.t}</text>
          <text x="20" y="37" className="kdm-t-sub">{o.s}</text>
        </g>
      ))}
      <line x1="524" y1="153" x2="552" y2="153" stroke={ACCENT} strokeWidth="2" markerEnd="url(#dr-a)" />

      <text x="0" y="242" className="kdm-t-head">РЕШЕНИЕ ПРИНИМАЕТСЯ</text>
      <text x="0" y="270" className="kdm-t-sub" fill="#B3C0D1">по тому, что человек</text>
      <text x="0" y="292" className="kdm-t-sub" fill="#B3C0D1">помнит и видит</text>
      <text x="0" y="314" className="kdm-t-sub" fill="#B3C0D1">в этот момент.</text>
    </svg>
  )
}

/* ─── Экран 5. Объединение потоков ─── */

export function MergedPool() {
  const gains = [
    "выше доля полезной загрузки",
    "меньше порожнего движения",
    "больше вариантов продолжения рейса",
  ]

  return (
    <svg viewBox="0 0 1100 344" className="kdm-svg" role="img"
      aria-label="Сборные грузы и прямые рейсы сводятся в единый пул заданий, из которого оптимизация строит последовательности перевозок. Ниже — перспектива: от грузопотока к управлению парком и автономным транспортным средствам.">
      <defs><Arrow id="mp-a" color={ACCENT} /></defs>

      {/* Два источника */}
      <rect x="0" y="20" width="270" height="72" rx="7" fill={SURFACE} stroke={ACCENT} strokeWidth="1.6" />
      <text x="22" y="50" className="kdm-t-lab">Сборные грузы</text>
      <text x="22" y="72" className="kdm-t-sub">партии · терминалы · транзит</text>

      <rect x="0" y="128" width="270" height="72" rx="7" fill={SURFACE} stroke={ACCENT} strokeWidth="1.6" />
      <text x="22" y="158" className="kdm-t-lab">Прямые рейсы</text>
      <text x="22" y="180" className="kdm-t-sub">крупные партии · FTL</text>

      <line x1="270" y1="56" x2="352" y2="98" stroke={ACCENT} strokeWidth="2.5" markerEnd="url(#mp-a)" />
      <line x1="270" y1="164" x2="352" y2="122" stroke={ACCENT} strokeWidth="2.5" markerEnd="url(#mp-a)" />

      {/* Единый пул */}
      <rect x="360" y="66" width="290" height="88" rx="8" fill={ACCENT} />
      <text x="505" y="102" textAnchor="middle" className="kdm-t-lab" fill="#fff">Единый пул заданий</text>
      <text x="505" y="126" textAnchor="middle" className="kdm-t-sub" fill="#DAEAF6">и свободной ёмкости</text>

      <line x1="650" y1="110" x2="716" y2="110" stroke={ACCENT} strokeWidth="2.5" markerEnd="url(#mp-a)" />

      {/* Результат */}
      <rect x="724" y="66" width="376" height="88" rx="8" fill="#0E141D" stroke={ACCENT} strokeWidth="1.8" />
      <text x="912" y="102" textAnchor="middle" className="kdm-t-lab" fill={ACCENT_2}>Последовательности перевозок</text>
      <text x="912" y="126" textAnchor="middle" className="kdm-t-sub">что и чем везём дальше</text>

      {/* Что это может давать */}
      <text x="0" y="238" className="kdm-t-head">ЧТО ЭТО МОЖЕТ ДАВАТЬ · ГИПОТЕЗА ДЛЯ ПРОВЕРКИ</text>
      {gains.map((g, i) => (
        <g key={g} transform={`translate(${i * 374},252)`}>
          <rect width="352" height="46" rx="6" fill={SURFACE} stroke={LINE} strokeWidth="1.3" strokeDasharray="6 5" />
          <text x="20" y="29" className="kdm-t-sub" fill="#B3C0D1">{g}</text>
        </g>
      ))}

      {/* Дальний горизонт — одной строкой, чтобы не спорить за внимание */}
      <text x="0" y="336" className="kdm-t-sub" fill="#6F7F93">
        Дальше по этой же логике: транспортная ёмкость → управление парком → автономные ТС. Не тема сегодняшнего разговора.
      </text>
    </svg>
  )
}

/* ─── Экран 8. Рекомендация в рабочем месте менеджера ─── */

export function SalesLoop() {
  // Второстепенный контур — и плотность схемы должна это показывать.
  const inputs = ["история отправок", "направления и частота", "используемые продукты"]
  const outputs = [
    { t: "Вероятно релевантный продукт", s: "LTL · FTL · международная" },
    { t: "Объяснение рекомендации", s: "почему именно этот" },
    { t: "Следующее действие", s: "что сделать менеджеру" },
  ]

  return (
    <svg viewBox="0 0 1100 300" className="kdm-svg" role="img"
      aria-label="История отправок клиента поступает в аналитику и модель. На выходе — вероятно релевантный продукт, объяснение и следующее действие менеджера. Рекомендация появляется в том рабочем месте, где менеджер уже работает.">
      <defs><Arrow id="sl-a" color={ACCENT} /></defs>

      <text x="0" y="16" className="kdm-t-head">ЧТО УЖЕ ИЗВЕСТНО О КЛИЕНТЕ</text>
      {inputs.map((t, i) => (
        <g key={t} transform={`translate(0,${30 + i * 50})`}>
          <rect width="280" height="40" rx="5" fill={SURFACE} stroke={LINE} strokeWidth="1.3" />
          <text x="18" y="26" className="kdm-t-sub" fill="#e6edf5">{t}</text>
        </g>
      ))}

      <line x1="288" y1="100" x2="336" y2="100" stroke={ACCENT} strokeWidth="2" markerEnd="url(#sl-a)" />

      {/* Что считает арифметика, а что — модель */}
      <rect x="344" y="40" width="300" height="120" rx="8" fill="#0E141D" stroke={ACCENT} strokeWidth="1.8" />
      <text x="366" y="70" className="kdm-t-lab" fill={ACCENT_2}>Правила и аналитика</text>
      <text x="366" y="93" className="kdm-t-sub">там, где логика понятна</text>
      <line x1="366" y1="107" x2="622" y2="107" stroke={LINE} />
      <text x="366" y="131" className="kdm-t-lab" fill={HYP}>Модель</text>
      <text x="366" y="152" className="kdm-t-sub">если истории достаточно</text>

      <line x1="644" y1="100" x2="692" y2="100" stroke={ACCENT} strokeWidth="2" markerEnd="url(#sl-a)" />

      {outputs.map((o, i) => (
        <g key={o.t} transform={`translate(700,${30 + i * 58})`}>
          <rect width="400" height="48" rx="6" fill={SURFACE} stroke={ACCENT} strokeWidth="1.4" />
          <text x="20" y="22" className="kdm-t-lab">{o.t}</text>
          <text x="20" y="40" className="kdm-t-sub">{o.s}</text>
        </g>
      ))}

      <line x1="900" y1="204" x2="900" y2="226" stroke={ACCENT} strokeWidth="2" markerEnd="url(#sl-a)" />
      <rect x="560" y="228" width="540" height="50" rx="7" fill={SURFACE} stroke={OK} strokeWidth="1.6" />
      <text x="830" y="251" textAnchor="middle" className="kdm-t-lab" fill={OK}>
        Появляется в рабочем месте менеджера
      </text>
      <text x="830" y="270" textAnchor="middle" className="kdm-t-sub">
        в вашей CRM — отдельного интерфейса не заводим
      </text>
    </svg>
  )
}
