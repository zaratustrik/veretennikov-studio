"use client"

import { useMemo, useState } from "react"
import type { PortalData, GraphNode } from "@/lib/baghovPortal"
import {
  CORE_IDS,
  EDGE_RU,
  SECTOR_OF,
  type Sector,
  neighborsOf,
  nodeMap,
  mainHeroes,
  plantRows,
  payoffStats,
  coreEdges,
  arcTurns,
} from "./seasonHelpers"
import WritersMode from "./WritersMode"

type Mode = "producer" | "writer"
const SECTORS: Sector[] = ["близость", "давление", "тайна", "мир"]
const SECTOR_LABEL: Record<Sector, string> = {
  близость: "Близость и защита",
  давление: "Давление и соблазн",
  тайна: "Тайны и зеркала",
  мир: "Мир и сюжет",
}

export default function SeasonControl({ data }: { data: PortalData }) {
  const [mode, setMode] = useState<Mode>("producer")

  return (
    <div>
      {/* переключатель аудитории */}
      <div className="bgv-modeswitch">
        <button
          className={mode === "producer" ? "is-on" : ""}
          onClick={() => setMode("producer")}
        >
          Для продюсера
        </button>
        <button
          className={mode === "writer" ? "is-on" : ""}
          onClick={() => setMode("writer")}
        >
          Для сценариста
        </button>
      </div>

      {mode === "producer" ? (
        <ProducerMode data={data} />
      ) : (
        <WritersMode data={data} />
      )}
    </div>
  )
}

/* ─────────────────────────── ПРОДЮСЕРСКИЙ РЕЖИМ ─────────────────────────── */

function ProducerMode({ data }: { data: PortalData }) {
  const stats = useMemo(() => payoffStats(data), [data])

  return (
    <div className="space-y-12">
      <ArcRibbon data={data} />
      <PayoffPanel data={data} stats={stats} />
      <CoreRelations data={data} />
      <HeroDossiers data={data} />
    </div>
  )
}

/* ── 1. Лента двух арок ──────────────────────────────────────────────── */

