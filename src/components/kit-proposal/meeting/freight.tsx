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
  const parts = [
    { id: "01", to: "Терминал B", who: "клиент 1", share: 30, y: 0, c: ACCENT },
    { id: "02", to: "Терминал C", who: "клиент 2", share: 25, y: 1, c: ACCENT_2 },
    { id: "03", to: "Терминал C", who: "клиент 3", share: 20, y: 2, c: HYP },
    { id: "04", to: "Терминал D", who: "клиент 4", share: 25, y: 3, c: WARN },
  ]

  return (
    <svg viewBox="0 0 1100 396" className="kdm-svg" role="img"
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
            <text x="176" y={y + h / 2 - 2} className="kdm-t-sub">{p.share} % объёма</text>
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

      <text x="0" y="344" className="kdm-t-sub" fill="#B3C0D1">
        Физически партии едут вместе. Логически у каждой свой маршрут, свой срок и свой следующий узел.
      </text>
      <text x="0" y="378" className="kdm-t-sub" fill="#6F7F93">
        Доли объёма условные — они нужны, чтобы показать принцип, а не реальную загрузку.
      </text>
    </svg>
  )
}

/* ─── Экран 3. Сеть узлов: вход и выход оптимизации ─── */

export function NetworkFlow() {
  const IN = [
    "партии и направления", "сроки и окна", "объём и масса",
    "вместимость", "совместимость", "стоимость плеча",
  ]
  const OUT = [
    "состав консолидации", "последовательность терминалов",
    "распределение по плечам", "план движения каждой партии",
  ]
  const nodes = [
    { x: 130, y: 60, l: "A" }, { x: 350, y: 30, l: "B" }, { x: 350, y: 118, l: "C" },
    { x: 570, y: 22, l: "D" }, { x: 570, y: 96, l: "E" }, { x: 570, y: 160, l: "F" },
  ]
  const links: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5]]

  return (
    <svg viewBox="0 0 1100 386" className="kdm-svg" role="img"
      aria-label="На входе оптимизации: партии, сроки, объёмы, вместимость, совместимость и стоимость. В центре — сеть терминалов. На выходе: состав консолидации, последовательность терминалов, распределение по плечам и план движения каждой партии.">
      <defs><Arrow id="nf-a" color={ACCENT} /></defs>

      {/* Вход */}
      <text x="0" y="16" className="kdm-t-head">НА ВХОДЕ</text>
      {IN.map((t, i) => (
        <g key={t} transform={`translate(0,${30 + i * 44})`}>
          <rect width="300" height="34" rx="5" fill={SURFACE} stroke={LINE} strokeWidth="1.3" />
          <text x="18" y="23" className="kdm-t-sub" fill="#e6edf5">{t}</text>
        </g>
      ))}

      {/* Сеть терминалов */}
      <text x="360" y="16" className="kdm-t-head">СЕТЬ ТЕРМИНАЛОВ И ТРАНЗИТНЫХ СКЛАДОВ</text>
      <g transform="translate(340,60)">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a]!.x - 340} y1={nodes[a]!.y} x2={nodes[b]!.x - 340} y2={nodes[b]!.y}
            stroke={LINE} strokeWidth="1.8" />
        ))}
        {nodes.map((n) => (
          <g key={n.l}>
            <circle cx={n.x - 340} cy={n.y} r="26" fill={SURFACE} stroke={ACCENT} strokeWidth="1.8" />
            <text x={n.x - 340} y={n.y + 6} textAnchor="middle" className="kdm-t-lab">{n.l}</text>
          </g>
        ))}
      </g>

      {/* Выход */}
      <text x="740" y="16" className="kdm-t-head">НА ВЫХОДЕ</text>
      {OUT.map((t, i) => (
        <g key={t} transform={`translate(740,${30 + i * 48})`}>
          <rect width="360" height="38" rx="5" fill="#0E141D" stroke={ACCENT} strokeWidth="1.5" />
          <text x="18" y="25" className="kdm-t-sub" fill="#fff">{t}</text>
        </g>
      ))}

      <line x1="308" y1="140" x2="336" y2="140" stroke={ACCENT} strokeWidth="2" markerEnd="url(#nf-a)" />
      <line x1="706" y1="140" x2="734" y2="140" stroke={ACCENT} strokeWidth="2" markerEnd="url(#nf-a)" />

      <line x1="0" y1="330" x2="1100" y2="330" stroke={LINE} />
      <text x="0" y="358" className="kdm-t-sub" fill="#B3C0D1">
        Оптимизировать нужно не отдельный рейс, а прохождение всех партий через сеть.
      </text>
      <text x="0" y="380" className="kdm-t-sub" fill="#6F7F93">
        Что именно минимизируется — стоимость, срок, число перегрузок или загрузка — определяется на ваших данных.
      </text>
    </svg>
  )
}