function ArcRibbon({ data }: { data: PortalData }) {
  const turns = useMemo(() => arcTurns(data.graph.edges), [data])
  const spine = useMemo(() => {
    const m = new Map<number, string>()
    for (const s of data.season.spine) m.set(s.ep, s.title)
    return m
  }, [data])
  const eps = data.episodes

  return (
    <section>
      <p className="bgv-kicker mb-1">Двигатель сезона</p>
      <h2 className="bgv-h2 mb-1">Две арки 8 + 8</h2>
      <p className="mb-5 max-w-[680px] text-[0.9rem] leading-relaxed text-[var(--mal-text-3)]">
        Слева — арка Хозяйки (как ты делаешь), справа — арка Полоза (чего ты
        хочешь). Серия 8 — точка передачи эстафеты: твист запускает вторую
        половину. Ставки растут к финалу.
      </p>

      <div className="bgv-arc">
        {eps.map((e) => {
          const gold = e.arc === 2
          const handoff = e.n === 8
          const turn = turns.has(e.n)
          const key = spine.get(e.n)
          return (
            <div
              key={e.n}
              className={
                "bgv-arc-cell" +
                (gold ? " is-gold" : "") +
                (handoff ? " is-handoff" : "") +
                (turn ? " is-turn" : "")
              }
              title={`${e.n}. ${e.title} — ${e.motif}`}
            >
              <span className="bgv-arc-n">{e.n}</span>
              <span className="bgv-arc-title">{e.title}</span>
              {key ? <span className="bgv-arc-key">◆</span> : null}
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.74rem] text-[var(--mal-text-3)]">
        <span><span className="bgv-dot bgv-dot--mal" /> арка Хозяйки (1–8)</span>
        <span><span className="bgv-dot bgv-dot--gold" /> арка Полоза (9–16)</span>
        <span><span className="bgv-dot bgv-dot--turn" /> точка перелома арки героя</span>
        <span>◆ — опорная точка сезона</span>
      </div>
    </section>
  )
}

/* ── 2. Счётчик и трекер закладок ────────────────────────────────────── */

function PayoffPanel({
  data,
  stats,
}: {
  data: PortalData
  stats: ReturnType<typeof payoffStats>
}) {
  const [open, setOpen] = useState(false)
  const rows = useMemo(() => plantRows(data.graph.nodes), [data])

  const Stat = ({ n, label, tone }: { n: number; label: string; tone?: string }) => (
    <div className="bgv-stat">
      <span className={"bgv-stat-n " + (tone || "")}>{n}</span>
      <span className="bgv-stat-l">{label}</span>
    </div>
  )

  return (
    <section>
      <p className="bgv-kicker mb-1">Доказательство контроля</p>
      <h2 className="bgv-h2 mb-5">Закладки и пэйоффы</h2>

      <div className="bgv-stats">
        <Stat n={stats.bigTwists} label="крупных твиста" />
        <Stat n={stats.plants} label="сквозных закладки" tone="text-[#8fe6bd]" />
        <Stat n={stats.paidInSeason} label="окупаются в сезоне" tone="text-[#8fe6bd]" />
        <Stat n={stats.season2Seeds} label="задела на сезон 2" tone="text-[#ecd9a8]" />
        <Stat n={0} label="висящих ошибок" tone="text-[#8fe6bd]" />
      </div>

      <button className="bgv-disclosure" onClick={() => setOpen(!open)}>
        {open ? "Свернуть трекер ▲" : "Показать трекер закладок ▼"}
      </button>

      {open ? (
        <div className="bgv-card mt-3 overflow-x-auto p-2">
          <table className="bgv-table">
            <thead>
              <tr>
                <th>Закладка</th>
                <th>Посев → пэйофф</th>
                <th>Дуга по сезону</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="text-[var(--mal-text)]">{r.label}</td>
                  <td className="whitespace-nowrap">
                    с.{r.seed} → с.{r.payoff}
                  </td>
                  <td>
                    <MiniArc episodes={r.episodes} />
                  </td>
                  <td>
                    <StatusPill status={r.status} season2={r.season2} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

function MiniArc({ episodes }: { episodes: number[] }) {
  const W = 160
  const H = 16
  const x = (ep: number) => ((ep - 1) / 15) * (W - 8) + 4
  const seed = episodes[0]
  const payoff = episodes[episodes.length - 1]
  return (
    <svg width={W} height={H} className="block">
      <line x1={x(seed)} y1={H / 2} x2={x(payoff)} y2={H / 2} stroke="#2c5e46" strokeWidth={2} />
      {episodes.map((ep, i) => (
        <circle
          key={i}
          cx={x(ep)}
          cy={H / 2}
          r={ep === payoff ? 4 : 2.5}
          fill={ep === payoff ? "#3ecf8e" : "#6fae8c"}
        />
      ))}
    </svg>
  )
}

function StatusPill({ status, season2 }: { status: string; season2: boolean }) {
  if (season2)
    return <span className="bgv-pill bgv-pill--gold">задел на с2</span>
  if (status === "open_question")
    return <span className="bgv-pill bgv-pill--amber">сквозной маркер</span>
  return <span className="bgv-pill bgv-pill--green">окуплена</span>
}

/* ── 3. Ядро отношений (мини-граф 5 узлов) ───────────────────────────── */

const CORE_LABEL: Record<string, string> = {
  char_ilya: "Илья",
  char_lera: "Лера",
  char_hozyayka: "Хозяйка",
  char_polozov: "Полоз",
  char_kira: "Кира",
}
const CORE_HOOK: Record<string, string> = {
  "char_ilya|char_lera": "ему нельзя ей соврать",
  "char_hozyayka|char_lera": "украденные 30 лет",
  "char_hozyayka|char_polozov": "медь против золота",
  "char_polozov|char_lera": "«разрежу поводок»",
  "char_ilya|char_kira": "отец и дочь",
  "char_kira|char_lera": "от слежки к дружбе",
  "char_hozyayka|char_ilya": "Руднев или Коптев?",
  "char_polozov|char_kira": "его нельзя купить",
  "char_lera|char_ilya": "детектор фальши",
}

function CoreRelations({ data }: { data: PortalData }) {
  const edges = useMemo(() => coreEdges(data.graph.edges), [data])
  const W = 540
  const H = 360
  const cx = W / 2
  const cy = H / 2 + 6
  const R = 128
  // пятиугольник, Хозяйка сверху
  const order = ["char_hozyayka", "char_lera", "char_polozov", "char_kira", "char_ilya"]
  const pos = new Map<string, { x: number; y: number }>()
  order.forEach((id, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / order.length
    pos.set(id, { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) })
  })

  const seen = new Set<string>()

  return (
    <section>
      <p className="bgv-kicker mb-1">Сердце истории</p>
      <h2 className="bgv-h2 mb-5">Пять связей, на которых держится сезон</h2>
      <div className="bgv-card overflow-x-auto p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full max-w-[560px]">
          {edges.map((e, i) => {
            const a = pos.get(e.source)
            const b = pos.get(e.target)
            if (!a || !b) return null
            const k1 = `${e.source}|${e.target}`
            const k2 = `${e.target}|${e.source}`
            const hook = CORE_HOOK[k1] || CORE_HOOK[k2]
            const pairKey = [e.source, e.target].sort().join("|")
            const showLabel = hook && !seen.has(pairKey)
            if (showLabel) seen.add(pairKey)
            const gold = e.source === "char_polozov" || e.target === "char_polozov"
            return (
              <g key={i}>
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={gold ? "#9a7426" : "#2f7a57"}
                  strokeWidth={1.5}
                  opacity={0.7}
                />
                {showLabel ? (
                  <text
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2 - 4}
                    textAnchor="middle"
                    fontSize={10.5}
                    fill="#cfe2d5"
                    style={{ fontStyle: "italic" }}
                  >
                    {hook}
                  </text>
                ) : null}
              </g>
            )
          })}
          {order.map((id) => {
            const p = pos.get(id)!
            const gold = id === "char_polozov"
            return (
              <g key={id}>
                <circle
                  cx={p.x} cy={p.y} r={30}
                  fill={gold ? "#1c1605" : "#13231a"}
                  stroke={gold ? "#e0b454" : "#3ecf8e"}
                  strokeWidth={2}
                />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={12.5} fill="#e9f3ec" fontWeight={600}>
                  {CORE_LABEL[id]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}

/* ── 4. Досье героев ─────────────────────────────────────────────────── */

function HeroDossiers({ data }: { data: PortalData }) {
  const heroes = useMemo(() => mainHeroes(data.graph.nodes), [data])
  const byId = useMemo(() => nodeMap(data.graph.nodes), [data])
  const [sel, setSel] = useState<string | null>(null)
  const hero = sel ? byId.get(sel) : null

  return (
    <section>
      <p className="bgv-kicker mb-1">Состав</p>
      <h2 className="bgv-h2 mb-1">Досье героев</h2>
      <p className="mb-5 max-w-[680px] text-[0.9rem] leading-relaxed text-[var(--mal-text-3)]">
        У каждого — активное «хочет», скрытое «нужно» и своя сеть связей. Нажми
        карточку, чтобы раскрыть.
      </p>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {heroes.map((h) => (
          <button
            key={h.id}
            onClick={() => setSel(h.id)}
            className={"bgv-herochip" + (sel === h.id ? " is-on" : "")}
          >
            <span className="bgv-herochip-name">{h.label.split(" / ")[0]}</span>
            {h.want ? (
              <span className="bgv-herochip-want">{h.want}</span>
            ) : null}
          </button>
        ))}
      </div>

      {hero ? <Dossier hero={hero} byId={byId} edges={data.graph.edges} onPick={setSel} /> : null}
    </section>
  )
}

function Dossier({
  hero,
  byId,
  edges,
  onPick,
}: {
  hero: GraphNode
  byId: Map<string, GraphNode>
  edges: PortalData["graph"]["edges"]
  onPick: (id: string) => void
}) {
  const links = useMemo(() => neighborsOf(hero.id, edges), [hero, edges])
  const grouped = useMemo(() => {
    const g: Record<Sector, typeof links> = { близость: [], давление: [], тайна: [], мир: [] }
    for (const l of links) {
      const sec = SECTOR_OF[l.edge.type] || "мир"
      g[sec].push(l)
    }
    return g
  }, [links])

  return (
    <div className="bgv-card mt-4 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="bgv-display text-[1.3rem] font-bold text-[var(--mal-text)]">
          {hero.label}
        </h3>
        {hero.episodes?.length ? (
          <span className="bgv-pill bgv-pill--green flex-none">
            серии {hero.episodes[0]}–{hero.episodes[hero.episodes.length - 1]}
          </span>
        ) : null}
      </div>
      {hero.short_description ? (
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-[var(--mal-text-2)]">
          {hero.short_description}
        </p>
      ) : null}

      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {hero.want ? (
          <div><dt className="bgv-field-label">Хочет</dt><dd className="mt-0.5 text-[0.88rem] text-[var(--mal-text-2)]">{hero.want}</dd></div>
        ) : null}
        {hero.need && hero.need !== "—" ? (
          <div><dt className="bgv-field-label">Нужно</dt><dd className="mt-0.5 text-[0.88rem] text-[var(--mal-text-2)]">{hero.need}</dd></div>
        ) : null}
        {hero.secret ? (
          <div className="sm:col-span-2"><dt className="bgv-field-label">Тайна</dt><dd className="mt-0.5 text-[0.88rem] text-[var(--mal-text-2)]">{hero.secret}</dd></div>
        ) : null}
      </dl>

      <hr className="bgv-hr my-4" />

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTORS.map((sec) =>
          grouped[sec].length ? (
            <div key={sec}>
              <p className="bgv-field-label">{SECTOR_LABEL[sec]}</p>
              <ul className="mt-1.5 space-y-1.5">
                {grouped[sec].map((l, i) => {
                  const other = byId.get(l.otherId)
                  const isChar = other?.type === "character"
                  return (
                    <li key={i} className="text-[0.85rem] leading-snug">
                      <span className="text-[var(--mal-text-3)]">{EDGE_RU[l.edge.type] || l.edge.type} </span>
                      {isChar ? (
                        <button onClick={() => onPick(l.otherId)} className="font-semibold text-[#8fe6bd] underline-offset-2 hover:underline">
                          {other?.label.split(" / ")[0]}
                        </button>
                      ) : (
                        <span className="font-semibold text-[var(--mal-text)]">{other?.label || l.otherId}</span>
                      )}
                      {l.edge.label ? <span className="block text-[var(--mal-text-3)]">{l.edge.label}</span> : null}
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null,
        )}
      </div>
    </div>
  )
}