/* ─── Экран 4. Прямой рейс: что после доставки ─── */

export function DirectReturn() {
  const options = [
    { t: "Прямой обратный заказ", s: "если он есть в пуле" },
    { t: "Сборный поток", s: "если совместим по типу и срокам" },
    { t: "Межтерминальное плечо", s: "перевозка внутри сети" },
    { t: "Короткий reposition", s: "к следующей выгодной загрузке" },
    { t: "Подождать на месте", s: "если это дешевле переезда" },
  ]

  return (
    <svg viewBox="0 0 1100 372" className="kdm-svg" role="img"
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

      <text x="0" y="238" className="kdm-t-head">СЕГОДНЯ РЕШЕНИЕ</text>
      <text x="0" y="266" className="kdm-t-sub" fill="#B3C0D1">принимается человеком</text>
      <text x="0" y="288" className="kdm-t-sub" fill="#B3C0D1">и по тому, что он</text>
      <text x="0" y="310" className="kdm-t-sub" fill="#B3C0D1">помнит и видит.</text>
      <text x="0" y="352" className="kdm-t-sub" fill="#6F7F93">Так ли это — вопрос</text>
      <text x="0" y="372" className="kdm-t-sub" fill="#6F7F93">к вам.</text>
    </svg>
  )
}

/* ─── Экран 5. Объединение потоков ─── */

export function MergedPool() {
  const gains = [
    "выше доля полезной загрузки",
    "меньше порожнего движения",
    "больше вариантов продолжения рейса",
    "устойчивее оборот транспорта",
  ]
  const future = ["Грузопоток", "Транспортная ёмкость", "Управление парком", "Автономные ТС"]

  return (
    <svg viewBox="0 0 1100 396" className="kdm-svg" role="img"
      aria-label="Сборные грузы и прямые рейсы сводятся в единый пул заданий, из которого оптимизация строит последовательности перевозок. Ниже — перспектива: от грузопотока к управлению парком и автономным транспортным средствам.">
      <defs><Arrow id="mp-a" color={ACCENT} /><Arrow id="mp-g" color={LINE} /></defs>

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
        <g key={g} transform={`translate(${i * 278},252)`}>
          <rect width="258" height="44" rx="6" fill={SURFACE} stroke={LINE} strokeWidth="1.3" strokeDasharray="6 5" />
          <text x="18" y="28" className="kdm-t-sub" fill="#B3C0D1">{g}</text>
        </g>
      ))}

      {/* Перспектива */}
      <line x1="0" y1="326" x2="1100" y2="326" stroke={LINE} />
      <text x="0" y="352" className="kdm-t-head">ДАЛЬШЕ · СЛЕДУЮЩИЙ УРОВЕНЬ</text>
      {future.map((f, i) => {
        const w = 236, gap = 52
        const x = i * (w + gap)
        return (
          <g key={f}>
            <rect x={x} y="362" width={w} height="32" rx="5" fill="#0A0F16" stroke={LINE} strokeWidth="1.3" />
            <text x={x + w / 2} y="383" textAnchor="middle" className="kdm-t-sub" fill="#8FA0B5">{f}</text>
            {i < future.length - 1 ? (
              <line x1={x + w + 8} y1="378" x2={x + w + gap - 10} y2="378" stroke={LINE} strokeWidth="1.6" markerEnd="url(#mp-g)" />
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Экран 8. Рекомендация в рабочем месте менеджера ─── */

export function SalesLoop() {
  const inputs = ["история отправок", "направления и частота", "объём и масса", "используемые продукты", "сезонность"]
  const outputs = [
    { t: "Вероятно релевантный продукт", s: "LTL · FTL · международная" },
    { t: "Объяснение рекомендации", s: "почему именно этот" },
    { t: "Следующее действие", s: "что сделать менеджеру" },
  ]

  return (
    <svg viewBox="0 0 1100 340" className="kdm-svg" role="img"
      aria-label="История отправок клиента поступает в аналитику и модель. На выходе — вероятно релевантный продукт, объяснение и следующее действие менеджера. Рекомендация появляется в том рабочем месте, где менеджер уже работает.">
      <defs><Arrow id="sl-a" color={ACCENT} /><Arrow id="sl-h" color={HYP} /></defs>

      <text x="0" y="16" className="kdm-t-head">ЧТО УЖЕ ИЗВЕСТНО О КЛИЕНТЕ</text>
      {inputs.map((t, i) => (
        <g key={t} transform={`translate(0,${30 + i * 46})`}>
          <rect width="280" height="36" rx="5" fill={SURFACE} stroke={LINE} strokeWidth="1.3" />
          <text x="18" y="24" className="kdm-t-sub" fill="#e6edf5">{t}</text>
        </g>
      ))}

      <line x1="288" y1="132" x2="336" y2="132" stroke={ACCENT} strokeWidth="2" markerEnd="url(#sl-a)" />

      {/* Разделение технологий */}
      <rect x="344" y="70" width="300" height="124" rx="8" fill="#0E141D" stroke={ACCENT} strokeWidth="1.8" />
      <text x="366" y="100" className="kdm-t-lab" fill={ACCENT_2}>Правила и аналитика</text>
      <text x="366" y="124" className="kdm-t-sub">там, где логика понятна</text>
      <line x1="366" y1="138" x2="622" y2="138" stroke={LINE} />
      <text x="366" y="162" className="kdm-t-lab" fill={HYP}>Модель</text>
      <text x="366" y="184" className="kdm-t-sub">если истории достаточно</text>

      <line x1="644" y1="132" x2="692" y2="132" stroke={ACCENT} strokeWidth="2" markerEnd="url(#sl-a)" />

      {outputs.map((o, i) => (
        <g key={o.t} transform={`translate(700,${64 + i * 60})`}>
          <rect width="400" height="50" rx="6" fill={SURFACE} stroke={ACCENT} strokeWidth="1.4" />
          <text x="20" y="24" className="kdm-t-lab">{o.t}</text>
          <text x="20" y="42" className="kdm-t-sub">{o.s}</text>
        </g>
      ))}

      {/* Где это появляется */}
      <line x1="900" y1="244" x2="900" y2="266" stroke={ACCENT} strokeWidth="2" markerEnd="url(#sl-a)" />
      <rect x="560" y="268" width="540" height="48" rx="7" fill={SURFACE} stroke={OK} strokeWidth="1.6" />
      <text x="830" y="290" textAnchor="middle" className="kdm-t-lab" fill={OK}>
        Появляется в рабочем месте менеджера
      </text>
      <text x="830" y="309" textAnchor="middle" className="kdm-t-sub">
        в вашей CRM — отдельного интерфейса не заводим
      </text>

      <text x="0" y="290" className="kdm-t-sub" fill="#6F7F93">Языковая модель объясняет</text>
      <text x="0" y="312" className="kdm-t-sub" fill="#6F7F93">и готовит текст. Оценку она</text>
      <text x="0" y="334" className="kdm-t-sub" fill="#6F7F93">не придумывает.</text>
    </svg>
  )
}
